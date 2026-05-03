import type { Metadata } from "next";
import Link from "next/link";
import CalculatorTeaser from "@/components/CalculatorTeaser";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-from-india`;
const TITLE = "AMC Pathway from India 2026: Complete Guide for Indian Medical Graduates";
const DESCRIPTION =
  "Step-by-step AMC route for Indian MBBS graduates: NMC verification, EPIC, IELTS/OET, AMC Part 1 + Part 2, AHPRA registration. Realistic 2-3 year timeline and a costed INR + AUD breakdown.";
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
    "amc from india",
    "amc pathway india",
    "indian mbbs to australia",
    "amc exam for indian doctors",
    "nmc to ahpra",
    "amc cost in inr",
    "amc timeline from india",
    "epic verification india",
    "indian doctors australia 482",
    "ahpra registration india",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC Pathway from India", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "What is the total cost of AMC from India in INR?",
    a: "Roughly INR 14-30 lakh end-to-end depending on attempts, travel, English test resits and relocation. The dominant AUD line items: AMC Part 1 ~A$2,790, AMC Part 2 ~A$3,800-A$4,000, AHPRA application + EPIC + English test ~A$1,500-A$2,500, plus relocation and bridging costs. INR equivalents fluctuate with the AUD rate, so treat the rupee figure as approximate, not exact.",
  },
  {
    q: "How long does the AMC pathway take from India?",
    a: "Realistic 2-3 years from MBBS internship completion to AHPRA general registration in Australia, assuming first-attempt passes on Part 1 and Part 2, OET grade B / IELTS 7.0 each band, and a 4-6 month AHPRA processing window. Recency-of-practice gaps or exam resits push it to 3-4 years.",
  },
  {
    q: "What documents do I need from AHPRA as an Indian MBBS graduate?",
    a: "MBBS degree certificate, MCI/NMC permanent registration certificate, internship completion certificate, ECFMG/EPIC primary-source verification, an approved English test (IELTS Academic 7.0 each band or OET grade B), AMC Part 1 + Part 2 certificates, and a structured Curriculum Vitae. Good standing letters from every regulator you have ever held registration with are also mandatory.",
  },
  {
    q: "IELTS or OET for Indian doctors applying to AHPRA?",
    a: "Both are accepted by AHPRA at the standard threshold. Most Indian doctors find OET maps better to clinical English (the writing and listening tasks are medical-context) and accept it on the second attempt; IELTS Academic 7.0 each band is harder to clear in writing for many. Pick OET unless you have a strong reason to sit IELTS.",
  },
  {
    q: "What if my MCI registration name does not match my MBBS degree?",
    a: "Fix this in India before you start AMC. AHPRA will reject inconsistent identity documents. Get a name correction affidavit, update NMC registration, and ensure passport, MBBS degree, MCI/NMC certificate and EPIC source-verification all reflect the same legal name. Indian gazette notification is the cleanest fix for legal name changes.",
  },
  {
    q: "Can I work in Australia before passing AMC?",
    a: "Generally no for medical roles. Without AMC certification you cannot get AHPRA medical registration, so you cannot work as a doctor. Some IMGs work as research assistants, medical scribes or in non-clinical roles on student or partner visas while preparing, but this is not a doctor pathway.",
  },
  {
    q: "Does AMC have a quota or country cap for Indian doctors?",
    a: "No. AMC does not cap Part 1 or Part 2 sittings by country of training. Every candidate sits the same blueprint, scored on the same scale. AHPRA registration is also not country-capped, though visa allocations under skilled migration programs do vary year to year.",
  },
  {
    q: "Should I do AMC from India or move to Australia first?",
    a: "Almost always sit AMC Part 1 from India - it is offered globally via Pearson VUE. AMC Part 2 has overseas centres for some sittings, and AHPRA processing can begin while you finish recency. Moving to Australia before any AMC pass means burning savings on rent without the right to practise medicine.",
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
            AMC From India · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            AMC Pathway from India 2026: Complete Guide for Indian Medical Graduates
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          India is the largest single source country of overseas-trained doctors in Australia (per AIHW Medical Workforce data). Indian MBBS holders register via the standard AMC pathway: NMC primary-source verification through EPIC, an approved English test, AMC CAT 1 (MCQ), AMC CAT 2 (Clinical), 12 months recency-of-practice and AHPRA application. Total end-to-end cost lands in the A$25,000-A$55,000 band (roughly INR 14-30 lakh, fluctuating with the AUD rate).
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you are an Indian MBBS graduate searching &ldquo;AMC from India&rdquo;, &ldquo;MCI to AHPRA&rdquo; or &ldquo;cost of AMC in INR&rdquo;, this is the page that answers all three honestly. The Indian doctor pathway to Australia is well-trodden but full of small gotchas - name mismatches, EPIC delays, recency postings that AHPRA does not accept - that turn a 2-year plan into a 4-year one.
        </p>
        <p>
          I write this as the founder of <Link href="/">Mostly Medicine</Link> and the husband of an Indian MBBS-trained AMC pass-graduate. My wife, Dr Amandeep Kamboj, is from Punjab and is currently completing recency-of-practice in Gurugram before returning to Sydney. The platform exists because she catalogued every avoidable mistake in the Indian pathway. Several of those gotchas are below.
        </p>

        <h2>Who this guide is for</h2>
        <p>
          You are an Indian medical graduate with an MBBS from an NMC- or MCI-recognised college, you have completed your one-year compulsory rotating internship, and you are NMC-permanent-registered. You want to register and practise medicine in Australia under AHPRA, ideally with a clear path to permanent residency for you and your family.
        </p>
        <p>
          This guide does not cover speciality-trained Indian doctors (MD/MS holders) seeking specialist-pathway recognition with the relevant Australian medical college (RACGP, RACP, RACS etc.) - that is a different process layered on top of AHPRA general registration. Start here, then look at speciality recognition once general registration is in hand.
        </p>

        <h2>The 6-step AMC pathway from India</h2>
        <ol>
          <li><strong>NMC permanent registration + good-standing letter.</strong> Confirm your name on the NMC register matches your passport, MBBS degree and internship completion certificate. Request good-standing/no-objection certificates from NMC and from any state medical council where you have ever been registered.</li>
          <li><strong>ECFMG / EPIC primary-source verification.</strong> Open an EPIC account at ecfmg.org/epic, upload your MBBS degree, internship certificate and NMC registration. EPIC writes directly to your medical college and to NMC for verification. Realistic timeline: 8-16 weeks from India.</li>
          <li><strong>English test - OET (preferred) or IELTS Academic.</strong> AHPRA requires OET grade B in all four sub-tests, or IELTS Academic overall 7.0 with no band below 7.0. Book early; OET dates fill up months ahead in metro India.</li>
          <li><strong>AMC Part 1 (CAT 1 - MCQ).</strong> 150 MCQs over 3.5 hours via Pearson VUE. Sit it from India - test centres are widespread. AMC fee is approximately A$2,790 per attempt. Plan for our recommended 3,000+ timed practice MCQs. See <Link href="/amc-cat1">AMC CAT 1 plan</Link>.</li>
          <li><strong>AMC Part 2 (CAT 2 - Clinical).</strong> 16-station OSCE. Some sittings are offered overseas; many candidates travel to Australia. AMC fee is approximately A$3,800-A$4,000 per attempt. See <Link href="/amc-cat2">AMC CAT 2 plan</Link>.</li>
          <li><strong>AHPRA application + recency-of-practice + workplace-based assessment or supervised practice.</strong> Submit your AHPRA application with EPIC verification, AMC certificates, English test, identity, good standing and CV. AHPRA processing typically runs 4-6 months. Provisional registration follows; general registration follows a supervised year.</li>
        </ol>

        <CitationHook n={1}>
          For Indian MBBS graduates, the AMC pathway runs NMC permanent registration → EPIC primary-source verification → OET/IELTS → AMC Part 1 → AMC Part 2 → AHPRA - a six-step sequence that takes 2-3 years end-to-end on a clean run.
        </CitationHook>

        <h2>Document checklist (Indian MBBS specifically)</h2>
        <ul>
          <li>MBBS degree certificate (final degree, not provisional)</li>
          <li>Mark sheets / transcripts for all MBBS phases</li>
          <li>One-year compulsory rotating internship completion certificate (from your medical college, not the hospital alone)</li>
          <li>MCI/NMC permanent registration certificate (and any state medical council registrations)</li>
          <li>NMC good-standing / certificate of good standing - issued for AHPRA</li>
          <li>State medical council good-standing letters (every state where you have ever been registered)</li>
          <li>EPIC account at <a href="https://www.ecfmg.org/epic" target="_blank" rel="noopener noreferrer">ecfmg.org/epic</a> with primary-source verification of MBBS, internship and NMC</li>
          <li>OET or IELTS Academic test report (must meet AHPRA standard)</li>
          <li>AMC Part 1 result and AMC Part 2 result</li>
          <li>Indian passport (valid 12+ months)</li>
          <li>Identity name-match: passport, MBBS degree, NMC certificate and EPIC must all show the same legal name. Mismatch is the #1 reason AHPRA applications get parked.</li>
          <li>Structured CV - reverse chronological, gap years explained explicitly</li>
        </ul>

        <h2>Cost breakdown in INR + AUD</h2>
        <p>
          Currency rates fluctuate. The AUD-INR rate has moved between roughly 50 and 60 over the last two years; treat the INR column as approximate, not precise. Use the latest rate from your bank or RBI on the day you transact.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Cost line</th>
                <th className="px-4 py-3 font-semibold">AUD (2026)</th>
                <th className="px-4 py-3 font-semibold">INR (approx, fluctuates)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">EPIC primary-source verification</td>
                <td className="px-4 py-3">~A$200-A$400</td>
                <td className="px-4 py-3">~INR 11,000-22,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">OET (one sitting)</td>
                <td className="px-4 py-3">~A$587</td>
                <td className="px-4 py-3">~INR 32,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">IELTS Academic (one sitting)</td>
                <td className="px-4 py-3">~A$420</td>
                <td className="px-4 py-3">~INR 23,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AMC Part 1 (per attempt)</td>
                <td className="px-4 py-3">~A$2,790</td>
                <td className="px-4 py-3">~INR 1.5 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AMC Part 2 (per attempt)</td>
                <td className="px-4 py-3">~A$3,800-A$4,000</td>
                <td className="px-4 py-3">~INR 2.1-2.2 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AHPRA application + initial registration</td>
                <td className="px-4 py-3">~A$700-A$1,200</td>
                <td className="px-4 py-3">~INR 39,000-66,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Travel for Part 2 (Delhi/Mumbai → AU)</td>
                <td className="px-4 py-3">~A$2,500-A$4,000</td>
                <td className="px-4 py-3">~INR 1.4-2.2 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Visa (subclass 482) + medicals</td>
                <td className="px-4 py-3">~A$3,000-A$4,500</td>
                <td className="px-4 py-3">~INR 1.7-2.5 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Relocation buffer (first 3 months)</td>
                <td className="px-4 py-3">~A$10,000-A$15,000</td>
                <td className="px-4 py-3">~INR 5.5-8 lakh</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium"><strong>Total (single-attempt, single applicant)</strong></td>
                <td className="px-4 py-3"><strong>~A$24,000-A$33,000</strong></td>
                <td className="px-4 py-3"><strong>~INR 13-18 lakh</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Add A$2,790 (~INR 1.5 lakh) for each AMC Part 1 resit and A$3,800+ for each Part 2 resit. Use our <Link href="/amc-fee-calculator">AMC fee calculator</Link> to model your specific scenario. Sources: <a href="https://www.amc.org.au/assessment/fees" target="_blank" rel="noopener noreferrer">amc.org.au/assessment/fees</a>, <a href="https://www.ahpra.gov.au" target="_blank" rel="noopener noreferrer">ahpra.gov.au</a>, OET and IELTS official India fee schedules.
        </p>

        <CitationHook n={2}>
          End-to-end AMC cost from India for a single first-attempt applicant lands in the A$24,000-A$33,000 band (approximately INR 13-18 lakh at current rates), dominated by AMC Part 1 + Part 2 fees and relocation, not by exam prep materials.
        </CitationHook>

        <h2>Timeline from India: realistic 2-3 year window</h2>
        <p>
          Below is a clean, single-attempt timeline starting from MBBS internship completion. Add 4-6 months per AMC resit; add 6-12 months if you have a recency-of-practice gap to backfill before AHPRA will look at you.
        </p>
        <ul>
          <li><strong>Month 0-3:</strong> NMC permanent registration. Open EPIC account. Apply for state council good-standing letters. Begin OET prep.</li>
          <li><strong>Month 3-6:</strong> EPIC verification in progress. Sit OET (target B in all). Begin AMC Part 1 prep with timed MCQs.</li>
          <li><strong>Month 6-12:</strong> AMC Part 1 (CAT 1) sat from India. Continue clinical posting in India for recency.</li>
          <li><strong>Month 12-18:</strong> AMC Part 2 (CAT 2) prep + sit. Some candidates travel to Australia for Part 2; some take overseas-centre sittings.</li>
          <li><strong>Month 18-24:</strong> AHPRA application submitted. Begin 482 visa workflow with sponsoring hospital. Recency gap closure if needed.</li>
          <li><strong>Month 24-30:</strong> Provisional AHPRA registration. Land in Australia, start as RMO/PGY1.</li>
          <li><strong>Month 30-36:</strong> General AHPRA registration after supervised year. Next: speciality college pathway or RACGP.</li>
        </ul>
        <p>
          For a date-by-date version of this you can edit, see our <Link href="/amc-timeline-planner">AMC timeline planner</Link>.
        </p>

        <h2>Common mistakes Indian MBBS graduates make</h2>
        <ol>
          <li><strong>Delay in MCI/NMC good standing.</strong> Indian state councils can take weeks to issue letters. Apply for good standing on day one of your AMC plan, not month six. AHPRA will not accept undated or stale letters - 90-day validity is typical.</li>
          <li><strong>Name discrepancy between passport and MCI/NMC.</strong> A surname change after marriage, an English transliteration mismatch (Anjali vs Anjli), or initials on the MBBS degree that the NMC dropped - any of these blocks AHPRA. Fix in India through gazette notification before EPIC.</li>
          <li><strong>Gap years on EPIC unexplained.</strong> EPIC will reflect every year you have been registered. Gaps of 12+ months without explanation get flagged at AHPRA. Document gap years explicitly with dated affidavits, study certificates, or family-care declarations.</li>
          <li><strong>Internship completion certificate from the hospital, not the college.</strong> AHPRA requires the college-issued certificate (i.e. degree-awarding institution), not just the hospital where you rotated. This trips up candidates who interned at attached vs affiliated hospitals.</li>
          <li><strong>Underestimating OET writing.</strong> Indian doctors trained in English-medium MBBS often clear listening, reading and speaking but stall on OET writing on attempt one. Book a writing-specific tutor for 4-6 weeks before the test.</li>
          <li><strong>Booking AMC Part 2 before Part 1 result is in hand.</strong> AMC will accept the booking, but if you fail Part 1 you have lost the Part 2 fee or rebooking fee. Sequence them properly.</li>
        </ol>

        <CitationHook n={3}>
          The single most common AHPRA application delay for Indian MBBS graduates is name-mismatch across passport, NMC certificate and MBBS degree - fix this in India through gazette notification before starting EPIC verification, not after.
        </CitationHook>

        <h2>Visa &amp; PR considerations for Indians</h2>
        <p>
          Australia&apos;s <strong>subclass 482 (Skills in Demand)</strong> is the standard hospital-sponsored visa for Indian doctors. ANZSCO 253111 Medical Practitioner is on the Core Skills Occupation List, and 482 covers your spouse and dependent children. After 2-3 years on 482 you can typically transition to <strong>subclass 186 (Employer-Sponsored PR)</strong>.
        </p>
        <p>
          Independent skilled options (<strong>subclass 189</strong>) and state-nominated (<strong>subclass 190</strong>) are theoretically available but slow. Most Indian doctors take 482 first, get to PR via 186.
        </p>
        <p>
          <strong>DAMA (Designated Area Migration Agreements)</strong> are worth a look - regional Australia has multiple DAMA-funded routes for medical practitioners that compress the path to PR. Northern Territory, Orana NSW, Far North Queensland and Goldfields WA all have current DAMAs covering medical roles. Tradeoff: 2-4 years in regional Australia in exchange for faster PR.
        </p>
        <p>
          There is no &ldquo;quota&rdquo; for Indian doctors in any Australian visa stream - the Department of Home Affairs uses occupation lists, English thresholds and points tests, none of which discriminate by nationality. See <Link href="/img-australia-pathway">IMG Australia pathway</Link> for the full visa unpack.
        </p>

        <h2>Recency-of-practice — finding a posting in India that AHPRA accepts</h2>
        <p>
          AHPRA requires recent (typically within 2-3 years), supervised, paid clinical practice. Generic &ldquo;observership&rdquo; postings, locum-without-supervision and unsupervised private practice usually do <strong>not</strong> count. What does count:
        </p>
        <ul>
          <li>Junior resident / senior resident posts at NMC-recognised teaching hospitals (AIIMS, PGIMER, JIPMER, state medical college hospitals)</li>
          <li>Permanent or contract-employed MO posts at district hospitals or government health services with documented supervision</li>
          <li>Structured residency posts in private medical colleges with formal supervision logs</li>
        </ul>
        <p>
          Document every single shift: dated supervisor signature, hospital letterhead, role description, hours per week, supervision structure. AHPRA assessors are explicit - the burden of proof is yours.
        </p>
        <p>
          My wife is doing exactly this in Gurugram right now (Medanta-style structured posting with weekly supervision logs) precisely because the alternative - assuming AHPRA would accept a casual locum log - was the highest-risk path. If you are planning recency in India, plan it for AHPRA evidence, not just the salary.
        </p>

        <h2>How Mostly Medicine helps Indian candidates specifically</h2>
        <p>
          Built by a Chetan-Amandeep team that walked this exact path: 3,000+ AMC MCQs filterable by Australian-context tag (PBS, eTG, Australian Immunisation Handbook), AMC Handbook RolePlay and Clinical RolePlay built on the Anthropic Claude API for Part 2 simulation, and Peer RolePlay for live OSCE rehearsal with another Indian-trained IMG. Pricing is in AUD but accessible from India - free tier is honest, Pro is A$19/mo (roughly INR 1,050). Indian-specific content drilling: PBS first lines, Australian-context ethics and population-health items - the three areas Indian-trained candidates routinely under-score on.
        </p>

        <CitationHook n={4}>
          Indian MBBS graduates tend to under-score on Australian-context distractors (PBS first-line therapy, Australian Immunisation Handbook items, population-health framing) on AMC Part 1 - not on systems knowledge. The fix is targeted Australian-context drilling, not re-reading textbooks.
        </CitationHook>

        <h2>Founder note from Amandeep</h2>
        <p>
          Amandeep is from Punjab, MBBS-trained at an NMC-recognised college, NMC permanent-registered. She sat AMC Part 1 from India, then Part 2, and is now finishing recency in Gurugram - 3 months apart from me as I write this from Sydney. The hardest line item was not any single exam. It was the document chain: getting NMC, MBBS degree, passport and EPIC to align on her legal name across three states&apos; medical councils. If she could redo one thing it would be starting good-standing letter requests three months earlier. Her exact words: &ldquo;The exams are hard but solvable. The paperwork is tedious but mandatory. Do the paperwork first.&rdquo;
        </p>

        <CitationHook n={5}>
          Indian doctors are the largest single nationality of overseas-trained doctors registered with AHPRA in Australia, per Australian Institute of Health and Welfare (AIHW) Medical Workforce data - a footprint of tens of thousands of Indian-trained doctors actively practising.
        </CitationHook>

        <h2>What to read next</h2>
        <p>
          If this guide answered the &ldquo;how&rdquo; for India, the next reads sharpen the &ldquo;what&rdquo;:
        </p>
        <ul>
          <li><Link href="/amc">AMC overview pillar</Link> - the master pathway page</li>
          <li><Link href="/amc-cat1">AMC CAT 1 plan</Link> - structured MCQ prep</li>
          <li><Link href="/amc-cat2">AMC CAT 2 plan</Link> - clinical OSCE prep</li>
          <li><Link href="/amc-vs-plab">AMC vs PLAB</Link> - if you are still deciding Australia vs UK</li>
          <li><Link href="/amc-pass-rates-by-country">AMC pass rates by country</Link> - what the data actually shows IMGs</li>
          <li><Link href="/ielts-vs-oet">IELTS vs OET</Link> - choosing your AHPRA English test</li>
          <li><Link href="/img-australia-pathway">IMG Australia pathway</Link> - visa + employment side</li>
          <li><Link href="/amc-fee-calculator">AMC fee calculator</Link> - your specific INR scenario</li>
          <li><Link href="/amc-timeline-planner">AMC timeline planner</Link> - 24-month editable plan</li>
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
          If you are an Indian MBBS graduate planning AMC and want a structured prep platform built by people who walked this path - try Mostly Medicine free at <Link href="/">mostlymedicine.com</Link>. No hard sell; the free tier is genuinely useful even if you never upgrade.
        </p>

        <hr className="border-white/10 my-10" />

        <div className="not-prose text-xs text-slate-500 space-y-1">
          <p><strong className="text-slate-400">Last reviewed:</strong> 2 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 2 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC pass-graduate IMG, MBBS, India)</p>
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
            <li><a href="https://www.nmc.org.in" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">National Medical Commission (India)</a></li>
            <li><a href="https://immi.homeaffairs.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Department of Home Affairs (visa subclasses 482, 186, 189, 190, DAMA)</a></li>
            <li><a href="https://occupationaltrainingengland.com" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">OET official</a></li>
          </ul>
        </div>
      </article>
    </main>
  );
}
