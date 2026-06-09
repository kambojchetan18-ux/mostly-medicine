import Link from "next/link";

// Simplified pricing — 1 highlighted plan (Pro) with the free path right
// next to it. Enterprise gets a footnote link to /pricing for the rare
// visitor who wants peer roleplay. This collapses v2's 3-card teaser into
// a single decision: free or Pro.

export default function PricingSimple() {
  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-900/60">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
            Start free. Upgrade when you want unlimited.
          </h2>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border-2 border-saffron-400 bg-cream-50 shadow-[0_30px_60px_-30px_rgba(232,146,22,0.35)]">
          <div className="grid divide-y divide-ink-950/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {/* Free */}
            <div className="p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-900/60">
                Free forever
              </p>
              <p className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink-950">
                A$0
              </p>
              <p className="mt-1 text-sm text-ink-900/65">
                Test the product end-to-end. No card.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-ink-900/85">
                <Bullet>1 AMC Clinical station / day</Bullet>
                <Bullet>5 MCQs / day</Bullet>
                <Bullet>5 flashcard reviews / day</Bullet>
                <Bullet>Full Ask AI reference library</Bullet>
              </ul>
              <Link
                href="/auth/signup"
                className="mt-7 inline-flex w-full items-center justify-center rounded-full border border-ink-950/15 px-5 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-cream-100"
              >
                Start free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-gradient-to-br from-saffron-50 via-cream-50 to-cream-50 p-8">
              <span className="absolute right-7 top-7 rounded-full bg-ink-950 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cream-50">
                Most picked
              </span>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-saffron-700">
                Pro
              </p>
              <p className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-extrabold tracking-tight text-ink-950">
                  A$29
                </span>
                <span className="text-sm text-ink-900/55">/ month</span>
              </p>
              <p className="mt-1 text-sm text-ink-900/65">
                Or A$290 / year &mdash; save A$58. Cancel any time.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-ink-900/90">
                <Bullet bold>Unlimited AMC Clinical stations</Bullet>
                <Bullet bold>Unlimited MCQs across all specialties</Bullet>
                <Bullet>3 AI-generated decks / day from your notes</Bullet>
                <Bullet>1 Anki .apkg import / day</Bullet>
                <Bullet>FSRS-5 spaced repetition on every card</Bullet>
              </ul>
              <Link
                href="/pricing"
                className="mt-7 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-saffron-500 px-5 py-3 text-sm font-bold text-ink-950 shadow-[0_8px_24px_-8px_rgba(232,146,22,0.5)] transition-all hover:-translate-y-0.5 hover:bg-saffron-400"
              >
                Get Pro
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-900/55">
          AUD pricing &middot; Stripe payout to AU bank &middot; GST-ready invoice.{" "}
          <Link
            href="/pricing"
            className="font-semibold text-saffron-700 underline-offset-2 hover:underline"
          >
            See Enterprise &amp; full breakdown
          </Link>
        </p>
      </div>
    </section>
  );
}

function Bullet({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 text-saffron-600">✓</span>
      <span className={bold ? "font-semibold" : ""}>{children}</span>
    </li>
  );
}
