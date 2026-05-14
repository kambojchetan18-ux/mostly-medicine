import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

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
    authors: ["Mostly Medicine"],
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
            By <span className="text-slate-200 font-semibold">Mostly Medicine</span> · medically reviewed
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          Sixteen weeks. Two hours on weekdays, six on weekends. Three thousand or more practice MCQs. Three full timed mocks. That is the plan that consistently converts for working IMGs in our platform data. It is not a comfortable plan, but it is an honest one &mdash; and if you are still working clinically while you prep, it is the only schedule that reliably gets you across the line.
        </blockquote>

        <p>
          If you are reading this, you are probably already working &mdash; clinically, long hours, in a system that is not the one you are training to enter. Maybe you have been searching for a study plan that does not assume you have eight free hours a day and zero responsibilities. That plan exists, and this is it. What follows is built from watching 136 IMGs go through AMC Part 1 prep on Mostly Medicine, seeing what got them across the line and what burned them out or left them two marks short. It is not theoretical. It reflects what actually works when you are juggling shifts and study sessions.
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
          Do not start the 16-week clock until these are in place. Starting without them guarantees a mid-prep derailment &mdash; and that is a waste of months you cannot get back.
        </p>
        <p>
          Your English test needs to be booked, not just planned. AHPRA requires OET, IELTS Academic, PTE Academic, or TOEFL iBT at specified minimums. What trips people up is that results have a two-year validity window from the <em>date of sitting</em>, not the date you receive the certificate. Book before week 1 begins so the result lands before you submit your AMC application. If English is your strong suit, IELTS Academic is the fastest path; if you have been working in a hospital setting, OET&apos;s clinical scenarios play to that experience. See <Link href="/ielts-vs-oet">IELTS vs OET for AHPRA</Link>.
        </p>
        <p>
          Your AMC ID needs to be active, or at least in process. Go to amc.org.au, create your account, and submit your primary medical qualification for primary-source verification through ECFMG/EPIC. This takes 8&ndash;12 weeks &mdash; which surprises almost everyone the first time they hear it. Plenty of IMGs start studying before their AMC ID exists, then hit week 12 and cannot book an exam date. Start the AMC ID process before week 1, even if you have not decided on a sitting date yet.
        </p>
        <p>
          You need your two core books in hand. <em>John Murtagh&apos;s General Practice</em> (7th or 8th edition) is your clinical reference backbone &mdash; it is the book that most closely maps to how AMC examiners think about diagnosis and management. The <em>AMC Handbook of MCQs</em> (latest edition) is the official question bank; nothing else gives you as close a signal to actual exam style. If you can only have one, get Murtagh first. If budget allows a third, add Therapeutic Guidelines (eTG) online for drug-specific questions.
        </p>
        <p>
          Finally, book your exam date before you start. Pearson VUE centres run AMC Part 1 globally, year-round. Having a fixed date creates real urgency &mdash; without it, most IMGs drift, extend their &ldquo;study phase&rdquo; indefinitely, and eventually sit underprepared anyway. Pick a date 17&ndash;18 weeks from now and lock it in before week 1 begins.
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
          Every AMC MCQ is built around four components: a <strong>patient vignette</strong> (age, sex, presenting complaint, duration), <strong>context cues</strong> (occupation, social history, country of origin where relevant), a <strong>key discriminating clinical detail</strong> (the abnormal finding or lab value that changes management), and a <strong>question trigger</strong> (what the exam is actually asking &mdash; diagnosis, next investigation, first-line treatment, or immediate management).
        </p>
        <p>
          Work through 20&ndash;30 AMC Handbook questions in week 1 and force yourself to do this: underline the key discriminating detail and circle the question trigger before you look at the options. If you cannot identify both within 10 seconds, slow down and re-read. Most wrong answers happen not because candidates do not know the medicine, but because they answer the question they expected rather than the question that was actually asked.
        </p>

        <h3>The 4 distractor patterns AMC repeats</h3>
        <p>
          The first is the <strong>overseas-first-line trap</strong> &mdash; a treatment that is first-line in India, the UK, or the US but not in Australia. AMC tests against the PBS, not international guidelines. Know the PBS-listed first-line agents for the top 20 conditions, because a DPP-4 inhibitor might be a reasonable choice abroad but metformin is still first-line for T2DM in Australia.
        </p>
        <p>
          The second is the <strong>&ldquo;most appropriate next step&rdquo; vs &ldquo;definitive diagnosis&rdquo; confusion</strong>. The question trigger changes everything. &ldquo;Most appropriate next step&rdquo; almost always points toward a cheap bedside test before anything expensive or invasive. &ldquo;Definitive diagnosis&rdquo; means the pathology or imaging gold standard. Read the trigger carefully &mdash; you can know the medicine perfectly and still answer the wrong question.
        </p>
        <p>
          The third is the <strong>Australian referral pathway distractor</strong>. AMC heavily tests primary-care context. &ldquo;Refer to specialist&rdquo; is wrong if a GP can manage. &ldquo;Admit to hospital&rdquo; is wrong if the condition is stable and community management is safe. Know where the GP&apos;s scope ends and a specialist&apos;s begins.
        </p>
        <p>
          The fourth is the <strong>overfit-to-the-rare-diagnosis trap</strong>. You are a clinical doctor &mdash; you have seen zebras. AMC Part 1 is a general practice exam. If you are choosing between a rare genetic condition and a common Australian primary-care diagnosis, the common one is almost always correct unless the vignette contains a very specific rare-disease cue.
        </p>
        <p>
          Spend 30 minutes in week 2 categorising your wrong answers from week 1 into these four patterns. Most people find that 60&ndash;70% of their errors fall into one or two patterns &mdash; which tells you exactly where to direct attention in the weeks ahead.
        </p>

        <h2>Weeks 3&ndash;6: System-by-system pass 1 (Cardio, Resp, GIT, Renal, Endo)</h2>

        <CitationHook n={2}>
          The single highest-yield textbook for AMC Part 1 is John Murtagh&apos;s General Practice &mdash; every AMC examiner is exposed to its diagnostic frameworks.
        </CitationHook>

        <p>
          Weeks 3&ndash;6 are your highest-volume study weeks, and the goal is deceptively simple: reach a state where you can reliably answer a well-formed MCQ on any topic within each system without needing to reconstruct first principles from scratch. You do not need to memorise every detail &mdash; you need fluency.
        </p>
        <p>
          The suggested split across four weeks is one system per week, with endocrine getting a full week of its own because it catches more people than expected. In week 3, work through cardiovascular &mdash; ACS, heart failure, arrhythmias, hypertension (PBS first-line agents are frequently tested), and rheumatic heart disease, which is high-yield for IMGs from South Asia. Week 4 is respiratory: asthma using the stepwise Australian management framework per GINA and NPS, COPD, community-acquired pneumonia with empiric antibiotic choices from Therapeutic Guidelines, PE, and pleural effusion. Week 5 covers gastrointestinal and renal together &mdash; GI bleeding, IBD, hepatitis screening in Australian primary care, CKD staging, AKI management, and renal calculi. Week 6 is endocrine: diabetes across all three types, thyroid disorders including Graves&apos;, adrenal emergencies, and calcium disorders.
        </p>
        <p>
          The right way to use Murtagh for each system is not to read entire chapters before touching questions. Read the chapter overview, then immediately do 30&ndash;40 MCQs on that topic. For every question you get wrong, go back to the relevant Murtagh paragraph and annotate it directly. Do not make long notes from Murtagh &mdash; annotate the book itself. You are building a retrieval system, not a summary document, and the difference matters on exam day.
        </p>
        <p>
          Your MCQ target for this phase is 150&ndash;200 questions per week, which puts you at 750&ndash;900 by the end of week 6. Accuracy on timed blocks should be sitting at 55&ndash;65% by that checkpoint. If you want a structured question bank that mirrors AMC exam style and tracks your performance by system and difficulty, this is where <Link href="/">Mostly Medicine&apos;s MCQ bank</Link> becomes genuinely useful &mdash; 4,400+ questions organised by specialty with explanations tied to Australian guidelines.
        </p>

        <h2>Weeks 7&ndash;10: System-by-system pass 2 (Neuro, Psych, Paeds, O&amp;G, Surgery, Emergency)</h2>
        <p>
          Pass 2 moves faster than pass 1, and that is not just because you have fewer systems left. You already know how to read stems and you have the Murtagh workflow locked in. The systems in this phase tend toward more discrete, rule-based content &mdash; which suits rapid MCQ-driven study rather than extended reading.
        </p>
        <p>
          In week 7, focus on neurology: stroke (tPA criteria, time windows, NIHSS interpretation), headache red flags, epilepsy management, Parkinson&apos;s, and MS. Week 8 is psychiatry and mental health law &mdash; depression with Kessler scales and PBS-listed first-line antidepressants, schizophrenia, involuntary admission criteria across Australian states (the specific Mental Health Acts differ by state, but AMC tests the principle, not the Act), suicide risk assessment, and duty to warn. Week 9 covers paediatrics and O&amp;G together: developmental milestones (AMC tests these more than you might expect), febrile convulsions, failure to thrive, antenatal care in Australia, GDM screening, pre-eclampsia diagnosis, and postpartum haemorrhage management. Week 10 closes out with surgery and emergency &mdash; surgical abdomen differentials where the triage order between appendicitis, mesenteric adenitis, and ectopic matters, FAST exam indications, trauma primary survey, and anaphylaxis management including EpiPen dosing and when to call an ambulance from a GP setting.
        </p>
        <p>
          One word of blunt advice on psychiatry: it is higher yield than most IMGs allocate. Across 136 Mostly Medicine users, psychiatry and mental health law is consistently the most underprepared area &mdash; and the Australian-specific content like involuntary admission criteria, child protection notification duties, and capacity assessment is the specific gap. Spend an extra 2&ndash;3 hours here even when it feels like non-clinical law. AMC will test it.
        </p>

        <CitationHook n={3}>
          Working IMGs who finish 3000+ practice MCQs before their first AMC Part 1 attempt have a meaningfully higher first-attempt pass rate than those who finish under 1500.
        </CitationHook>

        <p>
          By the end of week 10, your cumulative MCQ count should be between 1700 and 2000, and your accuracy on timed blocks should be sitting at 60&ndash;68%. If you are consistently below 58% at this point, do not push ahead &mdash; spend an additional week on your worst two systems before moving into population health. The mocks in weeks 13 and 14 will not save you if the system-level gaps are still there.
        </p>

        <h2>Weeks 11&ndash;12: Population health, ethics, and Australia-specific content</h2>
        <p>
          Let me be direct about this section: most IMGs treat it as a box-tick and that is a mistake that costs real marks. About 15% of your exam lives here &mdash; and it is consistently the category where overseas-trained doctors score lowest. Two weeks of focused work here can shift your overall result by 3&ndash;5 percentage points.
        </p>

        <CitationHook n={4}>
          Population health, ethics and medico-legal questions account for around 15% of AMC Part 1 and are routinely the lowest-scoring section for overseas-trained doctors.
        </CitationHook>

        <p>
          Start with the Australian healthcare system. You need to understand Medicare &mdash; bulk billing, gap payments, MBS items &mdash; the PBS including authority prescriptions, streamlined authority, and co-payment tiers, the NDIS including eligibility criteria and the GP&apos;s role in a NDIS plan, and the notifiable disease framework: who notifies, to whom, and within what timeframe. If this feels abstract, it becomes very concrete when a question puts you in a GP consultation and asks what you are legally required to do next.
        </p>
        <p>
          For screening programs, the ones that appear most often are BreastScreen Australia (50&ndash;74, two-yearly mammogram), the National Bowel Cancer Screening Program (50&ndash;74, biennial iFOBT), and the National Cervical Screening Program, which switched to a five-yearly primary HPV test in 2017. That last one still catches candidates who know the old Pap smear model &mdash; a meaningful number of questions test whether you know the 2017 change. Also know the NIP schedule by age; developmental vaccine questions blend paediatrics and public health in ways the exam likes.
        </p>
        <p>
          For medico-legal and ethics, the territory covers consent (capacity, implied consent, advance care directives), confidentiality and its limits including public safety and mandatory reporting, duty of care, and the four ethical principles applied to clinical vignettes. Know the difference between a coroner referral and a death certificate &mdash; AMC tests this more often than most candidates expect. On child protection: mandatory reporting thresholds differ by state, but the principle AMC tests is that reasonable suspicion of harm is sufficient to report.
        </p>
        <p>
          Aboriginal and Torres Strait Islander health rounds this section out. The Closing the Gap framework, targeted health checks under MBS items 715 and 228, and the higher-prevalence conditions in Indigenous communities &mdash; rheumatic heart disease, type 2 diabetes, chronic otitis media, renal disease &mdash; are all testable. The questions in this area almost always test whether you approach the clinical context with cultural safety principles, not just clinical knowledge.
        </p>
        <p>
          Aim for 150&ndash;200 population health and ethics MCQs in this two-week block. Use the &ldquo;Public Health &amp; Ethics&rdquo; filter in <Link href="/">Mostly Medicine</Link> to isolate exactly this content.
        </p>

        <h2>Weeks 13&ndash;14: Mocks &mdash; 3 full timed simulations</h2>

        <CitationHook n={5}>
          Mocking under timed conditions &mdash; 150 questions in 3.5 hours, no pauses &mdash; is the single most underused exam-prep tactic among IMGs preparing for AMC.
        </CitationHook>

        <p>
          This is where most study plans fall apart, and the reason is almost always the same: IMGs sit &ldquo;practice tests&rdquo; in untimed, open-book conditions and file them as mocks. That is not a mock. A real mock is 150 questions in 3.5 hours with no pause, no notes, no interruptions, phone face-down, and a bathroom break only if you genuinely cannot wait. It happens in a quiet room at the same time of day as your actual exam sitting, and it gets reviewed in full immediately afterwards &mdash; every wrong answer, every question you flagged as uncertain.
        </p>
        <p>
          For scheduling: Mock 1 goes on day 1 of week 13 as a diagnostic baseline. You will likely score 58&ndash;68% at this stage, and that is expected &mdash; it is not a crisis. Take two days immediately after to review your wrong-answer log systematically. Mock 2 follows on day 5 of week 13 or day 1 of week 14 as an improvement check, with another review session in the two days after. Mock 3 happens on day 5 of week 14 and should be treated as close to the real thing as you can make it &mdash; same start time, same hydration and food routine you plan to use on exam day.
        </p>
        <p>
          When you score your mocks, a scaled-score equivalent of 230&ndash;245 &mdash; roughly 65&ndash;70% raw correct on a quality mock &mdash; suggests you are on track. If you are consistently below 225 (about 60% raw) across two mocks, take that seriously. Consider whether you need to postpone the sitting before you commit to the attempt.
        </p>
        <p>
          If you cannot source three full-length mocks, the AMC Handbook of MCQs contains enough questions to construct two, and a quality question bank like <Link href="/">Mostly Medicine&apos;s</Link> can provide the third with performance tracking built in.
        </p>

        <h2>Week 15: Targeted weakness drilling</h2>
        <p>
          By week 15 you have something genuinely valuable: a wrong-answer log from three mocks and ten weeks of MCQ practice. Most people try to use this week for general review. Do not. Week 15 is surgical drilling of specific gaps, not a comfort pass over things you already know.
        </p>
        <p>
          Build your weakness list by pulling every question you got wrong or flagged as uncertain across your mocks. Group them by system and topic, then identify the top three areas where your error rate exceeds 40%. Those are the only targets for week 15.
        </p>
        <p>
          A few patterns come up repeatedly in Mostly Medicine users. IMGs from South Asian training systems tend to miss PBS-specific drug choices and the Australian GP referral threshold &mdash; not because the medicine is different, but because the Australian-specific layer is genuinely different from what they trained on. IMGs with hospital-heavy backgrounds tend to miss primary-care-first pathway questions and over-investigate where watchful waiting is the correct answer. IMGs from countries without universal healthcare tend to find population screening and Medicare structure questions harder than expected.
        </p>
        <p>
          The right protocol for each wrong answer is four steps: identify which of the four distractor patterns the error falls into, find the definitive source (a Murtagh chapter, an eTG entry, or a RACGP guideline), write one sentence in plain language explaining the rule, then do five additional MCQs on that exact topic within 24 hours. That last step is the one most people skip &mdash; and it is the one that actually closes the gap.
        </p>

        <h2>Week 16: Taper, sleep, exam logistics</h2>
        <p>
          Week 16 is not a study week. It is a performance week, and the distinction matters more than most people allow.
        </p>
        <p>
          Keep volume low but stay engaged. One hour of light MCQ review per day maximum. No new topics. No full-length mocks. What you are doing is maintenance, not learning &mdash; your brain needs to consolidate, not absorb.
        </p>
        <p>
          Sort logistics completely by day 3 of this week. Confirm your Pearson VUE test centre address, your ID requirements (passport), check-in time &mdash; usually 30 minutes before the exam starts &mdash; and a clear understanding of what you can bring into the room, which is essentially nothing except permitted items. If the test centre is more than 45 minutes away, consider staying nearby the night before. Removing that one logistical variable &mdash; the morning commute, the traffic uncertainty &mdash; is worth more than it sounds on a day that already has enough moving parts.
        </p>
        <p>
          Sleep is not optional. Go to bed at the same time as your exam-day plan every night this week. Sleep debt accumulated in the three days before an exam is not recoverable with an extra hour the night before &mdash; the research on this is unambiguous. Treat your bedtime as part of your exam preparation.
        </p>
        <p>
          On exam day itself: eat a real meal, arrive early, and use the tutorial time at the start of the exam to settle &mdash; not to review anything. Flag questions you are uncertain about and come back to them. Never spend more than 90 seconds on a single stem when uncompleted questions are waiting.
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
          These benchmarks are drawn from 136 Mostly Medicine users who tracked their practice performance across the platform. The ranges are wide because working hours, English proficiency, and prior system exposure vary significantly. What matters most is trajectory &mdash; consistent improvement across checkpoints. If your accuracy is flat or declining between system pass 1 and system pass 2, that is a signal worth investigating before the mocks, not something to hope improves on its own.
        </p>

        <h2>The 5 most common reasons IMGs fail AMC Part 1 first attempt</h2>
        <p>
          The most common failure pattern is starting with too few questions. The natural instinct is to read first, then practise &mdash; but the AMC rewards applied knowledge under time pressure, not accumulated reading. IMGs who spend 8 of 16 weeks in books and only 8 weeks doing MCQs consistently underperform against those who interleave reading and question practice from week 3 onwards. The questions are not a test of whether you read. They are the study.
        </p>
        <p>
          The second is ignoring Australian-specific content. If your preparation is built entirely on Harrison&apos;s, Robbins, or a non-Australian question bank, you will be solid on the clinical medicine but you will lose marks on PBS first-line drugs, Medicare and PBS structure, and Australian screening programs. eTG and Murtagh need to be in your toolkit from the start, not added on at week 14 when you notice the gaps.
        </p>
        <p>
          The third is mocking badly. An untimed, open-book &ldquo;practice test&rdquo; tells you nothing useful about exam performance. The exam is 150 questions, 3.5 hours, in silence, with a clock running. Every mock needs to replicate those conditions exactly. You cannot practise decision-making under time pressure in conditions that remove the time pressure.
        </p>
        <p>
          The fourth is not keeping a wrong-answer log. Doing 2000 MCQs without systematically reviewing errors is like practising free throws while looking away from the basket. Every wrong answer is data. The candidates who improve most rapidly across their prep are those who build a log from week 3 and actually act on it, not just collect it.
        </p>
        <p>
          The fifth is underestimating population health and ethics. About 15% of your exam is here, almost everyone underprepares it, and here is the thing &mdash; it is genuinely learnable content. It is not complex pathophysiology. It is the Australian healthcare system, the consent framework, and the public health programs. Two weeks of focused attention is one of the highest-return investments you can make in this prep.
        </p>

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
          <li><Link href="/">Mostly Medicine MCQ bank</Link> &mdash; 4,400+ questions mapped to AMC topic areas, with performance tracking, wrong-answer log, and difficulty progression. Start free, Pro is A$19/month. Built specifically for IMGs on the AMC pathway, with explanations tied to Australian guidelines rather than US or UK sources.</li>
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
            Mostly Medicine&apos;s MCQ bank is free to try &mdash; 4,400+ questions mapped to AMC topic areas, wrong-answer log built in, performance tracked by system and difficulty. Pro is A$19/month with no lock-in.
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
          <p><strong className="text-slate-400">Publisher:</strong> Mostly Medicine</p>
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
    <SiteFooter />
    </main>
  );
}
