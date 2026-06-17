import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient, type SupabaseClient } from "@supabase/supabase-js";
import { checkModulePermission } from "@/lib/permissions";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

// Server-side cloud TTS for the AI patient voice (web + mobile).
//
// Why: the browser Web Speech Synthesis API (and expo-speech on mobile) sound
// robotic, drift between voices per-device, and carry no emotion — the #1
// "this doesn't feel like a real patient" complaint. This route forwards the
// reply text to ElevenLabs' low-latency Flash model and streams back MP3 audio
// the client plays through a single <audio> element / Audio.Sound.
//
// Kill-switch: if ELEVENLABS_API_KEY is missing we return 503 and the client
// silently falls back to the old native synthesis path — so flipping the env
// off instantly reverts to the previous behaviour with zero code changes.
//
// nodejs runtime so we can pass the upstream ReadableStream straight through
// (the edge runtime is flakier re-streaming binary bodies on Vercel).
export const runtime = "nodejs";

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
// eleven_flash_v2_5: ~75ms time-to-first-audio, the cheapest realtime-grade
// model, 32 languages. Good enough quality for a conversational patient while
// keeping latency under the "feels live" threshold.
const ELEVENLABS_MODEL = "eleven_flash_v2_5";
const OUTPUT_FORMAT = "mp3_44100_128";

// Premade ElevenLabs voice IDs. Defaults lean British because that is the
// closest premade accent to en-AU. Override either with any voice ID from your
// ElevenLabs voice library — including a cloned/native Australian voice — via
// the env vars below (no redeploy of the client needed).
const DEFAULT_FEMALE_VOICE = "Xb7hH8MSUJpSbSDYk0k2"; // Alice (British female)
const DEFAULT_MALE_VOICE = "onwK4e9ZLuTAKqWW03F"; // Daniel (British male)

// Bound cost + URL/body size. A single patient turn is ~1-3 sentences; 1200
// chars is generous headroom while capping a runaway/abusive request.
const MAX_CHARS = 1200;

type Gender = "male" | "female" | "unknown";

function pickVoiceId(gender: Gender): string {
  const female = process.env.ELEVENLABS_VOICE_FEMALE || DEFAULT_FEMALE_VOICE;
  const male = process.env.ELEVENLABS_VOICE_MALE || DEFAULT_MALE_VOICE;
  // "unknown" → female default (neutral, and most premade voices read clearer).
  return gender === "male" ? male : female;
}

export async function POST(req: NextRequest) {
  // 1. Auth — accept Bearer token (mobile native app) OR cookie session (web).
  //    Identical handshake to /api/stt/transcribe.
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

  // 2. Plan gate — the patient voice belongs to the same three roleplay
  //    surfaces as STT: cat2 (`roleplay`), AMC Clinical solo (`acrp_solo`),
  //    and Peer RolePlay (`acrp_live`). Allow if the user has ANY of them.
  const [permRoleplay, permSolo, permLive] = await Promise.all([
    checkModulePermission(supabase, "roleplay"),
    checkModulePermission(supabase, "acrp_solo"),
    checkModulePermission(supabase, "acrp_live"),
  ]);
  if (!permRoleplay.allowed && !permSolo.allowed && !permLive.allowed) {
    return NextResponse.json(
      { error: "Voice not available on your plan" },
      { status: 403 }
    );
  }

  // 2b. Per-user throttle — one request per patient turn, so 60/min leaves
  //     plenty of room for a fast back-and-forth while blocking a loop.
  const rl = await aiRateLimit(clientKey(req, "tts", user.id), { max: 60, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  // 3. Server-side env check — return 503 (kill-switch) so the client reverts
  //    to native synthesis instead of going silent.
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "TTS not configured (ELEVENLABS_API_KEY missing)" },
      { status: 503 }
    );
  }

  // 4. Parse + validate the request body.
  let body: { text?: string; gender?: Gender };
  try {
    body = (await req.json()) as { text?: string; gender?: Gender };
  } catch {
    return NextResponse.json({ error: "Expected JSON body" }, { status: 400 });
  }
  const text = (body.text ?? "").trim().slice(0, MAX_CHARS);
  if (!text) {
    return NextResponse.json({ error: "text field required" }, { status: 400 });
  }
  const gender: Gender =
    body.gender === "male" || body.gender === "female" ? body.gender : "unknown";
  const voiceId = pickVoiceId(gender);

  // 5. Forward to ElevenLabs' streaming endpoint and pass the MP3 body straight
  //    back to the client.
  let upstream: Response;
  try {
    upstream = await fetch(
      `${ELEVENLABS_BASE}/${voiceId}/stream?output_format=${OUTPUT_FORMAT}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: ELEVENLABS_MODEL,
          // Conversational defaults: stable enough to avoid wobble, with a
          // touch of style for natural prosody.
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      }
    );
  } catch (err) {
    console.error("[tts] elevenlabs fetch failed", err);
    return NextResponse.json(
      { error: "TTS upstream unreachable" },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("[tts] elevenlabs error", upstream.status, detail);
    return NextResponse.json(
      {
        error: "TTS upstream error",
        upstreamStatus: upstream.status,
        upstreamBody: detail.slice(0, 400),
      },
      { status: 502 }
    );
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
