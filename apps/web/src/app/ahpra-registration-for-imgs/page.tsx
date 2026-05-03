import type { Metadata } from "next";
import Link from "next/link";
import CalculatorTeaser from "@/components/CalculatorTeaser";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/ahpra-registration-for-imgs`;
const TITLE = "AHPRA Registration for International Medical Graduates: 2026 Step-by-Step Guide";
const DESCRIPTION =
  "The complete step-by-step guide to AHPRA registration for IMGs in 2026 — pathways, EPIC verification, English language requirements, fees, timelines, and the mistakes that cost applicants months.";
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
    "ahpra registration for img",
    "ahpra application checklist",
    "ahpra english language test",
    "ahpra primary source verification",
    "epic verification ahpra",
    "ahpra registration types",
    "provisional registration australia",
    "general registration australia",
    "ahpra fees 2026",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AHPRA Registration for IMGs", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "Do I need to complete EPIC verification before I submit my AHPRA application?",
    a: "Not strictly — you can submit to AHPRA while EPIC is still in progress, and AHPRA will hold the application pending the EPIC report. In practice, submitting both simultaneously is the right approach. Starting EPIC first maximises parallel processing: AHPRA can complete its review of everything else (English language, employment history, criminal history) while EPIC verification is underway.",
  },
  {
    q: "My good-standing certificate is from a country where medical councils only issue it in the local language. Will AHPRA accept it?",
    a: "AHPRA requires a certified English translation prepared by a NAATI-accredited translator. You will need both the original document and the translation. Build the translation time into your document timeline — NAATI translation typically takes one to two weeks for a one-page document.",
  },
  {
    q: "I trained in the UK and have full GMC registration. Do I need to sit AMC exams?",
    a: "If you hold substantive GMC registration (not a training-grade licence) and have the prescribed working experience, you may qualify for the Competent Authority pathway and bypass AMC exams entirely. Check the MBA's Competent Authority pathway requirements carefully at medicalboard.gov.au — the threshold for prescribed experience is specific.",
  },
  {
    q: "What is the difference between provisional registration and limited registration?",
    a: "Provisional registration is the standard initial registration type for an IMG completing an intern year under supervision. Limited registration is issued for specific, defined purposes — a teaching appointment, a research role, or short-term employment — and is typically requested by the employing institution, not the applicant. They are distinct registration types with different conditions attached.",
  },
  {
    q: "Can I start working in Australia before my AHPRA registration is granted?",
    a: "No. Practising medicine in Australia without AHPRA registration is unlawful under the Health Practitioner Regulation National Law. You cannot start in a clinical role — even unpaid or voluntary — until your registration number appears on the AHPRA public register. Some hospitals issue provisional employment offers conditional on registration, but no clinical duties commence until registration is confirmed.",
  },
  {
    q: "How much does EPIC verification cost and who pays?",
    a: "ECFMG charges institutions, not applicants, for most verification requests — but ECFMG does charge applicants a service fee for creating a credentials file and initiating requests. As of 2026 the applicant-side fee is approximately US$80–US$160 depending on the number of institutions verified. Check ecfmg.org/epic for the current schedule.",
  },
  {
    q: "I have a gap of 18 months between graduation and my first internship. Is this a problem?",
    a: "It is not automatically a problem, but it requires explanation. Include a clear account of the gap — study leave, family circumstances, visa-related delay — in the employment history section of your application. AHPRA is looking for an honest, complete picture of your career, not a perfect, unbroken one.",
  },
  {
    q: "What happens if my AHPRA application is refused?",
    a: "Refusals are uncommon for IMGs who meet the standard pathway requirements, but they do occur, most often on grounds of criminal history or health impairment that affects fitness to practise. You have the right to seek a review of the decision by the MBA, and if unsatisfied, to appeal to the relevant tribunal in your state or territory. In practice, most unfavourable outcomes at this stage are queries requiring additional evidence rather than outright refusals — if you receive a query, treat it as an invitation to provide documentation, not as a refusal.",
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
            AHPRA Registration · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            AHPRA Registration for International Medical Graduates: 2026 Step-by-Step Guide
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          Most IMGs need provisional registration first, via the Standard pathway or the Competent Authority pathway. Realistic timeline from submitting your EPIC verification request to receiving a registration number: 4–6 months. The bottleneck is almost never AHPRA processing — it is document completeness.
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you have cleared the AMC exams and you are now staring at the AHPRA online portal wondering what comes next, this guide is for you. It is not a regulatory pamphlet. It is an account of how the process actually works, written by a team that has watched over 136 IMGs navigate AMC preparation on <Link href="/">Mostly Medicine</Link> and then walk into the registration maze. We have seen what stalls applications, what speeds them up, and which document errors repeat across otherwise excellent candidates.
        </p>
        <p>
          AHPRA is the regulator that issues your right to practise medicine in Australia; the Medical Board of Australia (MBA) sets the standards AHPRA enforces. That distinction matters more than it sounds. When AHPRA writes to you requesting extra documentation, it is almost always implementing an MBA standard — understanding which standard applies to your situation tells you exactly what evidence will close the request.
        </p>

        <h2>Quick answer</h2>
        <p>
          If you are an IMG with an AMC certificate, you are applying via the Standard pathway for provisional registration, which permits practice as an intern under supervision, equivalent to PGY-1 in the Australian system. Provisional registration is the typical first AHPRA registration type for an IMG. Once you have completed an intern year and a supervising hospital signs you off, you can apply for general (unrestricted) registration. The realistic timeline from submitting your EPIC primary-source verification request to receiving a registration number is 4–6 months — nearly always longer than candidates expect, and the delay is nearly always in document collection, not AHPRA&apos;s processing queue.
        </p>

        <CitationHook n={1}>
          Realistic AHPRA application turnaround in 2026 is 4–6 months from EPIC verification request to registration grant; delays are usually document-completeness issues, not AHPRA processing time.
        </CitationHook>

        <h2>The 3 IMG pathways: Competent Authority, Standard, and Specialist</h2>
        <p>
          Australia has three distinct routes for an IMG to reach registration, and knowing which applies to you changes almost every subsequent decision.
        </p>
        <p>
          The <strong>Competent Authority (CA) pathway</strong> is the fastest route to general registration and is available only to doctors who trained in — and hold substantive registration in — a small list of approved countries: the United Kingdom, Canada, the Republic of Ireland, New Zealand, and the United States. &ldquo;Substantive&rdquo; means real clinical registration, not a provisional or training-grade licence. A UK doctor with full GMC registration and prescribed working experience in the NHS can apply directly for general registration in Australia without sitting the AMC exams. This pathway is genuinely fast for eligible doctors — often three to four months — but the eligibility criteria are strict. Many IMGs assume they qualify because they passed PLAB or hold a US medical degree; they do not qualify unless they have substantive registration in that jurisdiction.
        </p>
        <p>
          The <strong>Standard pathway</strong> is the route for the majority of IMGs worldwide. It requires an AMC certificate (Part 1 + Part 2), completion of primary-source verification through ECFMG/EPIC, and satisfaction of the MBA&apos;s English Language Skills Registration Standard. Doctors on this pathway receive provisional registration first, then work through their intern year under supervision, and finally apply for general registration. If you are Indian, Pakistani, Filipino, Sri Lankan, Nigerian, or from any country not on the CA list, this is your pathway.
        </p>
        <p>
          The <strong>Specialist pathway</strong> applies to overseas-trained specialists (OTS) who want recognition in an Australian specialist college — for example, an overseas cardiologist or surgeon seeking fellowship equivalence. This is a parallel and substantially more complex process, typically overseen by the relevant specialist college rather than AHPRA directly, and is outside the scope of this guide.
        </p>
        <p>
          Still weighing AMC vs the UK&apos;s PLAB pathway before you start gathering documents? Read our <Link href="/amc-vs-plab">AMC vs PLAB pillar</Link> first.
        </p>

        <h2>Registration types explained</h2>
        <p>
          Once you know your pathway, you need to understand which registration type you will hold at each stage. AHPRA issues four types of medical registration, and they are not interchangeable.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Registration type</th>
                <th className="px-4 py-3 font-semibold">Who holds it</th>
                <th className="px-4 py-3 font-semibold">Key restriction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Provisional registration</td>
                <td className="px-4 py-3">IMGs completing intern year under supervision</td>
                <td className="px-4 py-3">Must practise only in an approved supervised position</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Limited registration</td>
                <td className="px-4 py-3">Specific purposes: research, teaching, short-term employment</td>
                <td className="px-4 py-3">Restricted to the stated purpose and employer</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">General registration</td>
                <td className="px-4 py-3">Doctors who have completed intern year and met all standards</td>
                <td className="px-4 py-3">Full, unrestricted right to practise; annual renewal required</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Specialist registration</td>
                <td className="px-4 py-3">Recognised specialists via a specialist college</td>
                <td className="px-4 py-3">Practise within the endorsed specialty</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CitationHook n={2}>
          Provisional registration is the typical first AHPRA registration type for an IMG, granted before the intern year and converted to general registration once the supervising hospital certifies completion.
        </CitationHook>

        <p>
          Provisional registration is not a lesser registration — it is a stage. Think of it as the mechanism that allows a hospital to employ you in an intern-equivalent role while the MBA satisfies itself that your clinical competencies meet Australian standards. Once your supervising hospital certifies completion, you transition to general registration on a straightforward application.
        </p>
        <p>
          Limited registration is occasionally issued for specific short-term purposes — a research appointment, a teaching role, or a sabbatical position — and should not be confused with provisional registration in an intern year.
        </p>

        <h2>Documents you must collect</h2>
        <p>
          Every IMG applying for AHPRA registration must complete primary-source verification of medical credentials through ECFMG/EPIC — there is no workaround. But before EPIC verification even begins, you need to gather a significant set of documents. Missing even one causes cascading delays, so treat this table as a pre-flight checklist.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Document</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Primary medical degree certificate</td>
                <td className="px-4 py-3">Notarised copy; must match the degree name exactly as it appears in the World Directory of Medical Schools</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Official academic transcripts</td>
                <td className="px-4 py-3">Issued directly by your medical school; sealed envelope or directly to EPIC</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Internship/housemanship completion certificate</td>
                <td className="px-4 py-3">From your postgraduate training institution; sometimes called a &ldquo;satisfactory completion&rdquo; letter</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Good-standing certificate / Certificate of registration status</td>
                <td className="px-4 py-3">From every medical council with which you have ever been registered</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Identity documents</td>
                <td className="px-4 py-3">Current passport; some councils also require national ID</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Passport-style photograph</td>
                <td className="px-4 py-3">Against a white background; AHPRA has specific dimensional requirements</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">English language test results</td>
                <td className="px-4 py-3">IELTS, OET, PTE Academic, or TOEFL iBT — must meet MBA minimums (see section below)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AMC certificate</td>
                <td className="px-4 py-3">Your Part 1 and Part 2 results certificate, issued by the AMC</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Employment history</td>
                <td className="px-4 py-3">Chronological list of all clinical positions from graduation; gaps require explanation</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Criminal history declaration</td>
                <td className="px-4 py-3">A statutory declaration; if you have convictions in any jurisdiction, supporting documentation required</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Professional indemnity insurance</td>
                <td className="px-4 py-3">Most hospitals provide this once employed, but AHPRA needs a statement of coverage</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Two of these regularly trip up candidates. First, the good-standing certificate from your home country medical council is not the same as your original registration certificate. It is a letter dated within the last twelve months confirming you hold (or held) registration in good standing, with no disciplinary matters recorded. Many councils charge a separate fee for this document and can take four to eight weeks to issue it — request it the day you decide to apply. Second, the employment history requirement is more thorough than most candidates expect. AHPRA wants a complete chronological record, including any gap between graduation and your first clinical post. A gap explained in writing is fine; a gap left unexplained triggers a query.
        </p>

        <h2>EPIC primary-source verification — how it works, how long it takes</h2>
        <p>
          ECFMG&apos;s International Credentials Services (EPIC) is the verification body AHPRA uses to confirm that your medical credentials are genuine. EPIC contacts your medical school, postgraduate training institution, and licensing authority directly to verify each document you have submitted. This is not a document check — it is a source check. AHPRA does not simply take your certified copy at face value.
        </p>

        <CitationHook n={3}>
          Every IMG applying for AHPRA registration must complete primary-source verification of medical credentials through ECFMG/EPIC — there is no workaround.
        </CitationHook>

        <p>
          The process works as follows. You create an account on the EPIC portal at <a href="https://www.ecfmg.org/epic/" target="_blank" rel="noopener noreferrer">ecfmg.org</a> and submit a verification request for each institution whose credentials you are claiming. EPIC then sends a request to that institution asking them to confirm your records. Response times vary enormously — institutions in the UK and the US typically respond within two to four weeks; institutions in India, Pakistan, and parts of Africa can take ten to sixteen weeks, particularly if the request is directed to a paper-based records office. EPIC sends reminders, but it cannot compel a faster response. Your job at this stage is to contact your institutions proactively and inform them a verification request is inbound — this single action is the most effective way to cut weeks off the process.
        </p>
        <p>
          Once EPIC confirms all verifications complete and transmits the report to AHPRA, AHPRA&apos;s own assessment typically takes four to eight weeks. The total timeline of 4–6 months assumes EPIC verifications come back within eight weeks, your application is complete, and there are no queries on your criminal history or employment gaps. Applications that take nine months or more nearly always involve an institution that took twelve or more weeks to respond to EPIC, a criminal history declaration requiring further investigation, or an employment gap the applicant did not document upfront.
        </p>

        <h2>English language requirements</h2>
        <p>
          The MBA&apos;s English Language Skills Registration Standard is one of the non-negotiable thresholds. There are four approved tests and specific minimum scores for each.
        </p>

        <CitationHook n={4}>
          AHPRA&apos;s English Language Skills Registration Standard accepts IELTS, OET, PTE Academic, and TOEFL iBT, with minimum scores set per test — for example, IELTS Academic requires an overall score of 7 with no individual band below 7.
        </CitationHook>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Test</th>
                <th className="px-4 py-3 font-semibold">Minimum overall</th>
                <th className="px-4 py-3 font-semibold">Minimum per section</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">IELTS Academic</td>
                <td className="px-4 py-3">7.0</td>
                <td className="px-4 py-3">7.0 in each of Listening, Reading, Writing, Speaking</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">OET (Medicine)</td>
                <td className="px-4 py-3">B</td>
                <td className="px-4 py-3">B in each of Listening, Reading, Writing, Speaking</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">PTE Academic</td>
                <td className="px-4 py-3">65</td>
                <td className="px-4 py-3">65 in each of Listening, Reading, Writing, Speaking</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">TOEFL iBT</td>
                <td className="px-4 py-3">94</td>
                <td className="px-4 py-3">Listening 24, Reading 24, Writing 27, Speaking 23</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          A few things to know. First, the test must have been taken within the last three years at the time of your application. Second, results must be sent directly to AHPRA from the testing body — a photocopy is not sufficient. Third, the OET for Medicine is the most common choice among IMGs from Commonwealth countries because its clinical scenarios feel closer to actual clinical communication than the IELTS Academic paper. PTE Academic is increasingly popular because results are returned within five business days, which is useful if you are applying under time pressure.
        </p>
        <p>
          If you are a citizen or permanent resident of Australia, Canada, New Zealand, the United Kingdom, or the Republic of Ireland, and you completed your entire primary medical degree in English at an institution in one of those countries, you may be exempt from the English language test. Check the exemption criteria carefully on <a href="https://www.medicalboard.gov.au" target="_blank" rel="noopener noreferrer">medicalboard.gov.au</a> — the exemptions are narrower than most candidates assume. For a deeper comparison of the two most-chosen tests, see our <Link href="/ielts-vs-oet">IELTS vs OET pillar</Link>.
        </p>

        <h2>The actual application: AHPRA online portal walkthrough</h2>
        <p>
          The AHPRA online application is at <a href="https://www.ahpra.gov.au" target="_blank" rel="noopener noreferrer">ahpra.gov.au</a>. You cannot submit a paper form. Before you begin, make sure every document in the checklist above is ready in its final form — uploading an incomplete application does not pause the clock; it starts a query cycle that adds weeks.
        </p>
        <p>
          The portal walks you through seven sections: personal details, identity verification, qualification and training history, registration history, English language evidence, criminal history declaration, and a declaration of fitness to practise. In the registration history section, you must list every medical council or licensing body with which you have ever been registered, including provisional or temporary registrations during postgraduate training. IMGs commonly omit a training-grade registration from their home country because they consider it &ldquo;not real&rdquo; registration — AHPRA considers it real registration and requires a good-standing certificate for it.
        </p>
        <p>
          In the qualification and training history section, you will be asked to enter your AMC certificate number. AHPRA verifies this directly with the AMC, so the verification happens automatically — you do not need to upload a copy of the certificate, but you should have it on hand in case there is a discrepancy.
        </p>
        <p>
          Once you submit, AHPRA acknowledges receipt within a few business days and assigns a reference number. The subsequent correspondence goes via the portal&apos;s message centre — check it every three to four days. AHPRA will not chase you by phone; unanswered portal messages expire and your application sits in a paused state until you respond.
        </p>
        <p>
          At the time you submit your application, your EPIC verification should already be underway or complete. If EPIC is still in progress, AHPRA will hold the application pending the EPIC report. You can check EPIC status via your ECFMG account and should do so weekly.
        </p>
        <p>
          If you are still completing your AMC preparation while planning ahead for the registration phase, Mostly Medicine&apos;s <Link href="/dashboard/cat1">AMC MCQ bank</Link> and <Link href="/dashboard/cat2">clinical roleplay module</Link> are the tools our community of 136 IMGs uses most to reach the AMC certificate threshold before this process begins.
        </p>

        <h2>Fees in 2026</h2>
        <p>
          AHPRA publishes its fee schedule annually. The current 2026 schedule, effective from the beginning of the registration year, is as follows.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Fee item</th>
                <th className="px-4 py-3 font-semibold">Amount (A$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Application for provisional registration</td>
                <td className="px-4 py-3">$540</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Application for general registration</td>
                <td className="px-4 py-3">$540</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Annual registration fee — provisional (pro-rated)</td>
                <td className="px-4 py-3">$180–$540 depending on registration date in cycle</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Annual registration fee — general</td>
                <td className="px-4 py-3">$800</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Criminal history check (national)</td>
                <td className="px-4 py-3">$89</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Priority processing (requested)</td>
                <td className="px-4 py-3">Not available for initial applications</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500">
          Source: AHPRA, <em>Registration fees for medical practitioners</em>, 2026 registration year (<a href="https://www.ahpra.gov.au/Registration/Registration-Fees" target="_blank" rel="noopener noreferrer">ahpra.gov.au</a>).
        </p>

        <p>
          These are AHPRA&apos;s own fees. To reach this point you will already have spent approximately A$3,200–A$4,000 on AMC Part 1 and Part 2, A$400–A$600 on an English language test, and US$150–US$300 on EPIC verification fees. The AHPRA registration fee is not the largest cost in the process — it is the last. Run your full pathway numbers on the <Link href="/amc-fee-calculator">AMC fee calculator</Link>.
        </p>
        <p>
          Annual renewal falls due on the 30th of September each year regardless of when you registered. If you registered provisionally in, say, April, your first renewal is five months later. Factor that into cash-flow planning in your PGY-1 year.
        </p>

        <h2>Typical timelines — what 4–6 months actually looks like</h2>
        <p>
          Based on what we see across IMGs preparing on Mostly Medicine, here is how those months actually break down.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Phase</th>
                <th className="px-4 py-3 font-semibold">Typical duration</th>
                <th className="px-4 py-3 font-semibold">What can extend it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Document gathering (before EPIC submission)</td>
                <td className="px-4 py-3">4–8 weeks</td>
                <td className="px-4 py-3">Good-standing certificates from slow-processing councils; employment reference letters</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">EPIC verification process</td>
                <td className="px-4 py-3">6–14 weeks</td>
                <td className="px-4 py-3">Institutions with paper-based records; holiday periods; non-English correspondence</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AHPRA application preparation and submission</td>
                <td className="px-4 py-3">1–2 weeks</td>
                <td className="px-4 py-3">N/A once documents are ready</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AHPRA assessment and decision</td>
                <td className="px-4 py-3">4–8 weeks</td>
                <td className="px-4 py-3">Criminal history queries; employment gap explanations; incomplete applications</td>
              </tr>
              <tr className="bg-white/5 font-semibold">
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3">15–32 weeks</td>
                <td className="px-4 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The candidates we see complete the process in 15–18 weeks are those who began document collection three months before they sat AMC Part 2. They did not wait for their results letter — they gathered credentials, requested EPIC verification for all institutions simultaneously, and submitted to AHPRA within days of receiving the AMC certificate. The candidates who take 28–32 weeks are those who began document collection after their Part 2 results arrived.
        </p>

        <h2>What goes wrong and how to avoid it</h2>
        <p>
          Based on 136 IMGs preparing for AMC on Mostly Medicine, and the registration experiences they have shared, these are the seven most common application errors — and how to sidestep each one.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Error</th>
                <th className="px-4 py-3 font-semibold">What happens</th>
                <th className="px-4 py-3 font-semibold">How to avoid it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Good-standing certificate &gt; 12 months old</td>
                <td className="px-4 py-3">AHPRA rejects it; you lose 6–8 weeks requesting a fresh one</td>
                <td className="px-4 py-3">Request it no more than 8 weeks before you plan to submit to AHPRA</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">EPIC verification submitted for primary degree only</td>
                <td className="px-4 py-3">AHPRA queries the internship certificate; +8–12 weeks</td>
                <td className="px-4 py-3">Submit EPIC requests for every institution simultaneously on day one</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Employment history has unexplained gaps</td>
                <td className="px-4 py-3">AHPRA sends a query requiring a statutory declaration; +4–6 weeks</td>
                <td className="px-4 py-3">Account for every gap in writing upfront, even if it is just &ldquo;studying for AMC Part 1&rdquo;</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Criminal history declaration omits a spent conviction</td>
                <td className="px-4 py-3">Even minor matters trigger extended assessment</td>
                <td className="px-4 py-3">Declare everything; AHPRA treats incompleteness more seriously than minor history</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">English test result older than 3 years</td>
                <td className="px-4 py-3">AHPRA cannot accept it; you must re-sit</td>
                <td className="px-4 py-3">Always check expiry; book a re-sit before submitting if needed</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Photograph not meeting AHPRA spec</td>
                <td className="px-4 py-3">Portal rejects the upload; application delayed until resubmission</td>
                <td className="px-4 py-3">Use a professional photograph service familiar with AHPRA requirements</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Applying before AMC certificate is issued</td>
                <td className="px-4 py-3">Application held pending the certificate; EPIC may have been complete for weeks</td>
                <td className="px-4 py-3">Submit to AHPRA the moment the AMC certificate is in hand, not before</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The single most expensive mistake — in terms of time lost — is the good-standing certificate error. It is also the most common, because candidates assume the certificate they obtained for a previous purpose (a visa application, a hospital credentialling requirement) is still valid. It is not if it is more than twelve months old.
        </p>

        <h2>Renewal, CPD, and ongoing obligations</h2>
        <p>
          AHPRA registration is not a one-time event. Once you hold provisional registration, you are subject to the Medical Board of Australia&apos;s professional obligations from day one, and these persist throughout your career.
        </p>
        <p>
          Annual renewal opens on the 1st of September and closes on the 30th of September. Late renewal attracts a surcharge and, if missed entirely, leads to registration lapsing — which means you cannot practise until it is reinstated. Set a calendar reminder. AHPRA sends an email, but that email can end up in spam during a busy intern year.
        </p>
        <p>
          Continuing professional development (CPD) obligations under the MBA&apos;s current framework require all medical practitioners to complete a minimum of 50 CPD hours per year, composed of educational activities, reviewing performance, and measuring outcomes. The MBA moved to the CPD Home framework in 2023, which requires you to register with an accredited CPD home — for most IMGs in their early years, this means joining the Australian Medical Association (AMA) or a college-affiliated program. CPD documentation is not submitted to AHPRA annually, but you may be audited, and failure to maintain records is treated as a registration compliance matter.
        </p>
        <p>
          The annual registration renewal also asks you to declare any notifiable conduct since your last renewal, any health impairment affecting your practice, and any new criminal charges or convictions in any jurisdiction. This is a legal declaration, not a formality.
        </p>
        <p>
          Once you transition from provisional to general registration, the process is straightforward provided your supervising hospital has submitted the required completion report and you have no outstanding compliance matters. General registration is not granted automatically — you must apply — but the application is considerably simpler than the initial one.
        </p>

        <CitationHook n={5}>
          Based on 136 IMGs preparing for AMC on Mostly Medicine, the candidates who reach AHPRA registration fastest are those who begin document collection three months before sitting AMC Part 2 — not those who wait for their results letter.
        </CitationHook>

        <h2>Start your AMC preparation on Mostly Medicine</h2>
        <p>
          AHPRA registration is the final step in a process that begins years earlier with the AMC exams. If you are still in the AMC preparation phase, our platform is built specifically for this. The <Link href="/dashboard/cat1">MCQ bank</Link> covers over 3,000 questions across all AMC Part 1 specialties with spaced repetition built in. The <Link href="/dashboard/cat2">AMC Handbook RolePlay</Link> lets you practise live clinical scenarios with AI roleplay that mirrors the AMC Part 2 OSCE format, with voice input and immediate feedback.
        </p>
        <p>
          The candidates who reach AHPRA registration fastest are those who build their study plan around structured question practice and scenario rehearsal from the beginning — not those who cram hardest in the final weeks. Start free at <Link href="/">mostlymedicine.com</Link> — Pro is A$19/mo, Enterprise is A$49/mo. If you are weighing the country decision, the <Link href="/amc-vs-plab">AMC vs PLAB pillar</Link> and the <Link href="/amc-pass-rates-by-country">pass-rates page</Link> are the natural next reads.
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
          <p><strong className="text-slate-400">Last reviewed:</strong> 3 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 3 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC pass-graduate IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://www.ahpra.gov.au/Registration/Registration-Fees" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA Registration Fees 2026</a></li>
            <li><a href="https://www.medicalboard.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Medical Board of Australia, English Language Skills Registration Standard</a></li>
            <li><a href="https://www.medicalboard.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Medical Board of Australia, Registration Standards</a></li>
            <li><a href="https://www.ecfmg.org/epic/" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">ECFMG/EPIC, International Credentials Services</a></li>
            <li><a href="https://www.amc.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medical Council, AMC Certificate</a></li>
            <li><a href="https://www.ahpra.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA, online registration portal and notification standards</a></li>
          </ul>
        </div>
      </article>
    </main>
  );
}
