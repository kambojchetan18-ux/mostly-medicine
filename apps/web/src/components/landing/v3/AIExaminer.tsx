// The 13-domain examiner rubric, shown as a real scored station. This is
// the conversion lever — no other AMC prep tool publishes the actual
// rubric breakdown, so showing it on the homepage is both proof and
// product-tour in one.

const DOMAINS = [
  { name: "Approach to the patient", score: 9 },
  { name: "History-taking", score: 8 },
  { name: "Communication & rapport", score: 9 },
  { name: "Physical examination", score: 7 },
  { name: "Investigations", score: 8 },
  { name: "Diagnostic reasoning", score: 9 },
  { name: "Management plan", score: 8 },
  { name: "Patient safety", score: 9 },
  { name: "Professionalism", score: 9 },
  { name: "Cultural & social awareness", score: 8 },
  { name: "Ethics & medico-legal", score: 8 },
  { name: "Counselling & shared decision", score: 7 },
  { name: "Time management", score: 8 },
];

export default function AIExaminer() {
  const total = DOMAINS.reduce((acc, d) => acc + d.score, 0);
  const max = DOMAINS.length * 10;
  const pct = Math.round((total / max) * 100);

  return (
    <section className="bg-ink-950 py-20 text-cream-50 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* LEFT — copy */}
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-400">
              The AI examiner
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-cream-50 sm:text-4xl">
              Scored on the same rubric the AMC uses.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-cream-50/75 sm:text-lg">
              When you say &ldquo;thank you, that&rsquo;s all&rdquo;, a Claude-Sonnet examiner reads
              your transcript and grades it across all <strong className="text-cream-50">13 AMC examiner
              domains</strong>. You see the score, the rationale, and the exact moments you lost or
              gained marks &mdash; line by line.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-cream-50/85">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-saffron-400" />
                <span>Grounded in your actual transcript &mdash; no generic feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-saffron-400" />
                <span>Quote-level rationale: &ldquo;Lost 1 mark here because you didn&rsquo;t ask about red flags&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-saffron-400" />
                <span>Weak-domain tracking across sessions &mdash; you know what to fix next</span>
              </li>
            </ul>
          </div>

          {/* RIGHT — rubric card */}
          <div className="rounded-3xl bg-cream-50 p-6 text-ink-950 shadow-[0_30px_80px_-30px_rgba(232,146,22,0.4)] sm:p-8">
            <div className="flex items-end justify-between border-b border-ink-950/10 pb-4">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-900/50">
                  Station 47 · Chest pain
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-950">
                  Examiner score
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-4xl font-extrabold leading-none text-saffron-600 sm:text-5xl">
                  {total}/{max}
                </p>
                <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-900/60">
                  {pct}%
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5">
              {DOMAINS.map((d) => (
                <li key={d.name} className="grid grid-cols-[1fr_60px_24px] items-center gap-2">
                  <span className="truncate text-[13px] text-ink-900/85">{d.name}</span>
                  {/* Score bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-ink-950/[0.06]">
                    <div
                      className={`h-full rounded-full ${
                        d.score >= 9
                          ? "bg-saffron-500"
                          : d.score >= 8
                            ? "bg-saffron-400"
                            : "bg-saffron-200"
                      }`}
                      style={{ width: `${d.score * 10}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-[11px] font-semibold text-ink-900/80">
                    {d.score}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 rounded-2xl bg-cream-100 px-3.5 py-2.5 font-mono text-[11px] leading-relaxed text-ink-900/75">
              <span className="font-semibold text-ink-950">Rationale (excerpt):</span> Strong rapport
              and red-flag screening for cardiac causes. Lost 1 mark on counselling — patient never
              told likely diagnosis before exam ended.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
