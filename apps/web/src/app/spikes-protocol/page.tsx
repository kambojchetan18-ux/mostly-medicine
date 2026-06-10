import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/spikes-protocol`;
const TITLE = "SPIKES Protocol — Breaking Bad News for AMC Handbook AI RolePlay (2026)";
const DESCRIPTION =
  "Master the SPIKES protocol for breaking bad news in AMC Handbook AI RolePlay counselling stations. Setup, Perception, Invitation, Knowledge, Emotions, Strategy explained with example phrases for IMG candidates.";

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
    { "@type": "Thing", name: "SPIKES protocol" },
    { "@type": "Thing", name: "Breaking bad news" },
    { "@type": "Thing", name: "AMC Handbook AI RolePlay clinical exam" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "SPIKES Protocol", item: PAGE_URL },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to break bad news using the SPIKES protocol",
  description:
    "A six-step framework for delivering bad news to patients in a structured, empathetic way — used in AMC Handbook AI RolePlay counselling stations.",
  totalTime: "PT8M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Setup",
      text: "Arrange a private, quiet setting. Ensure tissues are available, sit at eye level, silence your pager, and invite a support person if appropriate.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Perception",
      text: "Ask the patient what they already know about their condition. Use open questions such as 'What have you been told so far?' to calibrate.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Invitation",
      text: "Ask permission to share information and check how much detail the patient wants to receive.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Knowledge",
      text: "Give a warning shot, then deliver the news in plain language, in small chunks, and pause for understanding.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Emotions",
      text: "Acknowledge and validate emotional responses with empathic statements. Allow silence and respond to feelings before facts.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Strategy and Summary",
      text: "Agree a clear next-step plan, summarise key information, offer written resources, and arrange follow-up.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does SPIKES stand for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SPIKES stands for Setup, Perception, Invitation, Knowledge, Emotions, and Strategy/Summary. It is a six-step protocol developed by Baile and Buckman for delivering bad news.",
      },
    },
    {
      "@type": "Question",
      name: "Is SPIKES tested in the AMC Handbook AI RolePlay exam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AMC Handbook AI RolePlay counselling stations frequently require the candidate to break bad news (e.g., new cancer diagnosis, miscarriage, terminal prognosis). Examiners mark on communication and empathy, and SPIKES provides a defensible structure.",
      },
    },
    {
      "@type": "Question",
      name: "How do I deliver a 'warning shot' in SPIKES?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A warning shot is a short signalling phrase that prepares the patient for difficult news, such as 'I'm afraid the results are not what we were hoping for.' It gives the patient a moment to brace before details arrive.",
      },
    },
    {
      "@type": "Question",
      name: "What empathic statements work in the Emotions step?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use NURSE statements: Name the emotion, Understand it, Respect it, Support, Explore. Examples include 'I can see this is overwhelming' and 'Anyone in your position would feel shocked.'",
      },
    },
    {
      "@type": "Question",
      name: "How long should a SPIKES consultation take in AMC Handbook AI RolePlay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AMC Handbook AI RolePlay stations are around 8 minutes. Aim to spend roughly one minute on Setup and Perception combined, two minutes on Knowledge, three minutes on Emotions, and the remaining time on Strategy and Summary.",
      },
    },
    {
      "@type": "Question",
      name: "Can SPIKES be used outside of cancer diagnoses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. SPIKES applies to any difficult conversation — pregnancy loss, genetic disease, treatment failure, end-of-life discussions, unexpected death notification, and even disclosing medical errors.",
      },
    },
  ],
};

export default function SpikesProtocolPage() {
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

      <article className="max-w-3xl mx-auto px-6 sm:px-10 pb-24 prose prose-invert prose-headings:font-display prose-h1:text-4xl sm:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-a:text-brand-400 hover:prose-a:text-brand-300">
        <header className="mt-8 mb-12">
          <p className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-3">
            AMC Handbook AI RolePlay Frameworks · Updated 2026
          </p>
          <h1 className="font-display font-bold mb-4">
            SPIKES Protocol: Breaking Bad News in AMC Handbook AI RolePlay Stations
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            A six-step communication framework every IMG should drill before the
            AMC clinical exam. Learn each step with example phrases an examinee
            can deliver under pressure in eight minutes.
          </p>
        </header>

        <section>
          <h2>Why SPIKES matters in AMC Handbook AI RolePlay</h2>
          <p>
            In <Link href="/dashboard/cat2">AMC Handbook AI RolePlay counselling stations</Link>,
            you will routinely be asked to break bad news — a new cancer
            diagnosis, a miscarriage, a positive HIV test, a terminal prognosis,
            or news of an unexpected death. Examiners assess <strong>communication</strong>{" "}
            and <strong>professionalism</strong> as much as clinical content. A
            structured framework prevents you from rushing facts before the
            patient is ready, which is the most common reason candidates fail
            counselling stations.
          </p>
          <p>
            SPIKES, developed by Baile and Buckman in 2000, is the most widely
            taught protocol for these conversations and maps cleanly to AMC
            marking domains.
          </p>
        </section>

        <section>
          <h2>The six steps of SPIKES</h2>
          <ol>
            <li>
              <strong>S — Setup.</strong> Arrange the environment before talking.
              Sit at eye level, ensure privacy, silence your pager, and offer
              tissues. Ask if the patient would like a support person present.
              <br />
              <em>
                &quot;Before we begin, would you like your husband to join us? I
                want to make sure we have privacy and time.&quot;
              </em>
            </li>
            <li>
              <strong>P — Perception.</strong> Find out what the patient already
              knows or suspects. This calibrates your language and avoids
              repeating or contradicting earlier clinicians.
              <br />
              <em>
                &quot;What have you been told about why we ordered the
                biopsy?&quot;
              </em>
            </li>
            <li>
              <strong>I — Invitation.</strong> Ask permission to share results
              and check how much information they want.
              <br />
              <em>
                &quot;Are you the kind of person who likes all the medical
                detail, or would you prefer the broad picture first?&quot;
              </em>
            </li>
            <li>
              <strong>K — Knowledge.</strong> Deliver a warning shot, then share
              the news in small chunks of plain English. Pause frequently.
              Avoid jargon.
              <br />
              <em>
                &quot;I&apos;m afraid the news is not what we were hoping for.
                The biopsy has shown cancer cells in the breast tissue.&quot;
              </em>
            </li>
            <li>
              <strong>E — Emotions.</strong> Respond to feelings before facts.
              Use NURSE statements (Name, Understand, Respect, Support,
              Explore). Allow silence.
              <br />
              <em>
                &quot;I can see this is a huge shock. Take whatever time you
                need. I&apos;m here.&quot;
              </em>
            </li>
            <li>
              <strong>S — Strategy and Summary.</strong> Agree clear next steps
              once the patient is ready. Summarise, offer written information,
              and arrange follow-up.
              <br />
              <em>
                &quot;Our next step is a referral to the breast surgeon this
                week. I&apos;ll write everything down and we&apos;ll meet again
                in three days. What questions do you have right now?&quot;
              </em>
            </li>
          </ol>
        </section>

        <section>
          <h2>Timing inside an 8-minute station</h2>
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>Approximate time</th>
                <th>Key examiner cue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Setup &amp; Perception</td>
                <td>1 minute</td>
                <td>Privacy, sitting, opens with patient&apos;s understanding</td>
              </tr>
              <tr>
                <td>Invitation</td>
                <td>30 seconds</td>
                <td>Asks permission before sharing</td>
              </tr>
              <tr>
                <td>Knowledge</td>
                <td>2 minutes</td>
                <td>Warning shot, plain English, chunks</td>
              </tr>
              <tr>
                <td>Emotions</td>
                <td>2–3 minutes</td>
                <td>Names emotion, allows silence, validates</td>
              </tr>
              <tr>
                <td>Strategy &amp; Summary</td>
                <td>1–2 minutes</td>
                <td>Concrete next step, written info, follow-up</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Common mistakes IMGs make</h2>
          <ul>
            <li>Rushing into Knowledge before assessing perception or invitation.</li>
            <li>Using jargon (&quot;malignancy&quot;, &quot;metastasis&quot;) without translation.</li>
            <li>Filling silence with facts when the patient needs space.</li>
            <li>Forgetting to arrange follow-up — examiners explicitly mark for safety-netting.</li>
            <li>Closing too early without checking understanding.</li>
          </ul>
        </section>

        <section>
          <h2>Practise SPIKES with AI feedback</h2>
          <p>
            Mostly Medicine offers AI-powered counselling roleplays where you
            speak the consultation aloud and receive examiner-style feedback
            mapped to AMC domains. SPIKES is built into the marking rubric.
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

          <h3>What does SPIKES stand for?</h3>
          <p>
            Setup, Perception, Invitation, Knowledge, Emotions, and
            Strategy/Summary — a six-step protocol developed by Baile and
            Buckman in 2000.
          </p>

          <h3>Is SPIKES tested in the AMC Handbook AI RolePlay exam?</h3>
          <p>
            Yes. Counselling stations involving bad news are a standard AMC Handbook AI RolePlay
            station type, and a SPIKES-style structure is the safest approach.
          </p>

          <h3>How do I deliver a warning shot?</h3>
          <p>
            Use a short signalling phrase that prepares the patient: &quot;I&apos;m
            afraid the results are not what we were hoping for.&quot; Pause
            briefly before details.
          </p>

          <h3>Which empathic statements work best?</h3>
          <p>
            NURSE statements — Naming the emotion, Understanding it, Respecting
            it, Supporting, Exploring. Combine with deliberate silence.
          </p>

          <h3>How do I close a SPIKES consultation in 8 minutes?</h3>
          <p>
            Summarise in two sentences, agree one concrete next step, offer
            written information, and confirm a follow-up time. Then ask &quot;What
            questions do you have right now?&quot;
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
