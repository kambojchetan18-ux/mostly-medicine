// 3 numbered steps — tighter than v2's 4 cards. Each step pairs a tiny
// visual + a verb-led title + one-sentence promise + a quantified detail.

const STEPS = [
  {
    n: "01",
    title: "Pick a case",
    body: "Browse the 151 AMC Handbook cases by specialty — or switch to Beyond-Handbook mode for unlimited AI-generated cases on the systems you're weakest on.",
    detail: "5 sec to start",
  },
  {
    n: "02",
    title: "Talk for 8 minutes",
    body: "Voice in, voice out. The AI patient holds the history coherently — you can pivot, redirect, summarise. Just like the real exam.",
    detail: "Voice OSCE · 24/7",
  },
  {
    n: "03",
    title: "Get scored on the rubric",
    body: "A Claude-Sonnet examiner grades your transcript against the AMC's 13-domain rubric. You see exactly where you scored, where you didn't.",
    detail: "13-domain breakdown",
  },
];

export default function HowItWorksV3() {
  return (
    <section id="how-it-works" className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-900/60">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
            Three steps. Then you&rsquo;re practising.
          </h2>
        </div>

        <ol className="mt-14 grid gap-6 sm:gap-7 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className="relative rounded-3xl border border-ink-950/10 bg-cream-50 p-7 transition hover:border-ink-950/20 hover:shadow-[0_24px_48px_-24px_rgba(8,8,11,0.15)]"
            >
              {/* Big numeral as background motif */}
              <span
                aria-hidden
                className="absolute right-5 top-4 font-display text-6xl font-extrabold text-ink-950/[0.04]"
              >
                {step.n}
              </span>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-700">
                Step {i + 1}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-ink-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-900/75">{step.body}</p>
              <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-cream-50">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
