import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient, type SupabaseClient } from "@supabase/supabase-js";
import { checkModulePermission } from "@/lib/permissions";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

// Server-side STT for every voice surface (cat2, AMC solo, Peer RolePlay live).
// The browser MediaRecorder / mobile expo-av posts a short WebM/Opus (or MP4 on
// iOS) audio chunk to this route; we transcribe it and return { text }.
//
// Provider order (both gated by env, so either can be flipped off):
//   1. Deepgram Nova-3 Medical — preferred. Tuned for clinical vocabulary and
//      markedly more accurate on the non-native/accented English our IMG users
//      speak, which is exactly where generic Whisper degrades.
//   2. Groq whisper-large-v3-turbo — fallback. Used when DEEPGRAM_API_KEY is
//      unset OR a Deepgram request fails, so adding Deepgram can never make
//      transcription worse than before — at most it falls back to Groq.
// If neither key is present we return 503 (kill-switch) and the live transcript
// stays blank.
//
// The route contract ({ text }) is unchanged, so the web + mobile clients need
// no changes to benefit from the better model.
//
// nodejs runtime is required so multipart/form-data passthrough works on
// Vercel (the edge runtime can't reliably re-stream a multipart body).
export const runtime = "nodejs";

const GROQ_TRANSCRIPTIONS_URL =
  "https://api.groq.com/openai/v1/audio/transcriptions";
// whisper-large-v3-turbo: ~$0.04/hour, ~1s latency for 5s chunks.
const GROQ_MODEL = "whisper-large-v3-turbo";

const DEEPGRAM_URL = "https://api.deepgram.com/v1/listen";
// nova-3-medical: clinical-domain model. Override via env if Deepgram renames
// it or you want the general nova-3.
const DEEPGRAM_MODEL = process.env.DEEPGRAM_MODEL || "nova-3-medical";

type TranscribeResult =
  | { ok: true; text: string }
  | { ok: false; status: number; detail: string };

// Deepgram accepts the raw audio bytes with a Content-Type describing the
// container. Chrome/Android send audio/webm, iOS Safari audio/mp4, and a few
// paths audio/ogg — pass the blob's own mime through, defaulting to webm.
function audioContentType(audio: Blob): string {
  const t = audio.type || "";
  if (/mp4|m4a|aac/i.test(t)) return "audio/mp4";
  if (/ogg/i.test(t)) return "audio/ogg";
  if (/wav/i.test(t)) return "audio/wav";
  return "audio/webm";
}

