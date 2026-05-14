import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const BUCKET = "mcq-attachments";

// DELETE /api/cat1/notes/attachments/[id] — remove the row + storage object.
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Read the file_path before delete so we can clean up storage.
  const { data: row, error: selErr } = await supabase
    .from("mcq_note_attachments")
    .select("file_path, user_id")
    .eq("id", id)
    .maybeSingle();
  if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (row.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error: delRowErr } = await supabase
    .from("mcq_note_attachments")
    .delete()
    .eq("id", id);
  if (delRowErr) return NextResponse.json({ error: delRowErr.message }, { status: 500 });

  // Best-effort storage cleanup. RLS lets the user delete their own object.
  await supabase.storage.from(BUCKET).remove([row.file_path]).catch(() => {});

  return NextResponse.json({ ok: true });
}
