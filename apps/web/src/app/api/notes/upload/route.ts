import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NOTE_SUMMARY_PROMPT } from "@/lib/prompts";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];

async function extractText(buffer: Buffer, mimeType: string): Promise<{ text: string; pageCount: number }> {
  if (mimeType === "text/plain") {
    return { text: buffer.toString("utf-8"), pageCount: 1 };
  }

  if (mimeType === "application/pdf") {
    const pdfParseModule = await import("pdf-parse");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParse: (b: Buffer) => Promise<{ text: string; numpages: number }> =
      ((pdfParseModule as any).default ?? pdfParseModule) as any;
    const result = await pdfParse(buffer);
    return { text: result.text, pageCount: result.numpages };
  }

  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value, pageCount: 1 };
  }

  throw new Error("Unsupported file type");
}

async function generateSummary(text: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return "";
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{ role: "user", content: NOTE_SUMMARY_PROMPT(text) }],
  });
  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Rate limit: max 10 uploads per minute per user
  const rl = await aiRateLimit(clientKey(req, "notes-upload", user.id), { max: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only PDF, DOCX, and TXT files are supported" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // Sanitize the filename so the storage key never breaks RLS path matching
  // (auth.uid() = (storage.foldername(name))[1]). Slashes/odd chars are removed.
  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
  const storagePath = `${user.id}/${Date.now()}_${safeName}`;

  // Upload to Supabase Storage (private bucket — only the storage path is stored)
  const { error: uploadError } = await supabase.storage
    .from("user-notes")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }

  // Bucket is private, so getPublicUrl() would return a non-functional URL.
  // Store the storage path itself in `file_url` — the DELETE route parses it
  // back out, and any future signed-URL flow can call createSignedUrl(path).
  const fileRef = storagePath;

  // Extract text
  let extractedText = "";
  let pageCount = 1;
  try {
    const extracted = await extractText(buffer, file.type);
    extractedText = extracted.text;
    pageCount = extracted.pageCount;
  } catch {
    // Text extraction failed — continue without text
  }

  // Generate AI summary
  const aiSummary = extractedText ? await generateSummary(extractedText) : "";

  // Save to database
  const { data: note, error: dbError } = await supabase
    .from("user_notes")
    .insert({
      user_id: user.id,
      filename: file.name,
      file_url: fileRef,
      extracted_text: extractedText,
      ai_summary: aiSummary,
      page_count: pageCount,
      file_size_bytes: file.size,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }

  return NextResponse.json(note);
}
