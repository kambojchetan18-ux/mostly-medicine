"use client";

// Compact, collapsible notepad rendered inline on the MCQ question page.
// Used on mobile (where the right-side QuizMeta sidebar is hidden) so users
// can still scribble notes per question. Persists to localStorage under the
// same key as QuizMeta so notes follow the question across devices/sessions.

import { useEffect, useRef, useState } from "react";
import AttachmentPicker from "./AttachmentPicker";

interface InlineNotepadProps {
  questionId: string;
}

function notesKey(qid: string) {
  return `mm:cat1:notes:${qid}`;
}

function readLocal(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return "";
    return JSON.parse(raw) as string;
  } catch {
    return "";
  }
}
function writeLocal(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export default function InlineNotepad({ questionId }: InlineNotepadProps) {
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const existing = readLocal(notesKey(questionId));
    setNote(existing);
    setOpen(existing.length > 0);
  }, [questionId]);

  function onChange(v: string) {
    setNote(v);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeLocal(notesKey(questionId), v), 250);
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 mb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-amber-900">
          📝 Notepad
          {note.length > 0 && (
            <span className="text-[10px] uppercase tracking-wider bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full">
              saved
            </span>
          )}
        </span>
        <span className="text-amber-700 text-xs">{open ? "Hide ▴" : "Open ▾"}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          <textarea
            value={note}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Quick notes for this question — saved automatically on this device."
            rows={4}
            className="w-full bg-white border border-amber-200 rounded-lg p-2 text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:border-amber-400 resize-y"
            spellCheck={false}
          />
          <AttachmentPicker questionId={questionId} />
        </div>
      )}
    </div>
  );
}
