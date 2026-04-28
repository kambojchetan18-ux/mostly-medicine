import type { Metadata } from "next";
import Link from "next/link";

import {
  SITE_URL,
  SPECIALTIES,
  getCountsBySpecialty,
} from "./specialties";

const PAGE_URL = `${SITE_URL}/amc-mcq`;
const TITLE = "AMC MCQ Practice — Free Sample Questions by Specialty";
const DESCRIPTION =
  "Free AMC MCQ practice for International Medical Graduates. 3,000+ Australian-aligned questions across cardiology, respiratory, gastroenterology, neurology, paediatrics, O&G, emergency, and more.";

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

export default function AmcMcqIndexPage() {
  const counts = getCountsBySpecialty();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "AMC MCQ Practice", item: PAGE_URL },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    inLanguage: "en-AU",
    isPartOf: { "@type": "WebSite", name: "Mostly Medicine", url: SITE_URL },
    hasPart: SPECIALTIES.map((s) => ({
      "@type": "LearningResource",
      name: `AMC ${s.name} MCQ Practice`,
      url: `${SITE_URL}/amc-mcq/${s.slug}`,
      learningResourceType: "Practice question bank",
      teaches: s.name,
      educationalUse: "AMC MCQ examination preparation",
    })),
  };

  const totalQuestions = SPECIALTIES.reduce(
    (sum, s) => sum + (counts[s.slug] ?? 0),
    0,
  );

  return (
    <main className="min-h-screen bg-[#070714] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <nav className="max-w-4xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg">
          <span className="gradient-text">Mostly</span> Medicine
        </Link>
        <Link
          href="/auth/signup"
          className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold"
        >
          Start free
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto px-6 sm:px-10 pt-8 pb-12">
        <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-3">
          AMC MCQ · Practice
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">
          AMC MCQ Practice by Specialty
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
          {totalQuestions.toLocaleString()}+ Australian-aligned MCQs for
          International Medical Graduates, split across the {SPECIALTIES.length}{" "}
          core AMC MCQ specialties. Free sample questions with worked
          explanations on every page — sign up to unlock the full bank,
          AI-generated follow-ups, and spaced-repetition recall.
        </p>
        <div className="mt-6 flex gap-3 flex-wrap">
          <Link
            href="/auth/signup"
            className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl text-sm font-bold"
          >
            Start free
          </Link>
          <Link
            href="/amc"
            className="border border-slate-700 hover:border-slate-500 text-slate-200 px-6 py-3 rounded-xl text-sm font-bold"
          >
            Read the AMC exam guide
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-10 pb-20">
        <h2 className="font-display font-bold text-2xl sm:text-3xl mb-6">
          Choose a specialty
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SPECIALTIES.map((s) => {
            const n = counts[s.slug] ?? 0;
            return (
              <li key={s.slug}>
                <Link
                  href={`/amc-mcq/${s.slug}`}
                  className="block h-full rounded-2xl border border-slate-800 hover:border-violet-700/60 bg-slate-900/40 hover:bg-slate-900/70 p-5 transition"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-display font-bold text-lg text-white">
                      {s.name}
                    </h3>
                    <span className="text-xs uppercase tracking-widest text-violet-300">
                      {n} MCQs
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {s.tagline}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-widest text-violet-400 font-bold">
                    Practise {s.short.toLowerCase()} →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="max-w-4xl mx-auto px-6 sm:px-10 pb-16 text-sm text-slate-500">
        <p>
          Educational practice content from Mostly Medicine, mapped to publicly
          available Australian guidelines (RACGP, Therapeutic Guidelines, AMH,
          Heart Foundation, RANZCOG, RACS, RANZCP). For official AMC examination
          information visit{" "}
          <a href="https://www.amc.org.au" target="_blank" rel="noopener">
            amc.org.au
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
