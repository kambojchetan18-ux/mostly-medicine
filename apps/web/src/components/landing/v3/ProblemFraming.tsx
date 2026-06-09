// Old way vs new way — the StatDoctor framing reinterpreted for AMC prep.
// Instead of "tools wrong / MM right" generic comparison, this names the
// real IMG pain: passive reading doesn't simulate examiner pressure.

export default function ProblemFraming() {
  return (
    <section className="bg-cream-100/40 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-900/60">
            The problem
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
            Reading Murtagh isn&rsquo;t practising.
          </h2>
          <p className="mt-3 text-base text-ink-900/70 sm:text-lg">
            The AMC Clinical exam is 8 minutes per station, live, voiced, scored on the
            spot. No textbook gets you there.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {/* Old way */}
          <div className="relative rounded-3xl border border-ink-950/10 bg-cream-50 p-7">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-900/50">
              Old way
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-ink-950">
              Re-read the handbook. Hope.
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-ink-900/75">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-ink-900/30">—</span>
                <span>Solo reading; never spoken aloud</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-ink-900/30">—</span>
                <span>Study partner needs scheduling, may not show up</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-ink-900/30">—</span>
                <span>No 13-domain feedback &mdash; you don&rsquo;t know where you&rsquo;re losing marks</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-ink-900/30">—</span>
                <span>Tools tuned for USMLE, not AMC Clinical</span>
              </li>
            </ul>
          </div>

          {/* New way */}
          <div className="relative rounded-3xl border-2 border-saffron-400 bg-gradient-to-br from-saffron-50 via-cream-50 to-cream-50 p-7 shadow-[0_24px_48px_-24px_rgba(232,146,22,0.4)]">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-700">
              New way
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-ink-950">
              Talk through a station. Get scored. Repeat.
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-ink-900/85">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 font-bold text-saffron-600">+</span>
                <span>AI patient holds context for the full 8 minutes</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 font-bold text-saffron-600">+</span>
                <span>Available 24/7 &mdash; no partner, no scheduling</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 font-bold text-saffron-600">+</span>
                <span>13-domain examiner score, line by line</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 font-bold text-saffron-600">+</span>
                <span>Built around the AMC Handbook 2026, in Sydney</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
