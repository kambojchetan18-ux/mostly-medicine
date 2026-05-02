import Link from "next/link";

/**
 * CalculatorTeaser — static snapshot card for the AMC fee calculator.
 *
 * Phase 1 of the calculator-visibility plan: a tappable, brand-aligned widget
 * that lives inline in pillar articles (and is reusable elsewhere). It does
 * not fetch data or compute anything — the headline number is the Pro-tier
 * baseline for the full AMC pathway and updates only when we re-publish.
 *
 * Mobile: full-width below the article H1.
 * Desktop: ~280px fixed width, ready to drop into a sticky aside layout.
 *
 * The CTA links to the live calculator with `source=pillar` so we can split
 * conversion data later (see `data-source` plan in CALCULATOR-VISIBILITY.md).
 */
export default function CalculatorTeaser() {
  return (
    <aside
      className="not-prose my-7 w-full md:max-w-[280px] rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d22] via-[#0a0a1c] to-[#10101e] p-5 shadow-[0_0_40px_rgba(20,184,166,0.08)] backdrop-blur-sm"
      aria-label="AMC pathway cost snapshot"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-300 mb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse shrink-0" />
        Cost calculator · live
      </p>

      <p
        className="font-display font-bold text-white leading-none tabular-nums bg-gradient-to-r from-brand-300 via-violet-300 to-pink-300 bg-clip-text text-transparent"
        style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", letterSpacing: "-0.02em" }}
      >
        A$6,690
      </p>

      <p className="mt-2 text-sm text-slate-300 leading-snug">
        for the full AMC pathway
      </p>
      <p className="mt-1 text-[11px] text-slate-500 leading-snug">
        AMC CAT 1 + CAT 2 + IELTS + EPIC + AHPRA
      </p>

      <Link
        href="/amc-fee-calculator?source=pillar"
        aria-label="Open the AMC fee calculator and personalise your total"
        data-source="pillar-sidebar"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-brand-200 transition-colors group"
      >
        Personalise
        <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
      </Link>
    </aside>
  );
}
