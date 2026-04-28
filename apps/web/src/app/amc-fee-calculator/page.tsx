import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "./Calculator";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-fee-calculator`;
const TITLE = "AMC Fee Calculator 2026 — Total AMC Pathway Cost (AUD/USD/INR)";
const DESCRIPTION =
  "Free interactive calculator for the total cost of the AMC pathway in 2026 — AMC MCQ, AMC Handbook AI RolePlay, EPIC, IELTS or OET, and AHPRA registration. View totals in AUD, USD, or INR.";

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
    { "@type": "ListItem", position: 2, name: "AMC Fee Calculator", item: PAGE_URL },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AMC Fee Calculator",
  url: PAGE_URL,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  description: DESCRIPTION,
};

export default function AmcFeeCalculatorPage() {
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

      {/* Ambient blobs */}
      <div className="pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-6%] left-[15%] w-[600px] h-[600px] bg-violet-700/15 rounded-full blur-[130px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-pink-700/10 rounded-full blur-[110px]" />
      </div>

      {/* Nav */}
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

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pt-12 pb-10 text-center">
        <div className="inline-flex items-center gap-2.5 bg-brand-900/30 border border-brand-700/40 rounded-full px-5 py-2 text-xs text-brand-300 font-semibold mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse shrink-0" />
          Updated 2026 · AUD · USD · INR
        </div>
        <h1
          className="font-display font-bold text-white mb-4"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
        >
          AMC Fee <span className="gradient-text">Calculator</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
          Estimate the full cost of becoming a registered doctor in Australia — exam attempts, EPIC, English testing, and AHPRA — in your local currency.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-brand-300 hover:text-brand-200"
        >
          Start AMC prep free →
        </Link>
      </section>

      {/* Calculator */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 pb-20">
        <Calculator />
      </section>

      {/* Notes */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pb-24 prose prose-invert prose-headings:font-display prose-h2:text-2xl">
        <h2>What&apos;s included in this estimate</h2>
        <ul>
          <li>
            <strong>AMC MCQ:</strong> ~AUD 2,690 per sitting. Computer-based,
            150 questions, taken at Pearson VUE centres in Australia.
          </li>
          <li>
            <strong>AMC Handbook AI RolePlay (Clinical / MCAT):</strong> ~AUD 3,490 per sitting.
            Multi-station OSCE in Melbourne or Adelaide.
          </li>
          <li>
            <strong>EPIC (ECFMG verification):</strong> ~USD 130 base, plus per-document
            fees that vary by school. Required before applying for AMC.
          </li>
          <li>
            <strong>IELTS Academic:</strong> ~AUD 410, valid 3 years. Need 7.0 in each band.
          </li>
          <li>
            <strong>OET (Medicine):</strong> ~AUD 587, valid 3 years. Need a B in each
            sub-test. Generally favoured by AHPRA.
          </li>
          <li>
            <strong>AHPRA general registration:</strong> ~AUD 760 for the application
            and first year (figures vary).
          </li>
        </ul>
        <h2>What&apos;s not included</h2>
        <p>
          The estimate excludes travel, accommodation in Melbourne/Adelaide for AMC Handbook AI RolePlay,
          courier costs for certified document copies, criminal-history checks, and any
          revision course or coaching fees. Exchange-rate fluctuations also affect the
          final figure.
        </p>
        <p>
          Always confirm current fees directly on{" "}
          <a href="https://www.amc.org.au" target="_blank" rel="noopener">amc.org.au</a>,{" "}
          <a href="https://www.ecfmg.org" target="_blank" rel="noopener">ecfmg.org</a>,{" "}
          <a href="https://www.ahpra.gov.au" target="_blank" rel="noopener">ahpra.gov.au</a>,{" "}
          <a href="https://www.ielts.org" target="_blank" rel="noopener">ielts.org</a>{" "}
          and{" "}
          <a href="https://occupationalenglishtest.org" target="_blank" rel="noopener">
            occupationalenglishtest.org
          </a>
          .
        </p>
      </section>

      {/* Footer */}
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
