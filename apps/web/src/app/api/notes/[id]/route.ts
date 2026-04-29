import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Get note to find storage path
  const { data: note } = await supabase
    .from("user_notes")
    .select("file_url, user_id")
    .eq("id", id)
    .single();

  if (!note || note.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (note.file_url) {
    const storagePath = note.file_url.startsWith("http")
      ? new URL(note.file_url).pathname.split("/user-notes/")[1] ?? ""
      : note.file_url;
    if (storagePath) {
      await supabase.storage.from("user-notes").remove([decodeURIComponent(storagePath)]);
    }
  }

  // Delete from database (scoped to user for defense in depth)
  await supabase.from("user_notes").delete().eq("id", id).eq("user_id", user.id);

  return NextResponse.json({ success: true });
}
