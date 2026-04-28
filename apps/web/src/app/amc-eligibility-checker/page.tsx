import type { Metadata } from "next";
import Link from "next/link";
import Wizard from "./Wizard";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-eligibility-checker`;
const TITLE = "AMC Eligibility Checker — Are You Ready to Sit AMC MCQ / AMC Handbook AI RolePlay?";
const DESCRIPTION =
  "Free AMC eligibility wizard for IMGs. Answer 6 quick questions on WDOMS listing, EPIC verification, English (IELTS / OET) and AMC exams to see if you can sit AMC MCQ or AMC Handbook AI RolePlay.";

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
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  mainEntityOfPage: PAGE_URL,
  author: { "@type": "Organization", name: "Mostly Medicine", url: SITE_URL },
  publisher: { "@id": `${SITE_URL}/#organization` },
  datePublished: "2026-04-26",
  dateModified: "2026-04-26",
  inLanguage: "en-AU",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC Eligibility Checker", item: PAGE_URL },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AMC Eligibility Checker",
  url: PAGE_URL,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  description: DESCRIPTION,
};

export default function AmcEligibilityCheckerPage() {
  return (
    <main className="min-h-screen bg-[#070714] overflow-x-hidden relative text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div className="pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-6%] left-[15%] w-[600px] h-[600px] bg-violet-700/15 rounded-full blur-[130px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-pink-700/10 rounded-full blur-[110px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto">
        <Link href="/" className="font-display font-bold text-[1.15rem] tracking-tight">
          <span className="gradient-text">Mostly</span>
          <span className="text-white"> Medicine</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden sm:inline text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors font-medium"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-glow-teal hover:shadow-[0_0_40px_rgba(20,184,166,0.5)]"
          >
            Get started →
          </Link>
        </div>
      </nav>

      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pt-12 pb-10 text-center">
        <div className="inline-flex items-center gap-2.5 bg-brand-900/30 border border-brand-700/40 rounded-full px-5 py-2 text-xs text-brand-300 font-semibold mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse shrink-0" />
          6 quick questions · Personalised next steps
        </div>
        <h1
          className="font-display font-bold text-white mb-4"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
        >
          AMC Eligibility <span className="gradient-text">Checker</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
          Find out in under a minute whether you&apos;re ready to sit AMC MCQ, AMC Handbook AI RolePlay, or apply for AHPRA general registration — and what to do next.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-brand-300 hover:text-brand-200"
        >
          Start AMC prep free →
        </Link>
      </section>

      <section className="relative z-10 max-w-2xl mx-auto px-6 sm:px-10 pb-14">
        <Wizard />
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pb-24 prose prose-invert prose-headings:font-display prose-h2:text-2xl">
        <h2>Disclaimer</h2>
        <p>
          This wizard is informational only and does not constitute official AMC,
          AHPRA, or Medical Board of Australia advice. Always verify your individual
          circumstances against the latest published criteria at{" "}
          <a href="https://www.amc.org.au" target="_blank" rel="noopener">amc.org.au</a>{" "}
          and{" "}
          <a href="https://www.ahpra.gov.au" target="_blank" rel="noopener">ahpra.gov.au</a>.
        </p>
      </section>

      <footer className="relative z-10 border-t border-slate-900/80 py-8 text-center">
        <p className="font-display font-bold text-sm mb-1">
          <span className="gradient-text">Mostly Medicine</span>
          <span className="text-slate-700"> · AMC Exam Preparation</span>
        </p>
        <p className="text-xs text-slate-700 mt-1">
          Built for IMGs · Powered by Claude AI · Aligned with AMC Handbook 2026
        </p>
      </footer>
    </main>
  );
}
