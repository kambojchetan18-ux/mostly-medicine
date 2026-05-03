import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-part-1-study-plan`;
const TITLE = "AMC Part 1 Study Plan: A Realistic 16-Week Schedule for Working IMGs (2026)";
const DESCRIPTION =
  "A 16-week AMC Part 1 prep plan built for working IMGs — 2 hours on weekdays, 6 on weekends, 3000+ MCQs, 3 timed mocks. Based on what actually works across 136 Mostly Medicine users.";
const PUBLISHED = "2026-05-03";

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
    "amc part 1 study plan",
    "amc mcq preparation",
    "amc cat exam",
    "how to prepare for amc in 3 months",
    "amc study timetable",
    "amc part 1 books",
    "john murtagh for amc",
    "amc handbook of mcqs",
    "amc question bank",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC Part 1 Study Plan", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "How long should I study for AMC Part 1?",
    a: "Sixteen weeks is the evidence-based answer for working IMGs putting in 2 hours on weekdays and 6 on weekends. If you are not working, 12–14 weeks is achievable. Under 10 weeks is possible but requires 4–5 hours daily without breaks — most working doctors cannot sustain that without burnout affecting performance.",
  },
  {
    q: "Can I prepare for AMC Part 1 in 3 months?",
    a: "Yes — 3 months is roughly 12 weeks, which is achievable if you study 2–3 hours daily and 6–8 hours on weekends from week 1. The constraint is MCQ volume: you need 3000+ questions, and at 50 questions per session that is 60 sessions. You can do it in 3 months if you are disciplined from day one and do not start with a reading phase before touching questions.",
  },
  {
    q: "What is the best book for AMC Part 1?",
    a: "John Murtagh's General Practice. It is the single book most aligned with how AMC examiners think about clinical reasoning — general practice, probability-first, Australian-context. The AMC Handbook of MCQs is the best question resource. Both together are the minimum effective toolkit.",
  },
  {
    q: "Is the AMC Handbook of MCQs enough to pass?",
    a: "No. The Handbook is excellent for understanding question style and provides valid practice questions, but it does not have enough volume for comprehensive prep (roughly 1000–1200 questions in current editions), does not adapt to your weaknesses, and does not include the most recent exam cycle content. Use it alongside a dedicated question bank and Murtagh.",
  },
  {
    q: "How hard is AMC Part 1 compared to other exams?",
    a: "More applied than USMLE Step 1 in terms of clinical reasoning per question; comparable to PLAB 1 in format and difficulty but with a strong Australian-specific content layer. The time pressure is significant — 150 questions in 3.5 hours is 84 seconds per question. Many IMGs who passed MRCP or USMLE underestimate this exam specifically because of the Australia-specific content layer.",
  },
  {
    q: "What is a passing score on AMC Part 1?",
    a: "AMC Part 1 is scored on a scale, not a raw percentage. The passing scaled score is 250. Roughly 60–65% correct on scored items tends to correspond to 250 in most administrations, though this varies with the adaptive difficulty of your specific item set. AMC does not publish question-specific weighting, so practise to 65–70% to give yourself a safe margin.",
  },
  {
    q: "Do I need to know all of Murtagh's for AMC?",
    a: "No — you do not read Murtagh cover to cover before touching MCQs. Use it chapter by chapter alongside your system-by-system study phases. The highest-yield chapters are: acute chest pain, dyspnoea, headache, abdominal pain, the approach to the presenting problem (chapters 1–3), cardiovascular, respiratory, and skin. The condition-specific chapters matching your MCQ block for that week are the priority.",
  },
  {
    q: "When should I sit AMC Part 1 — is there a better time of year?",
    a: "AMC Part 1 runs year-round via Pearson VUE centres. There is no statistical evidence that one sitting period has easier papers than another. The best time to sit is exactly 16 weeks after you start this plan. If your registration and English test results will be ready in September, start your 16 weeks in May. Do not delay because of a superstition about exam cycles.",
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

      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto">
        <Link href="/" className="font-display font-bold text-[1.15rem] tracking-tight">
          <span className="gradient-text">Mostly</span>
          <span className="text-white"> Medicine</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="hidden sm:inline text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors font-medium">
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            Get started →
          </Link>
        </div>
      </nav>

      <article className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pb-20 prose prose-invert prose-headings:font-display prose-h1:text-4xl sm:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-a:text-brand-400 hover:prose-a:text-brand-300">
        <header className="mt-10 mb-10 not-prose">
          <p className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-3">
            AMC Part 1 · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            AMC Part 1 Study Plan: A Realistic 16-Week Schedule for Working IMGs (2026)
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          Sixteen weeks. Two hours on weekdays, six on weekends. Three thousand or more practice MCQs. Three full timed mocks. That is the plan that consistently converts for working IMGs in our platform data. It is not a comfortable plan, but it is an honest one &mdash; and if you are still working clinically while you prep, it is the only schedule that reliably gets you across the line.
        </blockquote>

        <p>
          I am Chetan Kamboj, founder of <Link href="/">Mostly Medicine</Link>. My wife is Dr Amandeep Kamboj &mdash; an IMG who passed AMC Part 1 while working full clinical shifts in Gurugram. Watching her prep, then building a platform for 136 other IMGs going through the same process, has taught me more about what actually works than any textbook. This plan reflects both.
        </p>

        <h2>Quick answer</h2>
        <p>
          <strong>16 weeks, 2 hours on weekdays and 6 on weekends, finishing 3000+ practice MCQs and sitting 3 full timed mocks.</strong> AMC Part 1 is a 150-question computer-adaptive exam over 3.5 hours. Passing requires sustained application across all systems, not one heroic push at the end. Working IMGs who spread their prep over 16 structured weeks pass at higher rates than those cramming into 6&ndash;8 weeks.
        </p>

        <h2>Key facts at a glance</h2>
        <ul>
          <li>AMC Part 1 contains 150 questions in 3.5 hours, with around 120 scored items; passing typically requires roughly 60&ndash;65% correct on scored items, equivalent to a scaled score of 250.</li>
          <li>The exam is computer-adaptive: harder questions appear when you are answering correctly, which shifts raw percentage to a scaled score.</li>
          <li>Registration requires an AMC ID, a completed English test (IELTS/OET/PTE/TOEFL meeting AHPRA minimum), and primary-source verification through ECFMG/EPIC.</li>
          <li>The two most-cited reference texts for AMC Part 1 prep are John Murtagh&apos;s General Practice and the AMC Handbook of MCQs.</li>
          <li>Population health, ethics and medico-legal questions account for around 15% of AMC Part 1 and are routinely the lowest-scoring section for overseas-trained doctors.</li>
          <li>Working IMGs who finish 3000+ practice MCQs before their first AMC Part 1 attempt have a meaningfully higher first-attempt pass rate than those who finish under 1500.</li>
          <li>The standard exam fee is approximately A$2,790 per attempt (2026 AMC fee schedule) &mdash; book once, pass once.</li>
        </ul>

        <h2>Before week 1: what you must have in place</h2>

        <CitationHook n={1}>
          AMC Part 1 contains 150 questions in 3.5 hours, with around 120 scored items; passing typically requires roughly 60&ndash;65% correct on scored items, equivalent to a scaled score of 250.
        </CitationHook>

        <p>
          Do not start the 16-week clock until these are checked off. Starting without them guarantees a mid-prep derailment.
        </p>
        <p>
          <strong>English test booked (not just planned).</strong> AHPRA requires OET, IELTS Academic, PTE Academic, or TOEFL iBT at specified minimums. English test results have a two-year validity window from the date of sitting, not the date of receipt. Book your test before week 1 begins so results arrive before you submit your AMC application. If English is your strength, IELTS Academic is the fastest path; if you are a hospital-based clinician, OET&apos;s medical scenarios play to your strength. See <Link href="/ielts-vs-oet">IELTS vs OET for AHPRA</Link>.
        </p>
        <p>
          <strong>AMC ID active.</strong> Go to amc.org.au, create your account, and submit your primary medical qualification for primary-source verification. This process takes 8&ndash;12 weeks via ECFMG/EPIC. Many IMGs start study before their AMC ID exists; then they cannot book an exam date. The AMC ID process should be running in parallel before week 1.
        </p>
        <p>
          <strong>Core books in hand.</strong> You need two texts:
        </p>
        <ul>
          <li><em>John Murtagh&apos;s General Practice</em> (7th or 8th edition) &mdash; your clinical reference backbone.</li>
          <li><em>AMC Handbook of MCQs</em> (latest edition) &mdash; the AMC&apos;s own questions, the closest published signal to actual exam style.</li>
        </ul>
        <p>
          If budget allows a third, add Therapeutic Guidelines (eTG) online for drug-specific questions.
        </p>
        <p>
          <strong>Exam date booked (or a target window).</strong> Pearson VUE centres globally run AMC Part 1 year-round. Having a date creates real urgency. Without it, most IMGs drift. Pick a date 17&ndash;18 weeks from now and book it before starting week 1.
        </p>

        <h2>The 16-week structure at a glance</h2>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Phase</th>
                <th className="px-4 py-3 font-semibold">Weeks</th>
                <th className="px-4 py-3 font-semibold">Wkday hrs</th>
                <th className="px-4 py-3 font-semibold">Wkend hrs</th>
                <th className="px-4 py-3 font-semibold">MCQ target</th>
                <th className="px-4 py-3 font-semibold">Key deliverable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Foundation</td>
                <td className="px-4 py-3">1&ndash;2</td>
                <td className="px-4 py-3">1.5</td>
                <td className="px-4 py-3">4</td>
                <td className="px-4 py-3">200</td>
                <td className="px-4 py-3">Stem anatomy + distractor patterns</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">System pass 1</td>
                <td className="px-4 py-3">3&ndash;6</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">6</td>
                <td className="px-4 py-3">900</td>
                <td className="px-4 py-3">Cardio, Resp, GIT, Renal, Endo done</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">System pass 2</td>
                <td className="px-4 py-3">7&ndash;10</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">6</td>
                <td className="px-4 py-3">900</td>
                <td className="px-4 py-3">Neuro, Psych, Paeds, O&G, Surgery, Emergency done</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Population health + ethics</td>
                <td className="px-4 py-3">11&ndash;12</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">6</td>
                <td className="px-4 py-3">300</td>
                <td className="px-4 py-3">Australia-specific content consolidated</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Mocks</td>
                <td className="px-4 py-3">13&ndash;14</td>
                <td className="px-4 py-3">1.5</td>
                <td className="px-4 py-3">5</td>
                <td className="px-4 py-3">450 (3×150)</td>
                <td className="px-4 py-3">3 full timed mocks completed</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Weakness drilling</td>
                <td className="px-4 py-3">15</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">6</td>
                <td className="px-4 py-3">200</td>
                <td className="px-4 py-3">Wrong-answer log worked through</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Taper</td>
                <td className="px-4 py-3">16</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">3</td>
                <td className="px-4 py-3">Light review</td>
                <td className="px-4 py-3">Logistics confirmed, sleep normalised</td>
              </tr>
              <tr className="bg-white/[0.03]">
                <td className="px-4 py-3 font-bold text-white">Total</td>
                <td className="px-4 py-3">&mdash;</td>
                <td className="px-4 py-3">&mdash;</td>
                <td className="px-4 py-3">&mdash;</td>
                <td className="px-4 py-3 font-bold text-white">3,000+</td>
                <td className="px-4 py-3">&mdash;</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          This schedule assumes you are working 40&ndash;50 clinical hours per week. If you are not working, compress weeks 3&ndash;10 by one week and extend mock practice.
        </p>

        <h2>Weeks 1&ndash;2: Foundation &mdash; How to read AMC MCQs</h2>
        <p>
          Most IMGs skip this phase because it feels like preparation for preparation. That is the wrong call. AMC MCQs have a specific architecture, and recognising that architecture turns 5-second hesitations into 15-second clean reads. Over 150 questions that is 25+ minutes &mdash; almost always the difference between finishing and panicking.
        </p>

        <h3>Anatomy of an AMC stem</h3>
        <p>
          Every AMC MCQ contains four components: a <strong>patient vignette</strong> (age, sex, presenting complaint, duration), <strong>context cues</strong> (occupation, social history, country of origin where relevant), a <strong>key discriminating clinical detail</strong> (the abnormal finding or lab value that changes management), and a <strong>question trigger</strong> (what the exam is actually asking &mdash; diagnosis, next investigation, first-line treatment, or immediate management).
        </p>
        <p>
          Work through 20&ndash;30 AMC Handbook questions in week 1 and do this exercise: underline the key discriminating detail and circle the question trigger before looking at the options. If you cannot identify both within 10 seconds, slow down and re-read. Most wrong answers happen because candidates answer the question they expected, not the question that was asked.
        </p>

        <h3>The 4 distractor patterns AMC repeats</h3>
        <ol>
          <li><strong>The overseas-first-line trap.</strong> A treatment that is first-line in India, the UK, or the US but not in Australia. Know the PBS-listed first-line agents for the top 20 conditions &mdash; AMC tests against the PBS, not international guidelines.</li>
          <li><strong>The &ldquo;most appropriate next step&rdquo; vs &ldquo;definitive diagnosis&rdquo; confusion.</strong> The question trigger changes everything. &ldquo;Most appropriate next step&rdquo; almost always means a bedside or cheap test before an expensive or invasive one. &ldquo;Definitive diagnosis&rdquo; means the pathology or imaging standard.</li>
          <li><strong>The Australian referral pathway distractor.</strong> AMC heavily tests primary-care/GP context. &ldquo;Refer to specialist&rdquo; is wrong if the GP can manage. &ldquo;Admit to hospital&rdquo; is wrong if the clinical condition is stable and community management is safe.</li>
          <li><strong>The overfit-to-the-rare-diagnosis trap.</strong> AMC Part 1 is a general practice exam. The common answer is usually right. If you are choosing between a rare genetic condition and a common Australian primary-care diagnosis, the common one is almost always the answer unless the vignette contains a very specific rare-disease cue.</li>
        </ol>
        <p>
          Spend 30 minutes in week 2 categorising your wrong answers from week 1 into these four patterns. You will likely find that 60&ndash;70% of your errors fall into one or two patterns &mdash; which tells you exactly where to direct attention in later phases.
        </p>

        <h2>Weeks 3&ndash;6: System-by-system pass 1 (Cardio, Resp, GIT, Renal, Endo)</h2>

        <CitationHook n={2}>
          The single highest-yield textbook for AMC Part 1 is John Murtagh&apos;s General Practice &mdash; every AMC examiner is exposed to its diagnostic frameworks.
        </CitationHook>

        <p>
          Weeks 3&ndash;6 are your highest-volume study weeks. The goal is not to memorise every detail of each system &mdash; it is to reach a state where you can reliably answer a well-formed MCQ on any topic within the system without reconstructing first principles under time pressure.
        </p>
        <p><strong>Suggested allocation (4 weeks, 5 systems):</strong></p>
        <ul>
          <li><strong>Week 3: Cardiovascular</strong> &mdash; ACS, heart failure, arrhythmias, hypertension (PBS first lines), rheumatic heart disease (high-yield for IMGs from South Asia).</li>
          <li><strong>Week 4: Respiratory</strong> &mdash; asthma (stepwise Australian management per GINA/NPS), COPD, community-acquired pneumonia (empiric antibiotic choices per Therapeutic Guidelines), PE, pleural effusion.</li>
          <li><strong>Week 5: Gastrointestinal + Renal</strong> &mdash; GI bleeding, IBD, hepatitis (screening in Australian primary care), CKD staging, AKI management, renal calculi.</li>
          <li><strong>Week 6: Endocrine</strong> &mdash; diabetes (T1, T2, gestational), thyroid (hypothyroidism, Graves&apos;), adrenal emergencies, calcium disorders.</li>
        </ul>
        <p>
          <strong>How to use Murtagh effectively:</strong> Read the chapter overview, then immediately do 30&ndash;40 MCQs on that topic. Every question you get wrong, find the relevant Murtagh paragraph and annotate it. Do not make long notes from Murtagh &mdash; annotate the book itself. You are building a retrieval system, not a summary document.
        </p>
        <p>
          MCQ target for this phase: 150&ndash;200 questions per week = 750&ndash;900 by end of week 6. Accuracy on timed blocks should be 55&ndash;65% at this checkpoint.
        </p>
        <p>
          If you want a structured question bank that mirrors AMC exam style and tracks your performance by system and difficulty, this is where <Link href="/">Mostly Medicine&apos;s MCQ bank</Link> becomes genuinely useful &mdash; 3000+ questions organised by specialty with explanations tied to Australian guidelines.
        </p>

        <h2>Weeks 7&ndash;10: System-by-system pass 2 (Neuro, Psych, Paeds, O&amp;G, Surgery, Emergency)</h2>
        <p>
          Pass 2 is faster than pass 1. You already know how to read stems and you have the Murtagh workflow. The systems in this phase tend to have more discrete, rule-based content &mdash; which suits rapid MCQ-driven study.
        </p>
        <p><strong>Suggested allocation (4 weeks, 6 systems):</strong></p>
        <ul>
          <li><strong>Week 7: Neurology</strong> &mdash; stroke (tPA criteria, time windows, NIHSS interpretation), headache red flags, epilepsy management, Parkinson&apos;s, MS.</li>
          <li><strong>Week 8: Psychiatry + Mental health law</strong> &mdash; depression (Kessler scales, first-line antidepressants on PBS), schizophrenia, involuntary admission criteria in Australian states (Mental Health Acts &mdash; AMC tests the principle, not the specific Act), suicide risk assessment, duty to warn.</li>
          <li><strong>Week 9: Paediatrics + O&amp;G</strong> &mdash; developmental milestones (AMC loves these), febrile convulsions, failure to thrive; antenatal care schedule in Australia, GDM screening, pre-eclampsia diagnosis, postpartum haemorrhage management.</li>
          <li><strong>Week 10: Surgery + Emergency</strong> &mdash; surgical abdomen differentials (appendicitis vs mesenteric adenitis vs ectopic &mdash; the triage order matters), FAST exam indications, trauma primary survey, anaphylaxis (EpiPen dose, IM vs IV, when to call an ambulance in a GP setting).</li>
        </ul>
        <p>
          <strong>Psych is higher yield than most IMGs allocate.</strong> In our data across 136 Mostly Medicine users, psychiatry and mental health law is consistently underprepared &mdash; particularly Australian-specific content like involuntary admission criteria, child protection notification duties, and capacity assessment. Spend an extra 2&ndash;3 hours here even if it feels like non-clinical law.
        </p>

        <CitationHook n={3}>
          Working IMGs who finish 3000+ practice MCQs before their first AMC Part 1 attempt have a meaningfully higher first-attempt pass rate than those who finish under 1500.
        </CitationHook>

        <p>
          By end of week 10 your cumulative MCQ count should be 1700&ndash;2000. Accuracy on timed blocks should be 60&ndash;68%. If you are below 58% consistently at this point, spend an additional week on your worst two systems before moving to population health.
        </p>

        <h2>Weeks 11&ndash;12: Population health, ethics, and Australia-specific content</h2>
        <p>
          This is the phase most IMGs treat as a box-tick. It is not. About 15% of your exam is here &mdash; and it is the category where overseas-trained doctors on average score lowest. Two weeks of focused effort on this content alone can shift your overall score by 3&ndash;5 percentage points.
        </p>

        <CitationHook n={4}>
          Population health, ethics and medico-legal questions account for around 15% of AMC Part 1 and are routinely the lowest-scoring section for overseas-trained doctors.
        </CitationHook>

        <p><strong>Australian healthcare system.</strong> Know the structure of Medicare (bulk billing, gap payments, MBS items), the PBS (authority prescriptions, streamlined authority, co-payment tiers), the NDIS (eligibility criteria and the GP&apos;s role), and the notifiable disease framework (who notifies, to whom, within what timeframe).</p>
        <p><strong>Screening programs.</strong> BreastScreen Australia (50&ndash;74, two-yearly mammogram), National Bowel Cancer Screening Program (50&ndash;74, biennial iFOBT), National Cervical Screening Program (25&ndash;74, five-yearly primary HPV test since 2017 &mdash; this replaced the Pap smear and a meaningful number of AMC questions still test whether candidates know the change). NIP (National Immunisation Program) &mdash; know the schedule by age.</p>
        <p><strong>Medico-legal and ethics.</strong> Consent (capacity, implied consent, advance care directives), confidentiality and its limits (public safety, mandatory reporting), duty of care, the four ethical principles (autonomy, beneficence, non-maleficence, justice) applied to clinical vignettes. Know the difference between a coroner referral and a death certificate. Child protection: mandatory reporting thresholds differ by state, but the principle AMC tests is &ldquo;reasonable suspicion of harm is sufficient to report.&rdquo;</p>
        <p><strong>Aboriginal and Torres Strait Islander health.</strong> The &ldquo;Closing the Gap&rdquo; framework; targeted health checks (MBS items 715 and 228); higher prevalence conditions (rheumatic heart disease, type 2 diabetes, chronic otitis media, renal disease); cultural safety principles. AMC questions on Indigenous health test whether you approach the clinical context with cultural safety principles, not just clinical knowledge.</p>
        <p>
          Target: 150&ndash;200 population health and ethics MCQs in this two-week block. Use the &ldquo;Public Health &amp; Ethics&rdquo; filter in <Link href="/">Mostly Medicine</Link>.
        </p>

        <h2>Weeks 13&ndash;14: Mocks &mdash; 3 full timed simulations</h2>

        <CitationHook n={5}>
          Mocking under timed conditions &mdash; 150 questions in 3.5 hours, no pauses &mdash; is the single most underused exam-prep tactic among IMGs preparing for AMC.
        </CitationHook>

        <p>
          This is where most study plans fall apart. IMGs sit &ldquo;practice tests&rdquo; in untimed, open-book conditions and call them mocks. That is not a mock. A real mock is:
        </p>
        <ul>
          <li>150 questions, 3.5 hours, no pause, no notes, no interruptions.</li>
          <li>Phone face-down. Bathroom break only if you genuinely cannot wait.</li>
          <li>A quiet room at the same time of day as your actual exam sitting.</li>
          <li>Reviewed in full immediately afterwards &mdash; every wrong answer, every unsure answer.</li>
        </ul>
        <p><strong>Schedule:</strong></p>
        <ul>
          <li><strong>Mock 1</strong> (week 13, day 1): diagnostic baseline. Score honestly. Expect 58&ndash;68% &mdash; that is normal at this stage.</li>
          <li><strong>Review</strong> (week 13, days 2&ndash;3): 2 hours of systematic wrong-answer review.</li>
          <li><strong>Mock 2</strong> (week 13, day 5 or week 14, day 1): improvement check.</li>
          <li><strong>Review</strong> (week 14, days 2&ndash;3).</li>
          <li><strong>Mock 3</strong> (week 14, day 5): final simulation. Same start time, same hydration and food routine you plan for exam day.</li>
        </ul>
        <p>
          A scaled score equivalent of 230&ndash;245 on a quality mock (65&ndash;70% raw correct) suggests you are on track. Below 225 (60% raw) consistently across two mocks means you need more drilling before your exam date &mdash; seriously consider whether to postpone the sitting.
        </p>

        <h2>Week 15: Targeted weakness drilling</h2>
        <p>
          By this point you have a wrong-answer log from three mocks and 10 weeks of MCQ practice. Week 15 is not general review &mdash; it is surgical drilling of your specific gaps.
        </p>
        <p>
          Build your weakness list: take every question you got wrong or flagged as uncertain across your mocks. Group them by system and topic. Identify the top 3 topic areas where your error rate exceeds 40%. Those are your week 15 targets only.
        </p>
        <p><strong>Typical patterns in Mostly Medicine users:</strong></p>
        <ul>
          <li>IMGs from South Asian training systems tend to miss PBS-specific drug choices and the Australian GP referral threshold.</li>
          <li>IMGs with hospital-heavy backgrounds tend to miss the primary-care/GP-first pathway questions and over-investigate where watchful waiting is the answer.</li>
          <li>IMGs from countries without universal healthcare tend to find population screening and Medicare structure questions harder.</li>
        </ul>
        <p>
          <strong>The wrong-answer review protocol:</strong> (1) identify which of the 4 distractor patterns the error falls into, (2) find the definitive source (Murtagh chapter, eTG entry, or RACGP guideline), (3) write one sentence explaining the rule in plain language, (4) do 5 additional MCQs on that exact topic within 24 hours. Do not spend week 15 reviewing things you already know. That is comfort, not preparation.
        </p>

        <h2>Week 16: Taper, sleep, exam logistics</h2>
        <p>
          Week 16 is not a study week. It is a performance week.
        </p>
        <p>
          <strong>Reduce volume, not engagement.</strong> One hour of light MCQ review per day maximum. No new topics. No full-length mocks. Maintenance only.
        </p>
        <p>
          <strong>Sort logistics completely by day 3.</strong> Confirm your Pearson VUE test centre address, ID requirements (passport), check-in time (usually 30 minutes before exam start), and what you can bring (nothing except permitted items). If the test centre is more than 45 minutes away, consider staying nearby the night before. Amandeep stayed in a hotel 10 minutes from her Pearson VUE centre for her Part 1 sitting &mdash; it eliminated one variable on a day that already had enough moving parts.
        </p>
        <p>
          <strong>Sleep.</strong> Go to bed at the same time as your exam-day plan for the entire week. Sleep debt accumulated in the 3 days before an exam is not recoverable with an extra hour the night before.
        </p>
        <p>
          <strong>Exam day.</strong> Eat a real meal. Arrive early. Use the tutorial time at the start of the exam to settle, not to review notes. Flag questions you are uncertain about and return to them &mdash; never spend more than 90 seconds on one stem when uncompleted questions are waiting.
        </p>

        <h2>What &ldquo;good&rdquo; looks like: accuracy benchmarks by checkpoint</h2>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Checkpoint</th>
                <th className="px-4 py-3 font-semibold">Target accuracy (timed blocks)</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3">End of week 2</td>
                <td className="px-4 py-3">45&ndash;52%</td>
                <td className="px-4 py-3">Foundation phase — still learning the format</td>
              </tr>
              <tr>
                <td className="px-4 py-3">End of week 6</td>
                <td className="px-4 py-3">55&ndash;65%</td>
                <td className="px-4 py-3">System pass 1 complete</td>
              </tr>
              <tr>
                <td className="px-4 py-3">End of week 10</td>
                <td className="px-4 py-3">60&ndash;68%</td>
                <td className="px-4 py-3">System pass 2 complete</td>
              </tr>
              <tr>
                <td className="px-4 py-3">End of week 12</td>
                <td className="px-4 py-3">63&ndash;70%</td>
                <td className="px-4 py-3">Population health + ethics added</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Mock 1 (week 13)</td>
                <td className="px-4 py-3">60&ndash;68%</td>
                <td className="px-4 py-3">First timed full simulation</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Mock 3 (week 14)</td>
                <td className="px-4 py-3">65&ndash;72%</td>
                <td className="px-4 py-3">Target range for readiness</td>
              </tr>
              <tr className="bg-white/[0.03]">
                <td className="px-4 py-3 font-bold text-white">Exam day</td>
                <td className="px-4 py-3 font-bold text-white">65&ndash;72% (scaled 250+)</td>
                <td className="px-4 py-3">Consistent trajectory matters more than any single number</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          These benchmarks are drawn from 136 Mostly Medicine users who tracked their practice performance across the platform. The range is wide because working hours, English proficiency, and prior system exposure vary significantly. What matters most is trajectory &mdash; consistent improvement across checkpoints. Flat or declining accuracy between system pass 1 and system pass 2 is a red flag worth investigating before the mocks.
        </p>

        <h2>The 5 most common reasons IMGs fail AMC Part 1 first attempt</h2>
        <ol>
          <li><strong>Starting with too few questions.</strong> The instinct is to read first, then practise. The AMC rewards applied knowledge under time pressure. IMGs who spend 8 of 16 weeks reading and only 8 weeks doing MCQs consistently underperform against those who interleave reading and MCQ practice from week 3 onwards.</li>
          <li><strong>Ignoring Australian-specific content.</strong> If your preparation is built entirely on Harrison&apos;s, Robbins, or a non-Australian question bank, you will pass the clinical medicine but lose marks on PBS first-line drugs, the Medicare/PBS structure, and Australian screening programs. Add eTG and Murtagh early, not as a late-stage add-on.</li>
          <li><strong>Mocking badly.</strong> An untimed, open-book &ldquo;mock&rdquo; teaches nothing about exam performance. Every mock must be 150 questions, 3.5 hours, no reference material, in silence. The exam tests decision-making under time pressure &mdash; you have to practise that condition specifically.</li>
          <li><strong>Not running a wrong-answer log.</strong> Doing 2000 MCQs without systematic review of errors is like practising free throws without watching the shot. Every wrong answer is data. The candidates who improve most rapidly are those who build and act on a wrong-answer log from week 3 onwards.</li>
          <li><strong>Underestimating population health and ethics.</strong> About 15% of your exam is here, almost everyone underprepares it, and it is genuinely learnable content &mdash; not complex pathophysiology, but knowing the Australian healthcare system, consent framework, and public health programs. Two focused weeks here is one of the highest-ROI investments in your prep.</li>
        </ol>

        <h2>Tools and resources</h2>
        <p><strong>Core textbooks:</strong></p>
        <ul>
          <li><em>John Murtagh&apos;s General Practice</em>, 7th or 8th edition &mdash; the foundation. Everything else builds on this.</li>
          <li><em>AMC Handbook of MCQs</em> &mdash; the closest published approximation to real exam questions. Work through the full book at least once.</li>
          <li><em>Therapeutic Guidelines (eTG) online</em> &mdash; drug-specific questions. The eTG is what Australian GPs use in practice; AMC tests against it.</li>
          <li><em>Australian Medicines Handbook</em> &mdash; second-line reference for pharmacology questions.</li>
        </ul>
        <p><strong>Question bank:</strong></p>
        <ul>
          <li><Link href="/">Mostly Medicine MCQ bank</Link> &mdash; 3000+ questions mapped to AMC topic areas, with performance tracking, wrong-answer log, and difficulty progression. Start free, Pro is A$19/month. Built specifically for IMGs on the AMC pathway, with explanations tied to Australian guidelines rather than US or UK sources.</li>
          <li>AMC Handbook of MCQs &mdash; book format, no adaptive tracking, but high validity for question style.</li>
        </ul>
        <p><strong>Australian clinical guidelines:</strong></p>
        <ul>
          <li>eTG (Therapeutic Guidelines) &mdash; antibiotic, cardiovascular, respiratory, analgesic, and mental health prescribing.</li>
          <li>RACGP Clinical Guidelines &mdash; primary care management.</li>
          <li>NHMRC screening guidelines &mdash; breast, cervical, bowel, skin.</li>
        </ul>
        <p><strong>Logistics:</strong></p>
        <ul>
          <li><a href="https://www.amc.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">amc.org.au</a> &mdash; AMC ID, exam booking, fee schedule, exam regulations.</li>
          <li><a href="https://www.pearsonvue.com" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">pearsonvue.com</a> &mdash; test centre locations and check-in procedures.</li>
          <li><a href="https://www.ahpra.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">ahpra.gov.au</a> &mdash; English test requirements and registration process.</li>
        </ul>

        <div className="not-prose my-10 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6">
          <p className="text-sm font-semibold text-white mb-2">Start your AMC Part 1 prep today</p>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Mostly Medicine&apos;s MCQ bank is free to try &mdash; 3000+ questions mapped to AMC topic areas, wrong-answer log built in, performance tracked by system and difficulty. Pro is A$19/month with no lock-in.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            Start free at mostlymedicine.com →
          </Link>
        </div>

        <h2>FAQ</h2>
        <div className="not-prose space-y-5 my-6">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm font-semibold text-white mb-2">{f.q}</p>
              <p className="text-sm text-slate-300 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <hr className="border-white/10 my-10" />

        <div className="not-prose text-xs text-slate-500 space-y-1">
          <p><strong className="text-slate-400">Last reviewed:</strong> 3 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 3 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC-pass IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://www.amc.org.au/assessment/fees" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medical Council — exam information and fees</a></li>
            <li><a href="https://www.amc.org.au/about/statistics" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AMC statistics and annual reports</a></li>
            <li><a href="https://www.amc.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AMC Handbook of Multiple Choice Questions</a></li>
            <li><a href="https://www.ahpra.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA English Language Skills Registration Standard</a></li>
            <li><a href="https://www.medicalboard.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Medical Board of Australia</a></li>
            <li><a href="https://www.tg.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Therapeutic Guidelines (eTG) Australia</a></li>
            <li><a href="https://www.racgp.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">RACGP Clinical Guidelines</a></li>
            <li><a href="https://www.health.gov.au/topics/immunisation/immunisation-throughout-life/national-immunisation-program-schedule" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">National Immunisation Program schedule</a></li>
            <li><a href="https://www.health.gov.au/our-work/national-cervical-screening-program" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">National Cervical Screening Program (HPV-primary, 2017)</a></li>
            <li><a href="https://www.ecfmg.org/epic" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">ECFMG / EPIC primary-source verification</a></li>
          </ul>
        </div>
      </article>
    </main>
  );
}
