import type { Metadata } from "next";
import Link from "next/link";
import PillarPageNav from "@/components/PillarPageNav";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/contact`;
const TITLE = "Contact Mostly Medicine — Email Support for IMG AMC Prep";
const DESCRIPTION =
  "Get in touch with Mostly Medicine. Email info@mostlymedicine.com — we read every message and reply within one business day.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Contact", item: PAGE_URL },
  ],
};

const orgContactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: TITLE,
  url: PAGE_URL,
  inLanguage: "en-AU",
  mainEntity: {
    "@type": "Organization",
    name: "Mostly Medicine",
    url: SITE_URL,
    email: "info@mostlymedicine.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "info@mostlymedicine.com",
      availableLanguage: ["English"],
      areaServed: "AU",
    },
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#070714] overflow-x-hidden relative text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgContactSchema) }} />

      <div className="pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-6%] left-[15%] w-[600px] h-[600px] bg-emerald-700/15 rounded-full blur-[130px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-teal-700/10 rounded-full blur-[110px]" />
      </div>

      <PillarPageNav />

      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pt-12 pb-16">
        <p className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-3">
          Contact
        </p>
        <h1
          className="font-display font-bold text-white mb-5"
          style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
        >
          Get in touch
        </h1>
        <p className="text-base text-slate-400 leading-relaxed mb-10">
          Whether you&apos;re an IMG with a question about AMC prep, a doctor wanting to share feedback,
          or a partner exploring how Mostly Medicine can help your cohort, we read every message.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="mailto:info@mostlymedicine.com"
            className="group rounded-2xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950/60 to-slate-900/60 hover:border-emerald-500/60 p-6 transition-all"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-2">
              Email
            </p>
            <p className="text-base font-semibold text-white mb-1">info@mostlymedicine.com</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              We typically reply within one business day. For exam-prep help, include your AMC sitting date so we can prioritise.
            </p>
            <p className="mt-4 text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
              Send an email →
            </p>
          </a>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
              Based in
            </p>
            <p className="text-base font-semibold text-white mb-1">Sydney, Australia</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              We support International Medical Graduates worldwide. Replies come from{" "}
              <span className="font-semibold text-slate-300">info@mostlymedicine.com</span>.
            </p>
          </div>
        </div>

        <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-950/40 p-7 sm:p-9">
          <h2 className="font-display font-bold text-xl text-white mb-3">
            Common questions before you write
          </h2>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>
              <span className="font-semibold text-white">Account or billing issue?</span>{" "}
              Sign in and visit{" "}
              <Link href="/dashboard/billing" className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline">
                /dashboard/billing
              </Link>{" "}
              — most subscription changes can be done there directly via Stripe.
            </li>
            <li>
              <span className="font-semibold text-white">Question about AMC prep itself?</span>{" "}
              Try{" "}
              <Link href="/ask-ai" className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline">
                Ask AI
              </Link>{" "}
              first — three free questions, no signup needed, grounded in Murtagh, RACGP and the AMC Handbook.
            </li>
            <li>
              <span className="font-semibold text-white">Want to know what we offer?</span>{" "}
              The{" "}
              <Link href="/amc" className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline">
                AMC Exam Guide
              </Link>{" "}
              and{" "}
              <Link href="/amc-fee-calculator" className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline">
                Fee Calculator
              </Link>{" "}
              cover the full pathway end-to-end.
            </li>
          </ul>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
