import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-cat2`;
const TITLE = "AMC Handbook AI RolePlay (MCAT) Clinical Exam 2026 — Stations, Domains, 8-Min Strategy";
const DESCRIPTION =
  "In-depth guide to AMC Handbook AI RolePlay — the multi-station clinical assessment (MCAT). Station types, four marking domains, 8-minute timing strategy, Calgary-Cambridge, SPIKES, and SOCRATES frameworks. Built for IMGs preparing for Australian medical registration.";

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
    { "@type": "Thing", name: "AMC Handbook AI RolePlay" },
    { "@type": "Thing", name: "Multi-station Clinical Assessment Tool" },
    { "@type": "Thing", name: "OSCE" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC Exam Guide", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC Handbook AI RolePlay", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many stations are on AMC Handbook AI RolePlay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AMC Handbook AI RolePlay (MCAT) typically consists of 16 active stations, with one or two pilot stations that are unscored but indistinguishable from the rest. Each scored station is 8 minutes long with a 2-minute reading interval.",
      },
    },
    {
      "@type": "Question",
      name: "What are the four marking domains in AMC Handbook AI RolePlay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The four AMC domains are: data gathering (history and examination), clinical reasoning (diagnosis, differentials, investigation/management plan), communication (rapport, structure, plain language), and professionalism (ethics, safety, cultural awareness, respectful conduct).",
      },
    },
    {
      "@type": "Question",
      name: "What frameworks should I use in AMC Handbook AI RolePlay stations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Calgary-Cambridge for the overall consultation structure, SOCRATES for pain history, SPIKES for breaking bad news, ICE (Ideas, Concerns, Expectations) for shared decision-making, and the ABCDE primary survey for emergency stations. Internalising these makes the 8-minute window manageable.",
      },
    },
    {
      "@type": "Question",
      name: "How is AMC Handbook AI RolePlay scored?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each station is scored independently against domain-specific criteria. Candidates must achieve a minimum standard across stations as set by modified Angoff or borderline-regression methods. A weak performance in one or two stations can be compensated by strong performance elsewhere, but consistent weakness in any single domain (especially communication or professionalism) is harder to compensate.",
      },
    },
    {
      "@type": "Question",
      name: "How do I practice for AMC Handbook AI RolePlay if I cannot attend a course?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pair-up roleplay with another IMG over video, time each station strictly to 8 minutes, and rotate roles (candidate, simulated patient, examiner with marking sheet). Mostly Medicine offers AI-powered roleplay with examiner-grade feedback that scores against the AMC marking domains, accessible 24/7.",
      },
    },
    {
      "@type": "Question",
      name: "What is the pass rate for AMC Handbook AI RolePlay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "First-sitting pass rates for AMC Handbook AI RolePlay typically sit between 40% and 60%. Candidates who fail almost always cite communication and time management as the primary cause, not knowledge gaps.",
      },
    },
    {
      "@type": "Question",
      name: "Where is AMC Handbook AI RolePlay held?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AMC Handbook AI RolePlay is delivered in person at the AMC's National Test Centre in Melbourne and at approved sites including Adelaide, Perth, Sydney, and Brisbane. Capacity is limited; bookings open quarterly. Refer to amc.org.au for current dates.",
      },
    },
  ],
};

export default function AmcCat2Page() {
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
            AMC Handbook AI RolePlay Deep Dive · Updated 2026
          </p>
          <h1 className="font-display font-bold mb-4">
            AMC Handbook AI RolePlay (MCAT): The Clinical Exam Mastery Guide
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Station types, the four marking domains, 8-minute timing strategy,
            and the consultation frameworks — Calgary-Cambridge, SPIKES,
            SOCRATES — that turn nervous candidates into confident ones.
          </p>
        </header>

        <section>
          <h2>What is AMC Handbook AI RolePlay?</h2>
          <p>
            <strong>AMC Handbook AI RolePlay</strong>, formally the{" "}
            <strong>Multi-station Clinical Assessment Tool (MCAT)</strong>, is
            the second of the AMC&apos;s two assessments for International
            Medical Graduates seeking general medical registration in Australia.
            It is an in-person, multi-station OSCE that simulates real Australian
            clinical encounters across the breadth of intern-level practice.
          </p>
          <p>
            Where{" "}
            <Link href="/amc-cat1">AMC MCQ</Link>{" "}
            tests medical knowledge, AMC Handbook AI RolePlay tests <strong>applied clinical
            performance</strong> — what you actually do in the room with a
            patient under time pressure.
          </p>
        </section>

        <section>
          <h2>Exam format at a glance</h2>
          <ul>
            <li>
              <strong>Stations:</strong> ~16 scored stations, plus 1–2 unscored
              pilots indistinguishable to candidates.
            </li>
            <li>
              <strong>Time per station:</strong> 8 minutes active + 2 minutes
              reading the door notes.
            </li>
            <li>
              <strong>Total duration:</strong> Approximately 3.5 hours
              including rotations and breaks.
            </li>
            <li>
              <strong>Format:</strong> Simulated patients (trained actors) and
              live AMC examiners. Some stations may include manikins for
              procedural skills.
            </li>
            <li>
              <strong>Cost (2026):</strong> Approximately AUD 3,490. Refer to{" "}
              <a href="https://www.amc.org.au" target="_blank" rel="noopener">
                amc.org.au
              </a>{" "}
              for current fees.
            </li>
          </ul>
        </section>

        <section>
          <h2>Station types</h2>
          <p>
            The AMC Handbook AI RolePlay blueprint draws from five repeating station archetypes.
            Every paper has a mix:
          </p>
          <ul>
            <li>
              <strong>History-taking:</strong> Focused history from a simulated
              patient, often presenting with an undifferentiated complaint
              (chest pain, headache, fatigue, vaginal bleeding).
            </li>
            <li>
              <strong>Focused examination:</strong> Targeted clinical exam on
              a simulated patient or manikin (cardiovascular, respiratory,
              abdominal, neurological, musculoskeletal, obstetric).
            </li>
            <li>
              <strong>Counselling:</strong> Explaining a diagnosis, breaking
              bad news, discussing treatment options, addressing patient
              concerns.
            </li>
            <li>
              <strong>Procedural skills:</strong> Demonstrating a procedure on
              a manikin (suturing, cannulation, basic life support, IM
              injection, urinary catheterisation).
            </li>
            <li>
              <strong>Clinical reasoning / management:</strong> Synthesising a
              clinical scenario, formulating a differential, and explaining the
              next investigations and management plan to the examiner or
              patient.
            </li>
          </ul>
        </section>

        <section>
          <h2>The four marking domains</h2>
          <p>
            Every AMC Handbook AI RolePlay station is scored against four domains. Examiners use
            station-specific anchored criteria, but the four headlines are
            constant:
          </p>
          <h3>1. Data gathering</h3>
          <p>
            Did you elicit the relevant history (chief complaint plus systems,
            past medical, drugs and allergies, family, social, ICE) and the
            relevant examination findings? Quality matters more than volume —
            asking 30 questions is not better than asking the right 12.
          </p>
          <h3>2. Clinical reasoning</h3>
          <p>
            Did you generate a sensible differential, prioritise the most
            likely or most dangerous diagnosis, choose appropriate
            investigations, and propose an evidence-based management plan
            consistent with Australian guidelines (RACGP, Therapeutic
            Guidelines, RANZCOG)?
          </p>
          <h3>3. Communication</h3>
          <p>
            Did you build rapport, signpost the consultation, use plain
            language (no jargon), check understanding, summarise, and close
            safely? This domain is where most failed candidates lose marks —
            even when their medical knowledge is strong.
          </p>
          <h3>4. Professionalism</h3>
          <p>
            Did you respect patient autonomy, demonstrate cultural safety
            (especially with Aboriginal and Torres Strait Islander patients),
            recognise safety issues (suicidal ideation, child protection,
            domestic violence), and act ethically (consent, confidentiality,
            mandatory reporting)?
          </p>
        </section>

        <section>
          <h2>The 8-minute timing strategy</h2>
          <p>
            Eight minutes feels long until you walk in. The successful
            candidates have a rehearsed micro-structure:
          </p>
          <ul>
            <li>
              <strong>0:00 – 0:30 — Greet &amp; orient.</strong> Introduce
              yourself, confirm patient identity, signpost the agenda
              (&quot;Today we&apos;ll talk about your symptoms, examine you,
              and discuss what to do next.&quot;).
            </li>
            <li>
              <strong>0:30 – 4:00 — Data gathering.</strong> Targeted history
              + focused exam. Leave 60 seconds buffer if the station is
              examination-heavy.
            </li>
            <li>
              <strong>4:00 – 5:30 — Synthesis.</strong> Briefly think out loud
              if appropriate, or pause to formulate.
            </li>
            <li>
              <strong>5:30 – 7:30 — Management &amp; counselling.</strong>{" "}
              Explain the working diagnosis, plan, safety-netting, and
              follow-up. Use ICE — address Ideas, Concerns, Expectations.
            </li>
            <li>
              <strong>7:30 – 8:00 — Close.</strong> Summarise, check
              understanding, invite questions, end safely.
            </li>
          </ul>
          <p>
            Practice with a stopwatch from week one. Most failures are not
            knowledge failures — they are time-allocation failures.
          </p>
        </section>

        <section>
          <h2>Frameworks that pass stations</h2>
          <h3>Calgary-Cambridge: the consultation backbone</h3>
          <p>
            The Calgary-Cambridge guide is the gold-standard structure for
            medical consultations. Five sequential phases: initiating the
            session, gathering information, physical examination, explanation
            and planning, closing the session — with two parallel threads
            running throughout: building the relationship and providing
            structure. Memorise the phases. Examiners are trained in this
            language.
          </p>
          <h3>SOCRATES: pain history in 60 seconds</h3>
          <p>
            <strong>S</strong>ite, <strong>O</strong>nset, <strong>C</strong>
            haracter, <strong>R</strong>adiation, <strong>A</strong>ssociated
            symptoms, <strong>T</strong>iming, <strong>E</strong>xacerbating/
            relieving factors, <strong>S</strong>everity. Use it for any pain
            stem and you will never miss a key feature.
          </p>
          <h3>SPIKES: breaking bad news</h3>
          <p>
            <strong>S</strong>etting, <strong>P</strong>erception (what the
            patient already knows), <strong>I</strong>nvitation (asking how
            much they want to know), <strong>K</strong>nowledge (delivering
            the information clearly), <strong>E</strong>motions (acknowledge
            and respond), <strong>S</strong>trategy and Summary. Bad-news
            stations are common — cancer diagnoses, miscarriage, terminal
            prognosis. SPIKES is non-negotiable.
          </p>
          <h3>ICE: shared decision-making</h3>
          <p>
            <strong>I</strong>deas (what does the patient think is going on),{" "}
            <strong>C</strong>oncerns (what are they worried about),{" "}
            <strong>E</strong>xpectations (what do they want from this visit).
            Picking up ICE elements is one of the fastest ways to score
            communication marks.
          </p>
        </section>

        <section>
          <h2>How to prepare</h2>
          <ol>
            <li>
              <strong>Internalise the four domains</strong> until you can name
              them under stress. Every action in a station should be deliberate
              against one of the four.
            </li>
            <li>
              <strong>Rehearse 100+ stations</strong> with timed roleplay.
              Quantity matters — examiner-grade feedback after every roleplay
              matters more.
            </li>
            <li>
              <strong>Record yourself.</strong> Watching yourself fumble a
              SPIKES station once is worth ten textbook reads.
            </li>
            <li>
              <strong>Drill procedural skills</strong> on a manikin or pillow:
              suturing, cannulation, BLS, IM injection, catheter insertion.
              Verbalise every step.
            </li>
            <li>
              <strong>Run a full mock</strong> of 16 back-to-back stations at
              least twice before the exam. Stamina matters.
            </li>
          </ol>
        </section>

        <section>
          <h2>How Mostly Medicine helps</h2>
          <ul>
            <li>
              <Link href="/dashboard/cat2">
                <strong>151+ AMC Handbook AI RolePlay clinical roleplays</strong>
              </Link>{" "}
              powered by Claude AI, each scored against the four AMC marking
              domains with detailed examiner-grade feedback.
            </li>
            <li>
              <strong>Voice-driven practice</strong> with text-to-speech
              simulated patients — train on the move, not just at a desk.
            </li>
            <li>
              <Link href="/dashboard/reference">
                <strong>Frameworks library</strong>
              </Link>{" "}
              with one-page references for Calgary-Cambridge, SPIKES,
              SOCRATES, ICE, and 20+ other rapid frameworks.
            </li>
            <li>
              <strong>Progress dashboard</strong> — track domain-level scores
              over time so you can see whether your communication is
              improving, not just your overall pass rate.
            </li>
          </ul>
          <p>
            <Link
              href="/auth/signup"
              className="inline-block mt-4 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-2xl font-bold no-underline"
            >
              Start AMC Handbook AI RolePlay roleplay free →
            </Link>
          </p>
        </section>

        <section>
          <h2>Frequently asked questions</h2>

          <h3>How many stations are there?</h3>
          <p>
            Approximately 16 scored stations plus 1 to 2 unscored pilot
            stations. Each station is 8 minutes plus 2 minutes reading.
          </p>

          <h3>What are the four domains?</h3>
          <p>
            Data gathering, clinical reasoning, communication, and
            professionalism. Every station scores all four.
          </p>

          <h3>Which frameworks matter most?</h3>
          <p>
            Calgary-Cambridge for consultation structure, SOCRATES for pain,
            SPIKES for bad news, and ICE for shared decision-making.
          </p>

          <h3>How is the exam scored overall?</h3>
          <p>
            Each station is scored independently against anchored criteria.
            The overall pass mark is set by modified Angoff or
            borderline-regression standard-setting.
          </p>

          <h3>What is the pass rate?</h3>
          <p>
            Typically 40% to 60% on first sitting. Failures most commonly
            stem from communication and time management, not knowledge gaps.
          </p>

          <h3>Where is the exam held?</h3>
          <p>
            AMC&apos;s Melbourne National Test Centre and approved sites in
            Adelaide, Perth, Sydney, and Brisbane. Capacity is limited;
            bookings open quarterly via amc.org.au.
          </p>
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500">
          <p>
            This guide is provided for educational purposes by Mostly Medicine.
            For official AMC Handbook AI RolePlay examination information, refer to{" "}
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
