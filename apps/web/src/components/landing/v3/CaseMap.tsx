// 151 cases laid out as a domain tag-cloud. Visual proof of depth that
// the v2 "21 specialty decks" KPI tile could never carry.

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
            {total} stations. Every AMC Handbook domain.
          </h2>
          <p className="mt-3 text-base text-ink-900/70 sm:text-lg">
            We don&rsquo;t pretend to cover &ldquo;everything&rdquo;. We cover the exam.
          </p>
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
          Counts approximate &mdash; the platform adds 4–8 cases each week as new AMC Handbook
          editions land.
        </p>
      </div>
    </section>
  );
}
