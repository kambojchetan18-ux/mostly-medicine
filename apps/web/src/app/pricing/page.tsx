import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/pricing`;
const TITLE = "Pricing — Free, Pro (A$29/mo) & Enterprise | Mostly Medicine";
const DESCRIPTION =
  "Mostly Medicine pricing for IMG doctors preparing for the AMC. Start free (no card needed), upgrade to Pro at A$29/mo for unlimited MCQs and AI clinical roleplay, or Enterprise at A$49/mo for live peer practice. Cancel anytime.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website" },
};

// Plan content mirrors apps/web/src/app/dashboard/billing/BillingClient.tsx —
// keep the two lists in sync if features change. This page is the public,
// no-auth marketing view; the actual Stripe checkout lives on /dashboard/billing.
type Plan = {
  key: "free" | "pro" | "enterprise";
  name: string;
  priceMonthly: number; // AUD; 0 = free
  priceYearly: number; // AUD
  tagline: string;
  features: string[];
  highlight?: boolean;
  accent: string; // tailwind border/text accent for the card
  tick: string; // bullet colour
};

const PLANS: Plan[] = [
  {
    key: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    tagline: "Get started — no card needed",
    accent: "border-ink-950/15",
    tick: "text-ink-950/55",
    features: [
      "5 AMC MCQs per day",
      "1 AMC Handbook AI RolePlay per day",
      "1 AMC Clinical AI Solo RolePlay per day",
      "1 sample Mock Exam paper per day",
      "Spaced repetition recalls (limited)",
      "Reference library (read-only)",
    ],
  },
  {
    key: "pro",
    name: "⭐ Pro",
    priceMonthly: 29,
    priceYearly: 290,
    tagline: "Clinical practice unlocked",
    highlight: true,
    accent: "border-amber-400",
    tick: "text-amber-400",
    features: [
      "Everything in Free",
      "Unlimited AMC MCQs (4,400+ bank)",
      "Full 150-question Mock Exam under exam conditions",
      "Unlimited AMC Handbook AI RolePlay",
      "AMC Clinical AI RolePlay — Solo voice mode",
      "Examiner-style feedback after every session",
    ],
  },
  {
    key: "enterprise",
    name: "🏢 Enterprise",
    priceMonthly: 49,
    priceYearly: 490,
    tagline: "Live partner practice",
    accent: "border-violet-400",
    tick: "text-violet-400",
    features: [
      "Everything in Pro",
      "AMC Peer RolePlay (live video with a partner)",
      "Practice with a partner over video + audio",
      "Higher daily limits",
      "Priority support",
    ],
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is there a free version?",
    a: "Yes. The Free plan needs no credit card and lets you practise every core feature daily — 5 MCQs, an AMC Handbook AI RolePlay, a Solo Clinical RolePlay, and a sample Mock Exam paper. It is enough to see how the platform works before you decide to upgrade.",
  },
  {
    q: "Why upgrade to Pro?",
    a: "Pro removes the daily caps. You get unlimited access to all 4,400+ AMC MCQs, the full 150-question Mock Exam under real exam conditions, unlimited AMC Handbook AI RolePlay for CAT 2, and examiner-style feedback after every session. Most candidates need thousands of practice questions and many roleplay reps — Pro is built for that volume.",
  },
  {
    q: "What does Pro cost?",
    a: "Pro is A$29 per month, or A$290 per year (about A$24.17/mo — roughly two months free). Enterprise, which adds live Peer RolePlay over video, is A$49 per month or A$490 per year.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel from your billing portal at any time and keep access until the end of your current billing period. There are no lock-in contracts.",
  },
  {
    q: "How do payments work?",
    a: "Payments are processed securely by Stripe in Australian dollars (AUD). We never see or store your card details. You can update your payment method or switch plans anytime from the billing portal.",
  },
  {
    q: "Is the content aligned with the real AMC exam?",
    a: "Yes. MCQs and clinical roleplays are aligned with the AMC Handbook of Clinical Assessment and the 2026 AMC syllabus, covering both CAT 1 (MCQ) and CAT 2 (clinical) preparation.",
  },
];

const offersSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Mostly Medicine — AMC Exam Preparation",
  description: DESCRIPTION,
  url: PAGE_URL,
  brand: { "@type": "Brand", name: "Mostly Medicine" },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "AUD",
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Pro (monthly)",
      price: "29",
      priceCurrency: "AUD",
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "29",
        priceCurrency: "AUD",
        billingDuration: 1,
        billingIncrement: 1,
        unitText: "MONTH",
      },
    },
    {
      "@type": "Offer",
      name: "Enterprise (monthly)",
      price: "49",
      priceCurrency: "AUD",
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "49",
        priceCurrency: "AUD",
        billingDuration: 1,
        billingIncrement: 1,
        unitText: "MONTH",
      },
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default async function PricingPage() {
  // Route the plan CTAs based on auth: signed-in users go straight to the
  // checkout surface; signed-out visitors sign up first, then land on billing.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const checkoutHref = user ? "/dashboard/billing" : "/auth/signup?next=/dashboard/billing";

  return (
    <main className="min-h-screen bg-cream-50 text-ink-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="font-display text-lg font-bold">
          <span className="gradient-text">Mostly</span> Medicine
        </Link>
        <Link
          href={user ? "/dashboard" : "/auth/login"}
          className="text-sm font-semibold text-ink-950/80 hover:text-ink-950"
        >
          {user ? "Dashboard" : "Sign in"}
        </Link>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-6 sm:px-10">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-saffron-300">
            Simple, honest pricing
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            Start free. Upgrade when you&apos;re serious.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-950/65">
            Built for International Medical Graduates preparing for the AMC. No
            credit card to start — pay only when you want unlimited practice.
          </p>
        </div>

        {/* Plan cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className={`relative rounded-2xl border-2 bg-white/[0.03] p-6 ${plan.accent} ${
                plan.highlight ? "shadow-lg shadow-amber-500/10" : ""
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-ink-950">
                  MOST POPULAR
                </span>
              )}
              <h2 className="text-lg font-bold text-ink-950">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold text-ink-950">
                {plan.priceMonthly === 0 ? "A$0" : `A$${plan.priceMonthly}`}
                {plan.priceMonthly > 0 && (
                  <span className="text-sm font-normal text-ink-950/65">/mo</span>
                )}
              </p>
              {plan.priceMonthly > 0 ? (
                <p className="mt-0.5 text-xs text-ink-950/55">
                  or A${plan.priceYearly}/yr · save ~17%
                </p>
              ) : (
                <p className="mt-0.5 text-xs text-ink-950/55">forever</p>
              )}
              <p className="mt-2 text-xs text-ink-950/65">{plan.tagline}</p>

              <ul className="mt-5 space-y-2 text-sm text-ink-950/80">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className={plan.tick}>{plan.key === "free" ? "•" : "✓"}</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.key === "free" ? (
                <Link
                  href="/auth/signup"
                  className="mt-6 block w-full rounded-xl border border-ink-950/20 px-4 py-2.5 text-center text-sm font-semibold text-ink-950 hover:bg-white/5"
                >
                  Start free
                </Link>
              ) : (
                <Link
                  href={checkoutHref}
                  className={`mt-6 block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold text-ink-950 shadow ${
                    plan.key === "pro"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-violet-600 hover:bg-violet-700"
                  }`}
                >
                  {plan.key === "pro" ? "Get Pro" : "Get Enterprise"}
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-ink-950/55">
          Payments processed securely by Stripe in AUD. Cancel anytime — no lock-in.
        </p>

        {/* Why upgrade */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Why upgrade to Pro?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                t: "Unlimited volume",
                d: "Most candidates need thousands of MCQs and dozens of roleplay reps. Pro removes the daily caps so your weak-area coverage is never throttled.",
              },
              {
                t: "Exam-realistic",
                d: "Sit the full 150-question Mock under real exam pacing and the one-way question pattern — the closest thing to the actual AMC CAT 1.",
              },
              {
                t: "Feedback that teaches",
                d: "Examiner-style feedback after every clinical roleplay, aligned to the AMC Handbook, so each session tells you exactly what to fix.",
              },
            ].map((b) => (
              <div key={b.t} className="rounded-xl border border-ink-950/10 bg-white/[0.02] p-4">
                <h3 className="text-sm font-bold text-ink-950">{b.t}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-950/65">{b.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Pricing FAQ</h2>
          <dl className="mt-6 divide-y divide-ink-950/10 border-y border-ink-950/10">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="text-sm font-semibold text-ink-950">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-950/65">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Closing CTA */}
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-saffron-500/30 bg-gradient-to-br from-saffron-500/10 to-transparent p-8 text-center">
          <h2 className="font-display text-2xl font-bold">Ready to pass the AMC?</h2>
          <p className="mt-2 text-sm text-ink-950/65">
            Start free today — upgrade to Pro the moment you want unlimited practice.
          </p>
          <Link
            href="/auth/signup"
            className="mt-5 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-500"
          >
            Create your free account
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
