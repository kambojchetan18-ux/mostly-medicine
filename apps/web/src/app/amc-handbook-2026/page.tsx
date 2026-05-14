import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-handbook-2026`;
const TITLE = "AMC Handbook 2026 Summary — Subjects, Weighting, Recent Changes";
const DESCRIPTION =
  "A clinician's summary of the AMC Handbook 2026 for International Medical Graduates: subject areas, blueprint weighting, recent changes for 2026, and how to use the Handbook as a structured study spine for AMC MCQ and AMC Handbook AI RolePlay.";

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
    { "@type": "Thing", name: "AMC Handbook" },
    { "@type": "Thing", name: "AMC blueprint" },
    { "@type": "Thing", name: "Multiple Choice Question Examination" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC Exam Guide", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC Handbook 2026", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the AMC Handbook?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The AMC Handbook is the Australian Medical Council's official examination reference. It comes in two editions: the Handbook of Multiple Choice Questions (covering AMC MCQ) and the Handbook of Clinical Assessment (covering AMC Handbook AI RolePlay / MCAT). Together they describe the blueprint, sample items, marking domains, and the breadth of clinical conditions an Australian intern is expected to handle.",
      },
    },
    {
      "@type": "Question",
      name: "How is the AMC Handbook structured?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each Handbook is organised by clinical discipline (internal medicine, surgery, paediatrics, O&G, psychiatry, general practice, emergency, population health) with sub-chapters for major condition categories. Sample MCQs appear with worked answers in the AMC MCQ Handbook; sample stations with marking criteria appear in the AMC Handbook AI RolePlay handbook.",
      },
    },
    {
      "@type": "Question",
      name: "What changed in the AMC Handbook for 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 2026 edition reflects three notable updates: stronger emphasis on Aboriginal and Torres Strait Islander health and cultural safety throughout all disciplines, expanded mental health content (especially perinatal and adolescent), and updated antimicrobial stewardship aligned with the latest Therapeutic Guidelines. Cardiovascular risk assessment now uses the updated Australian absolute CV risk calculator (2023 update).",
      },
    },
    {
      "@type": "Question",
      name: "How should I use the AMC Handbook as a study tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Treat the Handbook as a checklist, not a textbook. After each block of question-bank practice, run through the relevant Handbook chapter to spot conditions you have not yet encountered. The sample MCQs in the Handbook should be calibration items — if you score below 70% on them, your readiness is overstated.",
      },
    },
    {
      "@type": "Question",
      name: "Is the AMC Handbook enough on its own to pass AMC MCQ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The Handbook defines the scope but does not provide the depth needed to actually pass. You still need a primary text (Murtagh's General Practice), guideline references (RACGP Red Book, Therapeutic Guidelines), and at least 3,000 practice MCQs. The Handbook is the spine; the rest is the body.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I buy the AMC Handbook 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Direct from the Australian Medical Council at amc.org.au. The Handbook is available in print and ebook formats. Earlier editions are widely circulated second-hand but you should always check that you have the most recent edition because the blueprint is updated regularly.",
      },
    },
  ],
};

export default function AmcHandbook2026Page() {
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
            AMC Handbook · 2026 Edition
          </p>
          <h1 className="font-display font-bold mb-4">
            AMC Handbook 2026: Structure, Weighting, and How to Use It
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            The AMC Handbook is the official blueprint for the AMC exams. This
            page summarises its structure, the 2026 changes, and exactly how
            to use it as a study spine alongside your question bank — without
            wasting hours on background reading.
          </p>
        </header>

        <section>
          <h2>What is the AMC Handbook?</h2>
          <p>
            The <strong>AMC Handbook</strong> is the Australian Medical
            Council&apos;s official examination reference for International
            Medical Graduates. It is published in two companion volumes:
          </p>
          <ul>
            <li>
              <strong>Handbook of Multiple Choice Questions</strong> — defines
              the scope, blueprint, and sample items for{" "}
              <Link href="/amc-cat1">AMC MCQ</Link>.
            </li>
            <li>
              <strong>Handbook of Clinical Assessment</strong> — defines the
              station blueprint, marking domains, and sample stations for{" "}
              <Link href="/amc-cat2">AMC Handbook AI RolePlay (Clinical / MCAT)</Link>.
            </li>
          </ul>
          <p>
            Together they describe the breadth of medical knowledge and
            clinical performance that an Australian intern (PGY1) is expected
            to demonstrate on day one of practice. The Handbook is not a
            textbook — it is a <strong>blueprint</strong>.
          </p>
        </section>

        <section>
          <h2>Handbook structure</h2>
          <p>
            Each Handbook is organised by clinical discipline. Within each
            discipline, sub-chapters cluster conditions by system or theme.
            The same disciplines and weightings apply to both AMC MCQ and
            AMC Handbook AI RolePlay:
          </p>
          <ul>
            <li>
              <strong>Internal medicine (~25%)</strong> — cardiology,
              respiratory, endocrine, gastroenterology, nephrology,
              haematology, neurology, rheumatology, infectious diseases,
              geriatrics.
            </li>
            <li>
              <strong>Surgery (~15%)</strong> — general surgery,
              orthopaedics, urology, ENT, ophthalmology, peri-operative care.
            </li>
            <li>
              <strong>Paediatrics (~10%)</strong> — neonatal, infectious,
              developmental, immunisation, child protection.
            </li>
            <li>
              <strong>Obstetrics &amp; Gynaecology (~10%)</strong> — antenatal,
              labour and postpartum, contraception, screening, gynaecologic
              emergencies.
            </li>
            <li>
              <strong>Psychiatry (~10%)</strong> — mood, psychosis, suicide
              risk, substance use, perinatal and adolescent mental health.
            </li>
            <li>
              <strong>General Practice / Population Health (~25%)</strong> —
              preventive screening (RACGP Red Book), chronic disease, cultural
              safety, Aboriginal and Torres Strait Islander health.
            </li>
            <li>
              <strong>Emergency Medicine (~5%)</strong> — resuscitation,
              trauma, triage decisions.
            </li>
          </ul>
          <p>
            The AMC MCQ Handbook prints sample MCQs with worked explanations.
            The AMC Handbook AI RolePlay handbook prints sample station vignettes, the
            simulated-patient instructions, and the marking criteria mapped
            to the four domains (data gathering, clinical reasoning,
            communication, professionalism).
          </p>
        </section>

        <section>
          <h2>Recent changes for 2026</h2>
          <p>
            The 2026 edition introduces three notable updates that examiners
            will be watching for:
          </p>
          <h3>1. Aboriginal and Torres Strait Islander health</h3>
          <p>
            Cultural safety and Aboriginal and Torres Strait Islander health
            content has been expanded across all disciplines, not just the
            population health chapter. Expect items on culturally safe
            consultations, the social determinants of health, and the
            rheumatic heart disease screening framework. AMC Handbook AI RolePlay stations
            increasingly include Aboriginal simulated patients with explicit
            cultural-safety marking criteria.
          </p>
          <h3>2. Mental health</h3>
          <p>
            Perinatal mental health (depression and anxiety in pregnancy and
            postpartum), adolescent mental health (suicide risk
            assessment, eating disorders), and psychosis recognition have
            been expanded. The HEEADSSS adolescent assessment framework is
            implicitly testable.
          </p>
          <h3>3. Antimicrobial stewardship</h3>
          <p>
            All antibiotic-related questions are now anchored to the latest{" "}
            <em>Therapeutic Guidelines: Antibiotic</em>. Common pitfalls
            include outdated empirical regimens for community-acquired
            pneumonia, urinary tract infection, and sepsis. Cardiovascular
            risk questions use the updated Australian absolute CV risk
            calculator (2023 update).
          </p>
        </section>

        <section>
          <h2>How to use the Handbook as a study spine</h2>
          <p>
            The Handbook is most powerful when used as a structured checklist
            alongside high-volume question-bank practice. A 6-step workflow:
          </p>
          <ol>
            <li>
              <strong>Read the discipline blueprint first.</strong> Open the
              chapter for the discipline you are studying (e.g., Paediatrics)
              and scan the topic list. This becomes your study coverage map.
            </li>
            <li>
              <strong>Practice questions, not pages.</strong> Move straight
              to your question bank and complete a 50-question block in that
              discipline. Tag wrong answers by Handbook sub-topic.
            </li>
            <li>
              <strong>Backfill from the Handbook.</strong> For every
              sub-topic you got wrong, return to the Handbook chapter and
              read the named conditions. This is targeted, not bulk reading.
            </li>
            <li>
              <strong>Calibrate on Handbook samples.</strong> The official
              MCQs at the end of each chapter are written by AMC item-writers
              in the same style as the real exam. If you score below 70% on
              them, your readiness in that discipline is overstated.
            </li>
            <li>
              <strong>Map AMC Handbook AI RolePlay stations to the same chapters.</strong> The
              clinical Handbook&apos;s station blueprints align with the same
              disciplines. Run a roleplay against the corresponding sample
              station immediately after finishing your AMC MCQ block.
            </li>
            <li>
              <strong>Review changes annually.</strong> Confirm you are on
              the 2026 edition. Even one-year-old editions miss the cultural
              safety and antibiotic stewardship updates.
            </li>
          </ol>
        </section>

        <section>
          <h2>What the Handbook does <em>not</em> give you</h2>
          <p>
            The Handbook defines the scope. It does not provide:
          </p>
          <ul>
            <li>
              <strong>Depth of explanation.</strong> Use Murtagh&apos;s
              General Practice, the RACGP Red Book, and Therapeutic
              Guidelines for content depth.
            </li>
            <li>
              <strong>Volume of practice questions.</strong> The Handbook
              has dozens of sample items. The exam needs thousands of
              practice items to internalise reasoning patterns.
            </li>
            <li>
              <strong>Adaptive analytics.</strong> The Handbook cannot tell
              you which sub-topic is your weakest. A modern question bank
              like Mostly Medicine&apos;s does this automatically.
            </li>
            <li>
              <strong>Roleplay rehearsal.</strong> AMC Handbook AI RolePlay sample stations are
              read material; passing AMC Handbook AI RolePlay needs spoken, timed, feedback-loop
              roleplay.
            </li>
          </ul>
        </section>

        <section>
          <h2>How Mostly Medicine maps to the Handbook</h2>
          <p>
            Mostly Medicine&apos;s content engine is built on the same
            blueprint structure as the AMC Handbook 2026 — discipline,
            sub-topic, and condition tags align one-to-one. That means you
            can use the Handbook as your master checklist and the platform
            as your active practice and analytics layer.
          </p>
          <ul>
            <li>
              <Link href="/dashboard/cat1">
                <strong>4,400+ AMC MCQ questions</strong>
              </Link>{" "}
              tagged to AMC blueprint disciplines and Handbook sub-topics.
            </li>
            <li>
              <Link href="/dashboard/cat2">
                <strong>151+ AMC Handbook AI RolePlay scenarios</strong>
              </Link>{" "}
              mapped to clinical Handbook station archetypes with examiner-
              grade feedback against the four domains.
            </li>
            <li>
              <Link href="/dashboard/reference">
                <strong>Searchable reference library</strong>
              </Link>{" "}
              — Handbook 2026 summary, Murtagh, and RACGP Red Book indexed
              by Claude AI.
            </li>
            <li>
              <Link href="/dashboard">
                <strong>Recall cards</strong>
              </Link>{" "}
              for high-yield Australian-specific facts called out in the
              2026 update (CV risk thresholds, antimicrobial first-line
              choices, immunisation schedule).
            </li>
          </ul>
          <p>
            <Link
              href="/auth/signup"
              className="inline-block mt-4 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-2xl font-bold no-underline"
            >
              Start AMC prep free →
            </Link>
          </p>
        </section>

        <section>
          <h2>Frequently asked questions</h2>

          <h3>What is the AMC Handbook?</h3>
          <p>
            The AMC&apos;s official two-volume blueprint covering AMC MCQ
            and AMC Handbook AI RolePlay (Clinical) — disciplines, sub-topics, sample items,
            and marking criteria.
          </p>

          <h3>How is it structured?</h3>
          <p>
            By clinical discipline (internal medicine, surgery, paediatrics,
            O&amp;G, psychiatry, general practice, emergency, population
            health) with sub-chapters per condition cluster.
          </p>

          <h3>What changed in 2026?</h3>
          <p>
            Stronger Aboriginal and Torres Strait Islander health and
            cultural safety content, expanded mental health (perinatal,
            adolescent), and updated antimicrobial stewardship aligned to
            current Therapeutic Guidelines.
          </p>

          <h3>How should I use it?</h3>
          <p>
            As a checklist, not a textbook. Use it to map coverage and
            calibrate readiness — pair with question-bank practice for
            depth.
          </p>

          <h3>Is the Handbook enough on its own?</h3>
          <p>
            No. You also need Murtagh&apos;s General Practice, the RACGP Red
            Book, Therapeutic Guidelines, and 3,000+ practice MCQs.
          </p>

          <h3>Where do I buy the 2026 edition?</h3>
          <p>
            Direct from the AMC at{" "}
            <a href="https://www.amc.org.au" target="_blank" rel="noopener">
              amc.org.au
            </a>
            . Always check you are on the latest edition.
          </p>
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500">
          <p>
            This summary is provided for educational purposes by Mostly
            Medicine and is not a substitute for the official AMC Handbook.
            For current editions and authoritative content, refer to{" "}
            <a href="https://www.amc.org.au" target="_blank" rel="noopener">
              amc.org.au
            </a>
            . Last updated: April 2026.
          </p>
        </footer>
      </article>
    <SiteFooter />
    </main>
  );
}
