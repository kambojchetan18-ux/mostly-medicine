import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import CalculatorTeaser from "@/components/CalculatorTeaser";
import PillarPageNav from "@/components/PillarPageNav";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/rmo-jobs-for-img-australia`;
const TITLE = "How IMGs Land Their First RMO Job in Australia: State-by-State Strategy for 2026";
const DESCRIPTION =
  "Australian RMO recruitment runs state-by-state from May to September each year. The IMG playbook: target DPA-eligible hospitals, match the local CV style, and apply to multiple states in parallel.";
const PUBLISHED = "2026-05-07";

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
    "rmo jobs for img australia",
    "how to get rmo job australia",
    "img first job australia",
    "rmo recruitment australia",
    "hospital jobs for img",
    "dpa locations australia",
    "rural generalist img",
    "rmo pool nsw",
    "rmo pool victoria",
    "rmo pool queensland",
    "img cv australia",
    "img salary australia",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "RMO Jobs for IMGs in Australia", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "Can an IMG apply for an Australian RMO job before AHPRA registration is granted?",
    a: "Yes — most hospitals will accept an application with a current AHPRA reference number and a clear date for expected registration. A signed contract is conditional on the registration being granted before the start date. Without any AHPRA application underway, most hospital HR systems reject the application at the first filter.",
  },
  {
    q: "Do IMGs need to be in Australia to apply for RMO jobs?",
    a: "For the application itself, no. For the interview, you should be available either in person or via video call. For a contract, you must be in Australia and registered before the start date. Many IMGs apply from offshore for cycles that start 6-9 months later.",
  },
  {
    q: "Which state is easiest for IMGs to land their first RMO job?",
    a: "Historically Queensland and the Northern Territory have had the highest IMG-to-RMO conversion rates because of structural workforce shortages. Western Australia (outside Perth metro) and rural NSW also recruit IMGs in steady volumes. Inner-Sydney, inner-Melbourne and inner-Brisbane have the lowest IMG hire rates.",
  },
  {
    q: "What is the difference between a 482 visa and a 485 visa for IMGs?",
    a: "The 485 (Temporary Graduate) visa is for recent Australian graduates and is rarely available to IMGs unless they completed an Australian medical degree. Most IMG RMOs work on a 482 (Skills in Demand) visa sponsored by the hospital, which carries the DPA restriction. The 186 Employer Nomination Scheme is the typical PR pathway after 2-3 years on 482.",
  },
  {
    q: "Do I need an Australian observership before applying?",
    a: "Not strictly required, but it transforms the application. Two weeks of observership at any Australian hospital gives you a local referee, exposure to the documentation and handover style, and a credible answer to the &lsquo;How will you adapt to the Australian system&rsquo; interview question. Most observerships are unpaid and arranged directly with the hospital DCT.",
  },
  {
    q: "How long does the recency of practice requirement take?",
    a: "For doctors who have been clinically active in the past three years, AHPRA accepts the standard recency declaration with no additional requirement. For doctors with a clinical gap, a structured recency post is usually required — typically 6-12 months of supervised practice before unrestricted RMO contracts are available.",
  },
  {
    q: "Are IMG salaries different from Australian-graduate RMO salaries?",
    a: "No. The state award rates apply identically. An IMG PGY2 RMO earns the same base salary as an Australian-graduate PGY2 RMO. The only common difference is rural loadings, which IMGs on 482 visas are more likely to access because of DPA placement.",
  },
  {
    q: "What happens if I do not match in the first cycle I apply to?",
    a: "This is the most common IMG outcome and not the disaster it feels like. Mid-year vacancies open routinely, especially in regional NSW, Queensland Health, NT and WA Country Health. Apply to every off-cycle opening, lock in a short locum or observership in the meantime, and re-enter the main cycle the following May with a stronger Australian-referenced CV.",
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
            RMO Jobs · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            How IMGs Land Their First RMO Job in Australia: State-by-State Strategy for 2026
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          Australian RMO recruitment runs state-by-state on overlapping cycles between May and September each year, with most positions starting the following February. IMGs need provisional or limited AHPRA registration before they can hold a contract, and Distribution Priority Area (DPA) restrictions push 482-visa IMGs toward regional and outer-metro hospitals. The realistic timeline from arrival in Australia to first contract is 3&ndash;6 months if your AMC, AHPRA and English are already complete.
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you have just passed AMC Part 2 and finished your AHPRA paperwork, the next problem is the one no exam prepared you for: actually landing a hospital job. Australian RMO recruitment does not work like most countries IMGs come from. There is no national match, no central register of vacancies, and the cycles run on different calendars in every state. This article maps the system as it exists in 2026, with the specific decisions an IMG needs to make in May, June, July, August.
        </p>
        <p>
          I write this as the founder of <Link href="/">Mostly Medicine</Link>. My wife, Dr Amandeep Kamboj, is an AMC pass-graduate IMG currently completing her recency of practice in Gurugram before returning to Sydney. Her own job search across NSW and Victoria is what drove the structure of the Australian Jobs module on Mostly Medicine, and the patterns below come from watching dozens of IMGs in our community work this end of the pathway in real time.
        </p>

        <h2>Quick facts at a glance</h2>
        <ul>
          <li>The annual RMO recruitment cycle is <strong>state-based</strong>, not national — there is no Australian equivalent of the UK foundation match.</li>
          <li>Most major recruitment rounds open between <strong>May and August</strong> for positions that start the following <strong>February</strong>.</li>
          <li>IMGs need at least <strong>provisional or limited AHPRA registration</strong> to be offered a contract; most apply via the Standard Pathway after AMC. See <Link href="/ahpra-registration-for-imgs">AHPRA registration for IMGs</Link>.</li>
          <li><strong>Distribution Priority Area (DPA)</strong> rules mean IMGs on a 482 visa can usually only practise in DPA-classified locations, which are largely regional and outer-metro.</li>
          <li>Realistic time from arrival to first RMO contract for an exam-complete IMG: <strong>3&ndash;6 months</strong>. From scratch (no AMC, no English): 18&ndash;30 months.</li>
          <li>2026 RMO base salaries range from roughly <strong>A$80,000 (PGY1)</strong> to <strong>A$110,000 (PGY3)</strong> before overtime, on-call and rural loadings.</li>
        </ul>

        <h2>RMO, Resident, Registrar &mdash; what these terms mean in Australia</h2>
        <p>
          Australian hospital titles do not map cleanly onto IMG home-country titles, and the confusion costs IMGs interview marks.
        </p>
        <ul>
          <li><strong>Intern (PGY1)</strong> — first postgraduate year. Almost always reserved for Australian medical graduates; very few hospitals appoint IMG interns.</li>
          <li><strong>Resident Medical Officer (RMO)</strong> — PGY2 onwards, pre-vocational. This is the realistic IMG entry point. RMO terms last 12 months on a rotating contract.</li>
          <li><strong>Senior Resident Medical Officer (SRMO) / Junior Medical Officer (JMO)</strong> — PGY3+ in some states; same scope as RMO but slightly more responsibility.</li>
          <li><strong>Registrar</strong> — accepted into a specialty training program (RACP, RACS, RACGP, ACEM, ANZCA and the rest). IMGs reach this point after 1&ndash;2 RMO years and a successful college application.</li>
          <li><strong>Career Medical Officer (CMO)</strong> — non-training senior hospital doctor. Useful long-term if vocational training is not the goal.</li>
        </ul>
        <p>
          For IMGs, the practical question is &ldquo;how do I become an RMO&rdquo;. Once you are inside the hospital system as an RMO, the path to registrar follows the same rules as for Australian graduates.
        </p>

        <CitationHook n={1}>
          Australian RMO (Resident Medical Officer) is the standard pre-vocational hospital role for doctors in PGY2 and beyond, and is the realistic entry point for International Medical Graduates seeking their first Australian hospital contract.
        </CitationHook>

        <h2>The annual RMO recruitment cycle by state</h2>
        <p>
          Each state runs its own cycle on its own calendar. Applying to one state and waiting is the most common IMG mistake — the right strategy is parallel applications across at least three states, weighted by where DPA opportunities and your support network sit.
        </p>

        <h3>New South Wales (HETI / NSW Health)</h3>
        <p>
          NSW Health runs a centralised application via <a href="https://www.heti.nsw.gov.au" target="_blank" rel="noopener noreferrer">HETI</a> (Health Education and Training Institute). The annual NSW RMO recruitment opens around <strong>May</strong>, with offers issued in <strong>August&ndash;September</strong> for a February start. IMGs apply through the same portal as Australian graduates, but flag IMG status in the application. NSW has the largest absolute number of RMO positions and the most metropolitan options, which makes competition stiff in inner-Sydney teaching hospitals like RPA, Prince of Wales and Westmead.
        </p>

        <h3>Victoria (PMCV match)</h3>
        <p>
          Victoria runs a <strong>computer match</strong> through the Postgraduate Medical Council of Victoria — the closest thing Australia has to a UK-style match. Applications typically open in <strong>June</strong>, candidates rank hospitals, hospitals rank candidates, and a computer algorithm matches around <strong>August</strong>. PMCV is procedurally fair but can feel opaque to IMGs who are unfamiliar with rank-list strategy. Regional Victorian hospitals (Bendigo, Ballarat, Geelong) have historically been more IMG-friendly than the inner-Melbourne tertiary centres.
        </p>

        <h3>Queensland (Queensland Health single employer)</h3>
        <p>
          <a href="https://www.health.qld.gov.au" target="_blank" rel="noopener noreferrer">Queensland Health</a> runs a single-employer model — one application covers all 17 hospital and health services in the state. Applications open around <strong>May&ndash;June</strong>, with offers in <strong>September&ndash;October</strong>. Queensland has historically been the most IMG-receptive state because of its rural workforce footprint; the Sunshine Coast, Townsville, Mackay and Cairns hospitals all have steady IMG intakes.
        </p>

        <h3>WA, SA, Tasmania, ACT, NT</h3>
        <p>
          The smaller states each run their own portal:
        </p>
        <ul>
          <li><strong>WA Health</strong> — recruitment via <a href="https://www.wacountry.health.wa.gov.au" target="_blank" rel="noopener noreferrer">WA Country Health Service</a> and individual metro hospitals; cycle opens around <strong>June</strong>.</li>
          <li><strong>SA Health</strong> — applications via <a href="https://www.sahealth.sa.gov.au" target="_blank" rel="noopener noreferrer">SA Health careers</a> around <strong>June&ndash;July</strong>.</li>
          <li><strong>Tasmania</strong> — Tasmanian Health Service runs a small RMO intake; applications open around <strong>July</strong>.</li>
          <li><strong>ACT</strong> — Canberra Health Services recruits centrally with applications around <strong>June</strong>.</li>
          <li><strong>Northern Territory</strong> — <a href="https://health.nt.gov.au" target="_blank" rel="noopener noreferrer">NT Health</a> actively recruits IMGs year-round given the workforce shortage; can be a faster path than the southern states.</li>
        </ul>
        <p>
          NT and rural WA in particular often hire outside the standard cycle when vacancies open mid-year, which is useful if you arrive in Australia after the main rounds have closed.
        </p>

        <CitationHook n={2}>
          Each Australian state runs its own RMO recruitment cycle: Victoria uses the PMCV computer match in mid-year, NSW HETI opens recruitment in May with offers in August&ndash;September, and Queensland Health uses a single-employer model covering all 17 hospital and health services.
        </CitationHook>

        <h2>DPA: why Distribution Priority Area decides where most IMGs work</h2>
        <p>
          Distribution Priority Area is the single most important policy concept in the IMG job search. The Department of Health and Aged Care classifies geographic areas based on workforce shortage; under the Health Insurance Act, doctors who carry the <strong>section 19AB restriction</strong> (which applies to most IMGs on temporary visas for the first 10 years from initial registration) can only access Medicare provider numbers in DPA locations.
        </p>
        <p>
          In practice this means that an IMG on a 482 Skills in Demand visa, working as an RMO in a public hospital, must be in a hospital located in a DPA classification (or a designated outer-metro DPA pocket). Inner Sydney, inner Melbourne and inner Brisbane are not DPA. Western Sydney, regional Victoria, regional Queensland, almost all of WA outside Perth metro, almost all of SA outside Adelaide metro, all of Tasmania, all of NT — these are DPA.
        </p>
        <p>
          The official DPA map sits at <a href="https://www.doctorconnect.gov.au" target="_blank" rel="noopener noreferrer">doctorconnect.gov.au</a> and is updated quarterly. Before applying anywhere, search the hospital&apos;s postcode in the DPA tool. A non-DPA hospital can still hire IMGs in some salaried roles, but the visa and Medicare paperwork is significantly harder and many HR departments simply will not engage.
        </p>

        <CitationHook n={3}>
          Distribution Priority Area (DPA) status restricts where IMGs subject to section 19AB of the Health Insurance Act can practise; DPA locations in 2026 are concentrated across regional Australia and specific outer-metro pockets, and the official map is published at doctorconnect.gov.au.
        </CitationHook>

        <h2>The Rural Generalist door (RACGP Rural Generalist Pathway)</h2>
        <p>
          For IMGs willing to work rurally, the <strong>RACGP Rural Generalist Pathway</strong> is the fastest registration-to-fellowship route in Australia. Rural Generalists complete a structured program of GP training plus an advanced skill (anaesthetics, obstetrics, emergency medicine, mental health, paediatrics or others) and qualify with <strong>FRACGP plus FACRRM-equivalent advanced skills</strong>. The whole pathway runs 3&ndash;4 years from general registration to fellowship for an IMG already past AMC Part 2.
        </p>
        <p>The pathway suits IMGs who:</p>
        <ul>
          <li>want to stay in regional or rural Australia long-term</li>
          <li>have prior generalist or rural exposure in their home country</li>
          <li>are willing to do procedural work (caesareans, anaesthetics, ED resuscitation) in addition to clinic-based GP work</li>
        </ul>
        <p>
          Funding through the Rural Generalist Training Pathway often comes with a regional service obligation, which lines up neatly with most 482-visa DPA constraints. Several IMGs in our community have used this pathway to convert provisional registration into FRACGP within four years of landing in Australia.
        </p>

        <h2>CV and cover letter conventions for Australian hospitals</h2>
        <p>
          Australian hospital CVs look different from CVs in India, Pakistan, Egypt, Nigeria and most South Asian countries. The single fastest IMG win is reformatting the CV before the first application.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Convention</th>
                <th className="px-4 py-3 font-semibold">Australian hospital CV</th>
                <th className="px-4 py-3 font-semibold">Common IMG CV (avoid)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Length</td>
                <td className="px-4 py-3">2&ndash;3 pages, dense</td>
                <td className="px-4 py-3">6&ndash;12 pages, padded</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Photo</td>
                <td className="px-4 py-3">None</td>
                <td className="px-4 py-3">Headshot at top</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Personal details</td>
                <td className="px-4 py-3">Name, citizenship/visa, AHPRA number, contact</td>
                <td className="px-4 py-3">Photo, marital status, religion, parents&apos; names</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Order</td>
                <td className="px-4 py-3">Reverse-chronological clinical experience first</td>
                <td className="px-4 py-3">Education first, experience last</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Clinical experience</td>
                <td className="px-4 py-3">Hospital, role, dates, scope (1&ndash;2 lines per role)</td>
                <td className="px-4 py-3">Long paragraphs of duties</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Publications</td>
                <td className="px-4 py-3">Listed if relevant; IMGs without publications are not penalised</td>
                <td className="px-4 py-3">Inflated &ldquo;presentations&rdquo; lists</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Referees</td>
                <td className="px-4 py-3">2&ndash;3 named referees with current contact details</td>
                <td className="px-4 py-3">&ldquo;References available on request&rdquo;</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Interests/awards</td>
                <td className="px-4 py-3">Brief, only if substantive</td>
                <td className="px-4 py-3">Long, generic (&ldquo;cricket, reading, music&rdquo;)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Sources: hospital recruitment guidance from NSW Health, PMCV, Queensland Health, and AMA Career Pathways resources.
        </p>
        <p>
          The CV is the only thing that gets you to interview. A two-page Australian-style CV with named referees and a clear scope-of-practice statement clears the first sift; a 10-page CV with a photo is routinely deleted before a human reads it.
        </p>

        <CitationHook n={4}>
          Australian hospital CVs for RMO applications are 2&ndash;3 pages, written in plain English with reverse-chronological clinical experience and named referees — long-form CVs with photos and personal details, common in South Asian and Middle Eastern conventions, are routinely rejected at screening.
        </CitationHook>

        <h2>References &mdash; what Australian hospitals expect</h2>
        <p>
          Australian recruitment relies heavily on <strong>direct phone reference calls</strong>. Two patterns matter:
        </p>
        <ol>
          <li><strong>Named referees</strong> — at least two, ideally three, with their full title, email and direct phone number. The referees should know your clinical work; &ldquo;letterhead reference from the medical superintendent&rdquo; without a phone number is treated with suspicion.</li>
          <li><strong>Local reference where possible</strong> — even one Australian referee (a supervisor from a clinical observership, a Medical Educator from an exam course, a hospital you locumed at) carries far more weight than five home-country referees. If you have done a <Link href="/ahpra-recency-of-practice">recency of practice</Link> post in Australia, that supervisor is the single most valuable referee on your CV.</li>
        </ol>
        <p>
          Plan ahead. Email referees in advance, share the JMO/RMO position you are applying to, and ask them to expect a call from a 02/03/07 number. Australian recruiters will move on if a referee is unreachable.
        </p>

        <h2>Interview format: panel, behavioural, scenario</h2>
        <p>
          RMO interviews are typically panel-based — three to five interviewers, including a Director of Medical Services or Director of Clinical Training, a senior consultant from a relevant specialty, and an HR or workforce officer.
        </p>
        <p>The format is consistent across most Australian hospitals:</p>
        <ul>
          <li><strong>Opening question</strong> — &ldquo;Tell us about yourself&rdquo; or &ldquo;Why this hospital&rdquo;.</li>
          <li><strong>Behavioural questions</strong> — STAR-format (&ldquo;Tell us about a time you disagreed with a senior colleague&rdquo;, &ldquo;Tell us about a time you escalated a deteriorating patient&rdquo;).</li>
          <li><strong>Clinical scenarios</strong> — short clinical vignettes asking how you would manage a common ward situation (chest pain, sepsis, falls, end-of-life decisions).</li>
          <li><strong>IMG-specific questions</strong> — &ldquo;How will you adapt to the Australian system&rdquo;, &ldquo;What did you learn from your AMC clinical exam&rdquo;.</li>
          <li><strong>Your questions</strong> — always have two prepared, ideally about supervision structure or specific rotations available.</li>
        </ul>
        <p>
          Australian hospitals are <strong>strongly biased toward communication style</strong>. Confident, structured, English-fluent answers beat encyclopaedic clinical knowledge delivered hesitantly. The patterns that work in <Link href="/amc-clinical-exam-preparation">AMC Part 2</Link> work here too.
        </p>

        <h2>Salary bands by PGY year and state (real 2026 numbers)</h2>
        <p>
          The 2026 salary numbers below are pulled from publicly available state award documents and ASMOF rate cards. Numbers are <strong>base salary</strong>, before overtime, on-call, weekend penalties and rural loadings.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">PGY year</th>
                <th className="px-4 py-3 font-semibold">NSW</th>
                <th className="px-4 py-3 font-semibold">Victoria</th>
                <th className="px-4 py-3 font-semibold">Queensland</th>
                <th className="px-4 py-3 font-semibold">WA</th>
                <th className="px-4 py-3 font-semibold">SA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">PGY2 (RMO 1)</td>
                <td className="px-4 py-3">A$84,000</td>
                <td className="px-4 py-3">A$82,500</td>
                <td className="px-4 py-3">A$87,000</td>
                <td className="px-4 py-3">A$85,500</td>
                <td className="px-4 py-3">A$83,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">PGY3 (RMO 2)</td>
                <td className="px-4 py-3">A$92,000</td>
                <td className="px-4 py-3">A$90,000</td>
                <td className="px-4 py-3">A$95,500</td>
                <td className="px-4 py-3">A$93,500</td>
                <td className="px-4 py-3">A$91,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">PGY4 (SRMO 1)</td>
                <td className="px-4 py-3">A$100,500</td>
                <td className="px-4 py-3">A$98,500</td>
                <td className="px-4 py-3">A$104,000</td>
                <td className="px-4 py-3">A$102,000</td>
                <td className="px-4 py-3">A$99,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">PGY5 (SRMO 2)</td>
                <td className="px-4 py-3">A$108,000</td>
                <td className="px-4 py-3">A$106,000</td>
                <td className="px-4 py-3">A$112,000</td>
                <td className="px-4 py-3">A$109,500</td>
                <td className="px-4 py-3">A$106,500</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Sources: NSW Health Determinations 2026; Victorian Public Health Sector (Medical Scientists, Medical Officers and Dentists) Multiple Enterprise Agreement; Queensland Health Medical Officers (Queensland Health) Certified Agreement; ASMOF rate cards.
        </p>
        <p>
          After overtime (typical RMO works 50&ndash;60 hours including paid overtime), most RMOs take home A$110,000&ndash;A$140,000 in PGY2 and A$130,000&ndash;A$170,000 by PGY4. Rural loadings of 10&ndash;25% on top apply in DPA locations across most states.
        </p>

        <CitationHook n={5}>
          RMO base salaries in 2026 range from approximately A$80,000 in PGY1 to A$110,000 in PGY3 across Australian states, before overtime, on-call and rural loadings of 10&ndash;25% which apply in Distribution Priority Area locations.
        </CitationHook>

        <h2>The 7 most common IMG job-search mistakes</h2>
        <ol>
          <li><strong>Applying only to inner-metro tertiary hospitals.</strong> RPA, Royal Melbourne and Royal Brisbane have the lowest IMG hire rates in the country. DPA-classified regional hospitals hire IMGs in steady volumes every cycle.</li>
          <li><strong>One-state strategy.</strong> Apply to NSW + Victoria + Queensland in parallel, with a smaller WA/SA application as a backup. Sequential applications waste cycles.</li>
          <li><strong>Sending the home-country CV unchanged.</strong> Australian recruiters scan in 30 seconds; a 10-page padded CV is deleted in the first sift.</li>
          <li><strong>Failing to prep referees.</strong> Hospitals abandon a candidate when a phone call goes to voicemail twice in a row.</li>
          <li><strong>No Australian clinical exposure on the CV.</strong> A two-week observership at any Australian hospital, or a short locum, transforms the application.</li>
          <li><strong>Treating the interview as a knowledge test.</strong> Communication style and &ldquo;fit with the Australian system&rdquo; are scored heavily; rote knowledge is not.</li>
          <li><strong>Underestimating the 3&ndash;6 month timeline.</strong> IMGs who arrive in Australia in February expecting a March contract get blindsided. The cycle starts in May for the following February.</li>
        </ol>

        <h2>Founder note: how Amandeep is timing this</h2>
        <p>
          Amandeep is currently in Gurugram completing recency of practice post-AMC. The plan we are running together is exactly the parallel-applications strategy above — NSW HETI in May, PMCV match in June, Queensland Health in May&ndash;June, with a Sydney + regional NSW + outer-metro Melbourne shortlist. Rural Generalist Pathway is on the table as a backup if the metro RMO route stalls.
        </p>
        <p>
          The thing she has flagged repeatedly: <strong>you cannot start applications without an AHPRA application reference number</strong>. Even if your AHPRA registration is &ldquo;in progress&rdquo;, recruiters want to see proof you are in the system. Start the <Link href="/ahpra-registration-for-imgs">AHPRA registration paperwork</Link> the week you pass AMC Part 2 — do not wait for the registration to be granted.
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
          <li><strong>Confirm your DPA shortlist.</strong> Search 10 hospitals you would consider working at on <a href="https://www.doctorconnect.gov.au" target="_blank" rel="noopener noreferrer">doctorconnect.gov.au</a> and confirm DPA status before drafting applications.</li>
          <li><strong>Reformat your CV</strong> to 2&ndash;3 pages, Australian convention.</li>
          <li><strong>Email three referees</strong> and confirm phone contactability for the next 4 months.</li>
          <li><strong>Apply to NSW HETI, PMCV, and Queensland Health in parallel.</strong> Diary the exact opening dates the week before each portal opens.</li>
          <li><strong>Book one Australian observership</strong> for a 2&ndash;4 week window before your first interview.</li>
        </ol>
        <p>
          If you want to talk through your specific timeline — AMC pass date, AHPRA progress, visa class, state preference — start at <Link href="/">Mostly Medicine</Link>. We answer every IMG who writes in. For the broader pathway view, see <Link href="/img-australia-pathway">IMG Australia pathway</Link> and <Link href="/amc-pass-rates-by-country">AMC pass rates by country</Link>.
        </p>

        <hr className="border-white/10 my-10" />

        <div className="not-prose text-xs text-slate-500 space-y-1">
          <p><strong className="text-slate-400">Last reviewed:</strong> 7 May 2026</p>
          <p><strong className="text-slate-400">Next review:</strong> 7 November 2026</p>
          <p><strong className="text-slate-400">Author:</strong> Chetan Kamboj, Founder, Mostly Medicine</p>
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC-pass IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://www.medicalboard.gov.au/Registration-Standards.aspx" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA &mdash; Medical Board of Australia Registration Standards</a></li>
            <li><a href="https://www.doctorconnect.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Department of Health and Aged Care &mdash; DoctorConnect, Distribution Priority Area map</a></li>
            <li><a href="https://www.heti.nsw.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">HETI (Health Education and Training Institute), NSW Health</a></li>
            <li><a href="https://www.pmcv.com.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Postgraduate Medical Council of Victoria (PMCV)</a></li>
            <li><a href="https://www.health.qld.gov.au/employment" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Queensland Health, Medical Officers Recruitment</a></li>
            <li><a href="https://www.wacountry.health.wa.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">WA Country Health Service</a></li>
            <li><a href="https://www.sahealth.sa.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">SA Health Careers</a></li>
            <li><a href="https://health.nt.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">NT Health, Medical Officer Recruitment</a></li>
            <li><a href="https://www.racgp.org.au/education/imgs/rural-generalist" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">RACGP Rural Generalist Pathway</a></li>
            <li><a href="https://www.asmof.org.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">ASMOF (Australian Salaried Medical Officers&apos; Federation) rate cards 2026</a></li>
            <li><a href="https://www.ahpra.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA registration standards</a></li>
          </ul>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
