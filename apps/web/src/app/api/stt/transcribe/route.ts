import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkModulePermission } from "@/lib/permissions";

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
  // 1. Auth — require an authenticated user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Plan gate — same module permission as the live session itself
  const perm = await checkModulePermission(supabase, "acrp_live");
  if (!perm.allowed) {
    return NextResponse.json(
      { error: "Live RolePlay not available on your plan" },
      { status: 403 }
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
  // WebM/Opus is what MediaRecorder produces in Chrome; Groq accepts it.
  groqForm.append("file", audio, "chunk.webm");

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
    return NextResponse.json(
      { error: "Transcription upstream error" },
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
