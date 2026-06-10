import Link from "next/link";
import HeroShowcase from "./HeroShowcase";

// Split hero — left: niche-clear headline + dual CTA + tiny trust line.
// Right: interactive feature switcher (HeroShowcase) — tab pills for
// RolePlay / MCQ / Ask AI / Flashcards so every core module is one click
// away at the top of the page, no scrolling needed to discover features.

export default function HeroV3() {
  return (
    <section className="relative isolate overflow-hidden bg-cream-50 pt-28 sm:pt-36">
      {/* Decorative: subtle saffron halo top-right — adds warmth without
          turning the page into a gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-15%] -z-10 h-[480px] w-[480px] rounded-full bg-saffron-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-15%] top-[40%] -z-10 h-[420px] w-[420px] rounded-full bg-cream-200/60 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 sm:pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:pb-32">
        {/* LEFT — copy column */}
        <div>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-cream-100/70 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-900/70">
              AMC Clinical · AI Roleplay
            </span>
          </div>

          {/* H1 — Fraunces serif. Niche-clear in one line: AI patient + AMC
              Clinical + OSCE. */}
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-950 sm:text-5xl lg:text-[64px]">
            Practise <em className="not-italic text-saffron-600">AMC Clinical</em>
            <br />
            with an AI patient.
          </h1>

          {/* Subhead */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-900/75 sm:text-lg">
            All <strong className="text-ink-950">151 AMC Handbook cases</strong>, plus{" "}
            <strong className="text-ink-950">unlimited Beyond-Handbook</strong> AI clinical
            cases. Voice in, voice out. Scored against the same 13-domain AMC rubric.
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-saffron-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[0_8px_24px_-8px_rgba(232,146,22,0.5)] transition-all hover:-translate-y-0.5 hover:bg-saffron-400 hover:shadow-[0_12px_28px_-8px_rgba(232,146,22,0.6)]"
            >
              Try a station &mdash; free
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold text-ink-950/80 transition-colors hover:text-ink-950"
            >
              See how it works
            </Link>
          </div>

          {/* Tiny trust line */}
          <p className="mt-5 text-xs text-ink-900/55">
            No card. 1 free station per day. AMC Handbook 2026 aligned.
          </p>
        </div>

        {/* RIGHT — interactive feature switcher */}
        <div className="relative">
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
