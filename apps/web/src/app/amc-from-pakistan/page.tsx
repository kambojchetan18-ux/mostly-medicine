import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import CalculatorTeaser from "@/components/CalculatorTeaser";
import PillarPageNav from "@/components/PillarPageNav";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-from-pakistan`;
const TITLE = "AMC Pathway from Pakistan 2026: Complete Guide for PMC-Registered Doctors";
const DESCRIPTION =
  "Step-by-step AMC route for Pakistani MBBS graduates: PMC verification, FPC, EPIC, IELTS/OET, AMC Part 1 + Part 2, AHPRA registration. Realistic 2-3 year timeline and a costed PKR + AUD breakdown.";
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
    "amc from pakistan",
    "amc pathway pakistan",
    "pmc to ahpra",
    "pakistani doctors australia",
    "amc cost in pkr",
    "amc timeline from pakistan",
    "epic verification pakistan",
    "fpc pakistan",
    "amc exam pakistani mbbs",
    "ahpra registration pakistan",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC Pathway from Pakistan", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "What is the total cost of AMC from Pakistan in PKR?",
    a: "Roughly PKR 70-160 lakh end-to-end depending on attempts, travel, English test resits and relocation. The dominant AUD line items: AMC Part 1 ~A$2,790, AMC Part 2 ~A$3,800-A$4,000, AHPRA + EPIC + English test ~A$1,500-A$2,500, plus relocation and bridging costs. PKR equivalents fluctuate sharply with the AUD-PKR rate (A$1 ≈ PKR 180-200 in mid-2026), so treat the rupee figure as approximate, not exact.",
  },
  {
    q: "How long does the AMC pathway take from Pakistan?",
    a: "Realistic 2.5-3.5 years from house-job completion to AHPRA general registration in Australia, assuming first-attempt passes on Part 1 and Part 2 and an OET grade B / IELTS 7.0 each band. PMC verification delays and visa processing are the most common timeline-stretchers for Pakistani candidates.",
  },
  {
    q: "What documents do I need from AHPRA as a Pakistani MBBS graduate?",
    a: "MBBS degree certificate, PMC permanent registration certificate (form F-2 equivalent), house-job/internship completion certificate from your medical college, FPC certification where required, ECFMG/EPIC primary-source verification, an approved English test (IELTS Academic 7.0 each band or OET grade B), AMC Part 1 + Part 2 certificates, structured CV. Good standing letters from PMC and any prior provincial council are mandatory.",
  },
  {
    q: "IELTS or OET for Pakistani doctors applying to AHPRA?",
    a: "Both accepted. Pakistani doctors trained in English-medium MBBS often clear all four OET sub-tests on attempt 1 or 2; IELTS Academic 7.0 in writing remains the harder band for many. OET also tests medical-context English which maps better to the AMC and clinical practice. Default to OET unless you have a strong IELTS reason.",
  },
  {
    q: "What if my PMC registration name does not match my MBBS degree?",
    a: "Fix this in Pakistan before starting AMC. AHPRA rejects inconsistent identity. Update CNIC, passport, MBBS degree, PMC certificate and EPIC to a single legal name. Pakistani gazette notification is the cleanest fix for legal name changes; for marriage-related surname changes, marriage certificate plus PMC name update is the standard route.",
  },
  {
    q: "Can I work in Australia before passing AMC?",
    a: "No for medical roles. Without AMC certification you cannot get AHPRA medical registration and cannot work as a doctor. Some IMGs work in non-clinical research or admin roles on student or partner visas while preparing, but this is not a doctor pathway.",
  },
  {
    q: "Are there sponsorship paths for Pakistani doctors via 482?",
    a: "Yes. The subclass 482 (Skills in Demand) visa is the standard hospital-sponsored route for Pakistani doctors. ANZSCO 253111 Medical Practitioner is on the Core Skills Occupation List, and 482 covers spouse and dependent children. Regional DAMA agreements offer compressed paths to PR for medical practitioners.",
  },
  {
    q: "Should I do AMC from Pakistan or move to Australia first?",
    a: "Sit AMC Part 1 from Pakistan - it is offered globally via Pearson VUE in Karachi, Lahore and Islamabad. AMC Part 2 has overseas centres for some sittings, with many Pakistani candidates travelling to Australia. Moving to Australia before any AMC pass means burning savings without the right to practise medicine.",
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
            AMC From Pakistan · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            AMC Pathway from Pakistan 2026: Complete Guide for PMC-Registered Doctors
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          Pakistan is a top-ten source country for overseas-trained doctors registered with AHPRA in Australia (per AIHW Medical Workforce data). Pakistani MBBS holders register via the standard AMC pathway: PMC permanent registration → ECFMG/EPIC primary-source verification → an approved English test → AMC CAT 1 (MCQ) → AMC CAT 2 (Clinical) → AHPRA. Total end-to-end cost lands in the A$24,000-A$33,000 band (roughly PKR 50-70 lakh for a single-attempt applicant, fluctuating with the AUD-PKR rate).
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you are a Pakistani MBBS graduate searching &ldquo;AMC from Pakistan&rdquo;, &ldquo;PMC to AHPRA&rdquo; or &ldquo;AMC cost in PKR&rdquo;, this is the page that answers all three honestly. The pathway is well-trodden by graduates of Dow, KMC, AKU, AIMC, KEMU, RMC and FJMC - but full of small gotchas (form F-2 vs F-1 confusion, FPC scope-of-practice mismatches, internship certificates issued by hospitals rather than colleges) that turn a 2-year plan into a 4-year one.
        </p>
        <p>
          I write this as the founder of <Link href="/">Mostly Medicine</Link>. My wife, Dr Amandeep Kamboj, is an Indian-trained AMC pass-graduate currently completing recency in Gurugram - and the platform exists because she catalogued every avoidable mistake in the South-Asian IMG pathway. The Pakistan-specific gotchas below are drawn from Pakistani candidates we have worked with on the platform.
        </p>

        <h2>Who this guide is for</h2>
        <p>
          You are a Pakistani medical graduate with an MBBS from a PMC-recognised college, you have completed your one-year house-job (internship), and you are PMC-permanent-registered. You want to register and practise medicine in Australia under AHPRA, with a clear path to permanent residency for you and your family.
        </p>
        <p>
          This guide does not cover Pakistani MD/FCPS/MRCP holders seeking specialist-pathway recognition with the relevant Australian college (RACGP, RACP, RACS) - that is layered on top of AHPRA general registration. Start here, then consider speciality recognition once general registration is in hand.
        </p>

        <h2>The 6-step AMC pathway from Pakistan</h2>
        <ol>
          <li><strong>PMC permanent registration + good-standing letter.</strong> Confirm your name on the Pakistan Medical Commission register matches your CNIC, passport, MBBS degree and house-job completion certificate. Request a good-standing certificate (often issued as form F-2 equivalent depending on PMC&apos;s current forms).</li>
          <li><strong>FPC (where applicable) and ECFMG / EPIC primary-source verification.</strong> Open an EPIC account at ecfmg.org/epic, upload MBBS degree, house-job certificate and PMC registration. EPIC writes directly to your medical college and to PMC for verification. Realistic timeline: 10-20 weeks from Pakistan (PMC verification responses are slower than NMC India in our observation).</li>
          <li><strong>English test - OET (preferred) or IELTS Academic.</strong> AHPRA requires OET grade B in all four sub-tests, or IELTS Academic overall 7.0 with no band below 7.0. Book early - OET has fewer test dates in Karachi/Lahore/Islamabad than in Indian metros.</li>
          <li><strong>AMC Part 1 (CAT 1 - MCQ).</strong> 150 MCQs over 3.5 hours via Pearson VUE. Test centres available in Karachi, Lahore and Islamabad. AMC fee approximately A$2,790 per attempt. Plan for 3,000+ timed practice MCQs. See <Link href="/amc-cat1">AMC CAT 1 plan</Link>.</li>
          <li><strong>AMC Part 2 (CAT 2 - Clinical).</strong> 16-station OSCE. Some sittings overseas; most Pakistani candidates travel to Australia. AMC fee approximately A$3,800-A$4,000 per attempt. See <Link href="/amc-cat2">AMC CAT 2 plan</Link>.</li>
          <li><strong>AHPRA application + recency-of-practice + supervised practice or workplace-based assessment.</strong> Submit AHPRA application with EPIC verification, AMC certificates, English test, identity, good standing and CV. AHPRA processing typically 4-6 months. Provisional registration follows; general registration follows a supervised year.</li>
        </ol>

        <CitationHook n={1}>
          For Pakistani MBBS graduates, the AMC pathway runs PMC permanent registration → EPIC primary-source verification → OET/IELTS → AMC Part 1 → AMC Part 2 → AHPRA - a six-step sequence that takes 2.5-3.5 years end-to-end on a clean run.
        </CitationHook>

        <h2>Document checklist (Pakistani MBBS specifically)</h2>
        <ul>
          <li>MBBS degree certificate (final, not provisional) from a PMC-recognised college (DOW, KMC, AKU, KEMU, AIMC, RMC, FJMC, Aga Khan, etc.)</li>
          <li>Detailed mark sheets / DMC for all MBBS phases</li>
          <li>One-year house-job (internship) completion certificate issued by the college / parent university - <strong>not</strong> by the hospital alone where you rotated</li>
          <li>PMC permanent registration certificate (form F-2 equivalent)</li>
          <li>PMC good-standing letter / certificate of good standing - issued for AHPRA</li>
          <li>FPC certification where your training requires it</li>
          <li>EPIC account at <a href="https://www.ecfmg.org/epic" target="_blank" rel="noopener noreferrer">ecfmg.org/epic</a> with primary-source verification of MBBS, house-job and PMC</li>
          <li>OET or IELTS Academic test report meeting AHPRA standard</li>
          <li>AMC Part 1 result and AMC Part 2 result</li>
          <li>Pakistani passport (valid 12+ months) and CNIC</li>
          <li>Identity name-match: CNIC, passport, MBBS degree, PMC certificate and EPIC must all show the same legal name. Mismatch is a top reason AHPRA applications get parked for Pakistani applicants.</li>
          <li>Structured CV - reverse chronological, gap years explained explicitly</li>
        </ul>

        <h2>Cost breakdown in PKR + AUD</h2>
        <p>
          Currency rates fluctuate sharply. The AUD-PKR rate has moved meaningfully over the last two years; treat the PKR column as approximate, not precise. Use the State Bank of Pakistan or your forex provider rate on the day you transact.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Cost line</th>
                <th className="px-4 py-3 font-semibold">AUD (2026)</th>
                <th className="px-4 py-3 font-semibold">PKR (approx, fluctuates)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">EPIC primary-source verification</td>
                <td className="px-4 py-3">~A$200-A$400</td>
                <td className="px-4 py-3">~PKR 40,000-80,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">OET (one sitting)</td>
                <td className="px-4 py-3">~A$587</td>
                <td className="px-4 py-3">~PKR 1.15 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">IELTS Academic (one sitting)</td>
                <td className="px-4 py-3">~A$420</td>
                <td className="px-4 py-3">~PKR 84,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AMC Part 1 (per attempt)</td>
                <td className="px-4 py-3">~A$2,790</td>
                <td className="px-4 py-3">~PKR 5.6 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AMC Part 2 (per attempt)</td>
                <td className="px-4 py-3">~A$3,800-A$4,000</td>
                <td className="px-4 py-3">~PKR 7.6-8 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AHPRA application + initial registration</td>
                <td className="px-4 py-3">~A$700-A$1,200</td>
                <td className="px-4 py-3">~PKR 1.4-2.4 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Travel for Part 2 (Karachi/Lahore → AU)</td>
                <td className="px-4 py-3">~A$2,500-A$4,500</td>
                <td className="px-4 py-3">~PKR 5-9 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Visa (subclass 482) + medicals</td>
                <td className="px-4 py-3">~A$3,000-A$4,500</td>
                <td className="px-4 py-3">~PKR 6-9 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Relocation buffer (first 3 months)</td>
                <td className="px-4 py-3">~A$10,000-A$15,000</td>
                <td className="px-4 py-3">~PKR 20-30 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium"><strong>Total (single-attempt, single applicant)</strong></td>
                <td className="px-4 py-3"><strong>~A$24,000-A$34,000</strong></td>
                <td className="px-4 py-3"><strong>~PKR 50-70 lakh</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Add A$2,790 (~PKR 5.6 lakh) for each AMC Part 1 resit and A$3,800+ for each Part 2 resit. Use our <Link href="/amc-fee-calculator">AMC fee calculator</Link> to model your specific scenario. Sources: <a href="https://www.amc.org.au/assessment/fees" target="_blank" rel="noopener noreferrer">amc.org.au/assessment/fees</a>, <a href="https://www.ahpra.gov.au" target="_blank" rel="noopener noreferrer">ahpra.gov.au</a>, OET and IELTS Pakistan fee schedules.
        </p>

        <CitationHook n={2}>
          End-to-end AMC cost from Pakistan for a single first-attempt applicant lands in the A$24,000-A$34,000 band (approximately PKR 50-70 lakh at current rates), dominated by AMC Part 1 + Part 2 fees and relocation, not by exam prep materials.
        </CitationHook>

        <h2>Timeline from Pakistan: realistic 2.5-3.5 year window</h2>
        <p>
          Below is a clean, single-attempt timeline starting from house-job completion. Add 4-6 months per AMC resit; add 6-12 months if you have a recency gap, or if PMC verification responses to EPIC stall.
        </p>
        <ul>
          <li><strong>Month 0-3:</strong> PMC permanent registration. Open EPIC account. Begin PMC good-standing letter request. Begin OET prep.</li>
          <li><strong>Month 3-7:</strong> EPIC verification in progress (PMC responds slower than some councils - chase weekly). Sit OET or IELTS. Begin AMC Part 1 prep with timed MCQs.</li>
          <li><strong>Month 7-13:</strong> AMC Part 1 (CAT 1) sat from Karachi/Lahore/Islamabad. Continue clinical posting in Pakistan for recency.</li>
          <li><strong>Month 13-20:</strong> AMC Part 2 (CAT 2) prep + sit. Most Pakistani candidates travel to Australia for Part 2.</li>
          <li><strong>Month 20-26:</strong> AHPRA application submitted. Begin 482 visa workflow with sponsoring hospital. Recency closure if needed.</li>
          <li><strong>Month 26-32:</strong> Provisional AHPRA registration. Land in Australia, start as RMO/PGY1.</li>
          <li><strong>Month 32-40:</strong> General AHPRA registration after supervised year. Next: speciality college or RACGP pathway.</li>
        </ul>
        <p>
          For a date-by-date version of this you can edit, see our <Link href="/amc-timeline-planner">AMC timeline planner</Link>.
        </p>

        <h2>Common mistakes Pakistani MBBS graduates make</h2>
        <ol>
          <li><strong>PMC verification delays via EPIC.</strong> PMC has historically been slower than India&apos;s NMC at responding to EPIC verification requests, and has gone through structural reorganisations. Build in 3-5 months for verification, not 6-8 weeks. Chase EPIC and PMC weekly.</li>
          <li><strong>House-job certificate from the hospital, not the college.</strong> AHPRA wants the college- or university-issued completion certificate, not a hospital appointment letter. This trips up candidates who house-jobbed at attached vs affiliated hospitals.</li>
          <li><strong>Form F-1 vs F-2 confusion.</strong> Provisional vs permanent PMC registration documents are different. Submit the permanent registration document (F-2 equivalent under current PMC forms), not the provisional one issued during house-job.</li>
          <li><strong>Gap years on EPIC unexplained.</strong> EPIC reflects every year you have been registered. Gaps of 12+ months without explanation get flagged at AHPRA. Document gap years explicitly with dated affidavits, study certificates, or family-care declarations.</li>
          <li><strong>Name discrepancy: CNIC, passport, MBBS, PMC.</strong> A surname change after marriage or English transliteration drift between Urdu and English documents are common. Fix in Pakistan via gazette notification before EPIC.</li>
          <li><strong>Underestimating OET writing.</strong> Pakistani doctors trained in English-medium MBBS often clear listening, reading and speaking but stall on writing on attempt one. Book a writing-specific tutor for 4-6 weeks before the test.</li>
        </ol>

        <CitationHook n={3}>
          The single biggest timeline risk for Pakistani MBBS graduates on the AMC pathway is PMC primary-source verification latency to EPIC - budget 3-5 months for verification, not the 6-8 weeks typical of some other councils.
        </CitationHook>

        <h2>Visa &amp; PR considerations for Pakistanis</h2>
        <p>
          Australia&apos;s <strong>subclass 482 (Skills in Demand)</strong> is the standard hospital-sponsored visa for Pakistani doctors. ANZSCO 253111 Medical Practitioner is on the Core Skills Occupation List, and 482 covers spouse and dependent children. After 2-3 years on 482 you can typically transition to <strong>subclass 186 (Employer-Sponsored PR)</strong>.
        </p>
        <p>
          Independent skilled options (<strong>subclass 189</strong>) and state-nominated (<strong>subclass 190</strong>) are theoretically available - the points test does not discriminate by nationality. In practice most Pakistani doctors take 482 first, get to PR via 186.
        </p>
        <p>
          <strong>DAMA (Designated Area Migration Agreements)</strong> are particularly useful for Pakistani applicants. Northern Territory, Orana NSW, Far North Queensland and Goldfields WA all have current DAMAs covering medical practitioners and offer compressed paths to PR in exchange for 2-4 years in regional Australia.
        </p>
        <p>
          There is no Pakistan-Australia bilateral medical recognition agreement; eligibility runs through the standard AMC + AHPRA process. See <Link href="/img-australia-pathway">IMG Australia pathway</Link> for the full visa unpack.
        </p>

        <h2>Recency-of-practice in Pakistan: postings AHPRA accepts</h2>
        <p>
          AHPRA requires recent (typically within 2-3 years), supervised, paid clinical practice. Generic observerships and unsupervised private practice usually do <strong>not</strong> count. What does count for Pakistani candidates:
        </p>
        <ul>
          <li>House officer / medical officer posts at PMC-recognised teaching hospitals (Aga Khan, Shaukat Khanum, Mayo, Jinnah Postgraduate, Civil Karachi, Lahore General, PIMS Islamabad)</li>
          <li>Permanent or contract MO posts at federal or provincial health service hospitals with documented supervision</li>
          <li>Structured residency posts (CPSP-track or PMC-recognised) with formal supervision logs</li>
        </ul>
        <p>
          Document every shift: dated supervisor signature, hospital letterhead, role description, hours per week, supervision structure. AHPRA assessors are explicit - the burden of proof is yours, and Pakistani applicants get extra scrutiny on supervision documentation, so over-document.
        </p>

        <h2>How Mostly Medicine helps Pakistani candidates specifically</h2>
        <p>
          Built for South-Asian IMGs by a team that walked the same documentation gauntlet: 3,000+ AMC MCQs filterable by Australian-context tag (PBS, eTG, Australian Immunisation Handbook), AMC Handbook RolePlay and Clinical RolePlay built on the Anthropic Claude API for Part 2 simulation, and Peer RolePlay for live OSCE rehearsal. Pricing in AUD, free tier honest, Pro is A$19/mo (roughly PKR 3,800). Pakistan-specific drilling: PBS first lines, Australian-context ethics and population-health items - the three areas Pakistani-trained candidates routinely under-score on.
        </p>

        <CitationHook n={4}>
          Pakistani MBBS graduates tend to under-score on Australian-context distractors (PBS first-line therapy, Australian Immunisation Handbook items, population-health framing) on AMC Part 1 - not on systems knowledge. The fix is targeted Australian-context drilling, not re-reading textbooks.
        </CitationHook>

        <h2>Founder note</h2>
        <p>
          My wife is Indian, not Pakistani, but the South-Asian MBBS pathway rhymes more than it diverges. The Pakistani candidates I have spoken to on Mostly Medicine consistently flag the same three pain points: PMC verification latency, hospital-vs-college house-job certificates, and OET writing on attempt 1. The Pakistani prep advantage: Pakistani MBBS graduates from AKU, Dow, KMC and AIMC have strong systems knowledge. The Pakistani prep gap: Australian-context therapeutics (PBS first lines), population health, and shared-decision-making framing in Clinical (Part 2). Drill those three buckets and your trajectory looks the same as any other strong IMG.
        </p>

        <CitationHook n={5}>
          Pakistan is a top-ten source country for overseas-trained doctors registered with AHPRA in Australia, per Australian Institute of Health and Welfare (AIHW) Medical Workforce data - thousands of Pakistani-trained doctors are actively practising in Australia today.
        </CitationHook>

        <h2>What to read next</h2>
        <p>If this answered the &ldquo;how&rdquo; for Pakistan, the next reads sharpen the &ldquo;what&rdquo;:</p>
        <ul>
          <li><Link href="/amc">AMC overview pillar</Link> - the master pathway page</li>
          <li><Link href="/amc-cat1">AMC CAT 1 plan</Link> - structured MCQ prep</li>
          <li><Link href="/amc-cat2">AMC CAT 2 plan</Link> - clinical OSCE prep</li>
          <li><Link href="/amc-vs-plab">AMC vs PLAB</Link> - if you are still deciding Australia vs UK</li>
          <li><Link href="/amc-pass-rates-by-country">AMC pass rates by country</Link> - what the data actually shows IMGs</li>
          <li><Link href="/ielts-vs-oet">IELTS vs OET</Link> - choosing your AHPRA English test</li>
          <li><Link href="/img-australia-pathway">IMG Australia pathway</Link> - visa + employment side</li>
          <li><Link href="/amc-fee-calculator">AMC fee calculator</Link> - your specific PKR scenario</li>
          <li><Link href="/amc-timeline-planner">AMC timeline planner</Link> - editable 24-month plan</li>
        </ul>

        <h2>FAQ</h2>
        <div className="not-prose space-y-5 my-6">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm font-semibold text-white mb-2">{f.q}</p>
              <p className="text-sm text-slate-300 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <p className="text-slate-300">
          If you are a Pakistani MBBS graduate planning AMC and want a structured prep platform built by people who walked this path - try Mostly Medicine free at <Link href="/">mostlymedicine.com</Link>. The free tier is genuinely useful even if you never upgrade.
        </p>

        <hr className="border-white/10 my-10" />

        <div className="not-prose text-xs text-slate-500 space-y-1">
          <p><strong className="text-slate-400">Last reviewed:</strong> 2 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 2 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC pass-graduate IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://www.amc.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medical Council</a></li>
            <li><a href="https://www.amc.org.au/assessment/fees" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AMC fee schedule</a></li>
            <li><a href="https://www.ahpra.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA registration standards and overseas-trained doctor guidance</a></li>
            <li><a href="https://www.medicalboard.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Medical Board of Australia</a></li>
            <li><a href="https://www.aihw.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AIHW Medical Workforce</a></li>
            <li><a href="https://www.health.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Department of Health workforce reports</a></li>
            <li><a href="https://www.ecfmg.org/epic" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">ECFMG / EPIC primary-source verification</a></li>
            <li><a href="https://pmc.gov.pk" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Pakistan Medical Commission (PMC)</a></li>
            <li><a href="https://immi.homeaffairs.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Department of Home Affairs (visa subclasses 482, 186, 189, 190, DAMA)</a></li>
            <li><a href="https://occupationaltrainingengland.com" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">OET official</a></li>
          </ul>
        </div>
      </article>
    <SiteFooter />
    </main>
  );
}
