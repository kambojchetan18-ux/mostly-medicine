"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";

type Trigger = "mcq_streak_broken" | "mcq_two_wrong" | "roleplay_complete";

interface MentorMessageProps {
  trigger: Trigger | string;
  context?: { wrongCount?: number; topic?: string; score?: number };
  onDismiss?: () => void;
  // When true, banner positions itself fixed top-center (in-flow nudge).
  // Default false renders inline (used inside a results panel).
  floating?: boolean;
}

const AUTO_DISMISS_MS = 8000;

export default function MentorMessage({
  trigger,
  context,
  onDismiss,
  floating = false,
}: MentorMessageProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [errored, setErrored] = useState(false);
  const requestedRef = useRef(false);

  // Fetch on mount. Strict-mode double-invoke guard via ref so we only fire
  // once per mount and don't double-charge a Haiku call.
  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/mentor/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trigger, context }),
        });
        if (!res.ok) {
          // 429 (rate limited) and 401 are both silent failures — the banner
          // simply doesn't render. We don't want to surface noise.
          if (!cancelled) setErrored(true);
          return;
        }
        const data = (await res.json()) as { message?: string };
        if (!cancelled && data.message) setMessage(data.message);
        else if (!cancelled) setErrored(true);
      } catch {
        if (!cancelled) setErrored(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, JSON.stringify(context)]);

  // Auto-dismiss after the message renders.
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (errored || !visible) return null;

  const wrapperClasses = floating
    ? "fixed left-1/2 top-4 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2"
    : "w-full";

  // Skeleton state while Haiku call is in flight.
  if (!message) {
    return (
      <div className={wrapperClasses} aria-live="polite">
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm animate-in fade-in duration-300">
          <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-3/4 rounded bg-emerald-100" />
            <div className="h-2.5 w-1/2 rounded bg-emerald-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClasses} aria-live="polite">
      <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <p className="flex-1 text-sm leading-snug text-emerald-900">{message}</p>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          aria-label="Dismiss mentor message"
          className="shrink-0 rounded p-0.5 text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-900"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
