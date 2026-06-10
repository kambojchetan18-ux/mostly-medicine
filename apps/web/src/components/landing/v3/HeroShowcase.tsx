"use client";

import { useState } from "react";
import TranscriptDemo from "./TranscriptDemo";

// Hero-right interactive feature switcher (Dr Aman's feedback): every core
// module is clickable at the top of the page — no scrolling needed to
// discover Ask AI or Flashcards. Tab click swaps the demo panel with a
// fade; RolePlay keeps the live TranscriptDemo, the rest are compact
// product-true mockups in the same card frame.

type TabId = "roleplay" | "mcq" | "askai" | "flashcards";

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "roleplay", label: "RolePlay", emoji: "🩺" },
  { id: "mcq", label: "MCQ", emoji: "🧠" },
  { id: "askai", label: "Ask AI", emoji: "💬" },
  { id: "flashcards", label: "Flashcards", emoji: "🃏" },
];

export default function HeroShowcase() {
  const [active, setActive] = useState<TabId>("roleplay");

  return (
    <div>
      {/* Tab pills */}
      <div
        role="tablist"
        aria-label="Explore the platform"
        className="mb-4 flex flex-wrap items-center gap-2"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              active === tab.id
                ? "bg-saffron-500 text-ink-950 shadow-[0_8px_24px_-8px_rgba(232,146,22,0.5)]"
                : "border border-ink-950/10 bg-white/70 text-ink-900/70 hover:-translate-y-0.5 hover:border-saffron-300 hover:text-ink-950"
            }`}
          >
            <span aria-hidden>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Demo panel — keyed so each switch re-runs the fade-in */}
      <div key={active} className="animate-fade-in">
        {active === "roleplay" && <TranscriptDemo />}
        {active === "mcq" && <McqDemo />}
        {active === "askai" && <AskAiDemo />}
        {active === "flashcards" && <FlashcardDemo />}
      </div>
    </div>
  );
}

/* ---------- Shared frame ---------- */

function Frame({
  live,
  title,
  right,
  footerLeft,
  footerChip,
  children,
}: {
  live?: boolean;
  title: string;
  right?: string;
  footerLeft: string;
  footerChip: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-ink-950/10 bg-cream-50 p-4 shadow-[0_30px_60px_-30px_rgba(8,8,11,0.25)] sm:p-6">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div className="flex items-center gap-2">
          {live && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron-500" />
            </span>
          )}
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-900/70">
            {title}
          </span>
        </div>
        {right && <span className="font-mono text-[11px] text-ink-900/50">{right}</span>}
      </div>

      <div className="mt-4 min-h-[260px] sm:min-h-[300px]">{children}</div>

      <div className="mt-4 flex items-center justify-between border-t border-cream-200 pt-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-900/50">
          {footerLeft}
        </span>
        <span className="rounded-full bg-saffron-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-saffron-700">
          {footerChip}
        </span>
      </div>
    </div>
  );
}

/* ---------- MCQ + SmartFeedback ---------- */

function McqDemo() {
  return (
    <Frame
      title="AMC MCQ · Infectious diseases"
      right="Q 1,204"
      footerLeft="4,300+ MCQs · 15 specialties"
      footerChip="SmartFeedback"
    >
      <p className="text-[13px] leading-relaxed text-ink-900/85 sm:text-sm">
        A 19-year-old student: 5 days of sore throat, fever, fatigue. Exudative tonsillitis,
        posterior cervical nodes, mild splenomegaly. Next step?
      </p>

      <ul className="mt-3 space-y-2">
        <li className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-[13px] text-ink-900/85">
          <span aria-hidden className="font-bold text-rose-600">
            ✗
          </span>
          <span>
            <strong className="text-ink-950">B.</strong> Oral amoxicillin
            <span className="ml-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-600">
              Your answer
            </span>
          </span>
        </li>
        <li className="flex items-start gap-2 rounded-xl border border-saffron-400 bg-saffron-50 px-3 py-2 text-[13px] text-ink-900/85">
          <span aria-hidden className="font-bold text-saffron-600">
            ✓
          </span>
          <span>
            <strong className="text-ink-950">D.</strong> Supportive care + EBV serology
          </span>
        </li>
      </ul>

      <div className="mt-3 rounded-2xl bg-ink-950 p-3.5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-saffron-400">
          🤔 Why was I wrong? · SmartFeedback
        </p>
        <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-cream-50/85">
          Posterior nodes + splenomegaly point to EBV, where amoxicillin triggers a
          near-universal rash. eTG: withhold antibiotics, confirm with serology.{" "}
          <span className="text-cream-50">Pearl: posterior nodes, think EBV.</span>
        </p>
      </div>
    </Frame>
  );
}

/* ---------- Ask AI ---------- */

function AskAiDemo() {
  return (
    <Frame
      live
      title="Ask AI · Reference library"
      footerLeft="AU guidelines · cited answers"
      footerChip="Free tier"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-900/50">
            You
          </span>
          <div className="max-w-[88%] rounded-2xl bg-ink-950 px-3.5 py-2 text-[13px] leading-relaxed text-cream-50 sm:text-sm">
            <p>First-line antihypertensive for a 55yo with type 2 diabetes and albuminuria?</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-900/50">
            Ask AI
          </span>
          <div className="max-w-[88%] rounded-2xl bg-cream-100 px-3.5 py-2 text-[13px] leading-relaxed text-ink-950 sm:text-sm">
            <p>
              An <strong>ACE inhibitor</strong> (or ARB if not tolerated) — albuminuria with
              diabetes makes renin–angiotensin blockade first-line for renal protection. Target
              &lt;130/80. Check creatinine + potassium within 2 weeks of starting.
            </p>
            <p className="mt-1.5 font-mono text-[11px] font-medium text-ink-900/60">
              Source: eTG Cardiovascular · KDIGO 2024
            </p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- Flashcards ---------- */

function FlashcardDemo() {
  const [flipped, setFlipped] = useState(false);

  return (
    <Frame
      title="Flashcards · Cardiology deck"
      right="Card 12 / 30"
      footerLeft="FSRS spaced repetition"
      footerChip="5 free / day"
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show question" : "Show answer"}
        className="block h-[230px] w-full sm:h-[260px] [perspective:1200px]"
      >
        <span
          className={`relative block h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front — question */}
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-saffron-400 bg-gradient-to-br from-saffron-50 via-cream-50 to-cream-50 px-6 text-center shadow-[0_24px_48px_-24px_rgba(232,146,22,0.4)] [backface-visibility:hidden]">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-saffron-700">
              Question
            </span>
            <span className="font-display text-lg font-bold leading-snug text-ink-950 sm:text-xl">
              Murmur of aortic stenosis — character, location and radiation?
            </span>
            <span className="mt-1 animate-pulse font-mono text-[11px] uppercase tracking-wider text-ink-900/50">
              Tap to flip ↺
            </span>
          </span>

          {/* Back — answer */}
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-ink-950 px-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-saffron-400">
              Answer
            </span>
            <span className="text-[15px] font-semibold leading-relaxed text-cream-50">
              Ejection systolic, crescendo–decrescendo, loudest at the right 2nd intercostal
              space, radiating to the carotids.
            </span>
            <span className="mt-1 font-mono text-[11px] uppercase tracking-wider text-cream-50/50">
              Tap to flip back ↺
            </span>
          </span>
        </span>
      </button>
    </Frame>
  );
}
