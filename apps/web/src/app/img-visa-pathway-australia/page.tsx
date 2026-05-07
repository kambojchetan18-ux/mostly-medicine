import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import CalculatorTeaser from "@/components/CalculatorTeaser";
import PillarPageNav from "@/components/PillarPageNav";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/img-visa-pathway-australia`;
const TITLE = "IMG Visa Pathway in Australia 2026: From Student or Graduate to Permanent Residency";
const DESCRIPTION =
  "The realistic IMG visa stack in 2026: 485 for Australian graduates, 482 for sponsored overseas IMGs, DAMA for regional, then 186 to PR. Time-to-PR sits at 4–5 years post-registration.";
const PUBLISHED = "2026-05-08";

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
    "img visa pathway australia",
    "485 visa doctor",
    "482 visa medical practitioner",
    "dama doctor",
    "186 visa medical",
    "img pr australia",
    "anzsco 253111 medical practitioner",
    "doctor pr australia",
    "skills in demand medical practitioner",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "IMG Visa Pathway", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "Can I work on a 485 visa as an overseas-trained IMG?",
    a: "The 485 Post-Higher Education Work stream is restricted to recent Australian higher-education graduates. An overseas-trained IMG without an Australian medical degree cannot use the 485 directly. The dominant overseas-IMG route is direct sponsorship onto a 482.",
  },
  {
    q: "How long does the 482 visa take to grant for medical practitioners?",
    a: "Department of Home Affairs published processing times vary by stream and applicant volume. For medical practitioners on the Core Skills stream with complete documentation and a registered employer sponsor, processing has historically clustered in the 2-4 month range. Check the current published times on immi.homeaffairs.gov.au before committing to a start date.",
  },
  {
    q: "Can I switch employers during my 482 visa?",
    a: "Yes, but a new sponsor must lodge a fresh nomination, and switching resets the work-with-sponsor clock for 186 Temporary Residence Transition. Mid-cycle switches are common but should be planned with the PR end-state in mind.",
  },
  {
    q: "Does the DAMA pathway always lead to PR?",
    a: "Most current DAMA agreements include a defined PR pathway, typically through 186 after a specified period of regional employment with the approved employer. The pathway is contractual, not automatic — read the specific DAMA agreement before signing.",
  },
  {
    q: "What is the section 19AB restriction and how long does it last?",
    a: "Section 19AB of the Health Insurance Act restricts Medicare provider numbers for IMGs to Distribution Priority Area (DPA) locations for 10 years from initial Australian medical registration. This restriction runs in parallel to the visa stack — even after PR, an IMG within the 10-year window must work in a DPA location for Medicare-billable practice unless an exemption applies.",
  },
  {
    q: "Does my AMC certificate help my visa application?",
    a: "Yes indirectly. The AMC certificate evidences the qualification needed for AHPRA registration, which evidences the qualification needed for ANZSCO 253111 sponsorship. The visa department does not assess AMC results; it relies on AHPRA registration as the proxy.",
  },
  {
    q: "Should I use a registered migration agent?",
    a: "For straightforward 482 sponsored applications with a hospital HR team that has done IMG visas before, many candidates self-lodge. For DAMA, complex family situations, or 186 Direct Entry without 482, a registered migration agent (MARA) is usually worth the fee. Check the agent&apos;s registration on the OMARA website.",
  },
  {
    q: "Can my spouse work on a 482 dependent visa?",
    a: "Spouses of 482 Core Skills primary applicants generally have full work rights under the dependent visa. Specific conditions can vary; the Department of Home Affairs subclass 482 page is authoritative.",
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
            IMG Visa Pathway · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            IMG Visa Pathway in Australia 2026: From Student or Graduate to Permanent Residency
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          Most IMG doctors reach Australian PR through one of three stacks: (1) Australian medical graduate &rarr; 485 Temporary Graduate &rarr; 482 Skills in Demand &rarr; 186 Employer Nomination, (2) overseas IMG &rarr; direct 482 sponsored by an Australian hospital &rarr; 186, or (3) regional employer &rarr; DAMA &rarr; 186. Time-to-PR sits realistically at 4&ndash;6 years after general AHPRA registration. Skilled Independent (subclass 189) is technically possible but rare for doctors who already have a sponsoring employer.
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you are an International Medical Graduate searching &ldquo;best visa for doctor in Australia&rdquo; or &ldquo;how long to PR for IMG&rdquo;, the messy truth is that there is no single answer — there are roughly four pathways, each tied to a specific starting point, employer relationship and geographic constraint. This article maps the 2026 visa landscape for IMG doctors as it stands on the Department of Home Affairs subclass pages and the Department of Health and Aged Care DPA tooling, with the trade-offs each pathway carries.
        </p>
        <p>
          I write as the founder of <Link href="/">Mostly Medicine</Link> and the husband of an AMC pass-graduate IMG. My wife, Dr Amandeep Kamboj, completed AMC Part 1 and Part 2 in Australia and is currently doing recency of practice in Gurugram before returning to Sydney on the next phase of her own visa stack. Visa decisions sit alongside <Link href="/ahpra-registration-for-imgs">AHPRA registration</Link> and <Link href="/rmo-jobs-for-img-australia">your first RMO contract</Link> as the three load-bearing decisions in the IMG pathway.
        </p>

        <h2>Quick facts at a glance</h2>
        <ul>
          <li><strong>Medical Practitioner (ANZSCO 253111)</strong> is on Australia&apos;s Core Skills Occupation List in 2026, which keeps the 482 Skills in Demand visa open for sponsored IMG doctors.</li>
          <li>The most common IMG visa stack is <strong>482 &rarr; 186</strong>, taking around 4&ndash;6 years from arrival to PR for a doctor working in a DPA location.</li>
          <li><strong>DAMA agreements</strong> (Designated Area Migration Agreements) operate in specific regions (Northern Territory, parts of South Australia, Goldfields WA, Orana NSW, Pilbara, Kimberley, Far North Queensland, Great South Coast Victoria, etc.) and offer concessions to standard 482/186 rules for sponsored employers.</li>
          <li><strong>Subclass 189 (Skilled Independent)</strong> is technically open to medical practitioners but rarely the optimal route for IMGs already engaged with an Australian sponsor.</li>
          <li><strong>Family</strong> (spouse and dependent children) can be included on 482, 494, 491 and 186 at application or as subsequent entrants.</li>
          <li>The <strong>section 19AB / DPA restriction</strong> on Medicare provider numbers applies for <strong>10 years from initial Australian medical registration</strong> for most IMGs and runs in parallel to the visa stack.</li>
        </ul>

        <h2>The visas that matter for doctors</h2>
        <p>
          Six subclasses cover the vast majority of IMG cases. Names and numbers have changed across recent reforms; the 2026 landscape is:
        </p>
        <ul>
          <li><strong>Subclass 485</strong> — Temporary Graduate. For recent Australian medical graduates only; not open to overseas-trained IMGs without an Australian medical degree.</li>
          <li><strong>Subclass 482</strong> — Skills in Demand (formerly Temporary Skill Shortage / TSS). Sponsored employer visa, the dominant overseas IMG entry point. Up to 4 years on the Core Skills stream, renewable.</li>
          <li><strong>Subclass 494</strong> — Skilled Employer Sponsored Regional (Provisional). Regional employer-sponsored, 5 years, leads to PR through the 191 Skilled Regional permanent visa after 3 years.</li>
          <li><strong>Subclass 491</strong> — Skilled Work Regional (Provisional). Points-tested, state-or-relative-nominated, 5 years, leads to 191 PR.</li>
          <li><strong>Subclass 186</strong> — Employer Nomination Scheme. The standard PR endpoint after 482 employment with a sponsoring employer.</li>
          <li><strong>Subclass 189</strong> — Skilled Independent. Points-tested, no sponsor required, direct PR. Eligible for medical practitioners but competitive.</li>
        </ul>
        <p>
          DAMA is not a separate visa — it is an agreement that modifies how 482, 494 and 186 are applied within a designated region (for example concessions on age, salary or English thresholds, with a clearer PR pathway).
        </p>

        <CitationHook n={1}>
          Medical Practitioner (ANZSCO 253111) is on Australia&apos;s Core Skills Occupation List, which makes the 482 Skills in Demand visa a direct pathway for sponsored IMG doctors and underpins the standard 482-to-186 PR route.
        </CitationHook>

        <h2>ANZSCO 253111: the occupation that unlocks the stack</h2>
        <p>
          ANZSCO 253111 (Medical Practitioner — General) is the occupation code attached to most IMG visa applications. As of 2026 it sits on Australia&apos;s <strong>Core Skills Occupation List</strong>, the successor list to the previous MLTSSL. Inclusion on this list is what makes Medical Practitioner eligible for sponsorship under the 482 Skills in Demand visa and ultimately for the 186 Employer Nomination stream.
        </p>
        <p>
          Two practical things matter here. First, the occupation list is reviewed periodically by the Department of Home Affairs and Jobs and Skills Australia — IMGs planning a multi-year visa stack should check the <a href="https://immi.homeaffairs.gov.au" target="_blank" rel="noopener noreferrer">current list on immi.homeaffairs.gov.au</a> annually rather than relying on year-old forum posts. Second, sub-occupation codes (253112 Anaesthetist, 253399 Specialist Physicians not elsewhere classified, etc.) carry their own status; if you are post-fellowship, your sub-code may be the relevant one to track.
        </p>

        <h2>Pathway A &mdash; Australian medical graduate &rarr; 485 &rarr; 482 &rarr; 186</h2>
        <p>
          If you completed your medical degree at an Australian university (a small but growing IMG cohort, including IMGs who started in their home country and transferred), the optimal path is:
        </p>
        <ol>
          <li><strong>Subclass 485 Post-Higher Education Work stream</strong> — typically 2 years post-graduation.</li>
          <li>Transition to <strong>Subclass 482 Skills in Demand</strong> when sponsored as an RMO or registrar.</li>
          <li>Apply for <strong>Subclass 186 Employer Nomination</strong> after 2 years with the sponsoring employer.</li>
        </ol>
        <p>
          The 485 stream provides a buffer to complete intern year, gain general AHPRA registration, and find a sponsoring employer. Most Australian-graduate IMGs do not meet the 482 work-experience requirement at PGY1, which is why the 485 bridge is structurally important.
        </p>

        <h2>Pathway B &mdash; Overseas IMG &rarr; 482 directly (sponsored by an Australian hospital)</h2>
        <p>
          This is the dominant route for the overseas-trained IMG cohort that Mostly Medicine serves. The mechanics:
        </p>
        <ul>
          <li>Pass <Link href="/amc-clinical-exam-preparation">AMC Part 1 and Part 2</Link> (or qualify under the Competent Authority pathway).</li>
          <li>Complete the AHPRA registration application (provisional or limited).</li>
          <li>Find a hospital willing to sponsor a 482 visa for the RMO position. The hospital must be an approved Standard Business Sponsor and the role must be in a DPA-classified location for IMGs subject to section 19AB.</li>
          <li>Apply for the 482 visa in the Core Skills stream. Up to 4 years per grant.</li>
          <li>After 2 years of full-time work with the same sponsor in the same nominated occupation, transition to <strong>Subclass 186 Direct Entry</strong> or <strong>Temporary Residence Transition</strong> stream.</li>
        </ul>
        <p>
          The 2-year work-with-sponsor requirement is the hard timeline floor on this pathway.
        </p>

        <CitationHook n={2}>
          The 482 to 186 transition for medical practitioners typically requires at least 2 years of full-time work with the sponsoring employer in the nominated occupation before becoming eligible for permanent employer-sponsored residency under the Temporary Residence Transition stream.
        </CitationHook>

        <h2>Pathway C &mdash; DAMA agreements (regional concessions)</h2>
        <p>
          DAMA stands for <strong>Designated Area Migration Agreement</strong>. These are regional agreements between the Department of Home Affairs and a designated regional authority (a state government, a regional development agency, or a city council) that allow approved employers in the region to sponsor overseas workers on concessions not available under the standard 482.
        </p>
        <p>
          In 2026, DAMA agreements operate in regions including the Northern Territory, parts of South Australia, the Pilbara and Kimberley regions of WA, Goldfields WA, Orana (central NSW), Far North Queensland, the Great South Coast in Victoria, and several others. The current list lives at <a href="https://immi.homeaffairs.gov.au" target="_blank" rel="noopener noreferrer">immi.homeaffairs.gov.au</a>.
        </p>
        <p>The concessions vary by DAMA but commonly include:</p>
        <ul>
          <li>Age threshold raised (above the standard 482 age cap of 45 in some agreements).</li>
          <li>Salary or skill threshold concessions.</li>
          <li>English language threshold concessions in defined cases.</li>
          <li>A defined PR pathway, typically through 186 after a designated period of regional employment.</li>
        </ul>
        <p>
          For IMGs who would not qualify under standard 482 settings (older candidates, salary at the threshold, English at the floor), a DAMA-region role can be the difference between a viable pathway and a non-starter.
        </p>

        <CitationHook n={3}>
          DAMA agreements — Designated Area Migration Agreements — allow regional employers to sponsor IMGs on terms more flexible than the standard 482, including age and salary concessions, with PR pathways through 186 after a designated period of regional employment.
        </CitationHook>

        <h2>Pathway D &mdash; Skilled Independent (Subclass 189): possible but rare</h2>
        <p>
          Subclass 189 grants permanent residency directly without an employer sponsor, on a points-tested basis. It is open to medical practitioners on the Core Skills Occupation List. In practice, IMGs on the Mostly Medicine pathway rarely use 189 because:
        </p>
        <ul>
          <li>The points threshold is competitive and selection is based on EOI ranking, not first-come-first-served.</li>
          <li>IMGs who have a sponsoring hospital have already secured employment that funds the 482-to-186 path.</li>
          <li>Subclass 189 timelines (EOI submission to invitation to grant) are unpredictable.</li>
        </ul>
        <p>
          Where 189 makes sense: IMGs with strong points (high English score, age in the 25&ndash;32 sweet spot, postgraduate qualifications) who do not yet have a sponsor and want to land in Australia with PR already granted. For most IMGs, 482-to-186 lands faster and more reliably.
        </p>

        <h2>Pathway timelines compared (realistic 2026 numbers)</h2>
        <p>
          The numbers below are realistic medians for IMGs already AMC-complete with general AHPRA registration. Individual cases vary.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Pathway</th>
                <th className="px-4 py-3 font-semibold">Years to RMO start</th>
                <th className="px-4 py-3 font-semibold">Years on temporary visa before PR-eligible</th>
                <th className="px-4 py-3 font-semibold">Total years to PR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Australian grad &rarr; 485 &rarr; 482 &rarr; 186</td>
                <td className="px-4 py-3">1 (intern)</td>
                <td className="px-4 py-3">2 on 485 + 2 on 482 = 4</td>
                <td className="px-4 py-3">5</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Overseas IMG &rarr; direct 482 &rarr; 186</td>
                <td className="px-4 py-3">0&ndash;1 (job search)</td>
                <td className="px-4 py-3">2 on 482 with sponsor</td>
                <td className="px-4 py-3">4&ndash;6</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Overseas IMG &rarr; DAMA 482 &rarr; 186</td>
                <td className="px-4 py-3">0&ndash;1</td>
                <td className="px-4 py-3">2&ndash;3 in DAMA region</td>
                <td className="px-4 py-3">4&ndash;5</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Overseas IMG &rarr; 494 (regional) &rarr; 191</td>
                <td className="px-4 py-3">0&ndash;1</td>
                <td className="px-4 py-3">3 in regional location</td>
                <td className="px-4 py-3">5</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Overseas IMG &rarr; 491 (state-nominated) &rarr; 191</td>
                <td className="px-4 py-3">0&ndash;1</td>
                <td className="px-4 py-3">3 in nominated state/region</td>
                <td className="px-4 py-3">5</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Skilled Independent 189</td>
                <td className="px-4 py-3">0 (PR on arrival)</td>
                <td className="px-4 py-3">n/a — direct PR</td>
                <td className="px-4 py-3">2&ndash;4 (EOI processing)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Sources: Department of Home Affairs subclass pages (485, 482, 494, 491, 186, 189, 191), Department of Health and Aged Care DoctorConnect, current Core Skills Occupation List.
        </p>

        <h2>Family inclusion: how spouses and children fit in</h2>
        <p>Australian skilled visas treat the family unit as part of the application. Three rules to know:</p>
        <ul>
          <li><strong>At time of application</strong>, you can list a spouse/de facto partner and dependent children as secondary applicants. They share the primary visa subclass and grant date.</li>
          <li><strong>As subsequent entrants</strong>, family members can be added later — for example, a partner who joins after the primary applicant has settled.</li>
          <li><strong>For 186</strong> and the regional permanent visas (191), included family members get PR alongside the primary applicant. Children born in Australia to a parent on a temporary visa generally take the parent&apos;s status until either parent attains PR or citizenship.</li>
        </ul>

        <CitationHook n={4}>
          Family members (spouse and dependent children) can be included on 482, 494, 491, 491-converted-191 and 186 applications at time of application or as subsequent entrants without re-sitting medical or police checks for the primary applicant.
        </CitationHook>

        <p>
          For IMGs returning to Australia after recency abroad — a common pattern in Amandeep&apos;s situation — the partner visa interaction is worth checking with a registered migration agent. Spouse visas (subclass 309/100, 820/801) sit outside the skilled stream but can run in parallel.
        </p>

        <h2>Common visa traps for IMGs</h2>
        <p>The five recurring problems we see in our community:</p>
        <ol>
          <li><strong>DPA + visa mismatch.</strong> A 482 sponsored at an inner-Sydney hospital is technically valid, but the Medicare provider number cannot be issued because the location is not DPA. The hospital may not realise this at sponsorship stage. <strong>Always confirm DPA before signing the 482 nomination.</strong></li>
          <li><strong>Occupation list churn.</strong> Medical Practitioner (253111) is currently on the Core Skills list, but sub-codes and salary thresholds change. Do not rely on a 12-month-old forum post.</li>
          <li><strong>2-year sponsor lock-in.</strong> Switching employers during the 482 &rarr; 186 window resets the clock for 186 Temporary Residence Transition. Plan deliberately if a better job opens at year 1.</li>
          <li><strong>Age cap on 186.</strong> The standard 186 age cap is 45 (with exceptions). IMGs above 40 should plan the entire stack with the cap in mind, including DAMA concessions.</li>
          <li><strong>Failure to bank English at the right level.</strong> The 186 English threshold and the AHPRA English threshold are not identical. Some IMGs pass <Link href="/ielts-vs-oet">OET grade B for AHPRA</Link> but later need a higher band for 186 — re-sit costs time and money. Aim high on the first sitting.</li>
        </ol>

        <h2>Cost breakdown (2026 rough numbers)</h2>
        <p>
          Visa fees alone are a small fraction of the total cost. The realistic 2026 stack for a single applicant on the 482 &rarr; 186 route:
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Approximate cost (A$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">482 Skills in Demand visa application charge</td>
                <td className="px-4 py-3">A$3,210&ndash;A$3,310 (Core Skills primary)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">186 Employer Nomination application charge</td>
                <td className="px-4 py-3">A$4,640 (primary)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Skills assessment / occupation verification (where required)</td>
                <td className="px-4 py-3">A$0&ndash;A$2,000 depending on body</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Police checks (multiple jurisdictions)</td>
                <td className="px-4 py-3">A$50&ndash;A$300 each</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Medical examinations</td>
                <td className="px-4 py-3">A$300&ndash;A$500</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">English test (if required for 186 band)</td>
                <td className="px-4 py-3">A$420&ndash;A$587</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Migration agent (optional)</td>
                <td className="px-4 py-3">A$3,000&ndash;A$8,000 for full stack</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          These are visa application charges only — they do not cover <Link href="/ahpra-registration-for-imgs">AHPRA fees</Link>, AMC fees or relocation costs. Additional charges apply for secondary applicants (spouse and children).
        </p>

        <CitationHook n={5}>
          Doctors on the 485 Temporary Graduate visa cannot generally meet the medical experience threshold for 186 directly — most transition through 482 first to accumulate the 2 years of full-time work with a sponsoring employer that 186 Temporary Residence Transition requires.
        </CitationHook>

        <h2>Founder note: why we are running 482 &rarr; 186, not 189</h2>
        <p>
          Amandeep is overseas-trained, AMC-complete and headed back to Sydney. We looked at 189 seriously — it would have meant landing in Australia with PR already granted, which is administratively beautiful. We chose 482 &rarr; 186 anyway, for three reasons. First, we have line-of-sight to a sponsoring hospital, which means the 482 grants quickly with a job attached. Second, the 189 EOI ranking is unpredictable — we are not in the 25&ndash;28 age bracket where points stack cleanly. Third, the 482 stack lets us start working (and earning) immediately, while 189 EOI candidates can wait 6&ndash;18 months for an invitation. The lifetime numbers favour starting work sooner.
        </p>
        <p>
          If you are at the same crossroads, the heuristic we use is: <strong>do you have a sponsor? If yes, default to 482 &rarr; 186. If no and your points are strong, run 189 in parallel as a backup.</strong>
        </p>

        <h2>FAQ</h2>
        <div className="not-prose space-y-5 my-6">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm font-semibold text-white mb-2">{f.q}</p>
              <p className="text-sm text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: f.a }} />
            </div>
          ))}
        </div>

        <h2>What to do this week</h2>
        <ol>
          <li><strong>Confirm ANZSCO 253111</strong> is on the current Core Skills Occupation List on <a href="https://immi.homeaffairs.gov.au" target="_blank" rel="noopener noreferrer">immi.homeaffairs.gov.au</a>.</li>
          <li><strong>Map your pathway</strong> — choose A, B, C or D based on your starting point and sponsor situation.</li>
          <li><strong>Confirm DPA status</strong> of any hospital you are about to accept a job from on <a href="https://www.doctorconnect.gov.au" target="_blank" rel="noopener noreferrer">doctorconnect.gov.au</a>.</li>
          <li><strong>English score check</strong> — if your AHPRA score barely cleared OET grade B, retake to give yourself headroom for 186.</li>
          <li><strong>Diary your 2-year 482 anniversary</strong> the day you start work — that is your 186 eligibility date.</li>
        </ol>
        <p>
          If you want help mapping your specific stack — visa subclass, DPA, AMC pass date, recency status — start at <Link href="/">Mostly Medicine</Link>. For the broader pathway, see <Link href="/ahpra-registration-for-imgs">AHPRA registration for IMGs</Link> and <Link href="/rmo-jobs-for-img-australia">first RMO job in Australia</Link>.
        </p>

        <hr className="border-white/10 my-10" />

        <div className="not-prose text-xs text-slate-500 space-y-1">
          <p><strong className="text-slate-400">Last reviewed:</strong> 8 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 8 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC-pass IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://immi.homeaffairs.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Department of Home Affairs &mdash; Visa subclass pages (482, 485, 494, 491, 186, 189, 191)</a></li>
            <li><a href="https://immi.homeaffairs.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Department of Home Affairs &mdash; Designated Area Migration Agreements (DAMA)</a></li>
            <li><a href="https://immi.homeaffairs.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Department of Home Affairs &mdash; Core Skills Occupation List 2026</a></li>
            <li><a href="https://www.doctorconnect.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Department of Health and Aged Care &mdash; DoctorConnect, Distribution Priority Area map</a></li>
            <li><a href="https://www.mara.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Office of the Migration Agents Registration Authority (OMARA)</a></li>
            <li><a href="https://www.medicalboard.gov.au/Registration-Standards.aspx" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA &mdash; Medical Board of Australia Registration Standards</a></li>
          </ul>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
