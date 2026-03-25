import { createClient } from "@/lib/supabase/server";
import LibraryClient from "./LibraryClient";

export default async function LibraryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: topics } = await supabase
    .from("library_topics")
    .select("id, title, source, system, summary, amc_exam_type, difficulty")
    .order("created_at", { ascending: true });

  let notes: Note[] = [];
  if (user) {
    const { data } = await supabase
      .from("user_notes")
      .select("id, filename, ai_summary, page_count, file_size_bytes, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    notes = data ?? [];
  }

  return (
    <LibraryClient
      topics={topics ?? []}
      notes={notes}
      isAuthenticated={!!user}
    />
  );
}

type Note = {
  id: string;
  filename: string;
  ai_summary: string | null;
  page_count: number | null;
  file_size_bytes: number | null;
  created_at: string;
};
