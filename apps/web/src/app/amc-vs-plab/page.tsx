import type { Metadata } from "next";
import Link from "next/link";
import CalculatorTeaser from "@/components/CalculatorTeaser";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-vs-plab`;
const TITLE = "AMC vs PLAB in 2026: Which Exam Should an IMG Take First (Australia or UK)?";
const DESCRIPTION =
  "AMC and PLAB lead to different countries, not different leagues. Compare cost, format, pass rates, registration steps and time-to-PR — and pick the one you actually want to live in.";
const PUBLISHED = "2026-05-02";

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
    "amc vs plab",
    "is plab easier than amc",
    "amc or plab first",
    "plab vs amc difficulty",
    "australia vs uk for img doctors",
    "amc exam cost vs plab cost",
    "plab to amc conversion",
    "img pathway comparison australia uk",
    "which is better amc or plab",
    "can plab doctors work in australia",
    "competent authority pathway uk",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC vs PLAB", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "Is PLAB cheaper than AMC?",
    a: "On exam fees alone, yes — PLAB 1 £268 vs AMC Part 1 ~A$2,790; PLAB 2 £934 vs AMC Part 2 ~A$3,800–A$4,000. Add the mandatory Manchester trip for PLAB 2, English testing, registration fees and relocation, and the gap narrows. Australian RMO salaries close the remainder inside year one of work.",
  },
  {
    q: "Can I take both AMC and PLAB?",
    a: "Yes — there is no rule against it. Most doctors who do both pass PLAB first (often because they trained or worked in the UK), then sit AMC later when relocating to Australia. Passing one does not exempt you from the other under the standard pathway.",
  },
  {
    q: "Does Australia accept PLAB?",
    a: "Not as a substitute for AMC. A doctor with PLAB pass and full GMC registration cannot practise in Australia on PLAB alone — they must sit the AMC, or qualify for the Competent Authority pathway based on GMC registration plus prescribed UK-based supervised experience.",
  },
  {
    q: "Can a UK GMC-registered doctor practise in Australia without sitting AMC?",
    a: "Sometimes — via the AMC's Competent Authority pathway. Eligibility requires substantive GMC full registration plus a defined period of post-registration supervised UK practice, not just a PLAB pass. Check the current criteria on amc.org.au before assuming you qualify.",
  },
  {
    q: "Which leads to PR faster — Australia or UK?",
    a: "Roughly comparable. Australia's typical 482 → 186 path lands around 4–5 years post general registration. UK ILR is 5 years of continuous qualifying employment. Australia's regional/DAMA pathways can shorten this; the UK's Skilled Worker → ILR is more linear.",
  },
  {
    q: "What's the AMC's Competent Authority pathway and does the UK qualify?",
    a: "The Competent Authority pathway exempts certain doctors from standard AMC Part 1 and Part 2. The UK is one of the recognised authorities, but eligibility is not automatic for any UK-registered doctor — it requires GMC full registration plus prescribed UK-based supervised experience. The current criteria are listed on amc.org.au and should be checked directly before relying on them.",
  },
  {
    q: "Is PLAB easier than AMC?",
    a: "Different, not easier. PLAB weights NICE-aligned, often acute scenarios; AMC weights primary-care, PBS-listed therapeutics and patient-centred Australian consultation norms. Aggregate first-attempt pass rates are broadly comparable. The 'easier' question usually reduces to which clinical context matches your training, not which exam is intrinsically softer.",
  },
  {
    q: "Should an Indian MBBS graduate do AMC or PLAB first?",
    a: "Decide on country first. If you want Australia, do AMC — PLAB does not get you Australian registration. If you want to start in the UK and possibly move later, PLAB is fine, but you'll re-sit AMC if Australia becomes the long-term plan.",
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
            AMC vs PLAB · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            AMC vs PLAB in 2026: Which Exam Should an IMG Take First (Australia or UK)?
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          AMC gets you registered in Australia, PLAB gets you registered in the UK — there is no automatic recognition between them. AMC is the more expensive single exam (around A$2,790 for Part 1 vs £268 for PLAB 1) but Australian RMO salaries close the gap inside a year. The honest answer to &ldquo;which first&rdquo; is not difficulty — it&apos;s which country you actually want to build a life in.
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you are a working IMG asking &ldquo;should I do AMC or PLAB first&rdquo;, the worst mistake is to pick the cheaper exam and figure out the country later. Both pathways lead to safe, structured medical careers — but they diverge on cost, salary, family migration, and time to permanent residency. This piece compares them honestly, with citations from AMC, GMC, AHPRA, and the Australian Department of Health.
        </p>
        <p>
          I write as the founder of <Link href="/">Mostly Medicine</Link> and the husband of an AMC-pass IMG. My wife, Dr Amandeep Kamboj, looked seriously at PLAB and chose AMC directly. She finished Part 1, Part 2 and is now completing recency-of-practice in Gurugram before returning to Sydney. Her reasoning is below.
        </p>

        <h2>Quick facts at a glance</h2>
        <ul>
          <li>AMC Part 1 (MCQ) costs around A$2,790 per attempt; PLAB 1 costs £268 (AMC and GMC published 2025–2026 fee schedules).</li>
          <li>AMC has 2 exams (Part 1 MCQ + Part 2 Clinical); PLAB has 2 exams (PLAB 1 SBA + PLAB 2 OSCE).</li>
          <li>The AMC does not publish country-of-training pass rates; the GMC does, by primary medical qualification.</li>
          <li>Australia&apos;s RMO base salary in 2026 sits around A$80,000–A$110,000 (PGY1–PGY3) before overtime; UK FY2 base sits around £37,000 before banding (NHS pay scales 2025/26).</li>
          <li>A doctor with PLAB and full GMC registration cannot practise in Australia without sitting AMC — there is no automatic recognition.</li>
          <li>The UK is on the AMC&apos;s Competent Authority pathway, but only doctors with substantive UK GMC registration plus prescribed UK-based experience qualify — passing PLAB alone does not.</li>
        </ul>

        <h2>What is AMC and what is PLAB?</h2>
        <p>
          The <strong>AMC (Australian Medical Council)</strong> assesses overseas-trained doctors for Australian registration. The standard pathway is two exams — Part 1 (MCQ) and Part 2 (Clinical) — followed by AHPRA registration. Without an AMC certificate (or a Competent Authority exemption), an IMG cannot get general registration in Australia.
        </p>
        <p>
          <strong>PLAB (Professional and Linguistic Assessments Board)</strong> is the GMC&apos;s two-part assessment for UK registration: PLAB 1 (180 SBAs) and PLAB 2 (16-station OSCE). Pass both and you are eligible for full GMC registration with a licence to practise; first UK job is typically as an FY2 clinician.
        </p>

        <CitationHook n={1}>
          AMC certifies you for medical registration in Australia and PLAB certifies you for the UK — there is no automatic mutual recognition; passing one does not register you in the other country.
        </CitationHook>

        <h2>Eligibility: who can sit AMC vs PLAB</h2>
        <p>
          <strong>AMC</strong> requires a primary medical qualification recognised in the World Directory of Medical Schools, an approved English test (IELTS/OET/PTE/TOEFL meeting the AHPRA standard), and primary-source verification through ECFMG/EPIC. Without an AMC ID you cannot book Part 1.
        </p>
        <p>
          <strong>PLAB</strong> requires a GMC-recognised primary medical qualification, an approved English test (IELTS Academic 7.5 overall, no band below 7.0; or OET grade B), and a GMC online account application. The GMC also requires a completed internship before taking up full registration.
        </p>
        <p>
          Book your English test first — it is the single most common rate-limiter for IMGs on either pathway. See <Link href="/ielts-vs-oet">IELTS vs OET for AHPRA</Link>.
        </p>

        <h2>Cost comparison 2026 (the full picture, not just the exam fee)</h2>
        <p>
          Most &ldquo;AMC vs PLAB cost&rdquo; comparisons quote only the exam fee. That&apos;s misleading — the dominant cost is travel, English testing, and registration.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Cost line</th>
                <th className="px-4 py-3 font-semibold">AMC pathway (2026)</th>
                <th className="px-4 py-3 font-semibold">PLAB pathway (2026)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Part 1 / PLAB 1 fee</td>
                <td className="px-4 py-3">~A$2,790 per attempt</td>
                <td className="px-4 py-3">£268 per attempt</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Part 2 / PLAB 2 fee</td>
                <td className="px-4 py-3">~A$3,800–A$4,000</td>
                <td className="px-4 py-3">£934 per attempt</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Test centres</td>
                <td className="px-4 py-3">Part 1 globally via Pearson VUE; Part 2 in Australia + select overseas</td>
                <td className="px-4 py-3">PLAB 1 globally; PLAB 2 only in Manchester, UK</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">English test (typical)</td>
                <td className="px-4 py-3">OET A$587 or IELTS Academic A$420</td>
                <td className="px-4 py-3">Same — both accept IELTS / OET</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Primary-source verification</td>
                <td className="px-4 py-3">ECFMG/EPIC</td>
                <td className="px-4 py-3">GMC online verification</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Registration on pass</td>
                <td className="px-4 py-3">AHPRA application + fee</td>
                <td className="px-4 py-3">GMC registration with licence to practise + fee</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Mandatory international travel</td>
                <td className="px-4 py-3">Optional (Part 2 has overseas centres)</td>
                <td className="px-4 py-3">Mandatory Manchester trip for PLAB 2</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Sources: amc.org.au/assessment/fees, gmc-uk.org, ahpra.gov.au, ecfmg.org/epic.
        </p>
        <p>
          AMC has the higher single-exam fee, but PLAB requires a Manchester trip for PLAB 2 — which closes the gap meaningfully for IMGs in South Asia, the Middle East or Africa. Use our <Link href="/amc-fee-calculator">AMC fee calculator</Link> to model the full A$ stack.
        </p>

        <CitationHook n={2}>
          PLAB 2 can only be sat in Manchester, UK — a mandatory international trip for any IMG outside the UK; AMC Part 2 has more centre flexibility, including overseas sittings.
        </CitationHook>

        <h2>Difficulty: which is harder, AMC or PLAB?</h2>
        <p>
          No honest answer in the abstract. Both test broadly the same medical knowledge against country-specific clinical norms. More useful is what each tests <em>differently</em>.
        </p>
        <p>
          <strong>MCQ paper.</strong> AMC Part 1 is 150 MCQs over 3.5 hours with ~120 scored items. PLAB 1 is 180 SBAs over 3 hours — faster-paced. AMC weights Australian-specific therapeutics heavily (PBS first lines, Therapeutic Guidelines, eTG). The trap on AMC isn&apos;t knowledge — it&apos;s the Australian-context distractor.
        </p>
        <p>
          <strong>Clinical OSCE.</strong> Both are 16 stations × 8 minutes. AMC Part 2 has 14 examined cases plus 2 rest stations; you must pass 10 of 14. PLAB 2 uses a domain-based standard set per cycle. AMC clinical scenarios lean primary-care and Australian-context (&ldquo;PBS-listed antihypertensive&rdquo;, &ldquo;refer back to GP&rdquo;); PLAB 2 leans acute and NICE-aligned. IMGs trained in hospitalist-heavy systems sometimes find PLAB 2 closer to daily reasoning; IMGs with strong outpatient exposure often find AMC closer.
        </p>

        <CitationHook n={3}>
          AMC Clinical (Part 2) tests 16 stations across 14 examined cases — pass 10 to clear; PLAB 2 tests 16 OSCE stations of 8 minutes each, scored against domain-level standards set per cycle.
        </CitationHook>

        <h2>Pass rates compared</h2>
        <p>
          Critical caveat: <strong>AMC and GMC publish pass-rate data at very different levels of granularity.</strong> The GMC publishes PLAB 1 and PLAB 2 pass rates by primary medical qualification — you can look up rates by country group. The AMC publishes only aggregate per-cycle rates, with no country-of-training breakdown.
        </p>
        <p>What the public data shows:</p>
        <ul>
          <li><strong>AMC Part 1 (MCQ) first-attempt</strong> has historically clustered in the 60–70% band across recent cycles (AMC annual reports, amc.org.au/about/statistics). Verified range, not a single year-specific figure.</li>
          <li><strong>AMC Part 2 (Clinical) first-attempt</strong> sits lower, historically 50–65% depending on cycle.</li>
          <li><strong>PLAB 1 first-attempt</strong> published by the GMC has generally sat in the 65–75% global average range, with material country-by-country variation in the published tables.</li>
          <li><strong>PLAB 2 first-attempt</strong> varies substantially by primary medical qualification — see the GMC PLAB statistics page for the current breakdown.</li>
        </ul>
        <p>
          For deeper AMC pass-rate methodology, see <Link href="/amc-pass-rates-by-country">AMC pass rates by country</Link>.
        </p>

        <h2>Career outcomes: registration → first job → PR</h2>
        <p>
          <strong>Australia (AMC → AHPRA → RMO → PR).</strong> After AMC Part 1 + Part 2, apply for AHPRA. Most IMGs start on <strong>provisional registration</strong> as PGY-1 equivalent, move to <strong>general registration</strong> after a supervised year, and work as an RMO. Visa stack: 482 (Skills in Demand) → 186 (Employer-Sponsored PR), with DAMA agreements offering faster regional routes. ANZSCO 253111 Medical Practitioner is on Australia&apos;s Core Skills Occupation List. Realistic time to PR: 4–5 years post general registration via 482 → 186.
        </p>
        <p>
          <strong>UK (PLAB → GMC → FY2 → ILR).</strong> After PLAB, register with the GMC with a licence to practise, enter at FY2-equivalent (often Trust-grade or LAS first), then apply into formal training. Visa stack: Skilled Worker (Health and Care) → ILR after 5 years qualifying residence. Realistic time to PR/ILR: 5 years continuous qualifying employment.
        </p>

        <CitationHook n={4}>
          A UK GMC-registered doctor cannot practise in Australia without sitting the AMC — but UK doctors with substantive GMC registration plus prescribed UK-based experience may qualify for the AMC&apos;s Competent Authority pathway, which exempts them from standard AMC exams.
        </CitationHook>

        <h2>Salary, lifestyle, family</h2>
        <p>
          A 2026 Australian RMO base sits roughly A$80,000–A$110,000 (PGY1–PGY3, before overtime and rural loadings) per state award rates and ASMOF schedules. A 2026 UK FY2 base sits around £37,000 before banding supplements (NHS England pay scales 2025/26). After currency conversion, total RMO package routinely lands 1.6–2× UK FY2 equivalent. The UK has lower out-of-pocket healthcare costs and a more linear specialty training structure; Australia compensates with sunshine and clearer regional-to-PR pathways. Family migration: both countries allow spouse and children inclusion at the time of primary application; Australia&apos;s 482 → 186 keeps family on one visa stream throughout.
        </p>

        <h2>Founder note: why my wife chose AMC, not PLAB</h2>
        <p>
          Amandeep is Punjab MBBS-trained and looked at both pathways. Three things tipped her towards AMC. First, <strong>family geography</strong> — we were partly anchored to Sydney, so AMC fit the life we were already building rather than a hypothetical UK detour. PLAB has the lower headline exam fee, but uprooting twice (Manchester for PLAB 2, then potentially the UK-to-Australia move later) is the real cost. Second, <strong>salary differential</strong> — modelled on RMO and FY2 base rates, the Australian numbers won inside year one; the &ldquo;cheaper exam&rdquo; argument vanishes the moment you compare lifetime salary, not test fees. Third, <strong>specialty fit</strong> — Australia&apos;s primary-care orientation, RACGP and rural generalist routes match what she actually wants to practise.
        </p>
        <p>
          She finished Part 1, then Part 2, and is now completing recency in Gurugram (3 months apart from Sydney as I write this). No regrets on skipping PLAB. Make your decision on country and life — not on whichever test fee is lower.
        </p>

        <h2>Time to PR: AU vs UK side-by-side</h2>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Milestone</th>
                <th className="px-4 py-3 font-semibold">Australia (AMC pathway)</th>
                <th className="px-4 py-3 font-semibold">UK (PLAB pathway)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Pass exams</td>
                <td className="px-4 py-3">AMC Part 1 + Part 2 (typical 12–18 months prep)</td>
                <td className="px-4 py-3">PLAB 1 + PLAB 2 (typical 9–18 months prep)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Register</td>
                <td className="px-4 py-3">AHPRA (4–6 months realistic processing)</td>
                <td className="px-4 py-3">GMC (typically faster, ~weeks once docs in)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">First job</td>
                <td className="px-4 py-3">RMO (PGY1/2 hospital)</td>
                <td className="px-4 py-3">FY2 / Trust-grade / LAS</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Working visa</td>
                <td className="px-4 py-3">482 (4 years), DAMA possible</td>
                <td className="px-4 py-3">Skilled Worker (5 years to ILR)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Permanent residency</td>
                <td className="px-4 py-3">Typically 4–5 years post general registration via 482 → 186</td>
                <td className="px-4 py-3">Typically 5 years via ILR</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Specialty training entry</td>
                <td className="px-4 py-3">Concurrent with RMO years; college-specific</td>
                <td className="px-4 py-3">After FY2; via ST1 application</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          For a deeper unpack of the visa side, see <Link href="/img-australia-pathway">IMG Australia pathway</Link>.
        </p>

        <h2>Can you do both? PLAB-to-AMC is the more common direction</h2>
        <p>
          Yes — and a meaningful number of IMGs do. The most common direction is PLAB-to-AMC: pass PLAB, work in the NHS for 1–2 years, then decide Australia is the better long-term fit. Crucially, <strong>passing PLAB does not exempt you from AMC</strong>. PLAB-only doctors must sit standard AMC.
        </p>
        <p>
          The exception is the <strong>AMC Competent Authority pathway</strong>, which exempts certain doctors (including some UK-registered doctors meeting specific criteria around substantive GMC registration and supervised UK practice duration) from AMC Part 1 and Part 2. It is not a PLAB-pass shortcut — it requires GMC full registration plus prescribed post-registration UK experience. Check the current criteria on amc.org.au directly. Going AMC-to-PLAB is rarer but possible — your AMC certificate does not exempt you from PLAB.
        </p>

        <CitationHook n={5}>
          The AMC Competent Authority pathway lets some UK-registered (and certain other jurisdiction) doctors skip standard AMC exams — but eligibility requires substantive GMC registration plus prescribed post-registration UK experience, not PLAB pass alone.
        </CitationHook>

        <h2>Decision framework: which exam first?</h2>
        <p>Five questions, in order. Answer the first cleanly and the rest usually fall into place.</p>
        <ol>
          <li><strong>Where do you want to live for the next 10 years?</strong> If Australia, do AMC. If UK, do PLAB. Don&apos;t optimise for the cheaper exam.</li>
          <li><strong>Where is your family?</strong> Australia&apos;s 482 → 186 is family-inclusive throughout; UK Skilled Worker is too. Geography of visiting India/Pakistan/Egypt differs meaningfully between the two.</li>
          <li><strong>What specialty do you want?</strong> GP and rural generalist tracks are typically faster in Australia (RACGP, Rural Generalist Pathway). UK CCT routes are well-defined but generally longer for IMGs.</li>
          <li><strong>What&apos;s your English test profile?</strong> Both accept IELTS and OET. Working clinicians usually find OET maps better to daily English. See <Link href="/ielts-vs-oet">IELTS vs OET</Link>.</li>
          <li><strong>What&apos;s your honest budget for prep + exam + travel + first 6 months of relocation?</strong> Model this in numbers — the <Link href="/amc-fee-calculator">AMC fee calculator</Link> and <Link href="/amc-timeline-planner">AMC timeline planner</Link> help.</li>
        </ol>
        <p>
          If your answers point to Australia, next read <Link href="/amc-cat1">AMC CAT 1</Link> for the MCQ plan and <Link href="/amc-cat2">AMC CAT 2</Link> for clinical.
        </p>

        <h2>Where Mostly Medicine fits</h2>
        <p>
          If your decision points to Australia, the next concrete step is structured AMC prep. Mostly Medicine gives IMGs a 3000+ MCQ bank tagged by Australian context (PBS, eTG, immunisation handbook), AMC Handbook RolePlay and Clinical RolePlay built on the Anthropic Claude API for Part 2 simulation, and Peer RolePlay for live practice with another IMG. Free tier is honest, Pro is A$19/mo. Start at <Link href="/">mostlymedicine.com</Link>. For a three-way comparison see <Link href="/amc-vs-usmle-vs-plab">AMC vs USMLE vs PLAB</Link>.
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
          <p><strong className="text-slate-400">Last reviewed:</strong> 2 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 2 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC-pass IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://www.amc.org.au/assessment/fees" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medical Council exam information and fees</a></li>
            <li><a href="https://www.amc.org.au/about/statistics" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AMC statistics and annual reports</a></li>
            <li><a href="https://www.amc.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AMC Competent Authority pathway</a></li>
            <li><a href="https://www.ahpra.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA registration standards</a></li>
            <li><a href="https://www.medicalboard.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Medical Board of Australia</a></li>
            <li><a href="https://www.gmc-uk.org" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">General Medical Council (UK) — PLAB information and fees</a></li>
            <li><a href="https://www.gmc-uk.org" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">GMC PLAB pass rates by primary medical qualification</a></li>
            <li><a href="https://www.nhsemployers.org" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">NHS England pay and conditions (FY2 base salary)</a></li>
            <li><a href="https://asmof.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">ASMOF / state award schedules (RMO base salary)</a></li>
            <li><a href="https://www.health.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Department of Health workforce data</a></li>
            <li><a href="https://www.aihw.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AIHW Medical Workforce</a></li>
            <li><a href="https://immi.homeaffairs.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Department of Home Affairs subclass pages (482, 186, DAMA)</a></li>
            <li><a href="https://www.ecfmg.org/epic" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">ECFMG / EPIC primary-source verification</a></li>
          </ul>
        </div>
      </article>
    </main>
  );
}
