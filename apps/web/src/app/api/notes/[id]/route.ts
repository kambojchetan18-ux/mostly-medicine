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

  // `file_url` may be either a legacy public URL (from earlier rows) or a raw
  // storage path (`<user_id>/<timestamp>_<name>`). Normalise to a storage path.
  let storagePath: string | null = null;
  if (note.file_url) {
    if (note.file_url.startsWith("http")) {
      try {
        const url = new URL(note.file_url);
        const parts = url.pathname.split("/user-notes/");
        storagePath = parts[1] ? decodeURIComponent(parts[1]) : null;
      } catch {
        storagePath = null;
      }
    } else {
      storagePath = note.file_url;
    }
  }
  if (storagePath) {
    await supabase.storage.from("user-notes").remove([storagePath]);
  }

  // Delete from database
  await supabase.from("user_notes").delete().eq("id", id);

  return NextResponse.json({ success: true });
}
