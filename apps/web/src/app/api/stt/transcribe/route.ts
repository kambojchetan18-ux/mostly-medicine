import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { checkAiRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  let user = null;

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.auth.getUser(token);
    user = data.user;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed, retryAfterMs } = await checkAiRateLimit(user.id, "stt-transcribe");
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((retryAfterMs ?? 60000) / 1000)) } }
    );
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "STT service not configured" }, { status: 503 });
  }

  const formData = await req.formData();
  const audio = formData.get("audio") as File | null;
  if (!audio) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  if (audio.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "Audio file exceeds 25 MB limit" }, { status: 400 });
  }

  const groqForm = new FormData();
  groqForm.append("file", audio, audio.name || "audio.m4a");
  groqForm.append("model", "whisper-large-v3");
  groqForm.append("language", "en");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: groqForm,
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ text: data.text ?? "" });
}