async function transcribeWithDeepgram(
  audio: Blob,
  apiKey: string
): Promise<TranscribeResult> {
  const params = new URLSearchParams({
    model: DEEPGRAM_MODEL,
    language: "en",
    smart_format: "true", // punctuation + number/date formatting
    punctuate: "true",
  });
  let res: Response;
  try {
    res = await fetch(`${DEEPGRAM_URL}?${params.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": audioContentType(audio),
      },
      body: audio,
    });
  } catch (err) {
    return { ok: false, status: 502, detail: `deepgram unreachable: ${String(err)}` };
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { ok: false, status: res.status, detail: detail.slice(0, 400) };
  }
  let payload: {
    results?: {
      channels?: Array<{ alternatives?: Array<{ transcript?: string }> }>;
    };
  };
  try {
    payload = await res.json();
  } catch {
    return { ok: false, status: 502, detail: "deepgram non-JSON" };
  }
  const text =
    payload.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
  return { ok: true, text: text.trim() };
}

async function transcribeWithGroq(
  audio: Blob,
  apiKey: string
): Promise<TranscribeResult> {
  // Groq's Whisper parser needs an explicit filename whose extension matches
  // the actual container, or it sniffs the wrong type and 400s.
  const audioType = audio.type ?? "";
  const ext = /mp4|aac|m4a/i.test(audioType)
    ? "mp4"
    : /ogg/i.test(audioType)
      ? "ogg"
      : "webm";
  const groqForm = new FormData();
  groqForm.append("model", GROQ_MODEL);
  groqForm.append("response_format", "json");
  groqForm.append("temperature", "0");
  groqForm.append("language", "en");
  // NOTE: deliberately no `prompt`. Even a one-sentence domain hint gets echoed
  // back verbatim on quiet/ambiguous chunks (the decoder treats it as a "first
  // sentence" to continue), so users saw the prompt in the live transcript.
  groqForm.append("file", audio, `chunk.${ext}`);

  let res: Response;
  try {
    res = await fetch(GROQ_TRANSCRIPTIONS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: groqForm,
    });
  } catch (err) {
    return { ok: false, status: 502, detail: `groq unreachable: ${String(err)}` };
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { ok: false, status: res.status, detail: detail.slice(0, 400) };
  }
  let payload: { text?: string };
  try {
    payload = await res.json();
  } catch {
    return { ok: false, status: 502, detail: "groq non-JSON" };
  }
  return { ok: true, text: (payload.text ?? "").trim() };
}

export async function POST(req: NextRequest) {
  // 1. Auth — accept Bearer token (mobile native app) OR cookie session (web)
  let user = null;
  let supabase: SupabaseClient;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.auth.getUser(token);
    user = data.user;
  } else {
    supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Plan gate — STT is the mic input for THREE roleplay surfaces:
  //    cat2 (`roleplay`), AMC Clinical AI RolePlay (`acrp_solo`), and
  //    Peer RolePlay (`acrp_live`). Allow voice if the user has access
  //    to ANY of them — otherwise enabling acrp_solo for free users
  //    would leave the mic dead because `roleplay` stays off.
  const [permRoleplay, permSolo, permLive] = await Promise.all([
    checkModulePermission(supabase, "roleplay"),
    checkModulePermission(supabase, "acrp_solo"),
    checkModulePermission(supabase, "acrp_live"),
  ]);
  if (!permRoleplay.allowed && !permSolo.allowed && !permLive.allowed) {
    return NextResponse.json(
      { error: "Voice transcription not available on your plan" },
      { status: 403 }
    );
  }

  // 2b. Per-user throttle — MediaRecorder posts ~12 chunks/min during a
  //     normal conversation. 60/min leaves headroom for fast back-and-forth
  //     while blocking a script that loops on this endpoint.
  const rl = await aiRateLimit(clientKey(req, "stt", user.id), { max: 60, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  // 3. Server-side env check — at least one provider must be configured.
  const deepgramKey = process.env.DEEPGRAM_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  if (!deepgramKey && !groqKey) {
    return NextResponse.json(
      { error: "STT not configured (DEEPGRAM_API_KEY / GROQ_API_KEY missing)" },
      { status: 503 }
    );
  }

  // 4. Pull the audio blob out of the incoming multipart form
  let incoming: FormData;
  try {
    incoming = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 }
    );
  }
  const audio = incoming.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) {
    return NextResponse.json(
      { error: "audio field required" },
      { status: 400 }
    );
  }

  // 5. Transcribe. Prefer Deepgram (better on accents + medical), fall back to
  //    Groq if Deepgram is unconfigured or its request fails.
  let lastError: { status: number; detail: string } | null = null;
  if (deepgramKey) {
    const dg = await transcribeWithDeepgram(audio, deepgramKey);
    if (dg.ok) return NextResponse.json({ text: dg.text });
    console.error("[stt/transcribe] deepgram error", dg.status, dg.detail);
    lastError = { status: dg.status, detail: dg.detail };
  }
  if (groqKey) {
    const groq = await transcribeWithGroq(audio, groqKey);
    if (groq.ok) return NextResponse.json({ text: groq.text });
    console.error("[stt/transcribe] groq error", groq.status, groq.detail);
    lastError = { status: groq.status, detail: groq.detail };
  }

  // Both configured providers failed — surface the last upstream detail so the
  // diagnostic pill / console can show what went wrong.
  return NextResponse.json(
    {
      error: "Transcription upstream error",
      upstreamStatus: lastError?.status,
      upstreamBody: lastError?.detail,
    },
    { status: 502 }
  );
}
