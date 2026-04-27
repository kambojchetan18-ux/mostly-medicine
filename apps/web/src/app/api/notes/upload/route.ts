import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NOTE_SUMMARY_PROMPT } from "@/lib/prompts";

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
    system: [
      {
        type: "text",
        text: "You are a medical study note summariser for AMC exam preparation.",
        cache_control: { type: "ephemeral" },
      },
    ],
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
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
  const storagePath = `${user.id}/${Date.now()}_${safeName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("user-notes")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }

  const { data: signedUrlData } = await supabase.storage
    .from("user-notes")
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365);
  const fileUrl = signedUrlData?.signedUrl ?? storagePath;

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
      file_url: fileUrl,
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
