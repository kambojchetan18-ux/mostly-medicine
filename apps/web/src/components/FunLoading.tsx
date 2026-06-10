"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  "🩺 Polishing the stethoscope…",
  "🧠 Loading neurons…",
  "📚 Asking the AI examiner (don't tell them)…",
  "🤔 Channeling our inner Sherlock…",
  "💊 Prescribing patience…",
  "🦴 Aligning the differential diagnoses…",
  "🩸 Counting your white cells…",
  "📋 Reading the handbook for the 100th time…",
  "🧬 Sequencing your cleverness…",
  "⚕️ Sterilising the AI's gloves…",
  "🚑 Backing the ambulance up…",
  "🍵 Brewing the chai before the consult…",
  "📖 Flipping through Murtagh's…",
  "🩻 Developing the X-ray (still on film)…",
  "🧪 Spinning the centrifuge…",
  "🤖 Bribing Claude with biscuits…",
];

interface Props {
  className?: string;
  // Override messages for context-specific loading states.
  pool?: string[];
  // Cycle interval in ms (default 1.5s).
  intervalMs?: number;
}

// Rotating witty loading message. Gives the user something to read instead
// of staring at a spinner. Pure client-side, no network, no state outside
// the local timer.
export default function FunLoading({ className, pool, intervalMs = 1500 }: Props) {
  const messages = pool && pool.length > 0 ? pool : MESSAGES;
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * messages.length));

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [messages.length, intervalMs]);

  return (
    <div className={className ?? "flex items-center gap-2 text-sm text-gray-600"}>
      <div className="h-3 w-3 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      <span>{messages[idx]}</span>
    </div>
  );
}
