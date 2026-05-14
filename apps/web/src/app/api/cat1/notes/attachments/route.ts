import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const BUCKET = "mcq-attachments";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_PER_QUESTION = 10;
const ALLOWED_MIME = /^(image\/(png|jpe?g|webp|gif)|application\/pdf)$/i;
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

interface AttachmentRow {
  id: string;
  question_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

async function withSignedUrls(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: AttachmentRow[],
) {
  return Promise.all(
    rows.map(async (r) => {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(r.file_path, SIGNED_URL_TTL_SECONDS);
      return { ...r, url: data?.signedUrl ?? null };
    }),
  );
}

// GET /api/cat1/notes/attachments?questionId=xxx — list attachments
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const questionId = req.nextUrl.searchParams.get("questionId");
  if (!questionId) return NextResponse.json({ attachments: [] });

  const { data, error } = await supabase
    .from("mcq_note_attachments")
    .select("id, question_id, file_path, file_name, mime_type, size_bytes, created_at")
    .eq("user_id", user.id)
    .eq("question_id", questionId)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const withUrls = await withSignedUrls(supabase, (data ?? []) as AttachmentRow[]);
  return NextResponse.json({ attachments: withUrls });
}

// POST /api/cat1/notes/attachments — multipart upload one file
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const questionId = (form.get("questionId") as string | null)?.trim();
  if (!file || !questionId) {
    return NextResponse.json({ error: "Missing file or questionId" }, { status: 400 });
  }
  if (!ALLOWED_MIME.test(file.type)) {
    return NextResponse.json({ error: "Only images and PDFs are allowed" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `File exceeds ${MAX_BYTES / 1024 / 1024} MB limit` }, { status: 413 });
  }

  const { count } = await supabase
    .from("mcq_note_attachments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("question_id", questionId);
  if ((count ?? 0) >= MAX_PER_QUESTION) {
    return NextResponse.json({ error: `Max ${MAX_PER_QUESTION} attachments per question` }, { status: 400 });
  }

  const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, "_").slice(-80);
  const filePath = `${user.id}/${questionId}/${crypto.randomUUID()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, new Uint8Array(arrayBuffer), {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: row, error: insErr } = await supabase
    .from("mcq_note_attachments")
    .insert({
      user_id: user.id,
      question_id: questionId,
      file_path: filePath,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select("id, question_id, file_path, file_name, mime_type, size_bytes, created_at")
    .single();
  if (insErr) {
    // Roll back the storage object so we don't leak orphan files.
    await supabase.storage.from(BUCKET).remove([filePath]).catch(() => {});
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  const [withUrl] = await withSignedUrls(supabase, [row as AttachmentRow]);
  return NextResponse.json({ attachment: withUrl });
}
