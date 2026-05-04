import type { Metadata } from "next";
import Link from "next/link";
import CalculatorTeaser from "@/components/CalculatorTeaser";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/osce-guide`;
const TITLE = "OSCE Guide for IMGs (2026): How to Prepare for the AMC Clinical Exam";
const DESCRIPTION =
  "A complete OSCE preparation guide for International Medical Graduates sitting the AMC Clinical Exam — communication frameworks, history mnemonics, day-of-exam strategy, and the Australian-context pitfalls that cost candidates marks.";
const PUBLISHED = "2026-05-04";

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
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
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
    "osce guide",
    "amc clinical exam preparation",
    "amc osce mnemonics",
    "calgary cambridge",
    "socrates pain history",
    "spikes protocol",
    "ice framework",
    "amc mcat preparation",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "OSCE Guide", item: PAGE_URL },
  ],
};

const learningPathSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "AMC Clinical Stations Guide", url: `${SITE_URL}/amc-clinical-stations-guide` },
    { "@type": "ListItem", position: 2, name: "Calgary–Cambridge Consultation Model", url: `${SITE_URL}/calgary-cambridge-consultation` },
    { "@type": "ListItem", position: 3, name: "SOCRATES Pain History", url: `${SITE_URL}/socrates-pain-history` },
    { "@type": "ListItem", position: 4, name: "SPIKES Protocol — Breaking Bad News", url: `${SITE_URL}/spikes-protocol` },
  ],
};

const faqs = [
  {
    q: "What is the AMC Clinical Exam (OSCE / MCAT)?",
    a: "The AMC Clinical Exam — historically called the MCAT — is a multi-station Objective Structured Clinical Examination of around 16 stations, each ~8 minutes. Stations test history-taking, examination, communication, counselling, procedural skills, and clinical reasoning under supervised, time-pressured conditions. It is the second part of the AMC pathway after AMC MCQ.",
  },
  {
    q: "How long is each OSCE station and how is it structured?",
    a: "Most AMC OSCE stations run for 8 minutes of candidate time, often preceded by a brief reading minute outside the station. You read the candidate task, enter, perform the task with a simulated patient (and sometimes an examiner asking probing questions), and the bell ends the station regardless of whether you finished. Time discipline matters — the bell does not pause for an unfinished closure.",
  },
  {
    q: "Which communication framework does the AMC actually mark on?",
    a: "The AMC's marking schemes are not a verbatim Calgary–Cambridge tickbox, but the structural elements they test — opening, agenda-setting, gathering information, building relationship, providing structure, explanation/planning, and closing — map directly onto Calgary–Cambridge. Practising this framework is the highest-yield preparation for the communication score.",
  },
  {
    q: "What is the most common reason IMGs lose marks in OSCE stations?",
    a: "Three patterns dominate. First, jumping to investigations or management without enough history-taking and ICE (ideas/concerns/expectations) elicited. Second, failing to summarise back to the patient. Third, missing safety-netting at closure — \"come back if X, Y, Z gets worse.\" None of these are knowledge gaps; all three are structural communication habits that practice fixes.",
  },
  {
    q: "How many practice stations should I do before sitting the AMC OSCE?",
    a: "Across IMGs preparing on Mostly Medicine, 30+ recorded station rehearsals is the threshold above which first-attempt pass rates rise meaningfully. The discipline that matters is recording yourself on video, not the count itself — the playback is where the structural fixes happen.",
  },
  {
    q: "Are there free video resources for OSCE prep?",
    a: "Yes. Geeky Medics, OSCE Stop, and the AMC's own MCAT preparation video library on amc.org.au have well-regarded free station walkthroughs. Treat all third-party video content as supplementary — always cross-check against the current AMC Handbook because UK/NHS-aligned channels sometimes diverge from Australian guidelines on therapeutics, PBS, and cultural-safety framing.",
  },
  {
    q: "What's an Australian-context pitfall that catches international IMGs out?",
    a: "Therapeutics. UK-trained IMGs often default to NICE-aligned first-line agents that are not PBS-listed in Australia. Indian and Pakistani IMGs sometimes default to drugs that aren't current-line in Therapeutic Guidelines (eTG). The fix is drilling Australian-context MCQs and cross-checking every plan you propose against eTG and PBS during prep.",
  },
  {
    q: "How should I use the reading minute outside the station?",
    a: "Read the candidate task three times. Identify (a) the presenting complaint, (b) the explicit task — history-taking, counselling, procedural — and (c) any constraints or red flags hinted at in the stem. Pre-load your structure: which framework you'll use, what differentials you must rule out, what you'll likely need to say at closure. The minute is for planning, not panicking.",
  },
  {
    q: "Do I need to do all OSCE stations on real patients before the exam?",
    a: "No. Real patients are useful for skill-building, but the exam tests structured behaviour under time pressure, which is best rehearsed on simulated patients. AI roleplays — especially when you record audio or video — get you reps faster than waiting for clinical placements. Use real-patient time for examination skills and procedural confidence; use simulated/AI time for time-pressured communication and structure.",
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

const learningPath = [
  {
    step: 1,
    href: "/amc-clinical-stations-guide",
    title: "AMC Clinical Stations Guide",
    desc: "Start here. The AMC OSCE has predictable station archetypes — history-taking, counselling, procedural, examination. Learn to recognise each and the marking pattern attached to it.",
    pill: "Overview",
  },
  {
    step: 2,
    href: "/calgary-cambridge-consultation",
    title: "Calgary–Cambridge Consultation Model",
    desc: "The communication backbone for every history and counselling station. Opening, gathering, providing structure, building relationship, explanation, closing — the AMC marking schemes map directly onto these moves.",
    pill: "Communication",
  },
  {
    step: 3,
    href: "/socrates-pain-history",
    title: "SOCRATES Pain History",
    desc: "Site, Onset, Character, Radiation, Associated symptoms, Timing, Exacerbating/relieving, Severity. The pain stem turns up in roughly one in three AMC OSCE history stations — internalise this until it's reflexive.",
    pill: "History",
  },
  {
    step: 4,
    href: "/spikes-protocol",
    title: "SPIKES — Breaking Bad News",
    desc: "Setting, Perception, Invitation, Knowledge, Empathy, Strategy. Counselling stations live or die on empathic structure; SPIKES gives you the move-by-move scaffold the examiner is looking for.",
    pill: "Counselling",
  },
];

export default function OsceGuidePage() {
  return (
    <main className="min-h-screen bg-[#070714] overflow-x-hidden relative text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningPathSchema) }} />
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
            OSCE Preparation · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            OSCE Guide for IMGs: How to Prepare for the AMC Clinical Exam
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          The AMC Clinical Exam is a structured OSCE — around 16 stations of 8 minutes each, marked on communication, history-taking, counselling, examination, and procedural skills. Most IMGs lose marks not on knowledge but on structure: jumping to management, missing summarisation, forgetting safety-netting at closure. This guide walks the four communication frameworks that fix that, the day-of-exam strategy that buys you back time, and the practice modules that turn the structure into reflex.
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you have cleared AMC MCQ (Part 1) and you are now staring at the clinical exam wondering where to even start, this is your map. The AMC Clinical Exam — sometimes called the MCAT — is an Objective Structured Clinical Examination, the same OSCE format used worldwide for medical assessments. It tests structured clinical behaviour under time pressure, not encyclopaedic knowledge. The fastest IMGs to pass are not the ones who read more textbooks. They are the ones who get reps under exam-like conditions, record themselves, and fix structure ruthlessly. This page is the playbook.
        </p>

        <h2>Quick answer</h2>
        <p>
          The AMC OSCE has around 16 stations of 8 minutes each. Communication, history-taking, examination, counselling, and procedural stations rotate. Marks live in <em>structure</em>: opening, agenda-setting, ICE, summarisation, safety-netting, and closure. Internalise four frameworks — Calgary–Cambridge for the consultation backbone, SOCRATES for pain, SPIKES for bad news, and ICE for every patient interaction — and you have covered roughly 80% of the marking schema. Practise on simulated patients (AI or peer), record yourself, and get to 30+ rehearsed stations before the exam. That is the playbook in one paragraph.
        </p>

        <CitationHook n={1}>
          The AMC OSCE is structured around 16 stations of 8 minutes each, marked predominantly on consultation structure — opening, agenda-setting, ICE, summarisation, safety-netting, and closure — rather than encyclopaedic medical knowledge.
        </CitationHook>

        <h2>The 4-step learning path</h2>
        <p>
          Read these four guides in order. Each is a Mostly Medicine pillar focused on one block of the AMC marking scheme. Together they cover the structural moves the examiner is actively looking for.
        </p>

        <div className="not-prose my-8 grid gap-4">
          {learningPath.map((s) => (
            <Link
              key={s.step}
              href={s.href}
              className="group relative flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-brand-500/50 hover:bg-white/[0.06] p-5 transition-all"
            >
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/20 border border-brand-500/40 text-brand-300 font-display font-bold text-lg">
                {s.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-400 bg-brand-900/40 border border-brand-700/40 px-2 py-0.5 rounded-full">
                    {s.pill}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                <p className="mt-2 text-xs font-semibold text-brand-400 group-hover:text-brand-300">
                  Read the guide →
                </p>
              </div>
            </Link>
          ))}
        </div>

        <h2>Other frameworks worth memorising</h2>
        <p>
          The four pillar guides cover the most-tested moves. These shorter mnemonics fill specific gaps.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Mnemonic</th>
                <th className="px-4 py-3 font-semibold">Use case</th>
                <th className="px-4 py-3 font-semibold">What it stands for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">ICE</td>
                <td className="px-4 py-3">Every consultation</td>
                <td className="px-4 py-3">Ideas · Concerns · Expectations</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">BATHE</td>
                <td className="px-4 py-3">Brief psychosocial screen</td>
                <td className="px-4 py-3">Background · Affect · Trouble · Handling · Empathy</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">NURSE</td>
                <td className="px-4 py-3">Responding to emotion</td>
                <td className="px-4 py-3">Name · Understand · Respect · Support · Explore</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">HEEADSSS</td>
                <td className="px-4 py-3">Adolescent psychosocial</td>
                <td className="px-4 py-3">Home · Education · Eating · Activities · Drugs · Sex · Safety · Suicidality</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">CAGE</td>
                <td className="px-4 py-3">Alcohol screening</td>
                <td className="px-4 py-3">Cut down · Annoyed · Guilty · Eye-opener</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">MSE</td>
                <td className="px-4 py-3">Psychiatric station</td>
                <td className="px-4 py-3">Appearance · Behaviour · Speech · Mood/affect · Thought · Perception · Cognition · Insight · Judgement</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CitationHook n={2}>
          Three communication patterns dominate IMG mark losses in AMC OSCE stations: jumping to investigations before adequate history, failing to summarise back to the patient, and missing safety-netting at closure. None are knowledge gaps; all three are habit gaps that simulated practice fixes.
        </CitationHook>

        <h2>Day-of-exam strategy</h2>
        <p>
          Strategy on exam day is the single highest-yield part of preparation that almost no candidate practises explicitly. The structure that wins:
        </p>

        <h3>Use the reading minute deliberately</h3>
        <p>
          Before each station, you usually get a brief reading minute outside the door. Read the candidate task three times. Identify the <strong>presenting complaint</strong>, the <strong>explicit task</strong> (history-taking, counselling, examination, procedural), and any <strong>constraints or red flags</strong> hinted at in the stem. Pre-load your opening sentence. Decide which framework you will lean on. The minute is for planning, not panic.
        </p>

        <h3>Open with structure, not warmth alone</h3>
        <p>
          Confirm the patient&apos;s name, introduce yourself with role, set an explicit agenda (&ldquo;I&apos;d like to ask you some questions about the headache, do a brief examination, and then we can talk about what to do next — does that work?&rdquo;), and obtain consent. Warmth without agenda-setting reads as drift to an examiner. Structure with warmth is the marking sweet spot.
        </p>

        <h3>Time-budget the 8 minutes</h3>
        <p>
          A useful default for a history-taking station: ~3 minutes for the focused history including ICE, ~1 minute for relevant differential narrowing, ~2 minutes for explanation/planning, ~1 minute for summary + safety-netting + closure, with a 1-minute buffer. The exact split varies by station archetype (counselling stations skew toward exploration and empathy, procedural stations skew toward execution and explanation), but a candidate without a time plan ends up over-running history and skipping closure. The closure is where summarisation, safety-netting, and shared decision-making sit — it is heavily marked.
        </p>

        <h3>Recover from blanks fast</h3>
        <p>
          If you draw a blank mid-station, fall back on structure. Summarise what you have so far back to the patient (&ldquo;Just to recap what you&apos;ve told me…&rdquo;) — this buys you 20–30 seconds, often re-orients you, and is itself worth marks. Never stand silent. Examiners can tell the difference between a thinking pause and a frozen pause.
        </p>

        <h3>Treat each station independently</h3>
        <p>
          A station you felt went badly is often not as bad as you think — and even if it was, the next station is graded fresh. The single most expensive mental error in OSCE day is letting one bad station bleed into the next. After the bell, breathe, walk to the next door, read the task three times, reset.
        </p>

        <h2>Australian-context pitfalls</h2>
        <p>
          The AMC OSCE is not a generic OSCE. It is graded on Australian clinical norms, and certain habits travel poorly across borders. Three patterns we see repeatedly:
        </p>

        <h3>Therapeutics that are not PBS-listed first-line</h3>
        <p>
          UK-trained IMGs default to NICE first-line agents. Indian and Pakistani IMGs sometimes default to a drug that is not current-line in eTG. Confirm every management plan against the <a href="https://www.tg.org.au" target="_blank" rel="noopener noreferrer">Therapeutic Guidelines</a> and the <a href="https://amh.net.au" target="_blank" rel="noopener noreferrer">Australian Medicines Handbook</a> during prep. PBS listing is also marked — if you propose a non-PBS agent without acknowledging cost or alternatives, you lose marks for shared decision-making.
        </p>

        <h3>Patient autonomy framing</h3>
        <p>
          Australian consultation culture is markedly more autonomy-forward than many home country norms. Phrases like &ldquo;you should…&rdquo; or &ldquo;I want you to…&rdquo; read as paternalistic. The marking is on shared decision-making — &ldquo;there are a few options here, including X, Y, and Z. What matters most to you about how we approach this?&rdquo; The shift from instructive to collaborative is one of the highest-leverage rehearsals an IMG can do.
        </p>

        <h3>Cultural safety and Aboriginal and Torres Strait Islander health</h3>
        <p>
          The MBA&apos;s Cultural Safety Strategy 2020–2025 is a free, short read on <a href="https://www.medicalboard.gov.au" target="_blank" rel="noopener noreferrer">medicalboard.gov.au</a> and directly improves your communication scores. Stations sometimes test for cultural-safety-aware language without flagging it as a cultural-safety station — a candidate who drops &ldquo;is there anything about your background or family I should know about that would help me look after you better?&rdquo; into a relevant moment scores marks the next candidate misses entirely.
        </p>

        <CitationHook n={3}>
          AMC OSCE marking is graded on Australian clinical norms — PBS-listed therapeutics, RACGP/eTG guideline alignment, autonomy-forward consultation culture, and cultural-safety-aware language. Generic OSCE preparation that ignores these context factors leaves predictable marks on the table.
        </CitationHook>

        <h2>Practise in voice mode — get reps fast</h2>
        <p>
          Knowledge alone does not pass an OSCE. Reps under time pressure do. Mostly Medicine offers three layered practice modules; use them in this order:
        </p>

        <div className="not-prose my-6 grid sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/cat2"
            className="group rounded-2xl border border-pink-800/40 bg-gradient-to-br from-pink-950/60 to-slate-900/60 hover:border-pink-500/60 hover:from-pink-950/80 p-5 transition-all"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-pink-300 mb-2">Step 1 · Handbook scenarios</p>
            <h3 className="text-base font-semibold text-white mb-1">AMC Handbook AI RolePlay</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Official MCAT scenarios with AI patients. Voice mode, examiner-grade feedback. Free plan: 2/day.
            </p>
            <p className="mt-3 text-xs font-semibold text-pink-300 group-hover:text-pink-200">Open module →</p>
          </Link>
          <Link
            href="/dashboard/ai-roleplay"
            className="group rounded-2xl border border-fuchsia-800/40 bg-gradient-to-br from-fuchsia-950/60 to-slate-900/60 hover:border-fuchsia-500/60 hover:from-fuchsia-950/80 p-5 transition-all"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-300 mb-2">Step 2 · Beyond handbook</p>
            <h3 className="text-base font-semibold text-white mb-1">AMC Clinical AI RolePlay</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Synthesised scenarios beyond the handbook. Variable difficulty. Free plan: 1/day.
            </p>
            <p className="mt-3 text-xs font-semibold text-fuchsia-300 group-hover:text-fuchsia-200">Open module →</p>
          </Link>
          <Link
            href="/dashboard/ai-roleplay/live"
            className="group rounded-2xl border border-rose-800/40 bg-gradient-to-br from-rose-950/60 to-slate-900/60 hover:border-rose-500/60 hover:from-rose-950/80 p-5 transition-all"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-2">Step 3 · Live peer</p>
            <h3 className="text-base font-semibold text-white mb-1">AMC Peer RolePlay</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pair with another IMG over live video. Real candidate, real feedback, station-style.
            </p>
            <p className="mt-3 text-xs font-semibold text-rose-300 group-hover:text-rose-200">Open module →</p>
          </Link>
          <Link
            href="/try-amc-clinical-roleplay"
            className="group rounded-2xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950/60 to-slate-900/60 hover:border-emerald-500/60 hover:from-emerald-950/80 p-5 transition-all"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-2">No signup · Try first</p>
            <h3 className="text-base font-semibold text-white mb-1">Free taste — no signup</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              5-turn chest pain scenario, runs entirely without an account. See the format before you commit.
            </p>
            <p className="mt-3 text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">Try it now →</p>
          </Link>
        </div>

        <CitationHook n={4}>
          Across IMGs preparing for AMC on Mostly Medicine, 30+ recorded station rehearsals is the threshold above which first-attempt OSCE pass rates rise meaningfully. Recording yourself on video — and watching the playback — is where the structural fixes happen.
        </CitationHook>

        <h2>Free third-party video resources</h2>
        <p>
          Video walkthroughs are useful supplements but not substitutes for live reps. The widely-used free channels are listed below by name. Always cross-check therapeutics, drug names, and consultation framing against current Australian guidelines — UK and US channels diverge from AMC marking on multiple points.
        </p>

        <ul>
          <li>
            <strong>Geeky Medics</strong> (<a href="https://geekymedics.com" target="_blank" rel="noopener noreferrer">geekymedics.com</a>) — UK-focused, comprehensive station-by-station walkthroughs. Strong on structure; cross-check therapeutics against eTG.
          </li>
          <li>
            <strong>OSCE Stop</strong> (<a href="https://oscestop.com" target="_blank" rel="noopener noreferrer">oscestop.com</a>) — UK MRCS/MRCP-style walkthroughs. Good for examination technique demonstrations.
          </li>
          <li>
            <strong>The Australian Medical Council</strong> (<a href="https://www.amc.org.au" target="_blank" rel="noopener noreferrer">amc.org.au</a>) — official MCAT preparation video library and orientation videos. Authoritative for AMC-specific marking and station structure.
          </li>
          <li>
            <strong>RACGP exam preparation resources</strong> (<a href="https://www.racgp.org.au" target="_blank" rel="noopener noreferrer">racgp.org.au</a>) — primary care–oriented station resources, useful for the GP/community-medicine flavour of many AMC stations.
          </li>
        </ul>

        <p>
          Once you have watched a walkthrough, do not stop there. Open <Link href="/dashboard/cat2">AMC Handbook RolePlay</Link>, mirror the framework on a live AI patient, and record yourself. Watching is not the same as doing.
        </p>

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
          <p><strong className="text-slate-400">Last reviewed:</strong> 4 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 4 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC pass-graduate IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://www.amc.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medical Council — clinical exam information</a></li>
            <li><a href="https://www.medicalboard.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Medical Board of Australia — Cultural Safety Strategy</a></li>
            <li><a href="https://www.tg.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Therapeutic Guidelines (eTG)</a></li>
            <li><a href="https://amh.net.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medicines Handbook (AMH)</a></li>
            <li><a href="https://www.racgp.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Royal Australian College of General Practitioners (RACGP)</a></li>
            <li><a href="https://geekymedics.com" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Geeky Medics — third-party OSCE walkthroughs</a></li>
            <li><a href="https://oscestop.com" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">OSCE Stop — third-party station resources</a></li>
          </ul>
        </div>
      </article>
    </main>
  );
}
