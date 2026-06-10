import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-vs-usmle-vs-plab`;
const TITLE = "AMC vs USMLE vs PLAB 2026 — Cost, Pass Rates, Career Outcomes Compared";
const DESCRIPTION =
  "Definitive head-to-head comparison of the AMC (Australia), USMLE (USA), and PLAB (UK) for International Medical Graduates. Cost, format, pass rates, recognition, career outcomes, and the framework to decide which exam to pick. Updated for 2026.";

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
    { "@type": "Thing", name: "Australian Medical Council exam" },
    { "@type": "Thing", name: "United States Medical Licensing Examination" },
    { "@type": "Thing", name: "Professional and Linguistic Assessments Board" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC vs USMLE vs PLAB", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which exam is easiest — AMC, USMLE, or PLAB?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PLAB is generally considered the most accessible by total volume (two parts vs USMLE's four), and AMC sits between PLAB and USMLE in difficulty. USMLE Step 1 and Step 2 CK have the highest knowledge density. However, 'easiest' is the wrong question — the right exam is the one whose destination country fits your career, family, and visa profile.",
      },
    },
    {
      "@type": "Question",
      name: "Which exam has the highest pass rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PLAB Part 1 first-attempt pass rates for IMGs are typically around 65–75%. AMC MCQ sits at 50–70%. USMLE Step 1 was made pass/fail in 2022 and reports first-time IMG pass rates around 70–80%. Pass rate alone is misleading because of self-selection — only well-prepared candidates sit USMLE.",
      },
    },
    {
      "@type": "Question",
      name: "Which is cheapest end-to-end?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PLAB end-to-end (Part 1 + Part 2 + GMC registration) costs roughly GBP 1,800–2,200 (~AUD 3,500–4,200). AMC (AMC MCQ + AMC Handbook AI RolePlay + AHPRA) costs roughly AUD 7,500–9,000 including English testing and EPIC verification. USMLE (Step 1 + Step 2 CK + Step 3 + ECFMG certification + visa fees) typically exceeds USD 5,000 (~AUD 7,800), and that is before residency application costs (ERAS, interviews, travel) which can add another USD 5,000–10,000.",
      },
    },
    {
      "@type": "Question",
      name: "Can I sit all three exams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, there is no global rule preventing it, and some IMGs do hold AMC + PLAB or USMLE + AMC. However, the time and money cost is rarely justified. Pick one destination, commit, and reserve a backup pathway only if you have a clear reason (e.g., spouse working in a different country, future relocation plans).",
      },
    },
    {
      "@type": "Question",
      name: "How does career progression compare?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Australia (post-AMC): structured intern → RMO → registrar → fellowship via specialty colleges (RACGP, RACP, RACS, etc.), with strong work-life balance and predictable training. UK (post-PLAB): foundation programme → core training → specialty training, currently strained by NHS workforce pressures. USA (post-USMLE): residency match via NRMP — competitive, especially for IMGs in surgical and medical specialties, but the highest-paid endpoint and best research infrastructure.",
      },
    },
    {
      "@type": "Question",
      name: "Which exam is best for an IMG with a young family?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Australia (AMC pathway) is the most family-friendly: predictable training hours, strong public services, dependent visas straightforward, climate and lifestyle widely cited as positives. UK (PLAB) offers fast-track entry but NHS workload can be heavy. USA (USMLE) typically demands the most intense early years (residency 60–80 hrs/week) which is hard with young children.",
      },
    },
    {
      "@type": "Question",
      name: "If I already passed PLAB or USMLE, do I still need AMC for Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, in most cases. The AMC pathway is the standard route for general registration in Australia. Some specialists may qualify for the Specialist Pathway via direct college assessment, and Competent Authority pathways apply to a small list of countries (UK, Ireland, USA, Canada, NZ) — but for the vast majority of IMGs, AMC MCQ and AMC Handbook AI RolePlay remain required.",
      },
    },
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AMC vs USMLE vs PLAB Comparison",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "AMC (Australia)",
      url: `${SITE_URL}/amc`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "USMLE (United States)",
      url: "https://www.usmle.org",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "PLAB (United Kingdom)",
      url: "https://www.gmc-uk.org/registration-and-licensing/join-the-register/plab",
    },
  ],
};

export default function AmcVsUsmleVsPlabPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
            IMG Exam Comparison · Updated 2026
          </p>
          <h1 className="font-display font-bold mb-4">
            AMC vs USMLE vs PLAB: The Honest 2026 Comparison
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            A clinician&apos;s side-by-side comparison of the three major IMG
            licensing pathways — Australia (AMC), the United States (USMLE),
            and the United Kingdom (PLAB). Cost, format, pass rates,
            recognition, career outcomes, and a decision framework.
          </p>
        </header>

        <section>
          <h2>Why this comparison matters</h2>
          <p>
            For an International Medical Graduate, the choice of licensing
            exam is effectively the choice of country, family lifestyle, and
            10-year career arc. The exam itself is just the entry ticket —
            but the wrong ticket can cost two years and tens of thousands of
            dollars. This page is a fact-first comparison so you can decide
            with clarity.
          </p>
        </section>

        <section>
          <h2>Side-by-side comparison table</h2>
          <div className="not-prose my-8 overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-brand-300">
                <tr>
                  <th className="px-4 py-3 font-bold">Dimension</th>
                  <th className="px-4 py-3 font-bold">AMC (Australia)</th>
                  <th className="px-4 py-3 font-bold">USMLE (USA)</th>
                  <th className="px-4 py-3 font-bold">PLAB (UK)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Parts</td>
                  <td className="px-4 py-3">2 (AMC MCQ, AMC Handbook AI RolePlay Clinical/MCAT)</td>
                  <td className="px-4 py-3">3 (Step 1, Step 2 CK, Step 3)</td>
                  <td className="px-4 py-3">2 (Part 1 MCQ, Part 2 OSCE)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Total exam cost</td>
                  <td className="px-4 py-3">~AUD 6,200</td>
                  <td className="px-4 py-3">~USD 3,800 (~AUD 5,900)</td>
                  <td className="px-4 py-3">~GBP 1,500 (~AUD 2,900)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">English test</td>
                  <td className="px-4 py-3">IELTS 7+ or OET B+</td>
                  <td className="px-4 py-3">OET, TOEFL, or USMLE itself</td>
                  <td className="px-4 py-3">IELTS 7.5+ or OET B+</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">First-attempt pass rate</td>
                  <td className="px-4 py-3">AMC MCQ ~50–70%, AMC Handbook AI RolePlay ~40–60%</td>
                  <td className="px-4 py-3">Step 1 ~70–80%, Step 2 CK ~80%</td>
                  <td className="px-4 py-3">Part 1 ~65–75%, Part 2 ~70%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Time to registration</td>
                  <td className="px-4 py-3">12–24 months end-to-end</td>
                  <td className="px-4 py-3">2–4 years incl. residency match</td>
                  <td className="px-4 py-3">12–18 months end-to-end</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Post-exam pathway</td>
                  <td className="px-4 py-3">AHPRA registration → Internship/RMO → Fellowship</td>
                  <td className="px-4 py-3">ECFMG cert → NRMP residency match → Board cert</td>
                  <td className="px-4 py-3">GMC registration → Foundation Year → Specialty</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Avg. attending salary</td>
                  <td className="px-4 py-3">AUD 250k–500k+</td>
                  <td className="px-4 py-3">USD 250k–700k+</td>
                  <td className="px-4 py-3">GBP 90k–150k+ (NHS)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Work-life balance</td>
                  <td className="px-4 py-3">High</td>
                  <td className="px-4 py-3">Medium-low (residency)</td>
                  <td className="px-4 py-3">Medium</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Visa pathway</td>
                  <td className="px-4 py-3">482/186 sponsored, regional incentives</td>
                  <td className="px-4 py-3">J-1 or H-1B, then Green Card</td>
                  <td className="px-4 py-3">Skilled Worker (Health &amp; Care)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Family friendliness</td>
                  <td className="px-4 py-3">High (lifestyle, schools, climate)</td>
                  <td className="px-4 py-3">Variable (depends on city/state)</td>
                  <td className="px-4 py-3">High (NHS family policies)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">
            Figures are 2026 estimates compiled from public sources (AMC, USMLE,
            GMC) and IMG community reports. Always verify current fees on the
            official sites before budgeting.
          </p>
        </section>

        <section>
          <h2>AMC (Australia) — overview</h2>
          <p>
            The <strong>Australian Medical Council</strong> exam is a two-part
            assessment: <Link href="/amc-cat1">AMC MCQ</Link> and{" "}
            <Link href="/amc-cat2">AMC Handbook AI RolePlay (Clinical/MCAT)</Link>. After passing
            both, IMGs apply for AHPRA registration and enter the Australian
            health system as interns or RMOs, then pursue specialist training
            via Australia&apos;s medical colleges (RACGP, RACP, RACS, ACEM,
            etc.).
          </p>
          <p>
            <strong>Strengths:</strong> Strong work-life balance, generous
            salaries, structured training, high quality of life, family-friendly
            visa pathways, no residency &quot;match&quot; lottery.
          </p>
          <p>
            <strong>Weaknesses:</strong> Internship places competitive in major
            cities; some IMGs start in rural/regional areas. AMC Handbook AI RolePlay logistics
            (in-person, Melbourne-centred) can be inconvenient.
          </p>
        </section>

        <section>
          <h2>USMLE (United States) — overview</h2>
          <p>
            The <strong>United States Medical Licensing Examination</strong>{" "}
            has three steps: Step 1 (basic science, now pass/fail), Step 2 CK
            (clinical knowledge), and Step 3 (typically taken during
            residency). Passing alone does not grant licensure — IMGs must
            secure ECFMG certification then enter the National Resident
            Matching Program (NRMP) to begin residency.
          </p>
          <p>
            <strong>Strengths:</strong> Highest endpoint compensation, world-
            leading research and subspecialty training, broadest range of
            fellowship options.
          </p>
          <p>
            <strong>Weaknesses:</strong> Competitive match (especially
            surgical, dermatology, radiology), heavy residency hours,
            geographic uncertainty (you go where you match), visa complexity
            (J-1 with home-country requirement, or H-1B), highest total cost
            once application/interview travel is included.
          </p>
        </section>

        <section>
          <h2>PLAB (United Kingdom) — overview</h2>
          <p>
            The <strong>Professional and Linguistic Assessments Board</strong>{" "}
            test, run by the General Medical Council, has two parts: Part 1
            (200 MCQs over 3 hours) and Part 2 (16-station OSCE). After
            passing, IMGs register with the GMC and typically enter as a
            Trust-grade or Foundation Year doctor in the NHS.
          </p>
          <p>
            <strong>Strengths:</strong> Lowest exam cost, fastest end-to-end
            registration, English-speaking environment, recognised globally,
            strong family policies.
          </p>
          <p>
            <strong>Weaknesses:</strong> NHS workforce pressures, lower
            absolute compensation than AU/US, specialty training increasingly
            competitive, Brexit-era visa changes have added administrative
            complexity.
          </p>
        </section>

        <section>
          <h2>Recognition and reciprocity</h2>
          <p>
            None of the three exams is automatically recognised by another
            jurisdiction. However, a small number of <strong>Competent
            Authority pathways</strong> (limited to UK, Ireland, USA, Canada,
            and New Zealand) allow doctors with full registration in those
            countries to apply for AHPRA registration without sitting AMC.
            This is narrow — most IMGs from India, Pakistan, Bangladesh,
            Egypt, Nigeria, the Philippines, and similar countries must sit
            AMC for Australia regardless of prior PLAB or USMLE success.
          </p>
        </section>

        <section>
          <h2>How to decide: a 4-question framework</h2>
          <ol>
            <li>
              <strong>Where do you want to live in 5 years?</strong> The exam
              is downstream of country choice, not the other way around.
            </li>
            <li>
              <strong>What is your family situation?</strong> Young children
              and a non-doctor spouse generally favour AU or UK over a 3–5
              year US residency grind.
            </li>
            <li>
              <strong>What is your visa profile?</strong> Some passports have
              easier paths to AU PR or UK Skilled Worker than to US Green
              Card. Map this before paying any fees.
            </li>
            <li>
              <strong>What is your specialty target?</strong> If you want
              cutting-edge subspecialty research, the US is unrivalled. For
              broad-spectrum primary care or generalist hospital medicine,
              Australia and the UK are excellent.
            </li>
          </ol>
        </section>

        <section>
          <h2>Why most IMGs choose Australia in 2026</h2>
          <p>
            In recent IMG community surveys, Australia has overtaken the UK as
            the #1 destination of choice and now competes closely with the US
            on first-preference share. The drivers:
          </p>
          <ul>
            <li>
              <strong>Predictable training</strong> with no &quot;match&quot;
              lottery.
            </li>
            <li>
              <strong>Strong base salaries</strong> (AUD 80k+ from intern
              year, AUD 250k+ as RMO/registrar in some specialties).
            </li>
            <li>
              <strong>Lifestyle and climate</strong> repeatedly cited as
              top-tier.
            </li>
            <li>
              <strong>Clear PR pathway</strong> via subclass 482 → 186 visa
              for sponsored doctors, often within 2–4 years.
            </li>
            <li>
              <strong>Workforce demand</strong>: government-flagged shortages
              in regional and rural areas with relocation incentives.
            </li>
          </ul>
        </section>

        <section>
          <h2>Where Mostly Medicine fits</h2>
          <p>
            Mostly Medicine is purpose-built for the AMC pathway. If Australia
            is your target, the platform consolidates everything an IMG needs:
          </p>
          <ul>
            <li>
              <Link href="/dashboard/cat1">
                <strong>3,000+ AMC MCQ questions</strong>
              </Link>{" "}
              calibrated to the AMC blueprint and Australian guidelines.
            </li>
            <li>
              <Link href="/dashboard/cat2">
                <strong>151+ AMC Handbook AI RolePlay scenarios</strong>
              </Link>{" "}
              with AI examiner-grade feedback.
            </li>
            <li>
              <Link href="/img-australia-pathway">
                <strong>Full IMG pathway guide</strong>
              </Link>{" "}
              from EPIC verification to fellowship.
            </li>
            <li>
              <Link href="/dashboard/jobs">
                <strong>Australian medical job tracker</strong>
              </Link>{" "}
              for life after AMC.
            </li>
          </ul>
          <p>
            <Link
              href="/auth/signup"
              className="inline-block mt-4 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-2xl font-bold no-underline"
            >
              Start AMC prep free →
            </Link>
          </p>
        </section>

        <section>
          <h2>Frequently asked questions</h2>

          <h3>Which exam is easiest?</h3>
          <p>
            PLAB is generally most accessible by total volume; AMC sits in the
            middle; USMLE has the highest knowledge density. &quot;Easiest&quot;
            is the wrong filter — fit-for-country matters more.
          </p>

          <h3>Which has the highest pass rate?</h3>
          <p>
            USMLE Step 2 CK reports the highest IMG first-attempt pass rate
            (~80%), but with strong self-selection. PLAB and AMC report 50–75%
            ranges.
          </p>

          <h3>Which is cheapest end-to-end?</h3>
          <p>
            PLAB — roughly GBP 1,800–2,200 total. AMC and USMLE cluster
            around AUD 7,500–9,000 and USD 5,000+ respectively (USMLE before
            residency-application costs).
          </p>

          <h3>Can I sit more than one?</h3>
          <p>
            Yes, but rarely cost-effective. Pick one destination, commit, and
            keep a backup only if you have a specific reason.
          </p>

          <h3>How does post-exam career compare?</h3>
          <p>
            AU offers structured training and high lifestyle; US offers the
            highest pay and best research; UK offers fastest entry but heavier
            NHS workload.
          </p>

          <h3>If I have PLAB or USMLE, do I still need AMC?</h3>
          <p>
            In most cases yes. Only a narrow Competent Authority pathway
            allows direct AHPRA registration without AMC.
          </p>
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500">
          <p>
            This comparison is provided for educational purposes by Mostly
            Medicine. Verify current fees and policies on{" "}
            <a href="https://www.amc.org.au" target="_blank" rel="noopener">
              amc.org.au
            </a>
            ,{" "}
            <a href="https://www.usmle.org" target="_blank" rel="noopener">
              usmle.org
            </a>
            , and{" "}
            <a href="https://www.gmc-uk.org" target="_blank" rel="noopener">
              gmc-uk.org
            </a>
            . Last updated: April 2026.
          </p>
        </footer>
      </article>
    <SiteFooter />
    </main>
  );
}
