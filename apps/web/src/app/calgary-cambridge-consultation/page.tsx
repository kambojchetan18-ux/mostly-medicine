import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/calgary-cambridge-consultation`;
const TITLE = "Calgary-Cambridge Consultation Model — AMC Handbook AI RolePlay Guide (2026)";
const DESCRIPTION =
  "The Calgary-Cambridge consultation model for AMC Handbook AI RolePlay: initiating the session, gathering information, physical examination, explanation and planning, and closing. Step-by-step phrases for IMG candidates.";

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
    { "@type": "Thing", name: "Calgary-Cambridge model" },
    { "@type": "Thing", name: "Clinical communication" },
    { "@type": "Thing", name: "AMC Handbook AI RolePlay OSCE" },
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
      name: "Calgary-Cambridge Consultation",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to run a consultation using the Calgary-Cambridge model",
  description:
    "A five-stage clinical communication framework that structures consultations from greeting to closing — the gold standard taught in Australian medical schools.",
  totalTime: "PT8M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Initiating the session",
      text: "Greet the patient by name, introduce yourself with role, confirm the patient's identity, and establish the reason for the encounter using open questions.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Gathering information",
      text: "Use open-to-closed funnelling. Explore the presenting complaint, ICE (ideas, concerns, expectations), past history, medications, social and family history.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Physical examination",
      text: "Explain what you intend to examine, gain consent, maintain dignity, perform a focused examination, and verbalise findings to the examiner.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Explanation and planning",
      text: "Explain in plain language, share decisions, agree a management plan, and address the patient's ICE explicitly.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Closing the session",
      text: "Summarise, safety-net with red flags, arrange follow-up, and check the patient has no remaining questions.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Calgary-Cambridge consultation model?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Calgary-Cambridge model is a five-stage framework for medical consultations: initiating the session, gathering information, physical examination, explanation and planning, and closing the session. Two parallel tasks — providing structure and building the relationship — run throughout.",
      },
    },
    {
      "@type": "Question",
      name: "Who developed the Calgary-Cambridge model?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The model was developed in 1996 by Suzanne Kurtz and Jonathan Silverman from the universities of Calgary and Cambridge. It is now the dominant communication framework in UK and Australian medical curricula.",
      },
    },
    {
      "@type": "Question",
      name: "Is Calgary-Cambridge tested in AMC Handbook AI RolePlay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AMC Handbook AI RolePlay marking domains for communication and professionalism map directly to Calgary-Cambridge tasks. Examiners reward candidates who initiate properly, explore ICE, share decisions, and safety-net.",
      },
    },
    {
      "@type": "Question",
      name: "What is ICE in Calgary-Cambridge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ICE stands for Ideas, Concerns, and Expectations — a structured way to ask the patient what they think is happening, what worries them, and what they hope you will do. It transforms generic data gathering into patient-centred care.",
      },
    },
    {
      "@type": "Question",
      name: "How does Calgary-Cambridge differ from SOCRATES?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Calgary-Cambridge is a whole-consultation framework covering the entire patient encounter. SOCRATES is a symptom-specific mnemonic for taking a pain history, which sits inside the 'Gathering information' stage of Calgary-Cambridge.",
      },
    },
    {
      "@type": "Question",
      name: "What is open-to-closed funnelling?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open-to-closed funnelling means starting with broad open questions ('Tell me about the pain'), then narrowing to focused closed questions ('Does it radiate to your left arm?'). This builds rapport and avoids missing important detail.",
      },
    },
  ],
};

export default function CalgaryCambridgePage() {
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
            Calgary-Cambridge Consultation Model for AMC Handbook AI RolePlay
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            The five-stage consultation framework taught in every Australian
            medical school. Master this structure and your AMC Handbook AI RolePlay communication
            marks will look after themselves.
          </p>
        </header>

        <section>
          <h2>Why Calgary-Cambridge?</h2>
          <p>
            The <strong>Calgary-Cambridge guide</strong>, developed by Suzanne
            Kurtz and Jonathan Silverman in 1996, is the dominant consultation
            model in UK and Australian medical curricula. It breaks a
            consultation into five sequential stages with two parallel tasks —{" "}
            <em>providing structure</em> and <em>building the relationship</em>{" "}
            — running throughout. AMC Handbook AI RolePlay marking domains for communication
            and professionalism map directly onto its tasks, so a candidate who
            visibly follows the model will rarely fail communication.
          </p>
        </section>

        <section>
          <h2>Stage 1 — Initiating the session</h2>
          <ul>
            <li>Greet the patient by name and introduce yourself with your role.</li>
            <li>Confirm identity and demonstrate respect.</li>
            <li>
              Establish the reason for the encounter with an open question —{" "}
              <em>&quot;What brings you in today?&quot;</em>
            </li>
            <li>
              Listen for the opening statement without interrupting (golden
              minute) and screen for additional concerns —{" "}
              <em>&quot;Anything else?&quot;</em>
            </li>
            <li>Negotiate the agenda for the consultation.</li>
          </ul>
        </section>

        <section>
          <h2>Stage 2 — Gathering information</h2>
          <p>
            Use <strong>open-to-closed funnelling</strong>: start broad, then
            narrow. Explore the presenting complaint with structured mnemonics
            such as <Link href="/socrates-pain-history">SOCRATES</Link> for
            pain. Then cover background:
          </p>
          <ol>
            <li>Past medical and surgical history.</li>
            <li>Medications, allergies and adherence.</li>
            <li>Family history.</li>
            <li>Social history — smoking, alcohol, drugs, occupation, home.</li>
            <li>Systems review tailored to the differential.</li>
          </ol>
          <p>
            Critically, elicit <strong>ICE</strong> — the patient&apos;s{" "}
            <strong>Ideas</strong>, <strong>Concerns</strong>, and{" "}
            <strong>Expectations</strong>:
          </p>
          <ul>
            <li>
              <em>&quot;What do you think might be causing this?&quot;</em> (Ideas)
            </li>
            <li>
              <em>&quot;Is there something in particular you&apos;re worried about?&quot;</em>{" "}
              (Concerns)
            </li>
            <li>
              <em>&quot;What were you hoping we could do today?&quot;</em>{" "}
              (Expectations)
            </li>
          </ul>
        </section>

        <section>
          <h2>Stage 3 — Physical examination</h2>
          <p>
            Even when the station is examination-only, narrate what you would
            like to examine, why, and ask consent. Maintain dignity (cover
            sheet, chaperone offered) and verbalise findings to the examiner if
            instructed. Keep the examination focused and time-aware.
          </p>
        </section>

        <section>
          <h2>Stage 4 — Explanation and planning</h2>
          <p>
            This is where many AMC Handbook AI RolePlay candidates lose marks. Effective
            explanation involves:
          </p>
          <ol>
            <li>
              <strong>Chunking and checking.</strong> Give a small piece of
              information, pause, and confirm understanding.
            </li>
            <li>
              <strong>Plain English.</strong> Translate jargon — say &quot;blood
              clot in the lung&quot; not &quot;pulmonary embolism&quot;.
            </li>
            <li>
              <strong>Shared decision-making.</strong> Offer realistic options
              and invite the patient&apos;s preference.
            </li>
            <li>
              <strong>Address ICE explicitly.</strong> Loop back to the concerns
              they raised earlier.
            </li>
          </ol>
        </section>

        <section>
          <h2>Stage 5 — Closing the session</h2>
          <ul>
            <li>Summarise the plan in two sentences.</li>
            <li>
              <strong>Safety-net</strong>: state the red flags that should
              prompt return —{" "}
              <em>
                &quot;If the chest pain returns or you become short of breath,
                go straight to ED.&quot;
              </em>
            </li>
            <li>Arrange follow-up with a specific timeframe.</li>
            <li>Offer written information.</li>
            <li>
              Final check —{" "}
              <em>&quot;Is there anything else you wanted to ask?&quot;</em>
            </li>
          </ul>
        </section>

        <section>
          <h2>The two parallel tasks</h2>
          <p>
            Throughout all five stages, two tasks run continuously:
          </p>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>What it looks like in practice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Providing structure</td>
                <td>
                  Signpost between stages —{" "}
                  <em>&quot;Now I&apos;d like to ask about your medications.&quot;</em>{" "}
                  Summarise periodically.
                </td>
              </tr>
              <tr>
                <td>Building the relationship</td>
                <td>
                  Empathy, eye contact, calibrated body language, acknowledging
                  emotion, demonstrating respect.
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Drill the model with AI roleplays</h2>
          <p>
            Reading the framework is not enough. Mostly Medicine&apos;s{" "}
            <Link href="/dashboard/cat2">AMC Handbook AI RolePlay roleplay engine</Link>{" "}
            simulates real AMC Handbook AI RolePlay stations and grades each consultation against
            Calgary-Cambridge stages, ICE elicitation, and safety-netting.
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

          <h3>What is the Calgary-Cambridge model?</h3>
          <p>
            A five-stage consultation framework — initiating, gathering,
            examining, explaining, closing — with two parallel tasks of
            structure and relationship.
          </p>

          <h3>Who developed it?</h3>
          <p>
            Suzanne Kurtz (University of Calgary) and Jonathan Silverman
            (University of Cambridge) in 1996. Subsequent editions have
            refined the language but the structure is unchanged.
          </p>

          <h3>What is ICE?</h3>
          <p>
            Ideas, Concerns, and Expectations — three short questions that
            reveal what the patient thinks, fears, and wants. Eliciting ICE is
            the single biggest differentiator between average and excellent
            consultations.
          </p>

          <h3>How long should I spend on each stage in 8 minutes?</h3>
          <p>
            Roughly: 1 minute initiating, 3 minutes gathering, 1 minute
            examining (if relevant), 2 minutes explaining and planning, 1
            minute closing. Adjust to the station&apos;s instructions.
          </p>

          <h3>Is Calgary-Cambridge the same as the Cambridge model?</h3>
          <p>
            Yes — &quot;Cambridge model&quot; is a colloquial shorthand for the
            full Calgary-Cambridge guide.
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
