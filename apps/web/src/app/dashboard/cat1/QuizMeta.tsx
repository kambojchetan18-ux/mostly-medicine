"use client";

// Right-side quiz meta sidebar: per-question timer, scratch notepad, and
// feedback chips. Notes + feedback persist in localStorage keyed on the
// question id, so they survive page refresh and follow the user across
// sessions for the same question.

import { useEffect, useRef, useState } from "react";
import AttachmentPicker from "./AttachmentPicker";

interface QuizMetaProps {
  questionId: string;
  current: number; // resets the timer + reloads notes when this changes
}

const FEEDBACK_OPTIONS = [
  "Good item",
  "Too easy",
  "Too hard",
  "Not relevant",
  "Out of date",
  "Incorrect",
  "Typo",
  "Poorly worded",
  "Something else",
];

function notesKey(qid: string) {
  return `mm:cat1:notes:${qid}`;
}
function feedbackKey(qid: string) {
  return `mm:cat1:feedback:${qid}`;
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function writeLocal(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota etc — silently ignore, this is a UX-only feature */
  }
}

function fmtClock(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function QuizMeta({ questionId, current }: QuizMetaProps) {
  const [seconds, setSeconds] = useState(0);
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState<string[]>([]);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const noteSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset timer + reload note/feedback whenever the question changes.
  useEffect(() => {
    setSeconds(0);
    setNote(readLocal<string>(notesKey(questionId), ""));
    setFeedback(readLocal<string[]>(feedbackKey(questionId), []));
    setFeedbackSent(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Tick the clock once per second.
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [questionId]);

  // Debounced persist — avoid hammering localStorage on every keystroke.
  function onNoteChange(v: string) {
    setNote(v);
    if (noteSaveTimer.current) clearTimeout(noteSaveTimer.current);
    noteSaveTimer.current = setTimeout(() => writeLocal(notesKey(questionId), v), 250);
  }

  function toggleFeedback(label: string) {
    setFeedback((prev) => {
      const next = prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label];
      writeLocal(feedbackKey(questionId), next);
      return next;
    });
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 1500);
  }

  return (
    <aside className="space-y-3 md:sticky md:top-4 md:max-h-[calc(100vh-2rem)] md:overflow-auto">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 space-y-2">
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Notepad — quick notes for this question"
          rows={4}
          className="w-full bg-transparent text-sm text-amber-900 placeholder-amber-400 focus:outline-none resize-none"
          spellCheck={false}
        />
        <AttachmentPicker questionId={questionId} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3 flex items-center gap-3">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
          ⏱
        </span>
        <div className="leading-tight">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Time on this question
          </p>
          <p className="text-lg font-bold text-gray-900 tabular-nums">{fmtClock(seconds)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Leave Feedback
          </p>
          {feedbackSent && (
            <span className="text-[10px] text-emerald-600 font-semibold">Saved ✓</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FEEDBACK_OPTIONS.map((label) => {
            const active = feedback.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleFeedback(label)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                  active
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:border-brand-400 hover:text-brand-700"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[10px] text-gray-400">
          Stored locally on this device. We&apos;ll add a server submission soon.
        </p>
      </div>
    </aside>
  );
}
