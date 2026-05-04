import type { Metadata } from "next";
import Link from "next/link";
import CalculatorTeaser from "@/components/CalculatorTeaser";
import PillarPageNav from "@/components/PillarPageNav";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/ielts-vs-oet`;
const TITLE = "IELTS vs OET for AHPRA in 2026: Which English Test Should an IMG Doctor Take?";
const DESCRIPTION =
  "OET Medicine is easier for working clinicians, IELTS Academic is cheaper and more flexible — both are AHPRA-accepted. Pick by daily English habits, not price.";
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
    "ielts vs oet for doctors",
    "is oet easier than ielts",
    "oet medicine pass score ahpra",
    "ahpra english requirement",
    "oet vs ielts which is easier",
    "ielts academic for ahpra",
    "ielts 7 each band ahpra",
    "oet b grade requirement",
    "english test for img australia",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "IELTS vs OET", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "Does AHPRA accept both IELTS and OET?",
    a: "Yes — and also PTE Academic and TOEFL iBT. AHPRA's Medical Board English Language Skills Registration Standard treats all four as equally valid, with no test ranked higher than another. You only need to pass one of them at the minimum threshold.",
  },
  {
    q: "Is OET easier than IELTS for doctors?",
    a: "For most working clinicians, yes — marginally — because the content is healthcare-specific. The edge is largest in Listening, Reading and Speaking. Writing is comparably hard on both: it's the most common sub-test that IMGs miss on either test. If you have not done clinical work for 12+ months, OET may actually feel harder than IELTS.",
  },
  {
    q: "Can I switch from IELTS to OET (or vice versa) mid-application?",
    a: "Yes. AHPRA does not lock you to a test — submit any single AHPRA-accepted test at the minimum threshold. The only restriction is that you cannot combine sittings across two different tests; combining is only allowed across two sittings of the same test within 12 months.",
  },
  {
    q: "How long are scores valid for AHPRA?",
    a: "Two years from the test date. If your test result expires before AHPRA finalises your registration, you'll be asked to re-sit. This is one reason most IMGs sit the English test after AMC Part 1 has been booked — to keep the validity window aligned.",
  },
  {
    q: "Are PTE Academic and TOEFL iBT actually accepted, or just nominally?",
    a: "They are fully accepted. The 2026 minimum thresholds are PTE overall 65 with each of the four communicative skills at 65, and TOEFL iBT total 94 with Listening 24, Reading 24, Writing 27, Speaking 23. PTE in particular has strong centre availability in South Asia and is increasingly used by IMGs as a third option.",
  },
  {
    q: "What if I fail one band but my overall score is fine?",
    a: "That sitting does not meet the AHPRA standard. Either re-sit the full test (IELTS) or use OET's Single Skill Retake to re-sit just the failed sub-test (OET only). A sub-7.0 IELTS band requires a full re-sit; a sub-B OET sub-test requires a Single Skill Retake.",
  },
  {
    q: "Do I need OET Medicine specifically, or does any OET version work?",
    a: "You need OET Medicine. OET is profession-specific; AHPRA registration as a medical practitioner requires the Medicine version. The Nursing, Dentistry, Pharmacy etc. versions are valid for those professions only.",
  },
  {
    q: "How much does the English test add to my total IMG-pathway cost?",
    a: "For a single passing sitting, A$420 (IELTS) to A$587 (OET) plus prep materials — call it A$500–A$800 all-in. With one re-sit, that doubles. In the full AMC pathway, English testing typically accounts for under 5% of total cost; the dominant costs are AMC exam fees, AHPRA registration and travel.",
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
            English Test for AHPRA &middot; Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            IELTS vs OET for AHPRA in 2026: Which English Test Should an IMG Doctor Take?
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder &middot; medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          AHPRA accepts four English tests for medical registration &mdash; IELTS Academic, OET Medicine, PTE Academic and TOEFL iBT &mdash; with no test ranked above another. OET Medicine is widely considered easier for working clinicians because the content is medical scenario-based; IELTS Academic is cheaper, more globally available and tests general academic English. Both meet AHPRA&apos;s standard if you hit the minimum scores. Pick by daily English habits, not by price.
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you&apos;re an IMG searching &ldquo;is OET easier than IELTS&rdquo; or &ldquo;which English test does AHPRA prefer&rdquo;, the short answer is: AHPRA does not prefer one. The Medical Board of Australia explicitly accepts four tests under the <a href="https://www.medicalboard.gov.au/Registration-Standards/English-language-skills.aspx" target="_blank" rel="noopener noreferrer">English Language Skills Registration Standard</a>, and your registration application is treated identically whichever test you choose. The interesting question is which test fits <em>you</em> &mdash; your daily English habits, your timeline, your budget, and how often you want to re-sit.
        </p>
        <p>
          I write this as the founder of <Link href="/">Mostly Medicine</Link> and the husband of an AMC-pass IMG. My wife, Dr Amandeep Kamboj, sat OET Medicine in Delhi after weighing both options seriously. She finished AMC Part 1, Part 2, and is currently completing recency-of-practice in Gurugram before returning to Sydney. Her English-test reasoning is the founder note further down &mdash; it&apos;s specific, and it might mirror your own.
        </p>

        <h2>Quick facts at a glance</h2>
        <ul>
          <li>AHPRA accepts four English tests for medical registration: IELTS Academic, OET Medicine, PTE Academic, TOEFL iBT.</li>
          <li>Minimum <strong>AHPRA IELTS score</strong>: overall 7.0, with no band below 7.0 (Listening, Reading, Writing, Speaking).</li>
          <li>Minimum <strong>AHPRA OET score</strong>: grade B in each of the four sub-tests (Listening, Reading, Writing, Speaking).</li>
          <li>Test fee 2026 (AUD): IELTS Academic around A$420; OET Medicine around A$587.</li>
          <li>Score validity for AHPRA: 2 years from test date.</li>
          <li>AHPRA permits combining results across two sittings of the same test taken within 12 months, provided each sitting independently meets the minimum thresholds in each sub-test/band.</li>
          <li>OET Medicine content is built around clinical scenarios (patient letters, GP-style consults); IELTS Academic uses general academic content (essays, lectures, broad reading passages).</li>
        </ul>

        <h2>Why AHPRA cares about English at all</h2>
        <p>
          Medical registration in Australia is governed by the Medical Board of Australia under the AHPRA national scheme. Demonstrating English language proficiency is one of the seven Registration Standards every applicant must meet &mdash; alongside criminal history, recency of practice, professional indemnity, continuing professional development, the AMC pathway, and identity. The English standard exists because patient safety in an English-speaking health system depends on a doctor&apos;s ability to take a history, document accurately, communicate with consultants, and explain a diagnosis to a patient under stress.
        </p>
        <p>
          The standard is set high deliberately. Australian hospitals expect the bar set by the Medical Board, not the bar a hospital itself might quietly accept. Get this right once and you don&apos;t revisit it.
        </p>

        <h2>The four AHPRA-accepted tests</h2>
        <p>The Medical Board&apos;s English Language Skills Registration Standard names four tests. As of mid-2026 the published minimum scores are:</p>
        <ul>
          <li><strong>IELTS Academic</strong> &mdash; overall 7.0 with a minimum of 7.0 in each of the four bands.</li>
          <li><strong>OET (Occupational English Test) &mdash; Medicine</strong> &mdash; minimum grade B in each of the four sub-tests.</li>
          <li><strong>PTE Academic</strong> &mdash; overall 65 with a minimum of 65 in each of the four communicative skills.</li>
          <li><strong>TOEFL iBT</strong> &mdash; total 94, with Listening 24, Reading 24, Writing 27, Speaking 23.</li>
        </ul>
        <p>
          Two practical things to know. First, the standard requires the <strong>Academic</strong> version of IELTS &mdash; not General Training. Second, OET has versions for several professions (Medicine, Nursing, Dentistry, Pharmacy and others); doctors must sit <strong>OET Medicine</strong> specifically.
        </p>

        <CitationHook n={1}>
          AHPRA accepts four English tests for medical registration &mdash; IELTS Academic, OET Medicine, PTE Academic and TOEFL iBT &mdash; with no test ranked higher than another by the Medical Board of Australia.
        </CitationHook>

        <p>
          The vast majority of IMGs choose between IELTS Academic and OET Medicine, so the rest of this piece focuses on those two. PTE and TOEFL are valid options if a centre near you offers them more reliably; the comparison logic translates directly.
        </p>

        <h2>IELTS Academic vs OET Medicine: format compared</h2>
        <p>Both tests are four-skill: Listening, Reading, Writing, Speaking. The differences are in <em>what</em> you read, write, listen to and discuss.</p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Dimension</th>
                <th className="px-4 py-3 font-semibold">IELTS Academic (AHPRA)</th>
                <th className="px-4 py-3 font-semibold">OET Medicine (AHPRA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Test fee 2026 (AUD)</td>
                <td className="px-4 py-3">~A$420</td>
                <td className="px-4 py-3">~A$587</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Format</td>
                <td className="px-4 py-3">Paper-based or computer-delivered</td>
                <td className="px-4 py-3">Paper-based or on-computer at test centre, plus OET@Home (where eligible)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Sub-tests</td>
                <td className="px-4 py-3">Listening, Reading, Writing (2 tasks), Speaking</td>
                <td className="px-4 py-3">Listening, Reading, Writing (1 letter), Speaking (2 role-plays)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Total test time</td>
                <td className="px-4 py-3">~2 hr 45 min</td>
                <td className="px-4 py-3">~3 hr</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Minimum score for AHPRA</td>
                <td className="px-4 py-3">Overall 7.0; no band below 7.0</td>
                <td className="px-4 py-3">Grade B in each of the 4 sub-tests</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Score validity for AHPRA</td>
                <td className="px-4 py-3">2 years</td>
                <td className="px-4 py-3">2 years</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Content focus</td>
                <td className="px-4 py-3">General academic &mdash; lectures, essays, broad reading passages</td>
                <td className="px-4 py-3">Healthcare-specific &mdash; patient case notes, clinical letters, doctor&ndash;patient consults</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Speaking format</td>
                <td className="px-4 py-3">11&ndash;14 min interview with examiner</td>
                <td className="px-4 py-3">2 &times; ~5 min role-plays as a healthcare professional with a patient actor</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Writing task</td>
                <td className="px-4 py-3">Task 1: graph/chart description; Task 2: 250-word essay</td>
                <td className="px-4 py-3">A profession-specific letter (referral / discharge / advice)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Test frequency</td>
                <td className="px-4 py-3">Multiple sessions per month globally</td>
                <td className="px-4 py-3">Multiple sessions per month globally; OET@Home daily windows in many regions</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">IMG-friendliness</td>
                <td className="px-4 py-3">High familiarity, broad centres, lower cost</td>
                <td className="px-4 py-3">Higher familiarity for working clinicians; content matches clinical workflow</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500">
          Sources: <a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer">ielts.org</a> and <a href="https://www.idp.com/australia/ielts" target="_blank" rel="noopener noreferrer">idp.com</a> (IELTS); <a href="https://www.occupationalenglishtest.org" target="_blank" rel="noopener noreferrer">occupationalenglishtest.org</a> (OET); <a href="https://www.medicalboard.gov.au" target="_blank" rel="noopener noreferrer">medicalboard.gov.au</a> (AHPRA standard).
        </p>

        <p>
          The headline difference isn&apos;t the format scaffolding &mdash; it&apos;s the <em>content register</em>. OET asks you to read a patient&apos;s case notes and write a referral letter to a specialist. IELTS asks you to interpret a bar chart on national rainfall and argue both sides of a policy essay. For doctors who write referral letters every week and have not written an academic essay in five years, that gap is the entire decision.
        </p>

        <CitationHook n={2}>
          The minimum AHPRA IELTS score is 7.0 in each band with overall 7.0; for OET Medicine, the requirement is grade B in each of the four sub-tests &mdash; equivalent to roughly IELTS 7.0 on AHPRA&apos;s published mapping logic.
        </CitationHook>

        <h2>Required scores: AHPRA English Language Skills Registration Standard</h2>
        <p>
          The exact thresholds matter, because <strong>a single sub-test below the minimum disqualifies the entire sitting</strong> for AHPRA &mdash; even if your overall score is well above 7.0 / B.
        </p>
        <p>For <strong>IELTS Academic</strong>, AHPRA requires:</p>
        <ul>
          <li>Overall band score of 7.0</li>
          <li>No individual band (Listening, Reading, Writing, Speaking) below 7.0</li>
        </ul>
        <p>
          A 7.5 overall with a 6.5 in Writing does not meet the standard. This is the single most common failure mode IMGs hit on IELTS &mdash; losing a band in Writing or Speaking while clearing the overall.
        </p>
        <p>For <strong>OET Medicine</strong>, AHPRA requires:</p>
        <ul>
          <li>Grade B in each of the four sub-tests (Listening, Reading, Writing, Speaking)</li>
        </ul>
        <p>
          An A in three sub-tests with a C+ in Writing does not meet the standard. Again, the bottleneck is usually Writing &mdash; the referral letter task &mdash; rather than the receptive skills.
        </p>
        <p>
          The AHPRA standard is published in full at <a href="https://www.medicalboard.gov.au/Registration-Standards/English-language-skills.aspx" target="_blank" rel="noopener noreferrer">medicalboard.gov.au</a> and is the canonical version &mdash; always check it directly before you book.
        </p>

        <h2>Cost comparison 2026</h2>
        <p>Test fee is only one slice. The full English-test budget for an AHPRA-bound IMG includes the test, prep materials, and almost always at least one re-sit.</p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Cost line</th>
                <th className="px-4 py-3 font-semibold">IELTS Academic 2026</th>
                <th className="px-4 py-3 font-semibold">OET Medicine 2026</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Test fee (typical AUD)</td>
                <td className="px-4 py-3">~A$420</td>
                <td className="px-4 py-3">~A$587</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Re-sit fee</td>
                <td className="px-4 py-3">~A$420 per attempt</td>
                <td className="px-4 py-3">~A$587 per attempt</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Single sub-test re-sit</td>
                <td className="px-4 py-3">Not available &mdash; full test re-sit</td>
                <td className="px-4 py-3">Available &mdash; re-sit only the failed sub-test (OET Single Skill Retake)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Test centres globally</td>
                <td className="px-4 py-3">Very wide &mdash; IDP and British Council partners</td>
                <td className="px-4 py-3">Wide and growing &mdash; also OET@Home in many regions</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Free official prep</td>
                <td className="px-4 py-3">OfficialIELTS practice tests; British Council &amp; IDP free resources</td>
                <td className="px-4 py-3">OET official sample tests at occupationalenglishtest.org</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CitationHook n={3}>
          OET Medicine costs approximately A$587 in 2026 versus IELTS Academic at A$420; despite the price gap, OET often produces faster registration outcomes for clinically active IMGs because the content matches their daily English use.
        </CitationHook>

        <p>
          The single biggest 2026 development for cost-sensitive IMGs is <strong>OET&apos;s Single Skill Retake</strong> &mdash; if you miss a B in only one sub-test, you can re-sit that sub-test alone rather than the full test, materially closing the price gap with IELTS over a typical IMG&apos;s full prep cycle. IELTS does not currently offer a single-band re-sit.
        </p>

        <h2>Which is &ldquo;easier&rdquo; for IMGs &mdash; and why this is the wrong question</h2>
        <p>
          &ldquo;Is OET easier than IELTS?&rdquo; is the most-searched form of this question, and it has a defensible answer for <em>most</em> working clinicians: yes, marginally &mdash; for receptive skills (Listening, Reading) and Speaking. The medical context is the test-taker&apos;s daily working register. A patient consult role-play is closer to a working IMG&apos;s morning than a four-paragraph essay on urban planning.
        </p>
        <p>But that ease is conditional on three things being true:</p>
        <ol>
          <li>You currently work in clinical English at least weekly &mdash; taking histories, writing notes, discussing cases.</li>
          <li>You have practised the OET letter-writing format under timed conditions (this is where most IMGs lose their B).</li>
          <li>You are willing to pay the higher test fee for content alignment.</li>
        </ol>
        <p>If those are not all true, IELTS may actually be easier <em>for you</em>. Specifically:</p>
        <ul>
          <li>IMGs who have been out of clinical work for 12+ months sometimes find the OET listening sub-test harder, not easier &mdash; clinical accents and pace at speed.</li>
          <li>IMGs from strong written-academic backgrounds (recent thesis, recent journal writing) often clear IELTS Writing 7.0 without much prep, where they would have to learn the OET letter format from scratch.</li>
          <li>IMGs in regional locations sometimes have better IELTS centre availability than OET centres.</li>
        </ul>
        <p>
          The honest framing: <strong>easier is the wrong axis</strong> &mdash; <em>closer to your current English use</em> is the right axis. For most working IMGs, OET wins on that axis. For a meaningful minority, IELTS does.
        </p>

        <CitationHook n={4}>
          OET is widely considered easier for working clinicians because the content is medical scenario-based, while IELTS uses general academic content; the practical edge is largest in Listening, Reading and Speaking, smallest in Writing where the letter format must be learnt explicitly.
        </CitationHook>

        <h2>Pass rates and re-sit reality</h2>
        <p>
          Neither IDP/British Council nor OET Centre publishes a single global &ldquo;pass rate&rdquo; the way the GMC does for PLAB. Both publish score-distribution data at country level, and both quietly acknowledge that the AHPRA-required band (7.0 each / B each) is significantly higher than the <em>median</em> score achieved by candidates.
        </p>
        <p>Two patterns are reliably documented in OET and IELTS centre data:</p>
        <ul>
          <li>The most commonly missed band on IELTS Academic for IMGs targeting AHPRA is <strong>Writing</strong> &mdash; typically Task 2 essay structure or Task 1 graph description register.</li>
          <li>The most commonly missed sub-test on OET Medicine is also <strong>Writing</strong> &mdash; referral letter format, layout and tone.</li>
        </ul>
        <p>
          Plan for one re-sit. Most IMGs who clear AHPRA&apos;s English bar do so on attempt one or attempt two, and the second-attempt pass rate is materially higher because by then you&apos;ve seen the real test interface and stem style. (Same effect we documented for AMC in our <Link href="/amc-pass-rates-by-country">AMC pass-rates piece</Link>.)
        </p>

        <h2>Combining test sittings: the AHPRA 12-month rule</h2>
        <p>This is the single most under-known AHPRA English rule and it changes prep strategy materially.</p>
        <p>
          AHPRA permits combining results across <strong>two sittings of the same test taken within 12 months</strong>, provided each sitting independently meets minimum thresholds in each band/sub-test.
        </p>
        <p>
          Read that carefully. It does <strong>not</strong> mean you can mix-and-match a 7.5 Writing from one sitting with a 7.0 Speaking from another if your other sitting had a 6.5 Writing. The minima must be met in <em>each individual sitting</em> (no band/sub-test below the floor in any sitting being combined). What it does allow is using your strongest scores across two valid sittings to build a combined record that AHPRA will accept.
        </p>
        <p>You also cannot combine across tests &mdash; an IELTS sitting and an OET sitting cannot be combined.</p>

        <CitationHook n={5}>
          AHPRA permits combining results across two sittings of the same test taken within 12 months, provided each sitting individually meets minimum thresholds in each band &mdash; you cannot combine across IELTS and OET, and no individual sitting can fall below the floor.
        </CitationHook>

        <p>
          Always check the live wording of the standard at medicalboard.gov.au before relying on this &mdash; the rule has been refined over the last several years and may be updated.
        </p>

        <h2>How to prepare in 6 weeks while working</h2>
        <p>Most IMGs prep for the English test while still doing clinical work, often in a different time zone than where they&apos;ll sit it. A realistic 6-week plan:</p>
        <h3>Weeks 1&ndash;2 &mdash; diagnostic and format</h3>
        <ul>
          <li>Take one full official practice test, timed and unbroken. Free official tests are at ielts.org and occupationalenglishtest.org.</li>
          <li>Identify the weakest sub-test. It will almost always be Writing.</li>
          <li>Read the official test format guide front to back.</li>
        </ul>
        <h3>Weeks 3&ndash;4 &mdash; drill the weak sub-test</h3>
        <ul>
          <li>For OET: write 3 letters per week, get them marked by an OET-trained tutor or a peer, rewrite. The format (referral, discharge, advice) is learnable inside two weeks if you commit.</li>
          <li>For IELTS: write 4 essays per week (Task 2) plus 4 chart descriptions (Task 1). Use the band-descriptor rubric, not a generic English rubric.</li>
          <li>Drill Listening with the test format, not random podcasts. Format familiarity is half the score.</li>
        </ul>
        <h3>Weeks 5&ndash;6 &mdash; full mocks and Speaking</h3>
        <ul>
          <li>Two full timed mocks per week, one each weekend.</li>
          <li>For OET Speaking: 3 role-plays per week with a partner, recorded and reviewed.</li>
          <li>For IELTS Speaking: rehearse Part 2 (long turn) topics on camera; the structure is learnable.</li>
        </ul>
        <p>
          Book the test before you start prep. A scheduled date with money on the line concentrates effort like nothing else. (Yes, this is the same advice we give for <Link href="/amc-cat1">AMC CAT 1</Link>.)
        </p>

        <h2>Founder note: how Amandeep chose OET</h2>
        <p>Amandeep looked at both. Her reasoning, which I have heard repeated by half a dozen of her IMG friends since:</p>
        <blockquote className="not-prose my-6 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          &ldquo;I write referral letters every week. I have not written an academic essay since medical school. The OET letter format is one I already use; the IELTS Task 2 essay is a skill I&apos;d have to <em>learn</em>, not refresh. I&apos;d rather pay the extra A$167 for content I already work in.&rdquo;
        </blockquote>
        <p>
          She sat OET Medicine in Delhi, cleared all four sub-tests at B on first attempt, and submitted to AHPRA without re-sit. The decisive sub-test was Writing &mdash; she practised the referral letter format for two weeks before the sitting, with feedback from a colleague who had taken OET earlier. That colleague feedback loop was worth more than any paid course.
        </p>
        <p>
          Her counter-recommendation: if you have not done clinical work in the last 12 months, IELTS may genuinely be easier for you, and the lower fee plus wider centre availability matters. Don&apos;t pick OET because IMG forums said so &mdash; pick the test whose content matches your current daily English.
        </p>

        <h2>How AMC&apos;s English requirement differs from AHPRA&apos;s</h2>
        <p>
          This catches IMGs out, so flagging it explicitly: the AMC also has its own English requirement for sitting AMC exams. As of 2026, the <strong>AMC&apos;s English requirement and the AHPRA Registration Standard are aligned at the same minimum thresholds for the same four tests</strong> &mdash; the bar is set centrally by the Medical Board, then echoed by the AMC for its own purposes. In practice, hitting the AHPRA minimum (IELTS 7 each / OET B each / equivalent) clears both.
        </p>
        <p>
          Always check both <a href="https://www.amc.org.au" target="_blank" rel="noopener noreferrer">amc.org.au</a> and <a href="https://www.medicalboard.gov.au" target="_blank" rel="noopener noreferrer">medicalboard.gov.au</a> for the current published standard before booking, because individual test acceptance windows and combined-sitting rules can be tightened independently.
        </p>

        <h2>Where Mostly Medicine fits</h2>
        <p>
          We don&apos;t sell English-test prep &mdash; IELTS and OET both have excellent free official materials and we don&apos;t think there&apos;s a Mostly Medicine wedge here. What Mostly Medicine <em>does</em> solve sits one step downstream: once your English is cleared, the AMC exam is the next bottleneck, and that is where most IMGs lose 6&ndash;12 months. Free tier is honest, Pro is A$19/mo. Try it free at <Link href="/">mostlymedicine.com</Link>.
        </p>
        <p>
          If you&apos;re earlier in the pathway and still mapping the full AMC route, see our <Link href="/img-australia-pathway">IMG Australia Pathway page</Link>, the <Link href="/amc">AMC pillar</Link>, and our deep-dive on <Link href="/amc-vs-plab">AMC vs PLAB</Link>.
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
            <li><a href="https://www.medicalboard.gov.au/Registration-Standards/English-language-skills.aspx" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA / Medical Board of Australia &mdash; English Language Skills Registration Standard</a></li>
            <li><a href="https://www.ahpra.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA</a></li>
            <li><a href="https://www.idp.com/australia/ielts" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">IELTS official (IDP)</a></li>
            <li><a href="https://www.britishcouncil.org/exam/ielts" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">IELTS official (British Council)</a></li>
            <li><a href="https://www.ielts.org" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">IELTS global site</a></li>
            <li><a href="https://www.occupationalenglishtest.org" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">OET Centre (Occupational English Test)</a></li>
            <li><a href="https://www.occupationalenglishtest.org/test-information/single-skill-retake/" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">OET Single Skill Retake policy</a></li>
            <li><a href="https://www.amc.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medical Council</a></li>
            <li><a href="https://www.pearsonpte.com" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Pearson PTE Academic</a></li>
            <li><a href="https://www.ets.org/toefl" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">ETS TOEFL iBT</a></li>
          </ul>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
