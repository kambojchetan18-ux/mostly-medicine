"use client";

import { useEffect, useState } from "react";

// "Show, don't tell" — the hero-right widget. Plays back a real-ish AMC
// OSCE station turn by turn: patient line → candidate line → examiner
// score. Loops on a 12s cycle so a visitor sees the whole arc without
// scrolling. Pure CSS animation + react state, no audio (autoplay
// audio = instant bounce).
//
// Why this matters: a static "AI roleplay" claim is forgettable; watching
// an exam case play out in 12 seconds turns the moat into a demo.

interface Turn {
  who: "patient" | "you" | "examiner";
  text: string;
  detail?: string;
}

const TURNS: Turn[] = [
  {
    who: "patient",
    text: "Doctor, I've been having this chest pain for two days. It's worse when I climb stairs.",
  },
  {
    who: "you",
    text: "I'm sorry to hear that. Can you describe the pain — is it sharp, dull, or pressure-like?",
  },
  {
    who: "patient",
    text: "It feels like a heavy weight, right in the centre. Sometimes it goes to my left arm.",
  },
  {
    who: "you",
    text: "Have you had any sweating, nausea or shortness of breath with it?",
  },
  {
    who: "patient",
    text: "Yes — I felt sweaty yesterday and a bit nauseous.",
  },
  {
    who: "examiner",
    text: "End of station.",
    detail: "History: 9/10 · Communication: 8/10 · Diagnostic reasoning: 9/10",
  },
];

const TURN_MS = 2200; // ms per turn

export default function TranscriptDemo() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= TURNS.length) return 1;
        return c + 1;
      });
    }, TURN_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative isolate">
      {/* Frame: subtle ink card with monospaced typography. The "live"
          dot + station label sits in a top bar so it reads like a real
          product UI, not a hand-rolled mockup. */}
      <div className="rounded-3xl border border-ink-950/10 bg-cream-50 p-4 shadow-[0_30px_60px_-30px_rgba(8,8,11,0.25)] sm:p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-cream-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron-500" />
            </span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-900/70">
              AMC Handbook · Station 47
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-900/50">08:00</span>
        </div>

        {/* Transcript turns */}
        <div className="mt-4 flex min-h-[260px] flex-col gap-3 sm:min-h-[300px]">
          {TURNS.slice(0, visibleCount).map((turn, i) => (
            <TurnBubble key={`turn-${turn.who}-${turn.text.slice(0, 30)}-${i}`} turn={turn} fresh={i === visibleCount - 1} />
          ))}
        </div>

        {/* Bottom hint */}
        <div className="mt-4 flex items-center justify-between border-t border-cream-200 pt-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-900/50">
            AI voice patient
          </span>
          <span className="rounded-full bg-saffron-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-saffron-700">
            13-domain rubric
          </span>
        </div>
      </div>

      {/* Floating "score" chip — adds visual energy when the examiner
          turn appears. */}
      {visibleCount >= TURNS.length && (
        <div className="absolute -right-2 -top-4 hidden rotate-3 rounded-2xl bg-ink-950 px-3 py-2 text-cream-50 shadow-xl sm:block">
          <p className="font-mono text-[10px] uppercase tracking-wider text-cream-50/60">
            Overall
          </p>
          <p className="font-display text-2xl font-extrabold leading-none text-saffron-400">
            26/30
          </p>
        </div>
      )}
    </div>
  );
}

function TurnBubble({ turn, fresh }: { turn: Turn; fresh: boolean }) {
  const wrapAlign = turn.who === "you" ? "items-end" : "items-start";
  const bubble =
    turn.who === "patient"
      ? "bg-cream-100 text-ink-950"
      : turn.who === "you"
        ? "bg-ink-950 text-cream-50"
        : "bg-saffron-50 text-ink-950 ring-1 ring-saffron-200";
  const label =
    turn.who === "patient" ? "Patient" : turn.who === "you" ? "You" : "Examiner";

  return (
    <div className={`flex w-full flex-col gap-1 ${wrapAlign} ${fresh ? "animate-fade-in" : ""}`}>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-900/50">
        {label}
      </span>
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed sm:text-sm ${bubble}`}
      >
        <p>{turn.text}</p>
        {turn.detail && (
          <p className="mt-1.5 font-mono text-[11px] font-medium text-ink-900/70">{turn.detail}</p>
        )}
      </div>
    </div>
  );
}
