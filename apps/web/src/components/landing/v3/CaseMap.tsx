// 151 Handbook cases laid out as a domain tag-cloud. Visual proof of depth.
// Pairs with an "+ unlimited Beyond-Handbook" callout so visitors see both
// the AMC-aligned core AND the unlimited extra practice — these are the
// two distinct product modes inside AMC Clinical AI roleplay.

const CATEGORIES: { label: string; count: number; tone: "ink" | "saffron" | "cream" }[] = [
  { label: "Cardiology", count: 14, tone: "ink" },
  { label: "Respiratory", count: 12, tone: "cream" },
  { label: "Gastroenterology", count: 11, tone: "ink" },
  { label: "Endocrinology", count: 9, tone: "cream" },
  { label: "Renal", count: 7, tone: "cream" },
  { label: "Neurology", count: 10, tone: "ink" },
  { label: "Mental health", count: 13, tone: "saffron" },
  { label: "Paediatrics", count: 15, tone: "ink" },
  { label: "Women's health", count: 12, tone: "saffron" },
  { label: "Surgery", count: 9, tone: "cream" },
  { label: "Emergency", count: 11, tone: "saffron" },
  { label: "Geriatrics", count: 6, tone: "cream" },
  { label: "Ethics", count: 7, tone: "saffron" },
  { label: "Communication", count: 10, tone: "ink" },
  { label: "Aboriginal & Torres Strait Islander health", count: 5, tone: "saffron" },
];

const TONE: Record<(typeof CATEGORIES)[number]["tone"], string> = {
  ink: "bg-ink-950 text-cream-50",
  saffron: "bg-saffron-500 text-ink-950",
  cream: "bg-cream-100 text-ink-950 ring-1 ring-ink-950/10",
};

export default function CaseMap() {
  const total = CATEGORIES.reduce((acc, c) => acc + c.count, 0);

  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-900/60">
            Case coverage
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
            {total} Handbook cases. Plus unlimited Beyond.
          </h2>
          <p className="mt-3 text-base text-ink-900/70 sm:text-lg">
            The 151 AMC Handbook cases below are the exam-aligned core. When you want more reps,
            Beyond-Handbook generates fresh AI cases &mdash; no daily cap.
          </p>
        </div>

        {/* Mode comparison strip — Handbook (fixed, exam-aligned) vs
            Beyond-Handbook (unlimited, AI-generated). */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-950/10 bg-cream-50 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-900/60">
                Handbook mode
              </span>
              <span className="rounded-full bg-ink-950 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-cream-50">
                151 cases
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-900/75">
              The exam-aligned set. Every AMC Handbook 2026 case, mapped to the 13-domain rubric.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-saffron-400 bg-saffron-50 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-700">
                Beyond-Handbook mode
              </span>
              <span className="rounded-full bg-saffron-500 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-950">
                Unlimited
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-900/80">
              Fresh AI-generated cases across every specialty &mdash; no daily cap, infinite reps for the systems you&rsquo;re weakest on.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <span
              key={cat.label}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${TONE[cat.tone]}`}
            >
              {cat.label}
              <span className="font-mono text-[11px] font-medium opacity-70">{cat.count}</span>
            </span>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-xs text-ink-900/55">
          Handbook counts above are the AMC-aligned set. Beyond-Handbook adds infinite extras.
        </p>
      </div>
    </section>
  );
}
