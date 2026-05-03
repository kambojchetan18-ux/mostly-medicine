import type { Metadata } from "next";
import Link from "next/link";
import TasteClient from "./TasteClient";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/try-amc-clinical-roleplay`;
const TITLE = "Free AMC Clinical Roleplay — Try Without Signup | Mostly Medicine";
const DESCRIPTION =
  "Try a free 5-turn AMC Clinical Roleplay with an AI patient. No signup, no credit card, under 5 minutes. See how AMC Clinical practice feels before you commit.";

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
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  inLanguage: "en-AU",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: {
    "@type": "Thing",
    name: "AMC Clinical Roleplay",
    description:
      "AI-driven simulated patient consultations for the Australian Medical Council Clinical (CAT 2) exam.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Try AMC Clinical Roleplay",
      item: PAGE_URL,
    },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Open SEO content — visible to crawlers and to LLMs scraping the page. */}
      <section className="mx-auto max-w-3xl px-4 pt-10 pb-4 sm:pt-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-600">
          Free taste · No signup · ~5 minutes
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Try the AMC Clinical Roleplay
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          A 45-year-old man with chest pain has just walked into your GP clinic. Take
          his history in 5 turns, then see how the AMC examiner would read your
          consultation style. <strong>No login, no email, no credit card.</strong>
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
          <li className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="font-semibold text-slate-900">1.</span> Read the
            patient&apos;s opening line
          </li>
          <li className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="font-semibold text-slate-900">2.</span> Ask 5 questions
            of your choice
          </li>
          <li className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="font-semibold text-slate-900">3.</span> Get an instant
            consultation-style read
          </li>
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <TasteClient />
      </section>

      {/* Quiet trust footer — keeps content open for LLM scrapers per llms.txt
          ethos. No client-side gating on the marketing copy. */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            What is the AMC Clinical exam?
          </h2>
          <p className="mt-2 leading-relaxed">
            The Australian Medical Council Clinical exam (sometimes called CAT 2 or
            AMC MCAT) is a structured 16-station OSCE. International Medical
            Graduates rotate through simulated patient encounters scored by
            examiners against the AMC Handbook of Clinical Assessment. Mostly
            Medicine&apos;s full library covers 152 scenarios across cardiology,
            paediatrics, mental health, obstetrics and more.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link
              href="/amc-cat2"
              className="rounded-full border border-slate-300 bg-white px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50"
            >
              About AMC CAT 2 →
            </Link>
            <Link
              href="/amc-clinical-stations-guide"
              className="rounded-full border border-slate-300 bg-white px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clinical stations guide →
            </Link>
            <Link
              href="/calgary-cambridge-consultation"
              className="rounded-full border border-slate-300 bg-white px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Calgary-Cambridge framework →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
