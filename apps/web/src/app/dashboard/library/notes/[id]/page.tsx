import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import NoteChatWrapper from "./NoteChatWrapper";

export default async function NoteReadingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: note } = await supabase
    .from("user_notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!note) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/library"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 transition"
        >
          ← Back to Library
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 break-words">{note.filename}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
          <span>Uploaded {new Date(note.created_at).toLocaleDateString()}</span>
          {note.page_count && <span>{note.page_count} page{note.page_count !== 1 ? "s" : ""}</span>}
          {note.file_size_bytes && <span>{(note.file_size_bytes / 1024).toFixed(0)} KB</span>}
        </div>
      </div>

      {note.ai_summary && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-brand-700 mb-1">AI Summary</p>
          <p className="text-sm text-brand-800">{note.ai_summary}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Note Contents</h2>
        {note.extracted_text ? (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-mono text-xs">
            {note.extracted_text}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No text could be extracted from this file.</p>
        )}
      </div>

      <NoteChatWrapper
        noteFilename={note.filename}
        noteText={note.extracted_text ?? ""}
      />
    </div>
  );
}
