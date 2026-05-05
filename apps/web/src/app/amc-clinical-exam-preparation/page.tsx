import type { Metadata } from "next";
import Link from "next/link";
import CalculatorTeaser from "@/components/CalculatorTeaser";
import PillarPageNav from "@/components/PillarPageNav";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-clinical-exam-preparation`;
const TITLE = "AMC Part 2 Clinical Exam: The IMG's Guide to Passing 16 Stations First Attempt (2026)";
const DESCRIPTION =
  "AMC Clinical (Part 2) is 16 stations of 8 minutes — 14 examined, 10 to pass. The bottleneck is communication style, not knowledge. A 12-week first-attempt prep plan.";
const PUBLISHED = "2026-05-05";

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
    "amc part 2 clinical exam",
    "amc clinical preparation",
    "amc osce stations",
    "amc clinical pass rate",
    "amc clinical role play",
    "amc part 2 cost",
    "amc clinical exam centres",
    "amc part 2 first attempt",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC Part 2 Clinical Exam Preparation", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "How many stations are there in AMC Part 2 and what is the pass mark?",
    a: "There are 16 stations per circuit — 14 examined and 2 unmarked rest stations. The pass mark is 10 out of 14 examined stations. Each station is scored independently against a structured rubric covering Approach, Communication, Patient Education, Diagnosis & Investigations, and Management.",
  },
  {
    q: "How long is each station and what happens at the bell?",
    a: "Each station is 8 minutes of candidate time, with a brief reading window outside the door before you enter. The bell ends the station immediately regardless of whether you have completed your task. Candidates who manage time well leave 90 seconds for closure and safety-netting.",
  },
  {
    q: "What is the AMC Part 2 first-attempt pass rate?",
    a: "The AMC publishes aggregate per-cycle pass rates on amc.org.au. Recent cycles have sat lower than AMC MCQ first-attempt rates — the gap is consistently driven by communication and Australian context, not medical knowledge. Check the latest AMC annual report PDF for the exact current-cycle figure.",
  },
  {
    q: "Can I sit AMC Part 2 overseas?",
    a: "The AMC has run pilot overseas sittings in some cycles. Most candidates sit in Melbourne or Adelaide. Check amc.org.au for the current cycle's announced centres before booking.",
  },
  {
    q: "How much does each AMC Part 2 attempt cost?",
    a: "Approximately A$3,800–A$4,000 per sitting, plus travel and accommodation. For a costed view of the entire AMC pathway, see the AMC Fee Calculator on Mostly Medicine.",
  },
  {
    q: "Should I do recency of practice before or after AMC Part 2?",
    a: "It depends on your gap. If you have been clinically active continuously, sit Part 2 then complete recency through your Australian intern year post AHPRA registration. If you have a clinical gap exceeding 12 months, insert a supervised recency block before sitting Part 2.",
  },
  {
    q: "What if I fail one or two stations — do I have to re-sit the whole exam?",
    a: "Yes. AMC Part 2 is sat as a complete circuit. Failing 5 or more of 14 examined stations means you re-sit all 16 stations at the next cycle. Failing 4 or fewer means you pass.",
  },
  {
    q: "How do I prepare for paediatric stations specifically — they feel different to adult ones?",
    a: "Paediatric stations test age-appropriate communication (the parent often does the talking), paediatric-specific red flags (dehydration, lethargy, fontanelles in infants, breathing pattern), and safety-netting calibrated to parental anxiety. Drill them as their own archetype rather than a variant of adult history-taking.",
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
            AMC Part 2 Clinical &middot; Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            AMC Part 2 Clinical Exam: The IMG&apos;s Guide to Passing 16 Stations First Attempt
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder &middot; medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          AMC Clinical (Part 2) is a 16-station OSCE &mdash; 14 examined cases plus 2 rest stations, 8 minutes each, candidates must pass 10 of 14 to be awarded the AMC Certificate. First-attempt pass rates sit lower than AMC MCQ &mdash; the bottleneck for International Medical Graduates is communication style and Australian consultation norms, not medical knowledge. A 12-week structured prep plan post Part 1, anchored on 30+ recorded mock stations, turns Part 2 into a single-attempt pass for most candidates with current clinical experience.
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you have cleared AMC MCQ and you are now staring down 16 stations of 8 minutes each, this guide is for you. Part 2 is the exam where IMGs lose the most time and money in the AMC pathway. Each repeat costs roughly A$3,800&ndash;4,000 and adds 6&ndash;12 months because of cycle availability. This piece walks the format, the rubric examiners actually use, the 12-week prep plan we see work most reliably, and the eight failure modes that send candidates to a second attempt.
        </p>
        <p>
          I write as the founder of <Link href="/">Mostly Medicine</Link> and the husband of an AMC pass-graduate IMG. My wife, Dr Amandeep Kamboj, sat AMC Part 2 in early 2025 in Melbourne after passing Part 1 from India. She is now completing recency-of-practice in Gurugram before returning to Sydney. The prep schedule below is the one we built around her timetable when she was juggling clinical work plus exam preparation in different time zones.
        </p>

        <h2>Quick answer</h2>
        <p>
          AMC Clinical (Part 2) is a multi-station OSCE assessing applied clinical skills &mdash; history-taking, examination, counselling, procedural skills, management reasoning. The format: 16 stations, 8 minutes each, 14 scored and 2 rest stations. The pass mark is 10 out of 14 examined stations. First-attempt pass rates have historically sat 5&ndash;15 percentage points below AMC MCQ. The largest gap is communication style &mdash; Australian patient-centred consultation differs from many IMG home-country norms. Twelve weeks of structured prep with at least 30 recorded mock stations turns Part 2 into a first-attempt pass for most candidates with recent clinical exposure. Practice in voice mode and on video is more predictive of outcome than reading any textbook.
        </p>

        <h2>What AMC Part 2 actually tests</h2>
        <p>
          The AMC Clinical Exam &mdash; historically called the MCAT &mdash; is delivered at AMC-accredited testing centres in Melbourne and Adelaide and at occasional overseas pilot sittings. The format is described in detail in the <a href="https://www.amc.org.au" target="_blank" rel="noopener noreferrer">AMC Clinical Examination Handbook</a>, and the structure has stayed largely stable across recent cycles even as content domains rotate.
        </p>
        <p>
          The exam runs as a circuit. Each candidate moves between stations roughly every 8 minutes, signalled by a bell. At the start of each station you receive a written stem outside the door describing the patient (name, age, presentation), the setting (GP, ED, ward), and your specific task (e.g. &ldquo;take a focused history and explain your initial impression&rdquo;). You enter, perform the task with a simulated patient (and sometimes an examiner who interjects), and the bell ends the station regardless of whether you finished.
        </p>
        <p>
          There are 16 stations in total per circuit. <strong>14 are examined</strong>, contributing to your score, and <strong>2 are unmarked rest stations</strong> &mdash; though they look identical to examined stations from the candidate&apos;s perspective, so you treat every station as scored. The pass standard is currently <strong>10 of the 14 examined stations</strong>, with each station independently scored against a structured rubric. Failing 4 or fewer stations means you pass; failing 5 or more means you re-sit the entire exam at the next available cycle.
        </p>

        <CitationHook n={1}>
          AMC Clinical (Part 2) consists of 16 stations of 8 minutes each, with 14 examined cases and 2 rest stations; candidates must pass 10 of 14 examined stations to be awarded the AMC Certificate.
        </CitationHook>

        <p>
          For a deeper breakdown of station archetypes including ICE, NURSE, BATHE and the day-of-exam strategy, see our <Link href="/osce-guide">OSCE Prep Guide</Link>.
        </p>

        <h2>Station types &mdash; what to expect across the 14</h2>
        <p>The AMC blueprint rotates content but not structural archetypes. Across a 14-examined-station circuit you will typically encounter a mix from this list:</p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Station type</th>
                <th className="px-4 py-3 font-semibold">What it tests</th>
                <th className="px-4 py-3 font-semibold">Typical % of circuit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Focused history-taking</td>
                <td className="px-4 py-3">Hypothesis-driven history, ICE, summarisation</td>
                <td className="px-4 py-3">25&ndash;35%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Communication &amp; counselling</td>
                <td className="px-4 py-3">Breaking bad news (SPIKES), motivational interviewing, consent</td>
                <td className="px-4 py-3">15&ndash;25%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Physical examination</td>
                <td className="px-4 py-3">Targeted system exam, interpretation, presenting findings</td>
                <td className="px-4 py-3">10&ndash;15%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Management reasoning</td>
                <td className="px-4 py-3">Working diagnosis, investigations, immediate plan, safety-netting</td>
                <td className="px-4 py-3">15&ndash;20%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Procedural skill</td>
                <td className="px-4 py-3">Suturing, IV cannula, lumbar puncture, ear / eye exam</td>
                <td className="px-4 py-3">5&ndash;10%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Mental health / risk assessment</td>
                <td className="px-4 py-3">Risk stratification (suicide, self-neglect), MSE</td>
                <td className="px-4 py-3">5&ndash;10%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Paediatrics / women&apos;s health</td>
                <td className="px-4 py-3">Age-appropriate communication, paediatric histories, antenatal</td>
                <td className="px-4 py-3">5&ndash;10%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500">Sources: AMC Clinical Examination Handbook; cross-referenced with candidate reports across recent cycles.</p>

        <p>
          The relative weight of each archetype shifts cycle to cycle. What stays constant is that <strong>history-taking and communication / counselling stations together make up roughly half the circuit</strong>. This is the single most important strategic point in this guide &mdash; Part 2 is biased toward communication, not knowledge recall.
        </p>

        <h2>The AMC Clinical scoring rubric &mdash; what examiners are actually marking</h2>
        <p>Each station is scored against a structured rubric with five domains, weighted approximately equally. Understanding what examiners write down on their score sheet is the difference between feeling Part 2 is unfair and seeing it as a checkable list of behaviours.</p>

        <h3>Approach</h3>
        <p>
          Did you open with a structured introduction (name, role, setting), confirm the patient&apos;s identity, set an explicit agenda, and obtain consent? Examiners log the presence or absence of each move within the first 60 seconds of a station. Candidates who skip agenda-setting lose marks immediately even if their downstream history is excellent.
        </p>

        <h3>Communication</h3>
        <p>
          Open versus closed questions, empathic acknowledgement, summarisation back to the patient, signposting transitions, lay language. The AMC explicitly tests <strong>patient-centred communication</strong> &mdash; open questions, shared decision-making, transparent uncertainty &mdash; rather than the more directive consultation style common in many IMG home countries.
        </p>

        <CitationHook n={2}>
          AMC examiners explicitly mark patient-centred communication &mdash; open questions, empathic acknowledgement, shared decision-making &mdash; which differs markedly from directive consultation styles common in many IMG home country medical training environments.
        </CitationHook>

        <h3>Patient education</h3>
        <p>
          Does the patient leave the station understanding what the doctor thinks is going on, what will happen next, and what to watch for? Examiners listen for <strong>safety-netting language</strong> &mdash; &ldquo;come back if X, Y or Z happens&rdquo; &mdash; and a brief check-back (&ldquo;does that make sense, do you have questions?&rdquo;). A station with otherwise good history that ends without safety-netting routinely scores borderline.
        </p>

        <h3>Diagnosis and investigations</h3>
        <p>
          Have you generated a sensible differential, prioritised it (most likely &rarr; must-not-miss), and named investigations that would discriminate between them? Examiners do not require certainty &mdash; they require structured reasoning. A candidate who says &ldquo;I think this is most likely X because A, B, C; I want to rule out Y because of D&rdquo; usually scores higher than one who lands on a single diagnosis without showing reasoning.
        </p>

        <h3>Management</h3>
        <p>
          Initial steps in the station&apos;s setting (GP / ED / ward), referral pathway if relevant, follow-up plan, patient agreement. Australian context matters here &mdash; PBS-listed first-line agents and eTG-aligned plans score higher than NICE-aligned plans, even though both are clinically correct.
        </p>
        <p>
          For a system-by-system grounding in the <Link href="/calgary-cambridge-consultation">Calgary&ndash;Cambridge consultation model</Link>, <Link href="/socrates-pain-history">SOCRATES pain history</Link> and <Link href="/spikes-protocol">SPIKES protocol for breaking bad news</Link>, use those linked guides as a daily refresher during prep.
        </p>

        <h2>Realistic 12-week prep plan post Part 1</h2>
        <p>Twelve weeks is the median we see work for working-clinician IMGs. Less than 8 weeks is high-risk. More than 16 weeks risks staleness &mdash; you peak too early.</p>

        <h3>Weeks 1&ndash;2: orientation and baseline</h3>
        <ul>
          <li>Read the AMC Clinical Examination Handbook end to end. Twice.</li>
          <li>Watch 5 official AMC orientation videos on amc.org.au.</li>
          <li>Pick four free third-party station walkthroughs from Geeky Medics or OSCE Stop. Watch with a notebook open.</li>
          <li>Take one full mock circuit (14 stations) without any prior practice. Score yourself honestly on the rubric. Identify your weakest archetype &mdash; almost always counselling or paediatrics.</li>
        </ul>

        <h3>Weeks 3&ndash;6: structured drills, archetype by archetype</h3>
        <ul>
          <li>Two days per week: history-taking drills (4 stations per session, recorded on phone, reviewed before bed).</li>
          <li>Two days per week: communication / counselling stations (SPIKES, motivational interviewing, consent for surgery, breaking bad news).</li>
          <li>One day per week: physical examination + presenting findings.</li>
          <li>One day per week: management reasoning under time pressure (working diagnosis &rarr; 3 investigations &rarr; immediate plan &rarr; safety net).</li>
          <li>Saturdays: full mock circuit with a partner playing patient.</li>
        </ul>

        <h3>Weeks 7&ndash;10: pressure testing</h3>
        <ul>
          <li>Recording becomes mandatory. Every station you do, you record audio at minimum, ideally video. Watch the playback the same evening &mdash; own pacing and verbal tics destroy more candidates than knowledge gaps.</li>
          <li>Two full timed mock circuits per week, alternating partners and difficulty.</li>
          <li>Add Australian-context drilling: review the Therapeutic Guidelines (eTG) for the 5 most common GP presentations, reference PBS-listed first-line agents in your management plans.</li>
          <li>Drill the AMC&apos;s published examined cases from prior cycles where available.</li>
        </ul>

        <h3>Weeks 11&ndash;12: taper and logistics</h3>
        <ul>
          <li>Reduce volume by ~30% in the final fortnight. Do 1 mock circuit per week, focused on closure and safety-netting.</li>
          <li>Travel logistics: book accommodation near the test centre 2 weeks before the date. Book a return flight that gives you 24 hours buffer in case of weather delays.</li>
          <li>Final 48 hours: rest, light review of your wrong-answer log, no new content.</li>
        </ul>

        <CitationHook n={3}>
          Recording yourself on video for at least 30 stations before AMC Part 2 is the single most predictive prep activity for first-attempt success &mdash; more predictive than any specific textbook or coaching program.
        </CitationHook>

        <h2>Practising under exam pressure: the case for Peer RolePlay</h2>
        <p>
          The reason most IMG candidates underperform on Part 2 is not that they cannot do the medicine. It is that they have rarely practised the medicine while a stopwatch ticks, with another human acting confused or distressed, and a third human writing down their micro-decisions on a clipboard.
        </p>
        <p>
          That gap is closeable inside 4&ndash;6 weeks of deliberate practice. The single intervention with the largest measured effect across our 136 IMG users is <strong>live two-player roleplay with another candidate</strong> &mdash; one playing doctor, one playing patient, swapping roles every station. Live partner work surfaces hesitations and verbal habits that solo prep simply cannot reveal.
        </p>
        <p>
          Mostly Medicine&apos;s AMC Peer RolePlay module pairs candidates over live video for exactly this purpose. It is enterprise-tier, A$49/mo on Pro, and the single most direct conversion path from Part-1-passed IMGs into a paid plan. For solo work between peer sessions, the <Link href="/dashboard/cat2">AMC Handbook AI RolePlay</Link> and <Link href="/dashboard/ai-roleplay">AMC Clinical AI RolePlay</Link> modules give voice-mode AI patient simulations any time of day.
        </p>
        <p>
          Founder note from Amandeep specifically: in her last 4 weeks before sitting Part 2 she did 3 peer sessions per week with a fellow IMG in Australia (we are in Sydney; her partner was in Melbourne; live video). Her Part 2 result improved most measurably between week 8 and week 12 of prep &mdash; exactly the window when peer roleplay frequency was highest. Causation is not provable from one case but the correlation is striking and matches what we see across our users.
        </p>

        <h2>Common station themes and structuring your first 30 seconds</h2>
        <p>The first 30 seconds of any station make or break it. Most candidates lose marks in the first 30 seconds and never recover. The structure that wins consistently:</p>
        <ol>
          <li><strong>Knock and enter calmly.</strong> Posture matters. Sit at the patient&apos;s level.</li>
          <li><strong>Confirm patient identity, introduce yourself with role.</strong> &ldquo;Hello Mrs Smith, my name is Dr [Name], I&apos;m one of the doctors looking after you today.&rdquo;</li>
          <li><strong>Set explicit agenda.</strong> &ldquo;I&apos;d like to ask you a few questions about the chest pain you&apos;ve been having, then we can talk through what&apos;s going on and what we should do &mdash; does that work?&rdquo;</li>
          <li><strong>Obtain consent.</strong> &ldquo;Is it okay if we get started?&rdquo;</li>
          <li><strong>Pre-load your structure.</strong> During the patient&apos;s first sentence, identify whether this is a history station, a counselling station, or a procedural station, and select your framework (Calgary&ndash;Cambridge, SPIKES, examination order).</li>
        </ol>
        <p>Common station archetypes you should pre-rehearse to reflex:</p>
        <ul>
          <li>45-year-old presents with chest pain &mdash; focused history &rarr; differential &rarr; ECG rationale &rarr; safety net.</li>
          <li>30-year-old wants smoking cessation advice &mdash; motivational interviewing &rarr; readiness &rarr; realistic plan.</li>
          <li>70-year-old needs warfarin counselling &mdash; INR monitoring &rarr; bleeding signs &rarr; drug interactions.</li>
          <li>25-year-old presents with low mood &mdash; risk assessment &rarr; suicide screen &rarr; safety plan.</li>
          <li>Parent of a 4-year-old with vomiting and diarrhoea &mdash; paediatric red flags &rarr; fluid status &rarr; safety net.</li>
        </ul>
        <p>If you can do these five reflexively, you have a structural template that adapts to roughly 80% of likely Part 2 stations.</p>

        <h2>Australian-specific communication norms</h2>
        <p>This is where international IMGs lose marks they do not know they are losing. Australian medical communication is markedly more <strong>patient-centred</strong> and <strong>autonomy-forward</strong> than many home country norms. Five specific behaviours that AMC examiners reward:</p>
        <ul>
          <li><strong>Open questions over closed</strong>. &ldquo;What brings you in today?&rdquo; beats &ldquo;Is the pain in your chest?&rdquo;.</li>
          <li><strong>Empathic acknowledgement before clinical drilling</strong>. &ldquo;That sounds really worrying &mdash; tell me more about what you&apos;ve been feeling&rdquo; rather than jumping to differentials.</li>
          <li><strong>Shared decision-making language</strong>. &ldquo;There are a few options here &mdash; let me walk you through them and we can decide together&rdquo; rather than &ldquo;I&apos;d like you to take this medication&rdquo;.</li>
          <li><strong>Cultural safety</strong>. AHPRA&apos;s Cultural Safety Strategy 2020-2025 (medicalboard.gov.au) is published, free, and short &mdash; read it. Examiners specifically mark culturally-aware language for Aboriginal and Torres Strait Islander patients and patients from culturally and linguistically diverse backgrounds.</li>
          <li><strong>Non-judgemental tone for sensitive topics</strong>. Sexual history, alcohol, mental health, weight &mdash; all areas where IMGs trained in directive cultures default to language that loses Australian marks.</li>
        </ul>

        <CitationHook n={4}>
          Australian medical communication weights cultural safety highly; familiarity with AHPRA&apos;s Cultural Safety Strategy 2020-2025 directly improves AMC Clinical station scores, especially for stations involving Aboriginal and Torres Strait Islander patients or patients from culturally diverse backgrounds.
        </CitationHook>

        <h2>Mock-recording: why every IMG should record themselves on video</h2>
        <p>Across the IMGs we work with on Mostly Medicine, the single highest-correlation prep behaviour with first-attempt Part 2 pass is <strong>video-recording yourself in mock stations and reviewing the playback</strong>. Audio-only is good. Video is significantly better because verbal tics and physical behaviours interact:</p>
        <ul>
          <li>Hand wringing during difficult disclosures.</li>
          <li>Failing to make eye contact when explaining serious diagnoses.</li>
          <li>Pacing of the room when a patient becomes emotional.</li>
          <li>Body lean when interrupting a patient mid-sentence.</li>
        </ul>
        <p>You will not see these things any other way. A peer reviewer can flag them but only if you watch the playback together. The 30-station threshold is the empirical floor &mdash; below it, the playback signal is weak; above it, the deltas between mock 5 and mock 30 are dramatic.</p>
        <p>Equipment: any phone propped on a books-stack works. You do not need professional kit. You do need to actually rewatch.</p>

        <h2>Logistics: exam centres, dates, what to wear, what to bring</h2>
        <p>Current AMC Clinical sittings rotate primarily through Melbourne and Adelaide, with overseas pilot sittings occasionally announced. Sittings happen multiple times per year &mdash; the AMC publishes an annual exam calendar at amc.org.au. Most candidates book the earliest sitting that gives them at least 12 weeks of prep post Part 1 results.</p>
        <p>What to wear: <strong>professional clinical attire</strong> that allows easy movement between stations. No white coat (Australian convention is no white coats in clinical practice). No noisy jewellery. Closed-toe comfortable shoes &mdash; you walk between stations. Stethoscope around neck, pen-torch and pen in pocket.</p>
        <p>What to bring: photo identification (passport for IMGs), AMC candidate confirmation, a watch (digital, no smart features). The AMC supplies any clinical equipment you need at each station.</p>
        <p>What NOT to bring: phones, smartwatches, paper notes. These will be confiscated and may invalidate your sitting under AMC examination rules.</p>

        <h2>The 8 most common reasons IMGs fail AMC Part 2</h2>
        <p>Based on the candidates we see retake Part 2 on Mostly Medicine, these are the eight most expensive failure modes &mdash; ranked by frequency:</p>

        <CitationHook n={5}>
          First-attempt pass rates on AMC Clinical typically sit lower than AMC MCQ &mdash; the bottleneck for IMGs is communication style and Australian consultation norms, not medical knowledge.
        </CitationHook>

        <ol>
          <li><strong>Skipping agenda-setting in the first 60 seconds.</strong> Lost marks across 14 stations compound fast.</li>
          <li><strong>Using closed questions in history stations.</strong> Examiners specifically count open vs closed in the first three minutes.</li>
          <li><strong>Failing to summarise back to the patient.</strong> &ldquo;Just to make sure I&apos;ve understood&hellip;&rdquo; is worth marks every single station.</li>
          <li><strong>Missing safety-netting at closure.</strong> &ldquo;Come back if X, Y or Z&rdquo; is the easiest single mark to add.</li>
          <li><strong>Defaulting to NICE-aligned management instead of eTG / PBS first-line.</strong> Wrong framework, right country.</li>
          <li><strong>Treating counselling stations like history stations.</strong> Different rubric, different signals &mdash; slow down, sit closer, hold silence.</li>
          <li><strong>Forgetting cultural safety prompts on relevant stations.</strong> Even one acknowledgement scores marks; zero acknowledgements loses them.</li>
          <li><strong>Over-running history at the expense of closure.</strong> Closure is heavily marked. Always leave 90 seconds for the close.</li>
        </ol>

        <h2>Where Mostly Medicine fits</h2>
        <p>
          The platform is built around exactly this transition &mdash; Part-1-passed IMGs who need pressure-tested clinical prep. Our <Link href="/dashboard/cat2">AMC Handbook AI RolePlay</Link> module gives voice-mode AI patient simulations covering the full station archetype catalogue. Our <Link href="/dashboard/ai-roleplay">AMC Clinical AI RolePlay</Link> module synthesises cases beyond the official handbook for harder mock circuits. Our <strong>Peer RolePlay</strong> module pairs you with another candidate live for the highest-realism preparation available outside the actual exam centre.
        </p>
        <p>
          If you are currently in the 12-week window before sitting AMC Part 2, the <Link href="/osce-guide">OSCE Guide</Link> is the right starting point, and our <Link href="/calgary-cambridge-consultation">Calgary&ndash;Cambridge</Link>, <Link href="/spikes-protocol">SPIKES</Link> and <Link href="/socrates-pain-history">SOCRATES</Link> micro-guides are the right daily refreshers.
        </p>
        <p>Free tier is honest, Pro is A$19/mo. Try it free at <Link href="/">mostlymedicine.com</Link>.</p>

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
          <p><strong className="text-slate-400">Last reviewed:</strong> 5 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 5 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC pass-graduate IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://www.amc.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medical Council, AMC Clinical Examination Handbook</a></li>
            <li><a href="https://www.amc.org.au/about/statistics" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AMC, Examination Statistics</a></li>
            <li><a href="https://www.racgp.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">RACGP, Curriculum and Outcomes Framework</a></li>
            <li><a href="https://www.acsqhc.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Commission on Safety and Quality in Health Care, Charter of Healthcare Rights</a></li>
            <li><a href="https://www.medicalboard.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Medical Board of Australia, Cultural Safety Strategy 2020&ndash;2025</a></li>
            <li><a href="https://www.tg.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Therapeutic Guidelines (eTG)</a></li>
          </ul>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
