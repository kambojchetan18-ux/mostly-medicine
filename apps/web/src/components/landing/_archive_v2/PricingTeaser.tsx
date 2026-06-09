import Link from "next/link";

// 3-tier teaser; links to /pricing for the full breakdown. Mirrors the
// matrix shipped on /dashboard/billing so a Free user lands here, sees
// the price they'll see when they upgrade, and isn't surprised later.

const TIERS = [
  {
    name: "Free",
    price: "A$0",
    period: "forever",
    blurb: "Enough to test every feature before you decide.",
    features: [
      "5 AMC MCQs / day",
      "1 voice OSCE rehearsal / day",
      "5 flashcard reviews / day across 21 decks",
      "Full reference library + Ask AI",
    ],
    cta: { href: "/auth/signup", label: "Start free" },
    highlighted: false,
  },
  {
    name: "Pro",
    price: "A$29",
    period: "/ month",
    yearly: "A$290 / year (save A$58)",
    blurb: "Unlimited AMC drills + AI cards from your own notes.",
    features: [
      "Unlimited MCQs across all specialties",
      "Unlimited voice OSCE sessions",
      "3 AI-generated decks / day from your notes",
      "1 Anki .apkg import / day",
      "FSRS scheduling on every card",
    ],
    cta: { href: "/pricing", label: "Get Pro" },
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "A$49",
    period: "/ month",
    yearly: "A$490 / year",
    blurb: "Everything in Pro plus live peer practice.",
    features: [
      "Everything in Pro",
      "AMC Peer RolePlay (live 2-person video)",
      "Higher daily limits",
      "Priority support",
    ],
    cta: { href: "/pricing", label: "Get Enterprise" },
    highlighted: false,
  },
];

export default function PricingTeaser() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Honest pricing
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Free works. Paid is for power users.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            AUD pricing. Cancel any time. No agency in the middle.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-6 shadow-sm ${
                tier.highlighted
                  ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-200"
                  : "border-slate-200 bg-white"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                  Most popular
                </span>
              )}
              <h3 className="text-base font-bold text-slate-900">{tier.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {tier.price}
                </p>
                <p className="text-sm text-slate-500">{tier.period}</p>
              </div>
              {tier.yearly && (
                <p className="mt-0.5 text-[11px] text-slate-500">{tier.yearly}</p>
              )}
              <p className="mt-2 text-sm text-slate-600">{tier.blurb}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-700">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.cta.href}
                className={`mt-6 block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold transition ${
                  tier.highlighted
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tier.cta.label} →
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Stripe payouts to AU bank. GST-ready invoice on request.{" "}
          <Link href="/pricing" className="font-semibold text-emerald-700 hover:underline">
            Full pricing breakdown →
          </Link>
        </p>
      </div>
    </section>
  );
}
