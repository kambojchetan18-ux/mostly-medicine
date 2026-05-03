import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient, type SupabaseClient } from "@supabase/supabase-js";
import { checkModulePermission } from "@/lib/permissions";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

// Server-side Whisper STT for the Peer RolePlay live mode.
// Browser MediaRecorder posts a 5s WebM/Opus chunk to this route; we forward
// it to Groq's OpenAI-compatible Whisper endpoint and return { text }.
//
// Why: Web Speech API is unreliable on Android Chrome and broken on iOS
// Safari, leaving the live transcript empty for ~half of users (which also
// breaks the AI feedback because there's no transcript to score).
//
// nodejs runtime is required so multipart/form-data passthrough works on
// Vercel (the edge runtime can't reliably re-stream a multipart body).
export const runtime = "nodejs";

const GROQ_TRANSCRIPTIONS_URL =
  "https://api.groq.com/openai/v1/audio/transcriptions";
// whisper-large-v3-turbo: ~$0.04/hour, ~1s latency for 5s chunks.
// Free $1/mo Groq credit covers ~25 hours/month per account before billing.
const GROQ_MODEL = "whisper-large-v3-turbo";

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

  // 3. Server-side env check — fail loud if missing
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "STT not configured (GROQ_API_KEY missing)" },
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

  // 5. Build a fresh FormData for Groq — we can't forward the incoming one
  //    directly because the file part needs an explicit filename for Groq's
  //    parser to accept it.
  const groqForm = new FormData();
  groqForm.append("model", GROQ_MODEL);
  groqForm.append("response_format", "json");
  groqForm.append("temperature", "0");
  groqForm.append("language", "en");
  // VERY LIGHT vocabulary nudge — just hints the domain so Whisper picks
  // medical English over generic. We deliberately do NOT include 'Doctor:'
  // / 'Patient:' style dialogue in the prompt: a structured prompt biases
  // the decoder to CONTINUE the template on unclear/silent audio, which is
  // exactly how we ended up with hallucinations like 'Patient's voice is
  // not the same. Doctor, doctor doctor always. I'm sorry about this,
  // Margaret.' — the model is just continuing the doctor-patient pattern
  // it was given. A single short clinical sentence is enough domain
  // signal without giving the decoder a template to loop on.
  groqForm.append(
    "prompt",
    "An Australian medical consultation in plain clinical English."
  );
  // Pick the filename extension from the actual blob mime-type. Chrome /
  // Android produce audio/webm; iOS Safari produces audio/mp4 (it doesn't
  // support WebM in MediaRecorder). Groq's Whisper accepts both, but the
  // FILENAME hint matters — sending an mp4 blob as `chunk.webm` makes the
  // upstream parser sniff the wrong container and 400 the request.
  const audioType = (audio as Blob).type ?? "";
  const ext = /mp4|aac/i.test(audioType)
    ? "mp4"
    : /ogg/i.test(audioType)
      ? "ogg"
      : "webm";
  groqForm.append("file", audio, `chunk.${ext}`);

  // 6. Forward to Groq. fetch with FormData lets the runtime set the
  //    multipart boundary header automatically.
  let groqRes: Response;
  try {
    groqRes = await fetch(GROQ_TRANSCRIPTIONS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: groqForm,
    });
  } catch (err) {
    console.error("[stt/transcribe] groq fetch failed", err);
    return NextResponse.json(
      { error: "Transcription upstream unreachable" },
      { status: 502 }
    );
  }

  if (!groqRes.ok) {
    const detail = await groqRes.text().catch(() => "");
    console.error("[stt/transcribe] groq error", groqRes.status, detail);
    // Surface the upstream status + body so the diagnostic pill / console
    // can show the actual Groq error (auth, quota, rate-limit, format).
    return NextResponse.json(
      {
        error: "Transcription upstream error",
        upstreamStatus: groqRes.status,
        upstreamBody: detail.slice(0, 400),
      },
      { status: 502 }
    );
  }

  let payload: { text?: string };
  try {
    payload = (await groqRes.json()) as { text?: string };
  } catch {
    return NextResponse.json(
      { error: "Transcription upstream returned non-JSON" },
      { status: 502 }
    );
  }

  return NextResponse.json({ text: (payload.text ?? "").trim() });
}
