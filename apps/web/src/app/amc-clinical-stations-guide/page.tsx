import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-clinical-stations-guide`;
const TITLE = "AMC Handbook AI RolePlay Clinical Stations Guide — How to Attack Each Type (2026)";
const DESCRIPTION =
  "Complete guide to AMC Handbook AI RolePlay station types: history-taking, examination, counselling, and procedural. Strategy, structure, and common mistakes for IMG candidates preparing for the Australian clinical exam.";

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
    { "@type": "Thing", name: "AMC Handbook AI RolePlay stations" },
    { "@type": "Thing", name: "Multi-station Clinical Assessment Tool" },
    { "@type": "Thing", name: "OSCE preparation" },
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
      name: "AMC Clinical Stations Guide",
      item: PAGE_URL,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many stations are in AMC Handbook AI RolePlay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AMC Handbook AI RolePlay (also called the MCAT) consists of approximately 16 stations, each lasting around 8 minutes, with rest stations interspersed. Stations cover history-taking, focused examination, counselling, and procedural skills.",
      },
    },
    {
      "@type": "Question",
      name: "What are the four main station types?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The four main AMC Handbook AI RolePlay station types are history-taking, focused physical examination, counselling and explanation, and procedural skills. Many stations combine elements (for example history followed by management discussion).",
      },
    },
    {
      "@type": "Question",
      name: "How is each station marked?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stations are marked across four domains: data gathering and clinical reasoning, communication and rapport, professionalism and safety, and management and patient education. A trained examiner uses a station-specific rubric.",
      },
    },
    {
      "@type": "Question",
      name: "How long is the reading time before each station?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Candidates have approximately 2 minutes of reading time outside each station to study the candidate instructions, then 8 minutes inside the station with the simulated patient.",
      },
    },
    {
      "@type": "Question",
      name: "Are there rest stations in AMC Handbook AI RolePlay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Rest stations are interspersed throughout the circuit to allow candidates to reset between active stations. Use rest stations to slow your breathing and refocus, not to rehearse the previous case.",
      },
    },
    {
      "@type": "Question",
      name: "What is the most common reason candidates fail AMC Handbook AI RolePlay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The most common failure mode is poor structure — candidates rush into questions without rapport, miss safety-netting at the end, or fail to address the patient's concerns explicitly. Structured frameworks like Calgary-Cambridge, SPIKES, and SOCRATES prevent these errors.",
      },
    },
  ],
};

export default function AmcClinicalStationsGuidePage() {
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
            AMC Handbook AI RolePlay Strategy · Updated 2026
          </p>
          <h1 className="font-display font-bold mb-4">
            AMC Handbook AI RolePlay Clinical Stations: How to Attack Each Type
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            A practical guide to the four AMC Handbook AI RolePlay station types — history,
            examination, counselling, and procedural — with structured
            approaches IMGs can drill before exam day.
          </p>
        </header>

        <section>
          <h2>What is AMC Handbook AI RolePlay?</h2>
          <p>
            <strong>AMC Handbook AI RolePlay</strong>, formally the{" "}
            <strong>Multi-station Clinical Assessment Tool (MCAT)</strong>, is
            the clinical examination component of the AMC pathway. Candidates
            rotate through approximately 16 stations of around 8 minutes each
            with simulated patients (trained actors) and an examiner. Rest
            stations are interspersed.
          </p>
          <p>
            Stations test the four core competencies of an Australian intern:
            data gathering, clinical reasoning, communication, and
            professionalism. Almost every station combines two or more of these
            tasks — a pure &quot;just take a history&quot; station is rare.
          </p>
        </section>

        <section>
          <h2>The four station types</h2>
          <table>
            <thead>
              <tr>
                <th>Station type</th>
                <th>What you do</th>
                <th>Frameworks to use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>History-taking</td>
                <td>
                  Take a focused history, present a differential, suggest next
                  investigations.
                </td>
                <td>
                  <Link href="/calgary-cambridge-consultation">Calgary-Cambridge</Link>,{" "}
                  <Link href="/socrates-pain-history">SOCRATES</Link>
                </td>
              </tr>
              <tr>
                <td>Examination</td>
                <td>
                  Perform a focused physical examination on a real or simulated
                  patient, verbalise findings.
                </td>
                <td>Inspect-Palpate-Percuss-Auscultate, system-specific drills</td>
              </tr>
              <tr>
                <td>Counselling</td>
                <td>
                  Break bad news, explain a diagnosis, discuss management or
                  consent.
                </td>
                <td>
                  <Link href="/spikes-protocol">SPIKES</Link>, ICE, shared
                  decision-making
                </td>
              </tr>
              <tr>
                <td>Procedural</td>
                <td>
                  Perform a clinical skill on a manikin or simulator, often
                  with explanation.
                </td>
                <td>Consent-Prepare-Perform-Post-procedure framework</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>1. How to attack a history-taking station</h2>
          <ol>
            <li>
              <strong>Read the candidate instructions twice.</strong> Note the
              setting, patient demographics, presenting complaint, and the
              specific tasks (history only? differential? plan?).
            </li>
            <li>
              <strong>Open with Calgary-Cambridge initiation.</strong> Greet,
              introduce, confirm identity, ask the opening open question.
            </li>
            <li>
              <strong>Funnel from open to closed.</strong> For pain, drive
              SOCRATES. For symptoms (cough, dyspnoea, headache), use a
              system-specific framework.
            </li>
            <li>
              <strong>Cover background.</strong> Past history, medications,
              allergies, family, social, systems review.
            </li>
            <li>
              <strong>Elicit ICE.</strong> Ideas, Concerns, Expectations.
            </li>
            <li>
              <strong>Summarise and signpost.</strong>{" "}
              <em>
                &quot;To summarise, you have crushing central chest pain
                radiating to the left arm with sweating. Let me now suggest a
                plan.&quot;
              </em>
            </li>
          </ol>
        </section>

        <section>
          <h2>2. How to attack an examination station</h2>
          <ol>
            <li>
              <strong>Wash hands.</strong> Examiners watch for this from the
              moment you enter.
            </li>
            <li>
              <strong>Introduce, consent, expose appropriately.</strong> Offer
              a chaperone if relevant.
            </li>
            <li>
              <strong>Run the system drill.</strong> Inspection from the end of
              the bed, then peripheral signs, then the system itself
              (cardiovascular, respiratory, abdominal, neurological).
            </li>
            <li>
              <strong>Verbalise positive and negative findings.</strong>{" "}
              <em>
                &quot;The JVP is not raised, there are no peripheral oedema, and
                the apex beat is undisplaced.&quot;
              </em>
            </li>
            <li>
              <strong>Offer to complete the examination.</strong> Mention what
              you would also like to do (BP, urinalysis, fundoscopy) before
              presenting findings.
            </li>
            <li>
              <strong>Present a clear differential and next investigation.</strong>
            </li>
          </ol>
        </section>

        <section>
          <h2>3. How to attack a counselling station</h2>
          <ol>
            <li>
              <strong>Identify the task.</strong> Bad news? Explanation?
              Consent? Each has a different optimal framework.
            </li>
            <li>
              <strong>Use SPIKES for bad news.</strong> Setup, Perception,
              Invitation, Knowledge, Emotions, Strategy/Summary.
            </li>
            <li>
              <strong>Use chunk-and-check for explanations.</strong> Avoid
              monologues longer than two sentences without confirming
              understanding.
            </li>
            <li>
              <strong>Address ICE explicitly.</strong> Reference the patient&apos;s
              concerns by name.
            </li>
            <li>
              <strong>Safety-net.</strong> State concrete red flags that should
              prompt return, and confirm follow-up.
            </li>
            <li>
              <strong>Offer written information and finish on a check.</strong>{" "}
              <em>&quot;What other questions do you have for me today?&quot;</em>
            </li>
          </ol>
        </section>

        <section>
          <h2>4. How to attack a procedural station</h2>
          <ol>
            <li>
              <strong>Identify yourself, the patient, the procedure, and indications.</strong>
            </li>
            <li>
              <strong>Take focused consent.</strong> Benefits, risks (common,
              serious), alternatives, what to expect.
            </li>
            <li>
              <strong>Prepare.</strong> Hand hygiene, sterile field, equipment
              check, positioning, analgesia.
            </li>
            <li>
              <strong>Perform.</strong> Narrate each step. Maintain dignity and
              communicate with the patient throughout.
            </li>
            <li>
              <strong>Post-procedure care.</strong> Dispose sharps safely,
              document, brief the patient on what to expect next.
            </li>
            <li>
              <strong>Safety-net and arrange follow-up.</strong>
            </li>
          </ol>
          <p>
            Common procedural stations include male and female catheterisation,
            IV cannulation, suturing, ABG/venepuncture, NG tube insertion, and
            paediatric basic life support.
          </p>
        </section>

        <section>
          <h2>Time management inside an 8-minute station</h2>
          <table>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Approximate time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Initiation (greeting, introduction, opening)</td>
                <td>30–60 seconds</td>
              </tr>
              <tr>
                <td>Core task (history, exam, counselling, procedure)</td>
                <td>4–5 minutes</td>
              </tr>
              <tr>
                <td>Explanation, planning, shared decision-making</td>
                <td>1–2 minutes</td>
              </tr>
              <tr>
                <td>Summary, safety-net, closing</td>
                <td>1 minute</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Top six mistakes IMGs make</h2>
          <ol>
            <li>Skipping initiation and jumping straight into questioning.</li>
            <li>Using medical jargon without translating it.</li>
            <li>Forgetting ICE — the single biggest communication marker.</li>
            <li>Failing to safety-net at the end of every station.</li>
            <li>Running out of time because the consultation lacked structure.</li>
            <li>
              Letting one bad station bleed into the next — every station is
              independent and forgettable.
            </li>
          </ol>
        </section>

        <section>
          <h2>How Mostly Medicine prepares you</h2>
          <p>
            <Link href="/dashboard/cat2">Mostly Medicine&apos;s AMC Handbook AI RolePlay module</Link>{" "}
            offers AI-powered clinical roleplays across all four station types,
            with examiner-grade feedback mapped to AMC marking domains. You can
            simulate full exam-day circuits with back-to-back stations and
            track your progress by domain over time.
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

          <h3>How many stations are in AMC Handbook AI RolePlay?</h3>
          <p>
            Approximately 16 active stations of around 8 minutes each, plus
            interspersed rest stations.
          </p>

          <h3>What are the four main station types?</h3>
          <p>
            History-taking, focused physical examination, counselling, and
            procedural skills. Most stations combine elements.
          </p>

          <h3>How is each station marked?</h3>
          <p>
            Across four domains: data gathering and clinical reasoning,
            communication and rapport, professionalism and safety, and
            management and patient education.
          </p>

          <h3>Can I take notes inside the station?</h3>
          <p>
            Yes — a writing surface and pen are usually provided. Use sparingly;
            constant note-taking damages eye contact and rapport.
          </p>

          <h3>What happens if I run over time?</h3>
          <p>
            The station ends abruptly when the bell rings. Practising with a
            stopwatch from day one is the only reliable fix.
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
    <SiteFooter />
    </main>
  );
}
