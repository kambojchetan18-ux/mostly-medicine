"use client";

// Per-question notepad attachments backed by Supabase Storage. Files persist
// across devices and sessions for the logged-in user; nothing is held in
// localStorage. Used by both InlineNotepad (mobile) and QuizMeta (desktop).

import { useEffect, useRef, useState } from "react";

interface AttachmentPickerProps {
  questionId: string;
  className?: string;
}

interface Attachment {
  id: string;
  question_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  url: string | null;
}

const MAX_PER_QUESTION = 10;
const MAX_BYTES = 5 * 1024 * 1024;

export default function AttachmentPicker({ questionId, className = "" }: AttachmentPickerProps) {
  const [items, setItems] = useState<Attachment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [viewing, setViewing] = useState<Attachment | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load existing attachments whenever the question changes.
  useEffect(() => {
    let cancelled = false;
    setError(null);
    setItems([]);
    fetch(`/api/cat1/notes/attachments?questionId=${encodeURIComponent(questionId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setItems(Array.isArray(d?.attachments) ? d.attachments : []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [questionId]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy(true);
    try {
      const next = [...items];
      for (const f of Array.from(files)) {
        if (next.length >= MAX_PER_QUESTION) {
          setError(`Max ${MAX_PER_QUESTION} attachments per question.`);
          break;
        }
        if (f.size > MAX_BYTES) {
          setError(`${f.name}: too large (max ${MAX_BYTES / 1024 / 1024} MB).`);
          continue;
        }
        const fd = new FormData();
        fd.append("file", f);
        fd.append("questionId", questionId);
        const res = await fetch("/api/cat1/notes/attachments", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data?.error ?? `Upload failed (${res.status}).`);
          continue;
        }
        if (data?.attachment) next.push(data.attachment);
      }
      setItems(next);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removeAttachment(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/cat1/notes/attachments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Could not delete.");
        return;
      }
      setItems((prev) => prev.filter((a) => a.id !== id));
      if (viewing?.id === id) setViewing(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy || items.length >= MAX_PER_QUESTION}
          className="text-[11px] inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-300 bg-white text-amber-800 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {busy ? "Uploading…" : `📎 Attach${items.length ? ` (${items.length}/${MAX_PER_QUESTION})` : ""}`}
        </button>
        {error && <p className="text-[10px] text-rose-600 truncate" title={error}>{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {items.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((a) => {
            const isImg = a.mime_type.startsWith("image/");
            return (
              <div key={a.id} className="relative group">
                {isImg && a.url ? (
                  <button
                    type="button"
                    onClick={() => setViewing(a)}
                    className="block h-14 w-14 rounded-md overflow-hidden border border-amber-200 bg-white"
                    title={a.file_name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.url} alt={a.file_name} className="h-full w-full object-cover" />
                  </button>
                ) : (
                  <a
                    href={a.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-14 px-2 max-w-[140px] flex flex-col items-center justify-center rounded-md border border-amber-200 bg-white text-[10px] text-amber-800 hover:bg-amber-50"
                    title={a.file_name}
                  >
                    📄 <span className="truncate w-full text-center">{a.file_name}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(a.id)}
                  disabled={busy}
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:cursor-not-allowed"
                  aria-label="Remove attachment"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {viewing && viewing.url && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setViewing(null)}
        >
          <div className="max-w-3xl max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewing.url} alt={viewing.file_name} className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
            <p className="mt-2 text-center text-xs text-white">{viewing.file_name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
