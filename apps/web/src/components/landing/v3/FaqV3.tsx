// 6 practical Qs — replaces v2's 8 defensive Qs ("Do I still need eMedici?")
// with what an IMG actually asks before signing up: how the AI feels, what
// the exam alignment is, mobile, refund.

const FAQS: { q: string; a: string }[] = [
  {
    q: "What does an AMC Clinical AI station actually feel like?",
    a: "You hit start, see the scenario (e.g. \"40-year-old with chest pain\"), and the AI patient greets you in voice. You talk; it responds. You can interrupt, redirect, summarise — like a real exam. After 8 minutes you say \"thank you\", and a Sonnet-4.6 examiner scores you against the 13-domain AMC rubric. Available 24/7.",
  },
  {
    q: "Is the content actually aligned with the AMC Handbook 2026?",
    a: "Yes. Every station maps to the AMC Handbook 2026 case categories (cardiology, peds, mental health, etc.). Investigation choices, management plans and counselling lines are written against Australian clinical guidelines — not USMLE or UK NICE.",
  },
  {
    q: "How is the AI examiner score calculated?",
    a: "Your transcript is graded by Claude Sonnet 4.6 against the AMC's 13-domain rubric (history, communication, diagnostic reasoning, etc.). Each domain is scored 0–10 with a quote-level rationale: \"Lost 1 mark on counselling because you didn't explain the likely diagnosis before time ran out.\" Weak-domain tracking persists across sessions.",
  },
  {
    q: "Can I use it on my phone?",
    a: "Yes — the mobile app is in active testing (Android Play Store APK, iOS TestFlight). The voice OSCE works directly in mobile Safari and Chrome too if you don't want to install. AI deck generation and Anki import stay on web for v1.",
  },
  {
    q: "What's the free tier really worth?",
    a: "1 voice OSCE station per day, 5 AMC MCQs per day, 5 flashcard reviews per day, and the full Ask AI reference library. Enough to test every feature end-to-end before deciding. No card needed.",
  },
  {
    q: "Refund / cancellation policy?",
    a: "Cancel any time in your account — the remainder of the paid month stays active. We don't promise pass-or-refund guarantees, but if something breaks, email us within 30 days and we'll sort it out.",
  },
];

export default function FaqV3() {
  return (
    <section id="faq" className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-900/60">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
            What IMGs ask before signing up.
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-ink-950/10 bg-cream-50 px-5 py-4 transition open:bg-cream-100/40 open:shadow-sm"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 font-display text-base font-bold text-ink-950 marker:hidden">
                <span>{f.q}</span>
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-950/[0.06] text-sm font-bold text-ink-900/70 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-900/80">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
