import Link from "next/link";

// AMC MCQ deep-dive — the SmartFeedback feature shown as a real wrong-answer
// walkthrough. Mirrors AIExaminer's copy-vs-proof layout: the demo card IS
// the product tour. Sits right after AIExaminer so the page reads roleplay
// deep-dive → MCQ deep-dive, both with verbatim product output in mono.

const STATS = [
  "4,300+ MCQs",
  "15 specialties",
  "AU guidelines cited",
  "Spaced repetition",
];

export default function SmartFeedbackMCQ() {
  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* LEFT — MCQ + SmartFeedback demo card */}
          <div className="order-last lg:order-first">
            <div className="rounded-3xl border-2 border-saffron-400 bg-gradient-to-br from-saffron-50 via-cream-50 to-cream-50 p-6 shadow-[0_24px_48px_-24px_rgba(232,146,22,0.4)] sm:p-8">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-900/50">
                AMC MCQ · Infectious diseases · Q 1,204
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-900/85">
                A 19-year-old university student presents with 5 days of sore throat, fever and
                profound fatigue. Examination: exudative tonsillitis, posterior cervical
                lymphadenopathy, mild splenomegaly. The most appropriate next step?
              </p>

              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-sm text-ink-900/85">
                  <span aria-hidden className="font-bold text-rose-600">
                    ✗
                  </span>
                  <span>
                    <strong className="text-ink-950">B.</strong> Commence oral amoxicillin
                    <span className="ml-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-600">
                      Your answer
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl border border-saffron-400 bg-saffron-50 px-3.5 py-2.5 text-sm text-ink-900/85">
                  <span aria-hidden className="font-bold text-saffron-600">
                    ✓
                  </span>
                  <span>
                    <strong className="text-ink-950">D.</strong> Supportive care + EBV serology
                    <span className="ml-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-saffron-700">
                      Correct
                    </span>
                  </span>
                </li>
              </ul>

              {/* The SmartFeedback affordance */}
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-sm font-bold text-cream-50">
                <span aria-hidden>🤔</span> Why was I wrong?
              </p>

              {/* SmartFeedback explanation panel — verbatim product output */}
              <div className="mt-3 rounded-2xl bg-ink-950 p-4 sm:p-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-saffron-400">
                  SmartFeedback
                </p>
                <p className="mt-2 font-mono text-[12px] leading-relaxed text-cream-50/85">
                  <span className="font-semibold text-cream-50">The trap:</span> exudative
                  tonsillitis in a young adult screams strep — but posterior nodes + splenomegaly
                  point to EBV, where amoxicillin triggers a near-universal maculopapular rash.{" "}
                  <span className="font-semibold text-cream-50">Guideline:</span> eTG Antibiotic
                  says withhold antibiotics in suspected glandular fever and confirm with EBV
                  serology first. <span className="font-semibold text-cream-50">Pearl:</span>{" "}
                  anterior nodes think strep, posterior nodes think EBV — never amoxicillin for a
                  tired teenager with a big spleen.
                </p>
                <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-cream-50/40">
                  Cached · re-reads are free
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — copy */}
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-700">
              AMC MCQ · SmartFeedback
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
              Every wrong answer becomes a lesson.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-900/75 sm:text-lg">
              4,300+ AU-aligned MCQs across 15 specialties — and when you miss one, hit{" "}
              <strong className="text-ink-950">&ldquo;🤔 Why was I wrong?&rdquo;</strong>.
              SmartFeedback names the exact trap you fell into, cites the Australian guideline it
              tested (RACGP, eTG, AMH, NHFA), and leaves you one clinical pearl for exam day.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-ink-900/85">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-saffron-500" />
                <span>Personalised to the option you actually picked — not a generic answer key</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-saffron-500" />
                <span>Explanations cached, so re-reading during revision costs nothing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-saffron-500" />
                <span>FSRS spaced repetition resurfaces the questions you got wrong, right before you&rsquo;d forget</span>
              </li>
            </ul>

            <div className="mt-7 flex flex-wrap gap-2">
              {STATS.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-ink-950/10 bg-white px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-900/75"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-saffron-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[0_8px_24px_-8px_rgba(232,146,22,0.5)] transition-all hover:-translate-y-0.5 hover:bg-saffron-400 hover:shadow-[0_12px_28px_-8px_rgba(232,146,22,0.6)]"
              >
                Try 5 MCQs free today
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
