import Link from "next/link";

// The hero leads with AMC Clinical (the moat), and AMC MCQ now has its own
// SmartFeedback deep-dive section — this surfaces the remaining two pillars
// without diluting the Clinical-first narrative. Placement: after CaseMap,
// before BuiltForIMGs — so Clinical depth (AIExaminer + CaseMap) reads as
// a unit, then we open the aperture to "and there's more".

interface Module {
  numeral: string;
  tag: string;
  title: string;
  blurb: string;
  bullets: string[];
  href: string;
  cta: string;
}

const MODULES: Module[] = [
  {
    numeral: "01",
    tag: "Ask AI",
    title: "Your AMC reference library, on tap.",
    blurb:
      "Ask any clinical question — get Murtagh-grade answers grounded in Australian guidelines, free for everyone.",
    bullets: [
      "Murtagh / RACGP / eTG aware",
      "Cites every claim",
      "Free, no daily cap",
    ],
    href: "/ask-ai",
    cta: "Try Ask AI",
  },
  {
    numeral: "02",
    tag: "Flashcards",
    title: "21 specialty decks. FSRS-5 spaced recall.",
    blurb:
      "Cited like a textbook, fast like a flashcard. Plus AI generation from your notes and Anki .apkg import.",
    bullets: [
      "21 packaged AU-cited decks",
      "AI cards from your notes",
      "Anki .apkg import",
    ],
    href: "/dashboard/flashcards",
    cta: "Open flashcards",
  },
];

export default function MoreModules() {
  return (
    <section className="bg-cream-100/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-900/60">
            Beyond Clinical
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
            Two more ways to prep.
          </h2>
          <p className="mt-3 text-base text-ink-900/70 sm:text-lg">
            AMC Clinical is the moat. Ask AI and flashcards are how you keep building between
            stations.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
          {MODULES.map((m) => (
            <article
              key={m.tag}
              className="group relative flex flex-col rounded-3xl border border-ink-950/10 bg-cream-50 p-7 transition hover:-translate-y-1 hover:border-saffron-400 hover:shadow-[0_30px_60px_-30px_rgba(232,146,22,0.35)]"
            >
              {/* Big background numeral */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-6 top-5 font-display text-6xl font-extrabold text-ink-950/[0.04] transition-colors group-hover:text-saffron-500/15"
              >
                {m.numeral}
              </span>

              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-700">
                {m.tag}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold leading-tight text-ink-950">
                {m.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-900/70">{m.blurb}</p>

              <ul className="mt-5 space-y-2 text-[13px] text-ink-900/85">
                {m.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-0.5 text-saffron-600">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5">
                <Link
                  href={m.href}
                  className="group/cta inline-flex items-center gap-1.5 text-sm font-bold text-ink-950 transition-colors hover:text-saffron-700"
                >
                  {m.cta}
                  <span
                    aria-hidden
                    className="transition-transform group-hover/cta:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
