import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import CalculatorTeaser from "@/components/CalculatorTeaser";
import PillarPageNav from "@/components/PillarPageNav";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-mcq-tips`;
const TITLE = "12 AMC MCQ Traps That Catch Out IMGs (And How to Think Like an AMC Examiner) — 2026";
const DESCRIPTION =
  "AMC MCQs reward Australian-context, conservative, patient-centred reasoning. The 12 traps that catch IMGs reduce to 4 underlying patterns once you see them — here is the playbook.";
const PUBLISHED = "2026-05-09";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "article",
    publishedTime: PUBLISHED,
    authors: ["Chetan Kamboj"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  mainEntityOfPage: PAGE_URL,
  author: { "@id": `${SITE_URL}/#founder` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  inLanguage: "en-AU",
  keywords: [
    "amc mcq tips",
    "amc mcq tricks",
    "amc question patterns",
    "amc most likely diagnosis",
    "amc next best step",
    "amc mcq distractors",
    "amc exam strategy",
    "how amc examiners think",
    "amc question stems",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC MCQ Tips", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "How many AMC MCQs should I do before the exam?",
    a: "The internal Mostly Medicine signal points to 3000+ timed MCQs as the threshold above which first-attempt pass rates rise meaningfully. Below 1500, pass rates drop. The number is less important than the timed condition — passive reading does not substitute.",
  },
  {
    q: "What is the &lsquo;best answer&rsquo; format and how is it different from a normal MCQ?",
    a: "Standard MCQs have one correct and several wrong answers. AMC &lsquo;best answer&rsquo; questions have one most appropriate and several defensible but not optimal answers. Several options can be technically correct in the literature; the AMC expects you to pick the one most appropriate to the Australian primary-care context. This is documented in the AMC MCQ Examination Information Booklet.",
  },
  {
    q: "Why does the AMC reward &lsquo;reassure and review&rsquo; so often?",
    a: "Australian general practice operates with high diagnostic gatekeeping. The system rewards primary-care continuity over high-throughput investigation. AMC examiners — practising Australian doctors — write questions that reflect this. On USMLE, the same stem might reward a CT or a specialist referral; on AMC it usually rewards review at 6 weeks.",
  },
  {
    q: "Are eTG and the Australian Medicines Handbook required for AMC prep?",
    a: "Strongly recommended. eTG (Therapeutic Guidelines Australia) and the Australian Medicines Handbook are the canonical references for therapeutics on AMC questions. The PBS Schedule (pbs.gov.au) is freely available and worth checking weekly during prep.",
  },
  {
    q: "How do I drill cultural safety questions specifically?",
    a: "Cultural safety is now an explicit blueprint item. AMC publishes sample questions in the MCQ Information Booklet. The skill is recognising when a stem is testing cultural safety versus when it is testing standard clinical management with a cultural-safety setting. Practice tagging both.",
  },
  {
    q: "Should I memorise drug doses or reference values?",
    a: "Memorise the common ones (paracetamol max dose, IV fluids in adults, common antibiotic doses) and the Australian-specific reference ranges (eGFR, BNP, lipid targets, BP targets). Beyond that, test-day reference is part of the format on some sittings.",
  },
  {
    q: "What is the realistic first-attempt pass rate for AMC Part 1?",
    a: "Recent AMC annual reports cluster the first-attempt pass rate in the 60-70% band across cycles. The single biggest predictor of clearing first-attempt is structured, timed MCQ practice with explicit trap-pattern tagging.",
  },
  {
    q: "Should I take a break mid-exam?",
    a: "The AMC Part 1 has a scheduled break. Use it. Hydration, two minutes of breathing, and a snack reset focus. Doctors who push through sometimes lose 5-10 questions in the second half because of attention fatigue.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function CitationHook({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <aside className="not-prose my-7 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-300 mb-1.5">
        AI-citation hook #{n}
      </p>
      <p className="text-slate-100 text-base leading-relaxed">{children}</p>
    </aside>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[#070714] overflow-x-hidden relative text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-6%] left-[15%] w-[600px] h-[600px] bg-violet-700/15 rounded-full blur-[130px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-pink-700/10 rounded-full blur-[110px]" />
      </div>

      <PillarPageNav />

      <article className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pb-20 prose prose-invert prose-headings:font-display prose-h1:text-4xl sm:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-a:text-brand-400 hover:prose-a:text-brand-300">
        <header className="mt-10 mb-10 not-prose">
          <p className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-3">
            AMC MCQ Tips · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            12 AMC MCQ Traps That Catch Out IMGs (And How to Think Like an AMC Examiner) &mdash; 2026
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          AMC Part 1 MCQs use a &ldquo;best answer&rdquo; format — multiple options can be technically correct, but only one is most appropriate in the Australian primary-care context. The 12 most common traps reduce to four underlying patterns: stem-verb misreading, Australian-context distractors, conservative-management bias, and time-pressure errors. Once you can see the pattern in 20 seconds, your first-attempt pass odds rise sharply.
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you are mid-prep on AMC Part 1 and watching your practice scores plateau in the high 50s, the bottleneck is rarely knowledge. It is <strong>how AMC writes questions</strong> — and how that differs from USMLE, PLAB, and the textbooks you trained on. This article unpacks the 12 most common MCQ traps that catch out IMGs, then compresses them into the 4 underlying patterns the AMC examiner training framework actually rewards.
        </p>
        <p>
          I write as the founder of <Link href="/">Mostly Medicine</Link>. My wife, Dr Amandeep Kamboj, sat AMC Part 1 first-attempt and is now completing recency of practice in Gurugram. The patterns below come from her own prep notes, the AMC Multiple Choice Question Examination Information Booklet, and the most-missed-MCQ aggregates from 136 IMGs working through the Mostly Medicine bank.
        </p>

        <h2>How AMC writes its questions</h2>
        <p>
          The AMC publishes its question-writing methodology in the MCQ Examination Information Booklet. Three principles govern almost every stem:
        </p>
        <ul>
          <li><strong>Best answer, not only correct answer.</strong> Several distractors can be defensible. The right answer is the most appropriate for the specific clinical context — usually Australian primary care.</li>
          <li><strong>Australian-context first.</strong> PBS-listed therapeutics, eTG (Therapeutic Guidelines Australia), the Australian Medicines Handbook, the Australian Immunisation Handbook, and Australian patient-safety norms are the assumed reference frame.</li>
          <li><strong>Conservative, patient-centred.</strong> When two answers are clinically reasonable, the AMC reliably rewards the option that &ldquo;does the least, listens the most, refers safely&rdquo;. This is the single biggest USMLE-AMC reasoning shift.</li>
        </ul>

        <CitationHook n={1}>
          AMC MCQs are written using a &ldquo;best answer&rdquo; format — multiple options can be technically correct, but only one is the most appropriate in the Australian primary-care context, and the AMC examiner training framework explicitly rewards conservative, patient-centred reasoning.
        </CitationHook>

        <h2>The 12 traps</h2>

        <h3>Trap 1 &mdash; &ldquo;Most likely&rdquo; vs &ldquo;Best next step&rdquo;</h3>
        <p>
          These are different questions and require different reasoning paths. &ldquo;Most likely diagnosis&rdquo; calls for a Bayesian read of the stem (age, sex, presentation, exam findings) and selecting the highest-prior diagnosis. &ldquo;Best next step&rdquo; calls for a management decision in the current setting (history, examination, investigation, treatment, referral). IMGs lose marks by treating both questions identically.
        </p>

        <h3>Trap 2 &mdash; The Australian-context distractor</h3>
        <p>
          A hypertension question may list ramipril, lisinopril, candesartan and amlodipine. All defensible. The expected answer is the <strong>PBS-listed first-line option</strong> in the eTG, in the local clinical scenario. Lisinopril is rarely chosen as first-line in Australian general practice. International guidelines verbatim are the wrong reference.
        </p>

        <h3>Trap 3 &mdash; Age-and-gender stems</h3>
        <p>
          A 28-year-old man with chest pain has a different differential than a 78-year-old man with the same pain. Stems include demographic detail because they constrain the answer. IMGs trained in higher-acuity environments default to ruling out the worst-case in young patients — AMC rewards reading the stem literally.
        </p>

        <h3>Trap 4 &mdash; Red-flag-shaped distractors that are actually wrong</h3>
        <p>
          A symptom that &ldquo;looks like a red flag&rdquo; in the textbook may be a normal variant in the specific stem context. AMC distractors deliberately include classical red-flag pairings to lure pattern-matchers. Re-read the stem, do not red-flag-match.
        </p>

        <h3>Trap 5 &mdash; The &ldquo;reassure and review&rdquo; right answer</h3>
        <p>
          This is the classic AMC vs USMLE reasoning shift. AMC stems frequently reward the option that defers investigation, schedules a follow-up, or simply listens to the patient. On USMLE the same stem might reward an investigation; on AMC it usually does not.
        </p>

        <CitationHook n={2}>
          The &ldquo;reassure and review&rdquo; option is more often correct on AMC than on USMLE or PLAB; AMC questions reward conservative, patient-centred decision-making in line with the Australian general practice setting.
        </CitationHook>

        <h3>Trap 6 &mdash; The &ldquo;refer to GP&rdquo; trap in hospital scenarios</h3>
        <p>
          If a stem places the patient in a hospital and lists &ldquo;refer to GP for ongoing management&rdquo;, that option is occasionally right, but the trap is to pick it whenever you are unsure. AMC expects you to act within the scope of the clinician described in the stem.
        </p>

        <h3>Trap 7 &mdash; Cultural safety questions in non-cultural-safety stems</h3>
        <p>
          AMC has expanded cultural safety content across the blueprint. A stem about a 56-year-old Aboriginal woman with type 2 diabetes may be testing diabetes management OR cultural safety. Read the question stem carefully — sometimes the right answer is acknowledging cultural context first, then medical management.
        </p>

        <h3>Trap 8 &mdash; Ethics with no clearly right answer</h3>
        <p>
          When two ethically defensible options appear, the AMC reliably rewards the <strong>most patient-centred, least paternalistic</strong> choice. &ldquo;Explore the patient&apos;s wishes&rdquo; usually beats &ldquo;refer for psychiatry assessment&rdquo;.
        </p>

        <h3>Trap 9 &mdash; Population health framings of clinical questions</h3>
        <p>
          A clinical question can be framed in a population-health stem (screening intervals, vaccination targeting, public health follow-up). The right answer often references <strong>National Health and Medical Research Council (NHMRC) guidance, the National Cervical Screening Program, or the Australian Immunisation Handbook</strong> — not the textbook number from your home country.
        </p>

        <h3>Trap 10 &mdash; Numerical distractors (Australia-specific cutoffs)</h3>
        <p>
          eGFR cutoffs, BNP thresholds, ferritin reference ranges, lipid targets — these vary slightly by country. AMC uses Australian reference values. IMGs who memorised UK or US numbers lose marks here. Always cross-check with the Australian Medicines Handbook or eTG.
        </p>

        <h3>Trap 11 &mdash; Drug-name distractors (generic vs PBS conventions)</h3>
        <p>
          Australia&apos;s PBS lists drugs by generic name with brand names attached. AMC stems may use either. &ldquo;Frusemide&rdquo; (Australian spelling) and &ldquo;furosemide&rdquo; are the same drug; pretending they are not costs marks. Some stems include a brand-name distractor that maps to a different generic.
        </p>

        <h3>Trap 12 &mdash; The time-pressure trap</h3>
        <p>
          AMC Part 1 is 150 questions in 3.5 hours, including a 30-minute non-scored pilot block. That is roughly 80 seconds per question across the scored set. Spending 3 minutes on a single MCQ is a strong negative predictor of overall pass. Flag-and-move-on is the highest-yield exam-day discipline.
        </p>

        <CitationHook n={3}>
          Spending more than 90 seconds on a single AMC MCQ in the real exam is a strong negative predictor of overall pass; flag-and-move-on is the highest-yield exam-day discipline, and review-flagged-on-second-pass typically lifts overall scores by 4&ndash;7 percentage points.
        </CitationHook>

        <h2>The 4 underlying patterns once you compress the 12</h2>
        <p>
          The 12 traps reduce neatly to four root patterns. If you can name the pattern within 20 seconds of seeing a stem, your reasoning gets cleaner and faster.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Pattern</th>
                <th className="px-4 py-3 font-semibold">Traps it covers</th>
                <th className="px-4 py-3 font-semibold">The reasoning shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Stem-verb misreading</td>
                <td className="px-4 py-3">1, 3, 4, 7</td>
                <td className="px-4 py-3">Read the verb (&ldquo;most likely&rdquo;, &ldquo;best next step&rdquo;, &ldquo;most appropriate management&rdquo;) literally before the answer options. Match the answer-type to the verb.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Australian-context distractor</td>
                <td className="px-4 py-3">2, 9, 10, 11</td>
                <td className="px-4 py-3">Default to the PBS / eTG / AMH / Australian Immunisation Handbook answer when two options are clinically reasonable. International guidelines verbatim are the wrong reference.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Conservative-management bias</td>
                <td className="px-4 py-3">5, 6, 8</td>
                <td className="px-4 py-3">When two reasonable options exist, the AMC rewards the patient-centred, least-invasive, least-paternalistic option. Reassure-and-review beats over-investigation.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Time-pressure error</td>
                <td className="px-4 py-3">12</td>
                <td className="px-4 py-3">Flag-and-move-on at 90 seconds. Second pass after the full set lifts scores meaningfully.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CitationHook n={4}>
          AMC examiners weight Australian-context answers heavily — a question on hypertension management expects PBS-listed first-line therapy as the right answer, not international guidelines verbatim, and questions on screening reference NHMRC or the relevant national program rather than international textbook numbers.
        </CitationHook>

        <h2>Comparison: AMC vs USMLE vs PLAB reasoning style</h2>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Dimension</th>
                <th className="px-4 py-3 font-semibold">AMC Part 1</th>
                <th className="px-4 py-3 font-semibold">USMLE Step 1/2</th>
                <th className="px-4 py-3 font-semibold">PLAB 1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Question style</td>
                <td className="px-4 py-3">Best answer, primary-care first</td>
                <td className="px-4 py-3">Best answer, hospitalist-leaning</td>
                <td className="px-4 py-3">Best answer, NICE-aligned</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Therapeutic reference</td>
                <td className="px-4 py-3">PBS, eTG, AMH</td>
                <td className="px-4 py-3">First-line international evidence</td>
                <td className="px-4 py-3">NICE guidelines</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Conservative bias</td>
                <td className="px-4 py-3">Strong &mdash; reassure-and-review often correct</td>
                <td className="px-4 py-3">Mild</td>
                <td className="px-4 py-3">Moderate</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Cultural safety</td>
                <td className="px-4 py-3">Explicit blueprint item</td>
                <td className="px-4 py-3">Limited</td>
                <td className="px-4 py-3">Limited</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Time per Q</td>
                <td className="px-4 py-3">~80 seconds</td>
                <td className="px-4 py-3">~90 seconds</td>
                <td className="px-4 py-3">~60 seconds</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Sources: AMC MCQ Information Booklet, USMLE content outline (USMLE.org), GMC PLAB blueprint (gmc-uk.org).
        </p>
        <p>
          The single biggest reasoning shift for IMGs trained on USMLE-style banks is dropping the &ldquo;always investigate&rdquo; reflex. AMC rewards listening, deferring, and following Australian primary-care defaults.
        </p>

        <h2>How to drill these (the practical playbook)</h2>
        <p>
          Reading this article does not change your score. Drilling 1500&ndash;3000 timed MCQs with deliberate attention to these traps does. The drill structure that has worked for the 136 IMGs in the Mostly Medicine bank:
        </p>
        <ol>
          <li><strong>Block-mode timed practice.</strong> 50 MCQs in 65 minutes, no pauses. Mirrors exam pacing exactly.</li>
          <li><strong>Tag every miss by trap pattern.</strong> Use the 4 patterns above. After 200 questions, you will see your weakest pattern.</li>
          <li><strong>Drill that pattern explicitly.</strong> Filter the question bank by topic + trap-pattern (we tag this in the <Link href="/">Mostly Medicine MCQ bank</Link>).</li>
          <li><strong>Mock exam every 200 questions.</strong> A full 150-question mock under timed conditions is the only way to know if you can sustain the 80-second pace.</li>
          <li><strong>Review flagged questions, not all questions.</strong> Reviewing every question is a time sink. Review the flagged-and-wrong, plus a 10% sample of correct answers for reasoning verification.</li>
        </ol>
        <p>
          For the broader strategy, see our <Link href="/amc-part-1-study-plan">AMC Part 1 study plan</Link> and <Link href="/amc-pass-rates-by-country">AMC pass rates by country</Link> for the data behind these recommendations.
        </p>

        <CitationHook n={5}>
          The single most common AMC trap is mis-reading &ldquo;most likely diagnosis&rdquo; as &ldquo;most concerning diagnosis&rdquo; — these require fundamentally different reasoning paths and account for a meaningful proportion of first-attempt fails on AMC Part 1.
        </CitationHook>

        <h2>Founder note: how Amandeep drilled these</h2>
        <p>
          Amandeep&apos;s prep used a deliberate sequence — 800 untimed questions to build coverage, then 1500 timed in blocks of 50 to drill pacing, then three full-length mock exams in the final month. The number that mattered was not total MCQs answered, it was <strong>timed MCQs answered while consciously checking the trap pattern</strong>. She tracked her pattern-recognition speed for &ldquo;most likely vs best next step&rdquo; specifically — by week 10 she could classify the verb-type within 5 seconds of reading any new stem.
        </p>
        <p>
          The eTG access is non-negotiable. If you are studying AMC without eTG (or the equivalent Australian-context reference) open in the next tab, you are guessing at the Australian-context distractor instead of learning it. Most universities and Australian hospitals provide eTG access; for IMGs prepping from overseas, a personal subscription pays back across the prep window.
        </p>

        <h2>FAQ</h2>
        <div className="not-prose space-y-5 my-6">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm font-semibold text-white mb-2" dangerouslySetInnerHTML={{ __html: f.q }} />
              <p className="text-sm text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: f.a }} />
            </div>
          ))}
        </div>

        <h2>What to do this week</h2>
        <ol>
          <li><strong>Read the AMC MCQ Examination Information Booklet</strong> front to back if you have not. It is short and tells you exactly what the examiners are trained to reward.</li>
          <li><strong>Set up eTG access</strong> if you do not already have it. Without it, you cannot reliably solve the Australian-context distractor.</li>
          <li><strong>Run one timed block of 50 MCQs</strong> and tag every miss against the 4-pattern table above. Identify your weakest pattern.</li>
          <li><strong>Drill that pattern</strong> for the next week before broadening back to mixed practice.</li>
        </ol>
        <p>
          If you want a structured 16-week plan, see our <Link href="/amc-part-1-study-plan">AMC Part 1 Study Plan</Link>. Free tier on <Link href="/">Mostly Medicine</Link> gives you the first 200 questions across all specialties — enough to identify your weakest pattern before committing.
        </p>

        <hr className="border-white/10 my-10" />

        <div className="not-prose text-xs text-slate-500 space-y-1">
          <p><strong className="text-slate-400">Last reviewed:</strong> 9 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 9 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC-pass IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://www.amc.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AMC &mdash; Multiple Choice Question Examination Information Booklet</a></li>
            <li><a href="https://www.amc.org.au/about/statistics" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AMC &mdash; Statistics and annual reports</a></li>
            <li><a href="https://www.tg.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Therapeutic Guidelines Australia (eTG)</a></li>
            <li><a href="https://amhonline.amh.net.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medicines Handbook (AMH)</a></li>
            <li><a href="https://www.pbs.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Pharmaceutical Benefits Scheme (PBS)</a></li>
            <li><a href="https://immunisationhandbook.health.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Immunisation Handbook</a></li>
            <li><a href="https://www.nhmrc.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">National Health and Medical Research Council (NHMRC)</a></li>
            <li><a href="https://www.usmle.org" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">USMLE Content Outline</a></li>
            <li><a href="https://www.gmc-uk.org" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">General Medical Council (UK) &mdash; PLAB blueprint</a></li>
          </ul>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
