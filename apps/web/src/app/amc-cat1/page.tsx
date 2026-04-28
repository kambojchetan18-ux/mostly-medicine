import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-cat1`;
const TITLE = "AMC CAT 1 (MCQ) Exam 2026 — Format, Syllabus, Pass Mark, Strategy";
const DESCRIPTION =
  "Definitive guide to AMC CAT 1, the Australian Medical Council MCQ exam for IMGs. Format, syllabus weighting, sample question patterns, Angoff pass mark, study schedule, common pitfalls, and AMC Handbook references. Updated for 2026.";

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
    { "@type": "Thing", name: "AMC CAT 1" },
    { "@type": "Thing", name: "Multiple Choice Question Examination" },
    { "@type": "Thing", name: "International Medical Graduate" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC Exam Guide", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC CAT 1", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many questions are on the AMC CAT 1 exam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AMC CAT 1 contains 150 A-type single-best-answer multiple-choice questions delivered in a single computer-based session lasting 3.5 hours. All questions are scored; there are no pilot/unscored items disclosed to the candidate.",
      },
    },
    {
      "@type": "Question",
      name: "How is the AMC CAT 1 pass mark determined?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The AMC uses a modified Angoff standard-setting process. A panel of expert clinicians estimates the probability that a borderline-competent intern would answer each question correctly. The aggregated estimate becomes the criterion-referenced cut score, so the pass mark is fixed by content difficulty rather than by candidate ranking.",
      },
    },
    {
      "@type": "Question",
      name: "What subjects are covered in AMC CAT 1?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AMC CAT 1 covers internal medicine, surgery, paediatrics, obstetrics and gynaecology, psychiatry, general practice, emergency medicine, and population/preventive health. Approximately 25% of items have a population-health or RACGP preventive-care emphasis, which catches many IMGs trained in tertiary-only systems.",
      },
    },
    {
      "@type": "Question",
      name: "How long should I study for AMC CAT 1?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most successful candidates spend 4 to 8 months on focused preparation, completing 3,000 or more practice MCQs. Candidates with recent clinical exposure to Australian primary care often pass in the lower end of that range; those who have been out of clinical practice for over two years should plan for 8 months or longer.",
      },
    },
    {
      "@type": "Question",
      name: "What is the AMC CAT 1 pass rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Reported pass rates vary by sitting but typically fall between 50% and 70%. First-attempt candidates from non-English primary medical programmes have lower pass rates than UK or US-trained IMGs, largely because of unfamiliarity with Australian therapeutic guidelines.",
      },
    },
    {
      "@type": "Question",
      name: "Can I retake AMC CAT 1 if I fail?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. There is no formal cap on the number of attempts, and resits can be scheduled at the next available test window (typically every 2 to 3 months). The AMC encourages candidates who fail to use their score report to identify weak topic areas before re-sitting.",
      },
    },
    {
      "@type": "Question",
      name: "Is AMC CAT 1 a computer adaptive test?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Despite the name 'CAT', AMC CAT 1 is not currently item-adaptive in the same way as the GRE. All candidates see 150 fixed-form items in a single session. The 'CAT' label is retained for historical/branding consistency with the AMC's computerised testing platform.",
      },
    },
  ],
};

export default function AmcCat1Page() {
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

      <article className="max-w-3xl mx-auto px-6 sm:px-10 pb-24 prose prose-invert prose-headings:font-display prose-h1:text-4xl sm:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-a:text-violet-400 hover:prose-a:text-violet-300">
        <header className="mt-8 mb-12">
          <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-3">
            AMC CAT 1 Deep Dive · Updated 2026
          </p>
          <h1 className="font-display font-bold mb-4">
            AMC CAT 1: The Complete MCQ Exam Guide for IMGs
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Format, syllabus weighting, sample question patterns, Angoff pass-mark
            logic, an 8-month study schedule, and the most common pitfalls that
            sink first-time candidates.
          </p>
        </header>

        <section>
          <h2>What is AMC CAT 1?</h2>
          <p>
            <strong>AMC CAT 1</strong> is the Australian Medical Council&apos;s
            computer-based multiple-choice examination — the first of two
            assessments International Medical Graduates (IMGs) must clear to
            obtain general medical registration with the Medical Board of
            Australia (via AHPRA). It tests whether a doctor trained outside
            Australia and New Zealand has the medical knowledge of an
            Australian intern at the start of postgraduate year one (PGY1).
          </p>
          <p>
            CAT 1 is a <strong>knowledge gate</strong>. Passing it unlocks the
            right to sit{" "}
            <Link href="/amc-cat2">AMC CAT 2 (the clinical/MCAT exam)</Link>,
            which assesses applied clinical performance.
          </p>
        </section>

        <section>
          <h2>Exam format at a glance</h2>
          <ul>
            <li>
              <strong>Questions:</strong> 150 A-type single-best-answer MCQs.
            </li>
            <li>
              <strong>Duration:</strong> 3 hours 30 minutes (210 minutes), no
              scheduled breaks. Average 84 seconds per item.
            </li>
            <li>
              <strong>Delivery:</strong> Computer-based at Pearson VUE test
              centres globally, or via remote proctoring where available.
            </li>
            <li>
              <strong>Scoring:</strong> One mark per correct answer; no negative
              marking.
            </li>
            <li>
              <strong>Result release:</strong> Approximately 4 to 6 weeks after
              the test window closes.
            </li>
            <li>
              <strong>Cost (2026):</strong> Approximately AUD 2,690. Refer to{" "}
              <a href="https://www.amc.org.au" target="_blank" rel="noopener">
                amc.org.au
              </a>{" "}
              for current published fees.
            </li>
          </ul>
        </section>

        <section>
          <h2>Syllabus and weighting</h2>
          <p>
            The AMC blueprint distributes items across the disciplines an
            Australian intern is expected to handle on day one. Approximate
            weightings published in the AMC Handbook of Multiple Choice
            Questions are:
          </p>
          <ul>
            <li>
              <strong>Internal medicine:</strong> ~25% — cardiology, respiratory,
              endocrine, gastroenterology, nephrology, haematology, neurology,
              rheumatology, infectious diseases, geriatrics.
            </li>
            <li>
              <strong>Surgery:</strong> ~15% — general surgery, orthopaedics,
              urology, ENT, ophthalmology, peri-operative care.
            </li>
            <li>
              <strong>Paediatrics:</strong> ~10% — neonatal, infectious,
              developmental, immunisation, child protection.
            </li>
            <li>
              <strong>Obstetrics &amp; Gynaecology:</strong> ~10% — antenatal
              care, labour, postpartum, contraception, screening.
            </li>
            <li>
              <strong>Psychiatry:</strong> ~10% — mood, psychosis, suicide risk,
              substance use, perinatal mental health.
            </li>
            <li>
              <strong>General practice / population health:</strong> ~25% —
              preventive screening (RACGP Red Book), chronic disease management,
              Aboriginal &amp; Torres Strait Islander health, cultural safety.
            </li>
            <li>
              <strong>Emergency medicine:</strong> ~5% — resuscitation, trauma,
              triage decisions.
            </li>
          </ul>
        </section>

        <section>
          <h2>Sample question patterns</h2>
          <p>
            CAT 1 stems are clinical vignettes — never bare-fact recall. Expect
            two recurring patterns:
          </p>
          <h3>Pattern A: Most likely diagnosis</h3>
          <p>
            <em>
              &quot;A 58-year-old man presents with central crushing chest pain
              radiating to the left arm, started 2 hours ago. ECG shows 2 mm ST
              elevation in leads V2–V4. What is the most likely diagnosis?&quot;
            </em>
          </p>
          <p>
            Distractors are usually plausible differentials (e.g., pericarditis,
            aortic dissection, pulmonary embolism). The single best answer is
            anchored to the dominant clinical and investigation findings.
          </p>
          <h3>Pattern B: Next best step</h3>
          <p>
            <em>
              &quot;A 32-year-old woman is 28 weeks pregnant and her oral
              glucose tolerance test shows fasting glucose 5.4 mmol/L and 2-hour
              post-load 9.0 mmol/L. What is the most appropriate next step?&quot;
            </em>
          </p>
          <p>
            Pattern B questions reward candidates who think in
            Australian-guideline workflows (RACGP, RANZCOG, Therapeutic
            Guidelines). Memorising US or UK pathways is the most common cause
            of high-confidence wrong answers.
          </p>
        </section>

        <section>
          <h2>How the pass mark is set</h2>
          <p>
            AMC CAT 1 uses a <strong>modified Angoff standard-setting</strong>{" "}
            method. Expert clinicians independently estimate the proportion of
            borderline-competent interns who would answer each item correctly.
            The aggregated estimate per item is summed to produce the criterion
            cut score for that paper. As a result:
          </p>
          <ul>
            <li>
              The cut score varies slightly between sittings to neutralise
              difficulty differences.
            </li>
            <li>
              The pass mark is <strong>not</strong> a fixed percentage and{" "}
              <strong>not</strong> a percentile rank. You cannot fail because
              other candidates did better.
            </li>
            <li>
              Score reports show a scaled score and a pass/fail outcome, plus
              sub-scores by discipline so candidates can target weak areas.
            </li>
          </ul>
        </section>

        <section>
          <h2>An 8-month study schedule</h2>
          <p>
            This schedule assumes 15 to 20 hours of focused study per week and
            access to a high-quality question bank.
          </p>
          <ul>
            <li>
              <strong>Months 1–2 — Foundations:</strong> Read{" "}
              <em>Murtagh&apos;s General Practice</em> systematically. Annotate
              all RACGP Red Book screening intervals and Therapeutic Guidelines
              first-line drugs. Target 30 MCQs per day to calibrate.
            </li>
            <li>
              <strong>Months 3–5 — High-volume practice:</strong> Hit 50 to 75
              MCQs per day across all disciplines (not just your specialty).
              Track weak topics in a simple spreadsheet or use{" "}
              <Link href="/dashboard/cat1">analytics in Mostly Medicine</Link>{" "}
              to surface them automatically.
            </li>
            <li>
              <strong>Month 6 — Targeted remediation:</strong> Focus 70% of
              study time on weakest deciles (e.g., paediatric immunisation
              schedule, postpartum mental health, geriatric polypharmacy).
            </li>
            <li>
              <strong>Month 7 — Mock exams:</strong> Sit at least three full
              150-question timed mocks under exam conditions. Review every
              wrong answer and every &quot;lucky right&quot; in detail.
            </li>
            <li>
              <strong>Month 8 — Active recall &amp; rest:</strong> Wind down
              new content. Run spaced-repetition reviews of high-yield facts
              and ensure 7 to 8 hours of sleep nightly the week before.
            </li>
          </ul>
        </section>

        <section>
          <h2>Common pitfalls</h2>
          <ol>
            <li>
              <strong>Reading US/UK guidelines instead of Australian.</strong>{" "}
              The AMC tests RACGP, RANZCOG, NHMRC, and Therapeutic Guidelines —
              not UpToDate defaults or NICE.
            </li>
            <li>
              <strong>Skipping population health.</strong> Cervical screening,
              CVD risk calculators (Australian absolute CV risk), and
              Aboriginal and Torres Strait Islander health questions appear
              every paper.
            </li>
            <li>
              <strong>Over-studying your home specialty.</strong> A surgeon who
              skips obstetrics will fail. The blueprint is intentionally broad.
            </li>
            <li>
              <strong>Skimming explanations.</strong> Reading only the right
              answer wastes the question. The explanation is the learning unit.
            </li>
            <li>
              <strong>Ignoring time discipline.</strong> 84 seconds per item is
              tight when stems run 6 to 8 lines. Practise with a stopwatch from
              week one.
            </li>
            <li>
              <strong>Booking the test before you are ready.</strong> AMC
              recommends booking only after consistently scoring 75%+ on full
              timed mocks.
            </li>
          </ol>
        </section>

        <section>
          <h2>Official AMC Handbook references</h2>
          <p>
            The two official references published by the AMC remain the
            backbone of CAT 1 preparation:
          </p>
          <ul>
            <li>
              <strong>AMC Handbook of Multiple Choice Questions</strong> —
              the official sample MCQ collection with worked answers; treat
              every question as a calibration item, not just practice.
            </li>
            <li>
              <strong>Anthology of Medical Conditions</strong> — the AMC&apos;s
              own condensed reference covering the conditions most likely to
              appear on CAT 1; use it as a checklist after question-bank
              review.
            </li>
          </ul>
          <p>
            For the latest editions and ordering details, refer to{" "}
            <a href="https://www.amc.org.au" target="_blank" rel="noopener">
              amc.org.au
            </a>
            .
          </p>
        </section>

        <section>
          <h2>How Mostly Medicine accelerates CAT 1 prep</h2>
          <p>
            Mostly Medicine is built for IMGs sitting CAT 1, not a general
            medical question bank with an Australia toggle. Every question is
            written against the AMC blueprint and current Australian
            guidelines.
          </p>
          <ul>
            <li>
              <Link href="/dashboard/cat1">
                <strong>3,000+ AMC CAT 1 MCQs</strong>
              </Link>{" "}
              with AI explanations, spaced repetition, and weak-area analytics.
            </li>
            <li>
              <Link href="/dashboard">
                <strong>Recall cards</strong>
              </Link>{" "}
              for high-yield Australian-specific facts (immunisation schedule,
              CV risk thresholds, screening intervals).
            </li>
            <li>
              <Link href="/dashboard/reference">
                <strong>Reference library</strong>
              </Link>{" "}
              with searchable Murtagh, RACGP Red Book, and AMC Handbook
              summaries indexed by Claude AI.
            </li>
          </ul>
          <p>
            <Link
              href="/auth/signup"
              className="inline-block mt-4 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-2xl font-bold no-underline"
            >
              Start CAT 1 prep free →
            </Link>
          </p>
        </section>

        <section>
          <h2>Frequently asked questions</h2>

          <h3>How many questions are on AMC CAT 1?</h3>
          <p>
            150 A-type single-best-answer MCQs in a 3.5-hour computer-based
            session.
          </p>

          <h3>How is the pass mark determined?</h3>
          <p>
            Modified Angoff standard-setting. The cut score is criterion-
            referenced, not norm-referenced — you do not compete with other
            candidates.
          </p>

          <h3>What is the pass rate?</h3>
          <p>
            Typically 50% to 70% per sitting. First-attempt rates are highest
            among IMGs with recent Australian clinical exposure.
          </p>

          <h3>Can I retake if I fail?</h3>
          <p>
            Yes. There is no cap on attempts, and you can re-book at the next
            available window. Use your score report to target weak domains.
          </p>

          <h3>Is CAT 1 actually computer adaptive?</h3>
          <p>
            No. All candidates receive a 150-item fixed-form paper. The
            &quot;CAT&quot; label refers to AMC&apos;s computer-based testing
            platform, not item adaptivity.
          </p>

          <h3>How long should I prepare?</h3>
          <p>
            4 to 8 months of focused study and at least 3,000 practice MCQs is
            the typical successful range.
          </p>
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500">
          <p>
            This guide is provided for educational purposes by Mostly Medicine.
            For official AMC CAT 1 examination information, refer to{" "}
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
