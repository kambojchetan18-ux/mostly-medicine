import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/ielts-vs-oet`;
const TITLE = "IELTS vs OET for IMGs — Which Should You Take for AHPRA / AMC?";
const DESCRIPTION =
  "Detailed 2026 comparison of IELTS Academic vs OET Medicine for International Medical Graduates: cost, format, AHPRA recognition, scoring, and which test is easier for doctors. Plus FAQ.";

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
  datePublished: "2026-04-26",
  dateModified: "2026-04-26",
  inLanguage: "en-AU",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "IELTS vs OET", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "Is OET easier than IELTS for doctors?",
    a: "Most IMGs find OET easier because the content is grounded in clinical scenarios — case notes, referral letters, doctor–patient consultations — rather than the general academic content of IELTS. If you read clinical English fluently and take histories regularly, OET will feel natural. If you have strong general academic English (university essays, research articles), IELTS may suit you.",
  },
  {
    q: "Does AHPRA accept both IELTS and OET?",
    a: "Yes. AHPRA accepts IELTS Academic (minimum 7.0 in each of the four bands) and OET (minimum grade B in each of the four sub-tests) under its English Language Skills Registration Standard. Scores must be from a single sitting (or two sittings within 6 months meeting specific rules) and no more than 2 years old at the time of application.",
  },
  {
    q: "How much does IELTS vs OET cost in 2026?",
    a: "IELTS Academic in Australia is approximately AUD 410. OET (Medicine paper) is approximately AUD 587. OET is more expensive but only requires you to study one professional context, while IELTS requires preparation across more abstract academic topics.",
  },
  {
    q: "Can I switch between IELTS and OET?",
    a: "Yes. There is no penalty for trying one and switching. Many IMGs sit IELTS first because it is cheaper and more widely available, then switch to OET if they cannot reach 7.0 in every band. AHPRA only cares about the final qualifying scores.",
  },
  {
    q: "How long are scores valid?",
    a: "Both IELTS and OET scores are valid for 2 years for AHPRA registration purposes. AMC also accepts scores up to 2 years old at the time of application. Plan your prep so your test results don't expire before you submit.",
  },
  {
    q: "Which test is more widely available?",
    a: "IELTS has thousands of test centres worldwide and runs many times per week. OET has fewer locations but offers home-based computer-delivered testing in many countries, which has narrowed the gap.",
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

const rows: { feature: string; ielts: string; oet: string }[] = [
  { feature: "Cost (Australia, 2026)", ielts: "AUD 410", oet: "AUD 587" },
  { feature: "Test length", ielts: "≈ 2h 45m", oet: "≈ 3h 0m" },
  { feature: "Sub-tests", ielts: "Listening · Reading · Writing · Speaking", oet: "Listening · Reading · Writing · Speaking (medical)" },
  { feature: "Content focus", ielts: "General academic English", oet: "Healthcare scenarios (consultations, referrals)" },
  { feature: "Minimum score for AHPRA", ielts: "7.0 in each band", oet: "B in each sub-test" },
  { feature: "Score validity", ielts: "2 years for AHPRA", oet: "2 years for AHPRA" },
  { feature: "Delivery", ielts: "Paper or computer at test centre", oet: "Computer at test centre or at home" },
  { feature: "Result turnaround", ielts: "3–13 days", oet: "≈ 16 days" },
  { feature: "Speaking format", ielts: "Face-to-face with examiner, general topics", oet: "Two clinical roleplays with patient (actor)" },
  { feature: "Writing task", ielts: "Essay (~250 words) + chart/letter", oet: "Referral letter from clinical case notes" },
  { feature: "IMG-friendliness", ielts: "Lower — abstract topics", oet: "Higher — clinical familiarity helps" },
  { feature: "AHPRA recognition", ielts: "Accepted", oet: "Accepted (often preferred)" },
];

export default function IeltsVsOetPage() {
  return (
    <main className="min-h-screen bg-[#070714] overflow-x-hidden relative text-white">
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
          <Link
            href="/auth/login"
            className="hidden sm:inline text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors font-medium"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-glow-teal hover:shadow-[0_0_40px_rgba(20,184,166,0.5)]"
          >
            Get started →
          </Link>
        </div>
      </nav>

      <article className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pb-20 prose prose-invert prose-headings:font-display prose-h1:text-4xl sm:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-a:text-brand-400 hover:prose-a:text-brand-300">
        <header className="mt-10 mb-12 not-prose">
          <p className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-3">
            English Tests for IMGs · Updated 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            IELTS vs OET for <span className="gradient-text">IMGs</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            A 2026 head-to-head comparison of the two English tests International Medical Graduates use to satisfy AHPRA, AMC and Medical Board of Australia requirements.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-brand-300 hover:text-brand-200 no-underline"
          >
            Start AMC prep free →
          </Link>
        </header>

        <section>
          <h2>Why IMGs need an English test</h2>
          <p>
            Every International Medical Graduate seeking medical registration in
            Australia must demonstrate English-language proficiency to AHPRA before
            general registration is granted. The Medical Board of Australia&apos;s
            English Language Skills Registration Standard accepts five tests, but
            two dominate the IMG experience: <strong>IELTS Academic</strong> and{" "}
            <strong>OET (Medicine)</strong>. The choice between them affects your
            cost, your timeline, and — surprisingly often — your pass rate.
          </p>
          <p>
            Both tests are accepted equally by AHPRA. There is no benefit to one
            over the other in the registration process. The differences lie in the
            content, format, and how comfortable your existing clinical English will
            feel on test day.
          </p>
        </section>

        <section>
          <h2>The short answer</h2>
          <p>
            If you take histories, write clinical notes, and consult patients in
            English every day, <strong>OET is almost always easier</strong>. Its
            material is built around exactly the work you already do — reading case
            notes, writing referrals, discussing care with simulated patients. The
            cost is higher (about AUD 587 vs AUD 410 for IELTS), but the prep time
            is usually shorter.
          </p>
          <p>
            If your English is academic rather than clinical — for example, if you
            studied or wrote research in English at university but trained in your
            local language — <strong>IELTS</strong> may suit you better. The
            reading and writing tasks resemble undergraduate academic style and
            don&apos;t require any clinical context.
          </p>
        </section>

        <section className="not-prose my-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-5">
            Comparison at a glance
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/80">
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Feature</th>
                  <th className="text-left px-4 py-3 font-semibold text-violet-300">IELTS Academic</th>
                  <th className="text-left px-4 py-3 font-semibold text-pink-300">OET (Medicine)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.feature} className={i % 2 === 0 ? "bg-slate-900/30" : "bg-slate-900/10"}>
                    <td className="px-4 py-3 font-medium text-slate-200 align-top">{r.feature}</td>
                    <td className="px-4 py-3 text-slate-400 align-top">{r.ielts}</td>
                    <td className="px-4 py-3 text-slate-400 align-top">{r.oet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Costs and turnaround approximate, April 2026. Confirm at ielts.org and occupationalenglishtest.org.
          </p>
        </section>

        <section>
          <h2>How IELTS Academic works</h2>
          <p>
            IELTS Academic is the gold standard university English exam used worldwide.
            It has four equally weighted sub-tests:
          </p>
          <ul>
            <li><strong>Listening</strong> (~30 min): four monologues and conversations on general academic and social topics.</li>
            <li><strong>Reading</strong> (60 min): three long passages on general academic subjects with 40 questions.</li>
            <li><strong>Writing</strong> (60 min): describe a chart or diagram in 150 words, then a discursive essay in 250 words.</li>
            <li><strong>Speaking</strong> (~14 min): face-to-face interview with an examiner across general and abstract topics.</li>
          </ul>
          <p>
            Scores are reported on a 0–9 band scale. AHPRA requires <strong>7.0 in
            every band</strong>, achieved in a single sitting (or in some cases
            across two sittings within 6 months — read AHPRA&apos;s policy carefully).
          </p>
        </section>

        <section>
          <h2>How OET (Medicine) works</h2>
          <p>
            The Occupational English Test is purpose-built for healthcare professionals.
            The Medicine paper uses authentic clinical contexts throughout:
          </p>
          <ul>
            <li><strong>Listening</strong> (~50 min): consultations and lectures from clinical settings.</li>
            <li><strong>Reading</strong> (~60 min): mix of short healthcare texts and longer clinical articles.</li>
            <li><strong>Writing</strong> (45 min): a single referral letter from a real-format set of case notes.</li>
            <li><strong>Speaking</strong> (~20 min): two roleplay consultations with a simulated patient (interlocutor).</li>
          </ul>
          <p>
            Each sub-test is graded A–E. AHPRA requires <strong>grade B (350+) in
            each of the four sub-tests</strong>. OET is delivered at test centres or
            at home with an online proctor — useful if the nearest centre is far.
          </p>
        </section>

        <section>
          <h2>Choosing the right test for you</h2>
          <p>
            <strong>Pick OET if:</strong> you currently practise in English (clinical
            attachments, observerships, internship), you are confident at history-taking
            and counselling in English, and you want the writing task to feel like
            something you do at work.
          </p>
          <p>
            <strong>Pick IELTS if:</strong> you have strong general English from
            university (medical school in English, research papers, international
            travel), you are budget-sensitive (AUD ~177 cheaper), or your nearest
            test centre offers IELTS more frequently.
          </p>
          <p>
            Many IMGs sit IELTS first because of cost and availability, then move to
            OET if they keep missing 7.0 in writing or speaking. Switching is fine —
            AHPRA only checks final scores.
          </p>
        </section>

        <section>
          <h2>How Mostly Medicine fits in</h2>
          <p>
            English testing is one piece of the AMC pathway. Once your scores are
            sorted, you still need to pass{" "}
            <Link href="/amc">AMC MCQ</Link> and{" "}
            <Link href="/amc">AMC Handbook AI RolePlay (Clinical / MCAT)</Link>. Mostly Medicine
            consolidates 3,000+ AMC-aligned MCQs and 151+ AI clinical roleplays so
            you can rehearse the same kinds of consultations OET tests — and the
            same clinical reasoning AMC examiners want to see.
          </p>
          <p>
            Plan your full timeline with the{" "}
            <Link href="/amc-timeline-planner">AMC Timeline Planner</Link> or
            estimate the cost with the{" "}
            <Link href="/amc-fee-calculator">AMC Fee Calculator</Link>.
          </p>
        </section>

        <section>
          <h2>Frequently asked questions</h2>
          {faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500 not-prose">
          <p>
            For official requirements, refer to{" "}
            <a href="https://www.ahpra.gov.au" target="_blank" rel="noopener" className="text-brand-400 hover:text-brand-300">ahpra.gov.au</a>,{" "}
            <a href="https://www.ielts.org" target="_blank" rel="noopener" className="text-brand-400 hover:text-brand-300">ielts.org</a>{" "}
            and{" "}
            <a href="https://occupationalenglishtest.org" target="_blank" rel="noopener" className="text-brand-400 hover:text-brand-300">occupationalenglishtest.org</a>.
            Last updated April 2026.
          </p>
        </footer>
      </article>

      <footer className="relative z-10 border-t border-slate-900/80 py-8 text-center">
        <p className="font-display font-bold text-sm mb-1">
          <span className="gradient-text">Mostly Medicine</span>
          <span className="text-slate-700"> · AMC Exam Preparation</span>
        </p>
        <p className="text-xs text-slate-700 mt-1">
          Built for IMGs · Powered by Claude AI · Aligned with AMC Handbook 2026
        </p>
      </footer>
    <SiteFooter />
    </main>
  );
}
