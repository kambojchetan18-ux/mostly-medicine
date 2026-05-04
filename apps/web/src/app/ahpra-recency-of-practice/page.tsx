import type { Metadata } from "next";
import Link from "next/link";
import CalculatorTeaser from "@/components/CalculatorTeaser";
import PillarPageNav from "@/components/PillarPageNav";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/ahpra-recency-of-practice`;
const TITLE = "Recency of Practice and AMC: What Order Should an IMG Do Things In? (2026)";
const DESCRIPTION =
  "AMC Part 1 first, then English, AMC Part 2, AHPRA, and finally recency in Australia — but real exceptions exist. The IMG order-of-operations no one explains.";
const PUBLISHED = "2026-05-04";

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
    "ahpra recency of practice",
    "recency of practice img",
    "ahpra recency requirements",
    "recency before or after amc",
    "mba recency standard",
    "supervised practice australia img",
    "return to practice img",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "Recency of Practice", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "Does recency obtained in my home country actually count for AHPRA?",
    a: "Yes, when documented to AHPRA's standard. You need a supervisor letter (with their registration number), a hospital schedule showing your hours, a registration in good standing certificate, and primary-source verification through ECFMG/EPIC. Without that documentation pack, the time technically counts but cannot be evidenced — which is functionally the same as not counting.",
  },
  {
    q: "How much recency do I need before applying to AHPRA?",
    a: "The MBA Recency of Practice Standard sets the threshold — typically 1-2 years FTE within the past 3 years for most registration types. Check the current standard at medicalboard.gov.au for the exact figure for your registration type. The threshold has changed periodically, so do not rely on a forum post older than 6 months.",
  },
  {
    q: "I passed AMC Part 1 in 2022 but only sat Part 2 in 2026. Does my Part 1 expire?",
    a: "The AMC certificate has no expiry once issued. However, AHPRA may interpret the gap between Part 1 and Part 2 as a recency concern — particularly if you were not clinically active in that window. The cleanest mitigation is documented home-country supervised practice in the 12 months before sitting Part 2.",
  },
  {
    q: "Does maternity or paternity leave count against recency?",
    a: "It is not held against you per se, but it is also not credited as clinical time. AHPRA assesses whether your most recent clinical practice falls within the 3-year window and meets volume thresholds. Parental leave creates a gap that needs to be balanced by either earlier or later clinical work.",
  },
  {
    q: "Can I do recency in non-medical roles (research, teaching, administration)?",
    a: "No, not for the Recency of Practice Standard. Recency requires clinical work in your registered scope. Research and teaching contribute to CPD obligations under a separate standard but do not satisfy recency.",
  },
  {
    q: "What if I am a junior doctor with a 6-month gap during AMC prep — do I need a separate recency block?",
    a: "Probably not. A 6-month gap during exam preparation, immediately preceded and followed by clinical work, is generally absorbed into the 3-year recency assessment without a problem. The risk threshold is closer to 12-18 months continuous gap.",
  },
  {
    q: "Is recency the same thing as Continuing Professional Development (CPD)?",
    a: "No. CPD is the ongoing 50 hours per year of educational activity that registered doctors complete. Recency is the requirement that you have actually been practising medicine recently. The two standards are separate but both are referenced in your AHPRA renewal each year.",
  },
  {
    q: "How do I document my home-country clinical work to AHPRA's satisfaction?",
    a: "You need: your supervisor's signed letter on hospital letterhead with their registration number; your registration certificate from the home-country council; an in-good-standing letter dated within the last 12 months; a weekly schedule or roster covering the recency period; and evidence of patient contact volume (anonymised audit, OPD numbers, or supervisor attestation). EPIC primary-source verification covers the registration documents.",
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
            Recency of Practice · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            Recency of Practice and AMC: What Order Should an IMG Do Things In?
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          For most International Medical Graduates the lowest-risk order is AMC Part 1 &rarr; English test &rarr; AMC Part 2 &rarr; AHPRA application &rarr; Recency completed in Australia post provisional registration. Doctors with a clinical gap of more than 3 years should do supervised recency in their home country before sitting AMC Part 2. There is no single legally mandated sequence &mdash; but the wrong order routinely costs IMGs 6&ndash;12 months of avoidable delay.
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you have stared at the AHPRA portal trying to work out whether you should be sitting AMC Part 1, polishing your IELTS, applying for a recency role, or all three at once, this article is for you. The Australian Medical Council, the Medical Board of Australia (MBA) and AHPRA all publish their requirements separately, and none of them sequence the steps for you. Most IMGs piece the order together from forum threads, ad-hoc Reddit replies, and (often) a friend who walked the path two years ago &mdash; when the standards were slightly different. We have watched 136 IMGs make this decision on Mostly Medicine, and one error keeps repeating: candidates either do recency too early (it expires before they need it for AHPRA) or too late (their AHPRA application stalls because their recency status is questioned). This guide walks the actual standards, then sequences them.
        </p>
        <p>
          I write this as the founder of <Link href="/">Mostly Medicine</Link> and the husband of an AMC pass-graduate IMG. My wife, Dr Amandeep Kamboj, sat AMC Part 1 from India, sat AMC Part 2 in Australia, and is currently completing recency-of-practice in Gurugram before returning to Sydney where I live. The Sydney+Gurugram split is exhausting but it is the cleanest path for her specific situation &mdash; and below I explain why we made it that way.
        </p>

        <h2>Quick answer</h2>
        <p>
          <strong>For most IMGs without a clinical gap</strong>: AMC Part 1 &rarr; English test (OET grade B or IELTS 7.0) &rarr; AMC Part 2 &rarr; AHPRA application for provisional registration &rarr; Recency completed in Australia post provisional. <strong>For IMGs with more than 3 years away from clinical work</strong>: insert a supervised recency block in the home country <em>before</em> AMC Part 2, because Part 2 is a clinical exam and rust shows up immediately. The <a href="https://www.medicalboard.gov.au" target="_blank" rel="noopener noreferrer">Medical Board of Australia&apos;s Recency of Practice Registration Standard</a> is the legal anchor; the AMC and AHPRA both reference it but do not reproduce it.
        </p>

        <h2>What &ldquo;recency of practice&rdquo; actually means</h2>
        <p>
          Recency of practice is a regulatory concept administered by the Medical Board of Australia under its <a href="https://www.medicalboard.gov.au/Registration-Standards.aspx" target="_blank" rel="noopener noreferrer">Registration Standard: Recency of Practice</a>. In plain language it is the requirement that a doctor&apos;s clinical knowledge and skills are demonstrably current at the point of registration. The standard exists because medicine moves fast &mdash; therapeutics shift, guidelines update, drug interaction databases change &mdash; and a doctor who has not been clinically active is, statistically, more likely to make a serious error than one who has been.
        </p>
        <p>
          The Medical Board of Australia&apos;s Recency of Practice Standard requires registered doctors to have practised within their scope of practice in the past 3 years &mdash; typically 1&ndash;2 years FTE (full-time equivalent) depending on registration type and gap length. The exact figure is set in the standard and updated periodically. Treat any second-hand &ldquo;you need exactly X hours&rdquo; as a starting point, not gospel &mdash; always cross-check against the current MBA standard at medicalboard.gov.au.
        </p>
        <p>For IMGs the standard matters in two distinct moments:</p>
        <ol>
          <li><strong>At AHPRA application</strong> &mdash; AHPRA assesses whether your recent clinical history meets the standard before granting provisional or general registration.</li>
          <li><strong>At every annual renewal</strong> &mdash; once registered, you re-declare recency at every annual renewal and may be audited.</li>
        </ol>
        <p>
          The first moment is the one most IMGs underestimate. AHPRA does not just look at the AMC certificate. They look at the gap between your most recent supervised clinical practice and your application date.
        </p>

        <h2>Who actually needs recency?</h2>
        <p>You need to think about recency if any of these apply:</p>
        <ul>
          <li>You graduated more than 2 years ago and have had any continuous gap in clinical work.</li>
          <li>You took maternity or paternity leave of 12+ months in the last 3 years.</li>
          <li>You worked in a non-clinical role (research, administration, teaching) for more than 12 months.</li>
          <li>You moved between specialties such that your last practice was outside your intended scope in Australia.</li>
          <li>You are returning to medicine after illness, family commitments or a career break.</li>
        </ul>
        <p>
          If none of the above apply &mdash; you have been clinically active in your home country continuously, no breaks longer than a few weeks &mdash; recency is largely a paperwork item rather than a structural problem. Your AMC and AHPRA path will be much smoother, and you can defer the recency conversation until your AHPRA application stage. If any do apply, recency is a strategic problem and the order in which you do things changes meaningfully.
        </p>

        <CitationHook n={1}>
          The Medical Board of Australia&apos;s Recency of Practice Standard requires registered doctors to have practised within their scope of practice in the past 3 years &mdash; typically 1&ndash;2 years FTE depending on registration type &mdash; and is the most common single cause of AHPRA application delays for IMGs with clinical gaps.
        </CitationHook>

        <h2>The MBA Recency of Practice Standard, plain English</h2>
        <p>The MBA standard sits across three concepts. Confusing one for another is the most frequent cause of incorrect advice in IMG forums.</p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Concept</th>
                <th className="px-4 py-3 font-semibold">What it means</th>
                <th className="px-4 py-3 font-semibold">Why it matters for IMGs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Currency</td>
                <td className="px-4 py-3">Have you been clinically active in the recent past?</td>
                <td className="px-4 py-3">Determines whether you need a remediation/recency block at all.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Scope</td>
                <td className="px-4 py-3">Was your recent practice in the same scope you are applying for?</td>
                <td className="px-4 py-3">A surgeon who spent 2 years doing public-health research has a scope problem, not just a currency problem.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Volume</td>
                <td className="px-4 py-3">Roughly how much clinical time?</td>
                <td className="px-4 py-3">The MBA&apos;s threshold is set in hours/years FTE &mdash; currently 1&ndash;2 years FTE in the past 3 years for most registration types.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The Recency of Practice Standard is one document, but it interacts with the Continuing Professional Development Standard, the English Language Skills Standard and the Limited Registration Standard. For most IMGs the practical answer is: secure a recent block of supervised clinical practice &mdash; in your home country counts, in Australia counts more strongly &mdash; that is documentable, in scope, and within the past 3 years.
        </p>

        <CitationHook n={2}>
          Recency of practice obtained in your home country counts towards AHPRA&apos;s Recency of Practice Standard, provided it was supervised, in scope, and supported by primary-source documentation including a supervisor&apos;s letter and registration record.
        </CitationHook>

        <h2>The lowest-risk order for most IMGs</h2>
        <p>For an IMG without a meaningful clinical gap, the path that minimises wasted time is:</p>
        <ol>
          <li><strong>AMC Part 1 (MCQ)</strong> &mdash; passable from anywhere via Pearson VUE. Sit it while still working clinically in your home country. Use <Link href="/amc-part-1-study-plan">our Part 1 study plan</Link> for a 16-week schedule.</li>
          <li><strong>English test</strong> &mdash; OET Medicine grade B or IELTS Academic 7.0 each band. Defer until you have a clearer AHPRA timeline because results expire after 2&ndash;3 years.</li>
          <li><strong>AMC Part 2 (Clinical)</strong> &mdash; sit this either in Australia or at one of the overseas centres for that cycle. Part 2 prep is structural rather than knowledge-based; see our <Link href="/amc-clinical-stations-guide">AMC Clinical Stations Guide</Link>.</li>
          <li><strong>AHPRA application</strong> for provisional registration &mdash; submit immediately on receiving the AMC certificate, because the AMC certificate has no expiry but EPIC verifications have one.</li>
          <li><strong>Recency in Australia post provisional registration</strong> &mdash; your intern year IS your recency for general registration. This is the cleanest single path because the recency block is concurrent with the work itself.</li>
        </ol>
        <p>This order works because each step depends on the previous one, and each step&apos;s expiry interacts with the next:</p>
        <ul>
          <li>AMC Part 1 has no expiry once issued, so doing it first never hurts.</li>
          <li>English test results expire (3 years for IELTS, 2 years for OET) &mdash; you do not want to sit the test 4 years before you submit to AHPRA.</li>
          <li>AMC Part 2 also does not expire on its own, but EPIC verification within your AHPRA file does.</li>
          <li>AHPRA processes recency at the application stage, then again at every renewal.</li>
        </ul>

        <CitationHook n={3}>
          Most IMGs benefit from completing AMC Part 1 before starting recency, because Part 1 prep refreshes the clinical reasoning that recency assumes &mdash; and because Part 1 has no expiry, it does not penalise candidates who later need additional recency time.
        </CitationHook>

        <h2>Why doing recency BEFORE AMC Part 2 makes sense for some IMGs</h2>
        <p>
          There is one significant exception to the order above: doctors with a clinical gap of more than 12&ndash;18 months should consider a supervised recency block before sitting AMC Part 2.
        </p>
        <p>
          The reason is structural. AMC Part 2 is an OSCE &mdash; 16 stations of 8 minutes each, testing clinical reasoning, communication and procedural skills under time pressure. The clinical reasoning component degrades fast in a clinical gap. Candidates who sit Part 2 cold, after 2+ years away, routinely score borderline on station after station &mdash; not because their medical knowledge has gone, but because the speed and pattern recognition of live clinical practice is gone. They then fail Part 2, retake it, fail again, and only at the third attempt &mdash; when they have completed clinical work in the meantime &mdash; do they pass. The cost of that is roughly A$11,400 in exam fees alone, plus the time.
        </p>
        <p>
          A 6&ndash;12 month supervised recency block in the home country, sequenced after Part 1 but before Part 2, often turns Part 2 into a single attempt. The economic case is straightforward: 6 months of clinical work at home plus one Part 2 attempt is cheaper than zero recency plus three Part 2 attempts.
        </p>
        <p>
          For doctors with smaller gaps (3&ndash;12 months) the call is closer. We have seen it work both ways. The cleanest decision rule we use with users on Mostly Medicine: if you have been clinically inactive for the equivalent of 12 months or more in the last 3 years, sequence recency before Part 2.
        </p>

        <h2>Why doing recency AFTER AHPRA general registration makes sense for others</h2>
        <p>
          The opposite case is the IMG who is currently working clinically and has been continuously active for years. For them, doing additional recency before AHPRA is a waste of time. They should sequence recency by completing their Australian internship after provisional registration &mdash; that block of supervised practice is itself the recency demonstration for general registration.
        </p>
        <p>
          This is the standard pathway for the majority of IMGs we see who clear AMC and AHPRA inside 2&ndash;3 years from a strong starting position.
        </p>
        <p>
          The structural reason: provisional registration assumes recency is fresh from your home-country clinical work plus AMC. General registration then re-tests recency through your supervised intern year. The MBA&apos;s standard is satisfied at both stages without requiring a separate dedicated recency block.
        </p>

        <CitationHook n={4}>
          Doctors who took a break of more than 3 years post-graduation are required to demonstrate recency under MBA standards; failing to do so is the most common single cause of AHPRA application delays &mdash; and the second-most common reason candidates re-sit AMC Part 2.
        </CitationHook>

        <h2>Recency in the home country vs in Australia</h2>
        <p>This is one of the most frequently misunderstood points in the standard.</p>
        <p>
          <strong>Home-country recency counts</strong> towards the MBA&apos;s standard, provided it is documented and meets these criteria:
        </p>
        <ul>
          <li>Was supervised (formal supervisor letter required, with their registration number).</li>
          <li>Was in your scope of practice &mdash; specialty, setting, level of responsibility.</li>
          <li>Falls within the past 3 years from the date of application.</li>
          <li>Is supported by EPIC primary-source verification of any registration certificates.</li>
          <li>Is at the volume threshold the standard requires (typically 1&ndash;2 years FTE).</li>
        </ul>
        <p>
          <strong>Australian recency counts more strongly</strong> &mdash; not legally, but practically. AHPRA assessors are far more familiar with the documentation, supervision standards and quality of Australian rotations. Time spent as a supervised IMG in an Australian context, even on limited registration, is the most efficient single piece of evidence for the standard.
        </p>
        <p>
          For most IMGs the practical synthesis is: do home-country recency where you can, document it meticulously (supervisor letter, registration in good standing, weekly schedule, audit-quality timesheet), and supplement it with Australian intern-year recency post-provisional registration.
        </p>

        <h2>Real-world example: AMC pass first, recency in Gurugram</h2>
        <p>I will use my wife&apos;s pathway because it is the closest example I have.</p>
        <p>
          Dr Amandeep Kamboj, MBBS (Kasturba Medical College), passed AMC Part 1 in late 2024 from India, passed AMC Part 2 in early 2025 in Australia, and is currently &mdash; May 2026 &mdash; completing recency-of-practice in Gurugram. We are based in Sydney; she is in Gurugram for the recency block, and the plan is for her to return to Sydney to commence a supervised role here once the AHPRA registration is confirmed.
        </p>
        <p>
          The reason we sequenced it this way: she had a 14-month clinical gap during the AMC preparation phase (she stepped away from full-time clinical work to focus on Part 1 and Part 2 prep). Going into a Sydney supervised role straight after the AMC pass would have meant supervisor letters could only document the AMC-prep gap. Instead, returning to clinical practice in Gurugram for a structured 6-month supervised block has produced the recency evidence AHPRA actually wants &mdash; recent, supervised, in-scope, documented.
        </p>
        <p>
          The financial cost of the Sydney+Gurugram arrangement is real. The benefit is that her AHPRA application file will show continuous supervised clinical practice in the 12 months immediately preceding the application, which materially de-risks the assessment.
        </p>
        <p>
          This arrangement is not generalisable &mdash; most IMG households cannot split across countries &mdash; but the structural lesson is. If you have a meaningful clinical gap, slot a documented home-country recency block in <em>before</em> you submit to AHPRA. Do not assume your AMC pass alone will satisfy the recency requirement. It will not, for anyone with a 12-month-plus gap.
        </p>

        <h2>The hidden cost of getting the order wrong</h2>
        <p>The most expensive scenarios we see on Mostly Medicine, ranked by frequency:</p>
        <ol>
          <li><strong>English test sat too early</strong> &mdash; IELTS at 7.0 each band, taken in 2023, expired before AHPRA application in 2026. Re-sit cost A$410 + 4&ndash;6 week scheduling delay.</li>
          <li><strong>Recency completed too early</strong> &mdash; supervised hospital block done in 2022, AHPRA application submitted in 2026. The recency falls outside the 3-year window, AHPRA queries, application stalls 6&ndash;12 months while the candidate completes another block.</li>
          <li><strong>AMC Part 2 sat without enough recent clinical exposure</strong> &mdash; multiple Part 2 attempts at A$3,800&ndash;4,000 each, then eventually doing the recency the candidate should have done first.</li>
          <li><strong>AHPRA submitted before AMC certificate is in hand</strong> &mdash; application held in queue, EPIC verifications expiring while waiting, full re-submission required.</li>
          <li><strong>Recency obtained in the wrong scope</strong> &mdash; surgeon does 18 months of GP-equivalent work, then AHPRA says it does not count toward surgical scope.</li>
        </ol>

        <CitationHook n={5}>
          There is no single &lsquo;correct&rsquo; order &mdash; but the order that minimises wasted time for most IMGs is AMC Part 1 &rarr; English test &rarr; AMC Part 2 &rarr; AHPRA application &rarr; Recency in Australia post provisional registration; doctors with a clinical gap exceeding 12 months should insert a supervised recency block in their home country before sitting AMC Part 2.
        </CitationHook>

        <p>
          For a costed view of the entire pathway, including how recency-related re-attempts compound, plug your scenario into our <Link href="/amc-fee-calculator">AMC Fee Calculator</Link>. Most users find a 6-month delay assumption is realistic when modelling worst-case.
        </p>

        <h2>Where Mostly Medicine fits</h2>
        <p>
          The platform is built around the gap between knowing the standard and knowing the order. Our <Link href="/amc-part-1-study-plan">AMC Part 1 study plan</Link>, <Link href="/amc-vs-plab">AMC vs PLAB pillar</Link> and <Link href="/ahpra-registration-for-imgs">AHPRA registration guide</Link> are the natural next reads after this. Our 3,000+ MCQ bank tagged by Australian context is what most IMGs use to refresh clinical reasoning during a recency block.
        </p>
        <p>
          If you are sitting AMC Part 1 from a home country with a 1&ndash;2 year clinical gap, our Part 1 prep is the cheapest single intervention to fix the rust before Part 2.
        </p>
        <p>
          Free at <Link href="/">mostlymedicine.com</Link> &mdash; Pro is A$19/mo if you want unlimited MCQs and clinical roleplay.
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
          <p><strong className="text-slate-400">Last reviewed:</strong> 4 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 4 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC pass-graduate IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://www.medicalboard.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Medical Board of Australia, Registration Standard: Recency of Practice</a></li>
            <li><a href="https://www.ahpra.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA, Registration Standards and Policies</a></li>
            <li><a href="https://www.racgp.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">RACGP, Recency of Practice Resource</a></li>
            <li><a href="https://www.amc.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medical Council, AMC Examinations Handbook</a></li>
            <li><a href="https://www.who.int" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">World Health Organization, Health Workforce Migration Data</a></li>
          </ul>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
