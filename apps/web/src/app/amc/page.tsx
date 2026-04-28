import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc`;
const TITLE = "AMC Exam Guide 2026 — AMC MCQ & AMC Handbook AI RolePlay Clinical for IMGs";
const DESCRIPTION =
  "Complete guide to the Australian Medical Council (AMC) exam for International Medical Graduates. Learn about AMC MCQ, AMC Handbook AI RolePlay (Clinical/MCAT), eligibility, fees, pass rates, and preparation strategy. Updated for 2026.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "article",
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
  datePublished: "2026-04-27",
  dateModified: "2026-04-27",
  inLanguage: "en-AU",
  about: [
    { "@type": "Thing", name: "Australian Medical Council exam" },
    { "@type": "Thing", name: "International Medical Graduate" },
    { "@type": "Thing", name: "AHPRA registration" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC Exam Guide", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is eligible to sit the AMC exam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Doctors holding a primary medical qualification from a training programme outside Australia/New Zealand, with verified credentials via EPIC (ECFMG), and meeting English language requirements (IELTS 7+ or OET B+) are eligible to sit AMC MCQ. Passing AMC MCQ is required before sitting AMC Handbook AI RolePlay.",
      },
    },
    {
      "@type": "Question",
      name: "How much does the AMC exam cost in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AMC MCQ (MCQ) costs approximately AUD 2,690 and AMC Handbook AI RolePlay (Clinical) costs approximately AUD 3,490. Refer to amc.org.au for current fees as they are reviewed annually.",
      },
    },
    {
      "@type": "Question",
      name: "What is the AMC MCQ pass rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pass rates vary by cohort but typically sit between 50% and 70% for AMC MCQ. Performance correlates strongly with hours of MCQ practice and depth of clinical reasoning, not memorisation alone.",
      },
    },
    {
      "@type": "Question",
      name: "How long does AMC preparation take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most candidates spend 4–8 months preparing for AMC MCQ and an additional 3–6 months for AMC Handbook AI RolePlay, depending on prior clinical experience and English fluency. IMGs working clinically in Australia (e.g., as observers or in junior roles) often prepare faster.",
      },
    },
    {
      "@type": "Question",
      name: "What resources should I use to prepare?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Core resources include Murtagh's General Practice (the foundational text), the RACGP Red Book for prevention guidelines, the AMC Handbook of Multiple Choice Questions, the AMC Handbook of Clinical Assessment, and high-volume question banks. Mostly Medicine consolidates these with AI-powered MCQs and clinical roleplays.",
      },
    },
  ],
};

export default function AmcGuidePage() {
  return (
    <main className="min-h-screen bg-[#070714] text-white">
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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

      <article className="max-w-3xl mx-auto px-6 sm:px-10 pb-24 prose prose-invert prose-headings:font-display prose-h1:text-4xl sm:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-a:text-brand-400 hover:prose-a:text-brand-300">
        <header className="mt-8 mb-12">
          <p className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-3">
            AMC Exam Guide · Updated 2026
          </p>
          <h1 className="font-display font-bold mb-4">
            The AMC Exam: A Complete Guide for International Medical Graduates
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Everything an IMG needs to know about the Australian Medical Council
            assessment pathway — AMC MCQ, AMC Handbook AI RolePlay (Clinical/MCAT), eligibility,
            fees, timelines, and proven preparation strategy.
          </p>
        </header>

        <section>
          <h2>What is the AMC exam?</h2>
          <p>
            The <strong>Australian Medical Council (AMC) exam</strong> is the
            standard assessment pathway for International Medical Graduates
            (IMGs) seeking medical registration with the Medical Board of
            Australia via AHPRA. The exam verifies that doctors trained outside
            Australia and New Zealand meet the medical knowledge and clinical
            competence expected of an Australian medical graduate at intern
            level.
          </p>
          <p>
            The AMC assessment has two parts:{" "}
            <strong>AMC MCQ</strong>, a written
            multiple-choice examination, and{" "}
            <strong>AMC Handbook AI RolePlay</strong>, a multi-station
            clinical assessment also known as the <strong>MCAT</strong>{" "}
            (Multi-station Clinical Assessment Tool).
          </p>
        </section>

        <section>
          <h2>AMC MCQ: the MCQ exam</h2>
          <ul>
            <li>
              <strong>Format:</strong> 150 multiple-choice questions, computer-based.
            </li>
            <li>
              <strong>Duration:</strong> 3.5 hours.
            </li>
            <li>
              <strong>Content:</strong> All clinical disciplines — internal medicine,
              surgery, paediatrics, obstetrics &amp; gynaecology, psychiatry,
              general practice, emergency medicine, and population health.
            </li>
            <li>
              <strong>Pass mark:</strong> Set via Angoff standard-setting; typical
              pass rate is 50–70%.
            </li>
            <li>
              <strong>Cost (2026):</strong> Approximately AUD 2,690.
            </li>
          </ul>
          <p>
            AMC MCQ emphasises clinical reasoning over rote recall. Questions
            present clinical vignettes and ask candidates to identify the most
            likely diagnosis, the next best investigation, or the most appropriate
            management step.
          </p>
        </section>

        <section>
          <h2>AMC Handbook AI RolePlay: the clinical exam (MCAT)</h2>
          <ul>
            <li>
              <strong>Format:</strong> Multi-station OSCE, approximately 16 stations.
            </li>
            <li>
              <strong>Station types:</strong> History-taking, focused examination,
              counselling, procedural skills, and clinical reasoning.
            </li>
            <li>
              <strong>Duration:</strong> Around 8 minutes per station.
            </li>
            <li>
              <strong>Marking domains:</strong> Data gathering, clinical
              reasoning, communication, and professionalism.
            </li>
            <li>
              <strong>Cost (2026):</strong> Approximately AUD 3,490.
            </li>
          </ul>
          <p>
            AMC Handbook AI RolePlay simulates real Australian clinical practice. Candidates rotate
            through stations with simulated patients (actors trained to portray
            specific cases), and trained examiners assess performance against
            standardised marking criteria. Effective preparation requires
            structured roleplay practice, not just textbook reading.
          </p>
        </section>

        <section>
          <h2>Eligibility</h2>
          <ol>
            <li>
              <strong>Primary medical qualification</strong> from a recognised
              international medical school listed in the World Directory of
              Medical Schools.
            </li>
            <li>
              <strong>Verification via EPIC</strong> (Electronic Portfolio of
              International Credentials) administered by ECFMG.
            </li>
            <li>
              <strong>English language proficiency</strong>: IELTS Academic
              (overall 7.0, no band below 7.0) or OET (Grade B in all four
              components) or equivalent.
            </li>
            <li>
              <strong>Pass AMC MCQ</strong> before applying for AMC Handbook AI RolePlay.
            </li>
          </ol>
        </section>

        <section>
          <h2>How to prepare: a proven strategy</h2>
          <h3>For AMC MCQ</h3>
          <ol>
            <li>
              <strong>Build foundations</strong> with Murtagh&apos;s General
              Practice — the cornerstone Australian primary care text.
            </li>
            <li>
              <strong>Practice 3,000+ MCQs</strong> across all disciplines, not
              just your clinical specialty.
            </li>
            <li>
              <strong>Use spaced repetition</strong> for high-yield facts (drug
              doses, classification criteria, screening intervals).
            </li>
            <li>
              <strong>Target weak areas</strong> identified by question-bank
              analytics. Generic study wastes time.
            </li>
            <li>
              <strong>Review the RACGP Red Book</strong> for preventive care
              questions, which appear in nearly every paper.
            </li>
          </ol>

          <h3>For AMC Handbook AI RolePlay (MCAT)</h3>
          <ol>
            <li>
              <strong>Practice clinical roleplays</strong> against the official
              MCAT station blueprints (history, examination, counselling,
              procedural).
            </li>
            <li>
              <strong>Get examiner-grade feedback</strong> after every roleplay,
              mapped to AMC marking domains.
            </li>
            <li>
              <strong>Drill structured frameworks</strong>: SOCRATES for pain,
              SPIKES for breaking bad news, the Calgary-Cambridge model for
              consultations.
            </li>
            <li>
              <strong>Time your stations</strong>: 8 minutes goes fast. Practice
              with a stopwatch from day one.
            </li>
            <li>
              <strong>Simulate the real exam day</strong> with back-to-back
              stations rather than one at a time.
            </li>
          </ol>
        </section>

        <section>
          <h2>How Mostly Medicine helps</h2>
          <p>
            Mostly Medicine is built specifically for IMGs preparing for the AMC.
            The platform consolidates the resources, AI tools, and analytics that
            replace dozens of disjointed apps:
          </p>
          <ul>
            <li>
              <Link href="/dashboard/cat1">
                <strong>3,000+ AMC MCQ MCQs</strong>
              </Link>{" "}
              with AI explanations, spaced repetition, and weak-area targeting.
            </li>
            <li>
              <Link href="/dashboard/cat2">
                <strong>151+ AMC Handbook AI RolePlay clinical roleplays</strong>
              </Link>{" "}
              powered by Claude AI, with examiner-grade feedback after every
              consultation.
            </li>
            <li>
              <Link href="/dashboard/reference">
                <strong>Reference library</strong>
              </Link>{" "}
              — Murtagh, RACGP Red Book, and AMC Handbook summary, searchable
              and AI-indexed.
            </li>
            <li>
              <Link href="/dashboard/jobs">
                <strong>Australian medical job tracker</strong>
              </Link>{" "}
              — RMO pools, GP pathway, application checklist for life after AMC.
            </li>
          </ul>
          <p>
            The free tier includes sample MCQs, limited roleplays, and full
            reference access. No credit card required.
          </p>
          <p>
            <Link
              href="/auth/signup"
              className="inline-block mt-4 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-2xl font-bold no-underline"
            >
              Start preparing free →
            </Link>
          </p>
        </section>

        <section>
          <h2>Frequently asked questions</h2>

          <h3>Who is eligible to sit the AMC exam?</h3>
          <p>
            Doctors holding a primary medical qualification from a training
            programme outside Australia/New Zealand, with verified credentials
            via EPIC, and meeting English language requirements (IELTS 7+ or OET
            B+) are eligible to sit AMC MCQ. Passing AMC MCQ is required before
            sitting AMC Handbook AI RolePlay.
          </p>

          <h3>How long does AMC preparation take?</h3>
          <p>
            Most candidates spend 4–8 months preparing for AMC MCQ and an
            additional 3–6 months for AMC Handbook AI RolePlay, depending on prior clinical
            experience and English fluency.
          </p>

          <h3>What is the AMC MCQ pass rate?</h3>
          <p>
            Pass rates vary by cohort but typically sit between 50% and 70% for
            AMC MCQ. Performance correlates strongly with hours of MCQ practice
            and depth of clinical reasoning, not memorisation alone.
          </p>

          <h3>Is the AMC exam harder than the USMLE or PLAB?</h3>
          <p>
            The AMC tests a similar core knowledge base to USMLE Step 2 CK and
            PLAB but emphasises Australian primary care and population health
            (RACGP-style content). Candidates with USMLE or PLAB experience
            usually adapt quickly with focused practice on Australian-specific
            guidelines.
          </p>

          <h3>What is the difference between AMC Handbook AI RolePlay and MCAT?</h3>
          <p>
            They are the same exam. MCAT (Multi-station Clinical Assessment Tool)
            is the formal name for the AMC Handbook AI RolePlay clinical examination.
          </p>
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500">
          <p>
            This guide is provided for educational purposes by Mostly Medicine.
            For official AMC examination information, refer to{" "}
            <a href="https://www.amc.org.au" target="_blank" rel="noopener">
              amc.org.au
            </a>
            . Last updated: April 2026.
          </p>
        </footer>
      </article>
    </main>
  );
}
