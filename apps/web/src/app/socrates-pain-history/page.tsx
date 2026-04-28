import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/socrates-pain-history`;
const TITLE = "SOCRATES Pain History — AMC Handbook AI RolePlay OSCE Mnemonic (2026)";
const DESCRIPTION =
  "Master the SOCRATES pain history mnemonic for AMC Handbook AI RolePlay: Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/relieving, Severity. With OSCE script examples for IMG candidates.";

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
    { "@type": "Thing", name: "SOCRATES mnemonic" },
    { "@type": "Thing", name: "Pain history" },
    { "@type": "Thing", name: "AMC clinical exam" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "SOCRATES Pain History",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to take a pain history using the SOCRATES mnemonic",
  description:
    "An eight-step pain history mnemonic that ensures comprehensive symptom analysis in AMC Handbook AI RolePlay history-taking stations.",
  totalTime: "PT4M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Site",
      text: "Ask the patient to point to where the pain is. Establish exact location, depth, and whether it is localised or diffuse.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Onset",
      text: "Ask when the pain started, whether onset was sudden or gradual, and what the patient was doing at the time.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Character",
      text: "Ask the patient to describe the pain quality — sharp, dull, burning, crushing, colicky, throbbing.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Radiation",
      text: "Ask whether the pain moves anywhere else, such as down the arm, into the back, or to the groin.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Associations",
      text: "Ask about associated symptoms — nausea, sweating, breathlessness, fever, urinary or bowel changes.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Time course",
      text: "Ask about duration, pattern, and whether it is constant, intermittent, or progressive.",
    },
    {
      "@type": "HowToStep",
      position: 7,
      name: "Exacerbating and relieving factors",
      text: "Ask what makes the pain worse or better — movement, food, position, medication, rest.",
    },
    {
      "@type": "HowToStep",
      position: 8,
      name: "Severity",
      text: "Ask the patient to rate the pain on a 0–10 scale, and compare with previous worst pains.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does SOCRATES stand for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SOCRATES is a pain history mnemonic standing for Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/relieving factors, and Severity.",
      },
    },
    {
      "@type": "Question",
      name: "When should I use SOCRATES in AMC Handbook AI RolePlay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use SOCRATES in any AMC Handbook AI RolePlay station presenting with pain — chest pain, abdominal pain, headache, back pain, joint pain. It demonstrates structured symptom analysis to examiners.",
      },
    },
    {
      "@type": "Question",
      name: "How do I ask about pain character without leading the patient?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ask 'How would you describe the pain in your own words?' rather than offering options first. If the patient struggles, give a multiple-choice prompt: 'Is it more sharp, dull, or crushing?'",
      },
    },
    {
      "@type": "Question",
      name: "Is SOCRATES enough on its own?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. SOCRATES covers symptom analysis only. After SOCRATES, complete the rest of the history — past medical history, medications, family history, social history, and a focused systems review tied to the differential.",
      },
    },
    {
      "@type": "Question",
      name: "How does SOCRATES differ from OPQRST?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OPQRST (Onset, Provocation, Quality, Radiation, Severity, Time) covers similar ground but omits Associations as an explicit step. SOCRATES is the preferred mnemonic in Australian and UK medical curricula.",
      },
    },
    {
      "@type": "Question",
      name: "Should I document SOCRATES findings to the examiner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After taking the history, present the SOCRATES summary to the examiner in one fluent sentence, then state your top differential and next investigation.",
      },
    },
  ],
};

export default function SocratesPainHistoryPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
            AMC Handbook AI RolePlay Frameworks · Updated 2026
          </p>
          <h1 className="font-display font-bold mb-4">
            SOCRATES Pain History for AMC Handbook AI RolePlay OSCE
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            The eight-step pain mnemonic every IMG must drill before the AMC
            clinical exam. Learn each step with example phrases that work in a
            real eight-minute station.
          </p>
        </header>

        <section>
          <h2>Why SOCRATES?</h2>
          <p>
            Pain is the single most common presenting complaint in{" "}
            <Link href="/dashboard/cat2">AMC Handbook AI RolePlay history-taking stations</Link>{" "}
            — chest pain, abdominal pain, headache, back pain, joint pain. A
            disorganised pain history scores poorly on data gathering even when
            the differential diagnosis is correct. SOCRATES gives you a
            reliable script that fits inside three to four minutes and
            demonstrates structure to the examiner.
          </p>
        </section>

        <section>
          <h2>The eight steps of SOCRATES</h2>
          <table>
            <thead>
              <tr>
                <th>Letter</th>
                <th>Step</th>
                <th>Example phrase</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>S</td>
                <td>Site</td>
                <td>
                  <em>&quot;Can you point to exactly where the pain is?&quot;</em>
                </td>
              </tr>
              <tr>
                <td>O</td>
                <td>Onset</td>
                <td>
                  <em>
                    &quot;When did it start, and what were you doing at the
                    time?&quot;
                  </em>
                </td>
              </tr>
              <tr>
                <td>C</td>
                <td>Character</td>
                <td>
                  <em>&quot;How would you describe the pain in your own words?&quot;</em>
                </td>
              </tr>
              <tr>
                <td>R</td>
                <td>Radiation</td>
                <td>
                  <em>&quot;Does the pain travel anywhere else?&quot;</em>
                </td>
              </tr>
              <tr>
                <td>A</td>
                <td>Associations</td>
                <td>
                  <em>
                    &quot;Have you noticed anything else with the pain — nausea,
                    sweating, shortness of breath?&quot;
                  </em>
                </td>
              </tr>
              <tr>
                <td>T</td>
                <td>Time course</td>
                <td>
                  <em>
                    &quot;Has it been constant or does it come and go? Is it
                    getting better or worse?&quot;
                  </em>
                </td>
              </tr>
              <tr>
                <td>E</td>
                <td>Exacerbating &amp; relieving</td>
                <td>
                  <em>
                    &quot;What makes it worse, and is there anything that
                    helps?&quot;
                  </em>
                </td>
              </tr>
              <tr>
                <td>S</td>
                <td>Severity</td>
                <td>
                  <em>
                    &quot;On a scale of 0 to 10, where 10 is the worst pain
                    you&apos;ve ever felt, how bad is it now?&quot;
                  </em>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>OSCE script — central chest pain</h2>
          <ol>
            <li>
              <strong>Site:</strong> &quot;Where exactly is the pain — can you
              point to it for me?&quot;
            </li>
            <li>
              <strong>Onset:</strong> &quot;When did it begin, and were you
              resting or active?&quot;
            </li>
            <li>
              <strong>Character:</strong> &quot;Is it crushing, sharp, burning,
              or something else?&quot;
            </li>
            <li>
              <strong>Radiation:</strong> &quot;Does it spread to your jaw, left
              arm, or back?&quot;
            </li>
            <li>
              <strong>Associations:</strong> &quot;Any sweating, nausea,
              shortness of breath, or palpitations?&quot;
            </li>
            <li>
              <strong>Time course:</strong> &quot;How long has it lasted? Is it
              constant or coming in waves?&quot;
            </li>
            <li>
              <strong>Exacerbating/relieving:</strong> &quot;Worse on exertion?
              Better with rest or a GTN spray?&quot;
            </li>
            <li>
              <strong>Severity:</strong> &quot;Out of 10, how would you rate
              it?&quot;
            </li>
          </ol>
        </section>

        <section>
          <h2>OSCE script — acute abdominal pain</h2>
          <ol>
            <li>
              <strong>Site:</strong> &quot;Right upper quadrant? Epigastric? Or
              shifting?&quot;
            </li>
            <li>
              <strong>Onset:</strong> &quot;Sudden (think rupture/perforation)
              or gradual (think infection)?&quot;
            </li>
            <li>
              <strong>Character:</strong> &quot;Colicky points to obstruction;
              constant points to inflammation.&quot;
            </li>
            <li>
              <strong>Radiation:</strong> &quot;To the back (pancreatitis,
              AAA), shoulder tip (diaphragmatic), groin (renal colic).&quot;
            </li>
            <li>
              <strong>Associations:</strong> &quot;Vomiting, fever, urinary or
              bowel changes, vaginal bleeding.&quot;
            </li>
            <li>
              <strong>Time course:</strong> &quot;Hours, days, intermittent
              episodes? Is it progressing?&quot;
            </li>
            <li>
              <strong>Exacerbating/relieving:</strong> &quot;Worse with food
              (peptic, biliary), relieved by leaning forward (pancreatitis)?&quot;
            </li>
            <li>
              <strong>Severity:</strong> &quot;Out of 10, and how does it
              compare to childbirth or previous pains?&quot;
            </li>
          </ol>
        </section>

        <section>
          <h2>After SOCRATES — what comes next</h2>
          <p>
            SOCRATES covers symptom analysis only. To complete a AMC Handbook AI RolePlay history
            station, follow with:
          </p>
          <ul>
            <li>Past medical and surgical history.</li>
            <li>Medications, allergies, and over-the-counter use.</li>
            <li>Family history, especially of cardiac or oncologic disease.</li>
            <li>Social history — smoking, alcohol, occupation, home support.</li>
            <li>
              A focused systems review aimed at your top differentials.
            </li>
            <li>
              ICE — ideas, concerns, expectations — from the{" "}
              <Link href="/calgary-cambridge-consultation">Calgary-Cambridge model</Link>.
            </li>
          </ul>
        </section>

        <section>
          <h2>Drill SOCRATES with AI roleplays</h2>
          <p>
            Reading a mnemonic is not the same as delivering it under pressure.
            Mostly Medicine&apos;s AI roleplays generate unlimited pain
            scenarios and grade your history-taking against AMC marking
            domains.
          </p>
          <p>
            <Link
              href="/auth/signup"
              className="inline-block mt-4 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-2xl font-bold no-underline"
            >
              Start practising free →
            </Link>
          </p>
        </section>

        <section>
          <h2>Frequently asked questions</h2>

          <h3>What does SOCRATES stand for?</h3>
          <p>
            Site, Onset, Character, Radiation, Associations, Time course,
            Exacerbating/relieving factors, Severity.
          </p>

          <h3>When should I use SOCRATES in AMC Handbook AI RolePlay?</h3>
          <p>
            In any pain-based history station. It signals structure to
            examiners and ensures you do not miss key features such as
            radiation or associations.
          </p>

          <h3>How do I avoid leading the patient?</h3>
          <p>
            Start each step with an open question. Only offer multiple-choice
            prompts (sharp, dull, crushing) if the patient is struggling to
            describe the pain.
          </p>

          <h3>Is SOCRATES enough?</h3>
          <p>
            No — it is the symptom analysis component only. Complete the rest
            of the history afterward (past history, medications, family,
            social, systems review, ICE).
          </p>

          <h3>How does SOCRATES differ from OPQRST?</h3>
          <p>
            OPQRST covers similar ground but lacks an explicit Associations
            step. SOCRATES is preferred in Australian and UK curricula.
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
