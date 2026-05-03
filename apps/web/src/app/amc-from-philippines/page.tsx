import type { Metadata } from "next";
import Link from "next/link";
import CalculatorTeaser from "@/components/CalculatorTeaser";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-from-philippines`;
const TITLE = "AMC Pathway from the Philippines 2026: Complete Guide for Filipino Medical Graduates";
const DESCRIPTION =
  "Step-by-step AMC route for Filipino MD graduates: PRC verification, board exam transcript, EPIC, IELTS/OET, AMC Part 1 + Part 2, AHPRA registration. Realistic 2-3 year timeline and a costed PHP + AUD breakdown.";
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
    "amc from philippines",
    "amc pathway philippines",
    "filipino doctors australia",
    "prc to ahpra",
    "amc cost in php",
    "amc timeline from philippines",
    "epic verification philippines",
    "amc exam filipino md",
    "ahpra registration philippines",
    "philippine board exam to amc",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC Pathway from the Philippines", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "What is the total cost of AMC from the Philippines in PHP?",
    a: "Roughly PHP 850,000-1,500,000 end-to-end depending on attempts, travel, English test resits and relocation. The dominant AUD line items: AMC Part 1 ~A$2,790, AMC Part 2 ~A$3,800-A$4,000, AHPRA + EPIC + English test ~A$1,500-A$2,500, plus relocation. PHP equivalents fluctuate with the AUD-PHP rate (A$1 ≈ PHP 35-40 in mid-2026), so treat the peso figure as approximate, not exact.",
  },
  {
    q: "How long does the AMC pathway take from the Philippines?",
    a: "Realistic 2-3 years from post-graduate internship completion to AHPRA general registration in Australia, assuming first-attempt passes on Part 1 and Part 2 and an OET grade B / IELTS 7.0 each band. PRC primary-source verification timing and visa processing are the most common timeline-stretchers.",
  },
  {
    q: "What documents do I need from AHPRA as a Filipino MD graduate?",
    a: "MD degree certificate, PRC professional licence (board exam pass), Philippine Board Exam transcript, post-graduate internship completion certificate, ECFMG/EPIC primary-source verification, an approved English test (IELTS Academic 7.0 each band or OET grade B), AMC Part 1 + Part 2 certificates, structured CV. PRC certificate of good standing is mandatory.",
  },
  {
    q: "IELTS or OET for Filipino doctors applying to AHPRA?",
    a: "Both accepted. Filipino doctors typically have very strong English from MD-level English-medium training and clinical practice; many clear IELTS Academic 7.0 each band on attempt one. OET is still slightly preferred because the medical-context vocabulary maps better to AMC Clinical (Part 2). Either works.",
  },
  {
    q: "Does my USMLE prep transfer to AMC?",
    a: "Partially. USMLE Step 1/2 candidates have strong basic-science and pathophysiology knowledge that transfers to AMC Part 1 systems-based MCQs. The gap is Australian-context: PBS-listed first-line therapy, eTG (Therapeutic Guidelines), Australian Immunisation Handbook, and primary-care framing. Add 3-4 months of Australian-context drilling to your USMLE base.",
  },
  {
    q: "What if my PRC licence name does not match my MD degree?",
    a: "Fix in the Philippines before AMC. AHPRA rejects inconsistent identity. Update PSA-issued birth certificate (if applicable), passport, MD degree, PRC licence and EPIC to a single legal name. For marriage-related changes, PSA marriage certificate plus PRC name update is the standard route.",
  },
  {
    q: "Can I work in Australia before passing AMC?",
    a: "No for medical roles. Without AMC certification you cannot get AHPRA medical registration and cannot work as a doctor. Some IMGs work in nursing-bridge roles (if dual-trained), research assistant, or non-clinical roles on student or partner visas while preparing - this is not a doctor pathway though.",
  },
  {
    q: "Is there a Philippines-Australia bilateral agreement for doctors?",
    a: "No mutual recognition agreement exists for medical practitioners between the Philippines and Australia. Filipino doctors must complete the standard AMC + AHPRA pathway. Nursing has different bilateral arrangements; medicine does not.",
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
            AMC From Philippines · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            AMC Pathway from the Philippines 2026: Complete Guide for Filipino Medical Graduates
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          The Philippines is a top-ten source country for overseas-trained doctors registered with AHPRA in Australia (per AIHW Medical Workforce data). Filipino MD holders register via the standard AMC pathway: PRC professional licence → ECFMG/EPIC primary-source verification → an approved English test → AMC CAT 1 (MCQ) → AMC CAT 2 (Clinical) → AHPRA. Total end-to-end cost lands in the A$24,000-A$33,000 band (roughly PHP 850,000-1.2 million for a single-attempt applicant, fluctuating with the AUD-PHP rate).
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you are a Filipino MD graduate searching &ldquo;AMC from Philippines&rdquo;, &ldquo;PRC to AHPRA&rdquo; or &ldquo;AMC cost in PHP&rdquo;, this is the page that answers all three honestly. The pathway is well-trodden by graduates of UP-PGH, UST, FEU-NRMF, Cebu Doctors, AdventistU, Pamantasan ng Lungsod ng Maynila, and others - but full of small gotchas (USMLE-prep candidates pivoting to AMC, PRC name discrepancies post-marriage, internship logbook structure) that turn a 2-year plan into a 4-year one.
        </p>
        <p>
          I write this as the founder of <Link href="/">Mostly Medicine</Link>. My wife, Dr Amandeep Kamboj, is an Indian-trained AMC pass-graduate currently completing recency in Gurugram. The platform exists because she catalogued every avoidable mistake in the IMG pathway. The Philippines-specific gotchas below are drawn from Filipino candidates we have worked with on the platform.
        </p>

        <h2>Who this guide is for</h2>
        <p>
          You are a Filipino medical graduate with an MD from a CHED- and PRC-recognised college, you have completed your post-graduate internship, you have passed the Philippine Physician Licensure Examination, and you are PRC-registered. You want to register and practise medicine in Australia under AHPRA, with a clear path to permanent residency for you and your family.
        </p>
        <p>
          This guide does not cover Filipino specialist diplomates seeking specialist-pathway recognition with the relevant Australian college (RACGP, RACP, RACS, RANZCP) - that is layered on top of AHPRA general registration. Start here, then look at speciality recognition once general registration is in hand.
        </p>

        <h2>The 6-step AMC pathway from the Philippines</h2>
        <ol>
          <li><strong>PRC professional licence + good-standing letter.</strong> Confirm your name on the PRC register matches your PSA-issued birth certificate, passport, MD degree and internship certificate. Request a PRC certificate of good standing for AHPRA - 90-day validity is typical.</li>
          <li><strong>ECFMG / EPIC primary-source verification.</strong> Open an EPIC account at ecfmg.org/epic, upload your MD degree, board exam transcript, internship certificate and PRC licence. EPIC writes directly to your medical college and to PRC for verification. Realistic timeline: 8-16 weeks from the Philippines.</li>
          <li><strong>English test - OET or IELTS Academic.</strong> AHPRA requires OET grade B in all four sub-tests, or IELTS Academic overall 7.0 with no band below 7.0. Filipino doctors often clear IELTS 7.0 each band on attempt one; OET is still slightly preferred for the Clinical (Part 2) crossover benefit.</li>
          <li><strong>AMC Part 1 (CAT 1 - MCQ).</strong> 150 MCQs over 3.5 hours via Pearson VUE. Test centres in Manila and Cebu. AMC fee approximately A$2,790 per attempt. Plan for 3,000+ timed practice MCQs. See <Link href="/amc-cat1">AMC CAT 1 plan</Link>.</li>
          <li><strong>AMC Part 2 (CAT 2 - Clinical).</strong> 16-station OSCE. Some sittings overseas; many Filipino candidates travel to Australia. AMC fee approximately A$3,800-A$4,000 per attempt. See <Link href="/amc-cat2">AMC CAT 2 plan</Link>.</li>
          <li><strong>AHPRA application + recency-of-practice + supervised practice or workplace-based assessment.</strong> Submit AHPRA application with EPIC verification, AMC certificates, English test, identity, good standing and CV. AHPRA processing typically 4-6 months. Provisional registration follows; general registration follows a supervised year.</li>
        </ol>

        <CitationHook n={1}>
          For Filipino MD graduates, the AMC pathway runs PRC professional licence → EPIC primary-source verification → OET/IELTS → AMC Part 1 → AMC Part 2 → AHPRA - a six-step sequence that takes 2-3 years end-to-end on a clean run.
        </CitationHook>

        <h2>Document checklist (Philippine MD specifically)</h2>
        <ul>
          <li>MD degree certificate from a CHED- and PRC-recognised college (UP-PGH, UST, FEU-NRMF, Cebu Doctors, UE-RM, MCU, AdventistU, etc.)</li>
          <li>Detailed transcript of records (TOR) for the four-year MD program</li>
          <li>Pre-medical undergraduate degree transcript (BS Biology, BS Psychology, etc.) - some AHPRA assessors request it</li>
          <li>Post-graduate internship certificate (one year) issued by the affiliated teaching hospital + college</li>
          <li>Philippine Physician Licensure Examination (board exam) transcript / certificate of passing</li>
          <li>PRC professional licence (current and valid)</li>
          <li>PRC certificate of good standing - issued for AHPRA</li>
          <li>EPIC account at <a href="https://www.ecfmg.org/epic" target="_blank" rel="noopener noreferrer">ecfmg.org/epic</a> with primary-source verification of MD, internship, board exam and PRC</li>
          <li>OET or IELTS Academic test report meeting AHPRA standard</li>
          <li>AMC Part 1 result and AMC Part 2 result</li>
          <li>Philippine passport (valid 12+ months) and PSA-issued birth certificate</li>
          <li>Identity name-match: PSA birth certificate, passport, MD degree, PRC licence and EPIC must all show the same legal name. Marriage-related surname changes are the most common Filipino-applicant mismatch source.</li>
          <li>Structured CV - reverse chronological, gap years explained explicitly</li>
        </ul>

        <h2>Cost breakdown in PHP + AUD</h2>
        <p>
          Currency rates fluctuate. The AUD-PHP rate has moved between roughly 35 and 40 over the last two years; treat the PHP column as approximate, not precise. Use BSP-published or your bank&apos;s rate on the day you transact.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Cost line</th>
                <th className="px-4 py-3 font-semibold">AUD (2026)</th>
                <th className="px-4 py-3 font-semibold">PHP (approx, fluctuates)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">EPIC primary-source verification</td>
                <td className="px-4 py-3">~A$200-A$400</td>
                <td className="px-4 py-3">~PHP 7,500-15,500</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">OET (one sitting)</td>
                <td className="px-4 py-3">~A$587</td>
                <td className="px-4 py-3">~PHP 22,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">IELTS Academic (one sitting)</td>
                <td className="px-4 py-3">~A$420</td>
                <td className="px-4 py-3">~PHP 16,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AMC Part 1 (per attempt)</td>
                <td className="px-4 py-3">~A$2,790</td>
                <td className="px-4 py-3">~PHP 105,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AMC Part 2 (per attempt)</td>
                <td className="px-4 py-3">~A$3,800-A$4,000</td>
                <td className="px-4 py-3">~PHP 145,000-152,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AHPRA application + initial registration</td>
                <td className="px-4 py-3">~A$700-A$1,200</td>
                <td className="px-4 py-3">~PHP 26,000-46,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Travel for Part 2 (Manila → AU)</td>
                <td className="px-4 py-3">~A$1,800-A$3,000</td>
                <td className="px-4 py-3">~PHP 68,000-114,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Visa (subclass 482) + medicals</td>
                <td className="px-4 py-3">~A$3,000-A$4,500</td>
                <td className="px-4 py-3">~PHP 114,000-171,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Relocation buffer (first 3 months)</td>
                <td className="px-4 py-3">~A$10,000-A$15,000</td>
                <td className="px-4 py-3">~PHP 380,000-570,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium"><strong>Total (single-attempt, single applicant)</strong></td>
                <td className="px-4 py-3"><strong>~A$23,000-A$32,000</strong></td>
                <td className="px-4 py-3"><strong>~PHP 870,000-1,200,000</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Add A$2,790 (~PHP 105,000) for each AMC Part 1 resit and A$3,800+ for each Part 2 resit. Use our <Link href="/amc-fee-calculator">AMC fee calculator</Link> to model your specific scenario. Sources: <a href="https://www.amc.org.au/assessment/fees" target="_blank" rel="noopener noreferrer">amc.org.au/assessment/fees</a>, <a href="https://www.ahpra.gov.au" target="_blank" rel="noopener noreferrer">ahpra.gov.au</a>, OET and IELTS Philippines fee schedules.
        </p>

        <CitationHook n={2}>
          End-to-end AMC cost from the Philippines for a single first-attempt applicant lands in the A$23,000-A$32,000 band (approximately PHP 870,000-1,200,000 at current rates), dominated by AMC Part 1 + Part 2 fees and relocation, not by exam prep materials.
        </CitationHook>

        <h2>Timeline from the Philippines: realistic 2-3 year window</h2>
        <p>
          Below is a clean, single-attempt timeline starting from PRC licensure (board exam pass + post-graduate internship complete). Add 4-6 months per AMC resit; add 6-12 months if you have a recency gap or are mid-residency in the Philippines.
        </p>
        <ul>
          <li><strong>Month 0-3:</strong> PRC active licence in hand. Open EPIC account. Begin PRC good-standing letter request. Begin OET or IELTS prep.</li>
          <li><strong>Month 3-6:</strong> EPIC verification in progress. Sit OET or IELTS. Begin AMC Part 1 prep with timed MCQs.</li>
          <li><strong>Month 6-12:</strong> AMC Part 1 (CAT 1) sat from Manila or Cebu. Continue clinical posting in the Philippines for recency.</li>
          <li><strong>Month 12-18:</strong> AMC Part 2 (CAT 2) prep + sit. Many Filipino candidates travel to Australia for Part 2.</li>
          <li><strong>Month 18-24:</strong> AHPRA application submitted. Begin 482 visa workflow with sponsoring hospital. Recency closure if needed.</li>
          <li><strong>Month 24-30:</strong> Provisional AHPRA registration. Land in Australia, start as RMO/PGY1.</li>
          <li><strong>Month 30-36:</strong> General AHPRA registration after supervised year. Next: speciality college pathway or RACGP.</li>
        </ul>
        <p>
          For a date-by-date version of this you can edit, see our <Link href="/amc-timeline-planner">AMC timeline planner</Link>.
        </p>

        <h2>Common mistakes Filipino MD graduates make</h2>
        <ol>
          <li><strong>USMLE prep candidates underestimating Australian-context drilling.</strong> Many UP, UST and Cebu Doctors graduates are originally USMLE-bound and pivot to AMC. The basic-science overlap is ~70%; the gap is PBS first-line therapy, eTG, Australian Immunisation Handbook and primary-care framing. Add 3-4 months of Australian-context drilling.</li>
          <li><strong>PRC licence name discrepancy after marriage.</strong> Common for women MDs who married between MD graduation and PRC licensure. PSA-issued marriage certificate plus PRC name update is the standard fix - do it in the Philippines before EPIC.</li>
          <li><strong>Internship logbook structure confusion.</strong> AHPRA wants the affiliated teaching hospital + college joint certificate, not the rotation log alone. Submit the formal completion certificate, not the daily log.</li>
          <li><strong>Mid-residency timing.</strong> Filipino doctors often start AMC mid-residency (PGY-2/3 of a Philippine specialty program). This is fine for AMC but creates recency continuity issues if you pause residency to relocate. Plan the pause carefully or finish residency first.</li>
          <li><strong>Skipping the board exam transcript.</strong> AHPRA wants the actual board exam transcript - not just the PRC licence. Request it from PRC early; processing can take weeks.</li>
          <li><strong>Underestimating the Australian-style consultation framing in Part 2.</strong> Filipino consultations are often time-pressured and hospitalist-heavy; AMC Clinical weights Australian primary-care framing - shared decision-making, lifestyle counselling, longer consult structure. Drill this explicitly with our <Link href="/calgary-cambridge-consultation">Calgary-Cambridge consultation framework</Link> page.</li>
        </ol>

        <CitationHook n={3}>
          Filipino MD graduates pivoting from USMLE prep to AMC have ~70% basic-science overlap but a meaningful gap in Australian-context items - PBS first-line therapy, eTG (Therapeutic Guidelines), Australian Immunisation Handbook, and primary-care consultation framing.
        </CitationHook>

        <h2>Visa &amp; PR considerations for Filipinos</h2>
        <p>
          Australia&apos;s <strong>subclass 482 (Skills in Demand)</strong> is the standard hospital-sponsored visa for Filipino doctors. ANZSCO 253111 Medical Practitioner is on the Core Skills Occupation List, and 482 covers spouse and dependent children. After 2-3 years on 482 you can typically transition to <strong>subclass 186 (Employer-Sponsored PR)</strong>.
        </p>
        <p>
          Independent skilled options (<strong>subclass 189</strong>) and state-nominated (<strong>subclass 190</strong>) are theoretically available - the points test does not discriminate by nationality. Filipino doctors with strong English scores often score well on points-based independent options.
        </p>
        <p>
          <strong>DAMA (Designated Area Migration Agreements)</strong> - Northern Territory, Orana NSW, Far North Queensland and Goldfields WA all have current DAMAs covering medical practitioners and offer compressed paths to PR in exchange for 2-4 years in regional Australia.
        </p>
        <p>
          The Philippines and Australia have strong nursing-pathway ties but <strong>no</strong> bilateral medical recognition agreement; Filipino doctors register through the standard AMC + AHPRA process. See <Link href="/img-australia-pathway">IMG Australia pathway</Link> for the full visa unpack.
        </p>

        <h2>Recency-of-practice in the Philippines: postings AHPRA accepts</h2>
        <p>
          AHPRA requires recent (typically within 2-3 years), supervised, paid clinical practice. What counts for Filipino candidates:
        </p>
        <ul>
          <li>Resident posts at PRC- and PCMA-recognised teaching hospitals (PGH, St Luke&apos;s, Makati Medical Center, The Medical City, UST Hospital, Cebu Doctors&apos; Hospital, FEU Hospital)</li>
          <li>Government health service / DOH-affiliated MO posts with documented supervision</li>
          <li>Structured residency posts in PHIC-accredited specialty programs with formal supervision logs</li>
        </ul>
        <p>
          Document every shift: dated supervisor signature, hospital letterhead, role description, hours per week, supervision structure. AHPRA assessors are explicit - the burden of proof is yours.
        </p>

        <h2>How Mostly Medicine helps Filipino candidates specifically</h2>
        <p>
          Built for IMGs by a team that walked the documentation and exam gauntlet: 3,000+ AMC MCQs filterable by Australian-context tag (PBS, eTG, Australian Immunisation Handbook), AMC Handbook RolePlay and Clinical RolePlay built on the Anthropic Claude API for Part 2 simulation, and Peer RolePlay for live OSCE rehearsal. Pricing in AUD, free tier honest, Pro is A$19/mo (roughly PHP 700). Philippines-specific drilling: USMLE-to-AMC bridge content covering PBS first lines, Australian-context ethics, and Australian primary-care consultation framing.
        </p>

        <CitationHook n={4}>
          Filipino MD graduates typically score strong on USMLE-style basic-science MCQs but under-score on Australian-context distractors (PBS first-line therapy, eTG-listed treatment, primary-care framing) - a context gap, not a knowledge gap, fixed by 3-4 months of targeted Australian-context drilling.
        </CitationHook>

        <h2>Founder note</h2>
        <p>
          My wife is Indian-trained, but the Filipino MDs I have spoken to on Mostly Medicine consistently flag the same three pain points: USMLE-to-AMC pivot Australian-context gap, marriage-related PRC name updates, and Australian-style primary-care framing on Part 2. The Filipino prep advantage: very strong English plus solid USMLE-style systems knowledge often gets Filipino candidates over the Part 1 line on attempt one. The Filipino prep gap: Australian primary-care orientation in Clinical (Part 2) - shared decision-making, lifestyle counselling, longer consultation structure. Drill these explicitly and your trajectory looks excellent.
        </p>

        <CitationHook n={5}>
          The Philippines is a top-ten source country for overseas-trained doctors registered with AHPRA in Australia, per Australian Institute of Health and Welfare (AIHW) Medical Workforce data - thousands of Filipino-trained doctors are actively practising in Australia today.
        </CitationHook>

        <h2>What to read next</h2>
        <p>If this answered the &ldquo;how&rdquo; for the Philippines, the next reads sharpen the &ldquo;what&rdquo;:</p>
        <ul>
          <li><Link href="/amc">AMC overview pillar</Link> - the master pathway page</li>
          <li><Link href="/amc-cat1">AMC CAT 1 plan</Link> - structured MCQ prep</li>
          <li><Link href="/amc-cat2">AMC CAT 2 plan</Link> - clinical OSCE prep</li>
          <li><Link href="/amc-vs-plab">AMC vs PLAB</Link> - if you are still deciding Australia vs UK</li>
          <li><Link href="/amc-pass-rates-by-country">AMC pass rates by country</Link> - what the data actually shows IMGs</li>
          <li><Link href="/ielts-vs-oet">IELTS vs OET</Link> - choosing your AHPRA English test</li>
          <li><Link href="/img-australia-pathway">IMG Australia pathway</Link> - visa + employment side</li>
          <li><Link href="/amc-fee-calculator">AMC fee calculator</Link> - your specific PHP scenario</li>
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
          If you are a Filipino MD graduate planning AMC and want a structured prep platform that bridges USMLE-prep habits to AMC Australian-context items - try Mostly Medicine free at <Link href="/">mostlymedicine.com</Link>. The free tier is genuinely useful even if you never upgrade.
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
            <li><a href="https://www.prc.gov.ph" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Professional Regulation Commission (Philippines)</a></li>
            <li><a href="https://immi.homeaffairs.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Department of Home Affairs (visa subclasses 482, 186, 189, 190, DAMA)</a></li>
            <li><a href="https://occupationaltrainingengland.com" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">OET official</a></li>
          </ul>
        </div>
      </article>
    </main>
  );
}
