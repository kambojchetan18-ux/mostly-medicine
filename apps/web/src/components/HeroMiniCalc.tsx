"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * HeroMiniCalc — interactive AMC fee mini-calculator embedded in the homepage hero.
 *
 * Phase 2 of the calculator-visibility plan: a live, tappable widget so the
 * very first thing every visitor sees is a numeric anchor — "this is what
 * AMC actually costs". Three toggle inputs (CAT 1, CAT 2, IELTS), all
 * checked by default, drive an animated count-up of the AUD total.
 *
 * Mobile (< md): renders inline below the hero CTAs as a single bordered card.
 * Desktop (>= md): rendered as the right column of a 60/40 hero layout.
 *
 * No external deps — count-up uses requestAnimationFrame with an ease-out
 * curve over ~600ms. Reuses the same brand vocabulary as CalculatorTeaser
 * (gradient totals, tabular-nums, brand-300 accents, live pulse dot).
 */
type CalcItem = {
  id: "cat1" | "cat2" | "ielts";
  label: string;
  cost: number;
};

const ITEMS: ReadonlyArray<CalcItem> = [
  { id: "cat1",  label: "AMC CAT 1", cost: 2790 },
  { id: "cat2",  label: "AMC CAT 2", cost: 3490 },
  { id: "ielts", label: "IELTS",     cost:  410 },
];

const ANIM_DURATION_MS = 600;

const formatAud = (n: number): string =>
  `A$${Math.round(n).toLocaleString("en-AU")}`;

// ease-out cubic — fast at start, gentle settle at end (matches the
// CalculatorTeaser's "live" feel without being bouncy)
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export default function HeroMiniCalc() {
  const [included, setIncluded] = useState<Record<CalcItem["id"], boolean>>({
    cat1:  true,
    cat2:  true,
    ielts: true,
  });

  const target = ITEMS.reduce(
    (sum, item) => (included[item.id] ? sum + item.cost : sum),
    0,
  );

  const [displayed, setDisplayed] = useState<number>(target);
  const fromRef    = useRef<number>(target);
  const startRef   = useRef<number | null>(null);
  const rafRef     = useRef<number | null>(null);
  const lastTarget = useRef<number>(target);

  useEffect(() => {
    if (target === lastTarget.current) return;

    fromRef.current  = displayed;
    startRef.current = null;
    lastTarget.current = target;

    const tick = (now: number): void => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / ANIM_DURATION_MS);
      const eased = easeOutCubic(t);
      const next = fromRef.current + (target - fromRef.current) * eased;
      setDisplayed(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // displayed intentionally excluded — we only re-run when target changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const toggle = (id: CalcItem["id"]): void => {
    setIncluded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside
      className="w-full md:max-w-[340px] rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d22] via-[#0a0a1c] to-[#10101e] p-5 sm:p-6 shadow-[0_0_40px_rgba(20,184,166,0.08)] backdrop-blur-sm text-left"
      aria-label="AMC fee mini calculator"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-300 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse shrink-0" />
        AMC pathway · 2026
      </p>

      <ul className="space-y-1.5 mb-3" role="group" aria-label="Pathway items">
        {ITEMS.map((item) => {
          const on = included[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => toggle(item.id)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 text-left ${
                  on
                    ? "bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.06]"
                    : "bg-transparent border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10"
                }`}
              >
                <span className="flex items-center gap-2.5 text-sm font-medium">
                  <span
                    aria-hidden
                    className={`inline-flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                      on
                        ? "bg-brand-500 border-brand-400 text-white"
                        : "bg-transparent border-slate-600 text-transparent"
                    }`}
                  >
                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6.5 L5 9 L9.5 3.5" />
                    </svg>
                  </span>
                  {item.label}
                </span>
                <span className={`text-sm tabular-nums ${on ? "text-slate-200" : "text-slate-600 line-through"}`}>
                  {formatAud(item.cost)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-white/10 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
          Your total
        </p>
        <p
          className="font-display font-bold text-white leading-none tabular-nums bg-gradient-to-r from-brand-300 via-violet-300 to-pink-300 bg-clip-text text-transparent"
          style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", letterSpacing: "-0.02em" }}
          aria-live="polite"
          aria-atomic="true"
        >
          {formatAud(displayed)}
        </p>
        <p className="mt-1.5 text-[11px] text-slate-500 leading-snug">
          Tap items to include or exclude · AUD only
        </p>
      </div>

      <Link
        href="/amc-fee-calculator?source=hero"
        aria-label="Open the full AMC fee calculator"
        data-source="hero"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-brand-200 transition-colors group"
      >
        Open full calculator
        <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
      </Link>
    </aside>
  );
}
