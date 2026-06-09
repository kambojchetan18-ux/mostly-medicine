// 4-step "How it works" with a time-to-value claim per step.
// StatDoctor pattern: numbered tiles, big numeral, tight benefit copy.

const STEPS = [
  {
    num: 1,
    title: "Pick the system you'll fail on",
    blurb:
      "Open a CAT 1 weak-area drill or a specialty deck — Cardiology to Aboriginal Health. We surface what's lowest on your readiness curve.",
    time: "5 minutes",
  },
  {
    num: 2,
    title: "Drill it with spaced recall",
    blurb:
      "FSRS-5 scheduling brings each card back the moment you're about to forget. Every explanation cites Murtagh, RACGP or eTG.",
    time: "20 minutes / day",
  },
  {
    num: 3,
    title: "Rehearse it out loud",
    blurb:
      "Talk to an AI patient over voice. 150+ AMC Handbook stations, scored against the official 13-domain rubric. No partner needed.",
    time: "1 OSCE / day",
  },
  {
    num: 4,
    title: "Track CAT 1 readiness",
    blurb:
      "Heatmap, streak, weak-system ranking. We tell you when you're ready to sit — not just how many cards you've reviewed.",
    time: "Updated nightly",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            From signup to your first OSCE rehearsal &mdash; 24 hours.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            No agency. No paywall on the first sit-down. Built around how working IMGs actually
            study.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-emerald-300 hover:bg-white"
            >
              <div className="absolute -top-3 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-md">
                {step.num}
              </div>
              <h3 className="mt-2 text-base font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.blurb}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                <span aria-hidden>⏱️</span> {step.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
