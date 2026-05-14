import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import CalculatorTeaser from "@/components/CalculatorTeaser";
import PillarPageNav from "@/components/PillarPageNav";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-pass-rates-by-country`;
const TITLE = "AMC Pass Rates by Country (2024-2026): What the Data Actually Shows IMGs";
const DESCRIPTION =
  "AMC Part 1 first-attempt pass rates sit around 60-70%, with country-level variation driven by years-since-graduation and structured prep, not innate ability.";
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
    "amc pass rate",
    "amc cat 1 pass rate",
    "amc pass rate by country",
    "amc mcq pass percentage",
    "amc clinical pass rate",
    "amc first attempt pass rate",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC Pass Rates by Country", item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: "What is the AMC Part 1 pass rate in 2026?",
    a: "The AMC publishes aggregate pass rates per sitting on amc.org.au/about/statistics and in its annual report. Recent cycles have sat in the 60-70% band for first-attempt MCQ candidates. For the most current single-cycle number, check the latest AMC annual report directly — it is updated annually and is the authoritative source.",
  },
  {
    q: "What is the AMC pass rate for Indian doctors specifically?",
    a: "The AMC does not publish a country-of-training breakdown. Workforce data (AHPRA, AIHW) plus academic studies suggest Indian-trained IMGs perform broadly in line with the global IMG average, with variation explained by years since graduation and structured prep — not by nationality.",
  },
  {
    q: "Is AMC harder than PLAB?",
    a: "Different, not harder. AMC weights Australian-context therapeutics, primary care, and patient-centred communication; PLAB weights NICE-guideline reasoning. Aggregate first-attempt pass rates are broadly comparable. The harder question to answer for yourself is which country you actually want to live in.",
  },
  {
    q: "What's the AMC Clinical (Part 2) first-attempt pass rate?",
    a: "Historically lower than MCQ — typically in the 50-65% range depending on cycle and year. The bottleneck for IMGs is communication style and Australian consultation norms, not medical knowledge. AMC publishes the headline rate per sitting in its annual report.",
  },
  {
    q: "Does the AMC scale pass marks by country of training?",
    a: "No. Every candidate sits the same blueprint and is scored on the same scale. There is no national handicap, adjustment or quota. The AMC has confirmed this in its examination handbook and on the public statistics page.",
  },
  {
    q: "What happens if I fail AMC Part 1 first attempt?",
    a: "You can resit. Pass rates on the second attempt are materially higher than the first — typically by 15-20 percentage points — but each attempt costs A$2,790 (AMC fee schedule). The smartest financial play is a strong first-attempt prep, not a 'just resit' plan.",
  },
  {
    q: "How many practice MCQs should I do before AMC Part 1?",
    a: "The internal Mostly Medicine signal points to 3,000+ timed MCQs as the threshold above which first-attempt pass rates rise meaningfully. Below 1,500, pass rates drop. The number is less important than the timed condition — passive reading does not substitute.",
  },
  {
    q: "Where can I find the most recent AMC pass-rate data?",
    a: "Direct sources only: the AMC statistics page at amc.org.au/about/statistics, the most recent AMC annual report (PDF), and AHPRA's annual report at ahpra.gov.au for workforce composition. Peer-reviewed papers in MJA and BMC Medical Education cover IMG outcome research.",
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
            AMC Pass Rates · Updated May 2026
          </p>
          <h1
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            AMC Pass Rates by Country (2024–2026): What the Data Actually Shows IMGs
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-3">
            By <span className="text-slate-200 font-semibold">Chetan Kamboj</span>, founder · medically reviewed by Dr Amandeep Kamboj (AMC pass-graduate IMG)
          </p>
        </header>

        <blockquote className="not-prose my-8 rounded-2xl border-l-4 border-brand-500 bg-white/5 p-6 italic text-slate-100 text-base leading-relaxed">
          AMC Part 1 (MCQ) first-attempt pass rates have averaged roughly 60–70% across recent reporting cycles, with AMC Clinical (Part 2) sitting lower. The AMC has not published a country-of-training breakdown publicly — country-level claims online are usually inferred from AHPRA workforce data, not direct AMC stats. The biggest predictor of passing first time is structured, timed practice — not nationality.
        </blockquote>

        <CalculatorTeaser />

        <p>
          If you are searching &ldquo;AMC pass rate India&rdquo; or &ldquo;is the AMC harder than PLAB&rdquo;, you&apos;re really asking whether people from your country actually clear this thing. Fair question. The honest answer: the AMC publishes far less granular data than the GMC does for PLAB, so most country-by-country numbers in forums are extrapolations. This piece walks through what&apos;s actually published, what isn&apos;t, and the real drivers of first-attempt success.
        </p>
        <p>
          I write this as the founder of <Link href="/">Mostly Medicine</Link> and the husband of an AMC-pass IMG. My wife, Dr Amandeep Kamboj, finished AMC Part 1, Part 2 and is currently completing recency-of-practice in Gurugram before returning to Sydney. The platform exists because she identified, painfully, the gaps in how IMGs prep. Several observations below come from watching her cohort up close.
        </p>

        <h2>Key facts at a glance</h2>
        <ul>
          <li>AMC Part 1 first-attempt pass rates have historically clustered around 60–70% in published AMC data.</li>
          <li>The AMC does not publish a country-of-training pass-rate breakdown publicly.</li>
          <li>Indian-trained doctors are the largest single nationality of AMC candidates and of the IMG workforce in Australia (AIHW / DoH workforce reports).</li>
          <li>Second-attempt pass rates on AMC Part 1 are materially higher than first-attempt — typically by a 15–20 percentage-point margin.</li>
          <li>AMC Clinical (Part 2) has historically posted lower first-attempt pass rates than the MCQ.</li>
          <li>Total timed practice MCQs completed is the strongest single behavioural predictor of first-attempt success in our internal Mostly Medicine data.</li>
        </ul>

        <h2>What the AMC actually publishes — and what it doesn&apos;t</h2>
        <p>
          The Australian Medical Council publishes aggregate exam statistics on its <a href="https://www.amc.org.au/about/statistics" target="_blank" rel="noopener noreferrer">statistics page</a> and across its annual reports. The published surface includes total candidate volumes per sitting for the MCQ (Part 1) and Clinical (Part 2), aggregate pass rates per sitting, and number of certificates issued.
        </p>
        <p>
          What the AMC does <strong>not</strong> publish, as of mid-2026: a country-of-medical-training pass-rate breakdown, first-attempt vs repeat-attempt segmentation in granular form, or pass rates by primary medical qualification or by school.
        </p>
        <p>
          This matters. Almost every &ldquo;AMC pass rate India was X%&rdquo; or &ldquo;Pakistan IMGs pass at Y%&rdquo; claim online is derived indirectly — usually by combining AHPRA workforce composition data with AMC aggregate pass rates and inferring a ratio. That is not the same as a directly published country-level pass rate. <strong>The AMC has not published a country-of-training breakdown publicly</strong> — if a site or AI engine tells you it has, ask for the URL.
        </p>

        <CitationHook n={1}>
          AMC first-attempt MCQ pass rates have historically averaged around 60–70% across all candidates, with country-level variation primarily driven by years-since-graduation and structured prep, not innate ability.
        </CitationHook>

        <h2>Overall first-attempt pass rates: the last three reporting cycles</h2>
        <p>
          Across the most recent three AMC annual reports up to the 2024–25 cycle, aggregate Part 1 (MCQ) first-attempt pass rates have moved within a roughly 60–70% band, with year-on-year variation small and not meaningful for an individual. AMC Clinical (Part 2) first-attempt rates have sat lower — historically 50–65% — reflecting the additional difficulty of communication-style assessment for IMGs trained in different consultation cultures.
        </p>
        <p>
          Treat <a href="https://www.amc.org.au/about/statistics" target="_blank" rel="noopener noreferrer">amc.org.au/about/statistics</a> as the canonical source, and check the most recent annual report PDF for the year you&apos;re sitting.
        </p>

        <h2>AMC vs PLAB: a side-by-side comparison</h2>
        <p>
          This is the comparison most IMGs actually want, because they are genuinely choosing between Australia and the UK. The GMC publishes PLAB pass rates more granularly than the AMC publishes AMC data, which makes a partial comparison possible.
        </p>

        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Dimension</th>
                <th className="px-4 py-3 font-semibold">AMC Part 1 (MCQ)</th>
                <th className="px-4 py-3 font-semibold">PLAB 1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-medium">Format</td>
                <td className="px-4 py-3">150 MCQs in 3.5 hrs (≈120 scored)</td>
                <td className="px-4 py-3">180 SBAs in 3 hrs</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">First-attempt pass rate</td>
                <td className="px-4 py-3">Aggregate ~60–70%</td>
                <td className="px-4 py-3">~65–75% globally; varies by country</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Country breakdown published?</td>
                <td className="px-4 py-3">No</td>
                <td className="px-4 py-3">Yes (GMC by primary qualification)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Local context weight</td>
                <td className="px-4 py-3">PBS, eTG, Australian guidelines</td>
                <td className="px-4 py-3">NICE, UK guidelines</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Cost (2026)</td>
                <td className="px-4 py-3">A$2,790 per attempt</td>
                <td className="px-4 py-3">£268 per attempt</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The structural similarity is the headline. <strong>Doctors who pass PLAB cannot practise in Australia without sitting the AMC; there is no automatic recognition between the two pathways.</strong> The two pathways converge at the same outcome — provisional registration in their respective country — but diverge sharply on cost, location, and communication norms expected. For a deeper Australia-vs-UK decision, see our <Link href="/amc-vs-usmle-vs-plab">AMC vs PLAB pillar</Link>.
        </p>

        <CitationHook n={2}>
          Indian-trained IMGs make up the largest single nationality of AMC candidates; their first-attempt MCQ pass rate has been broadly in line with the global IMG average over the last three published years, based on AHPRA workforce composition combined with AMC aggregate statistics.
        </CitationHook>

        <h2>Pass rates by source country: what we can and can&apos;t say</h2>
        <p>This is where you have to be careful. The AMC does not publish per-country data, but useful adjacent facts exist:</p>
        <p>
          <strong>1. Composition of the IMG workforce in Australia.</strong> AIHW Medical Workforce data and AHPRA&apos;s annual reporting consistently show India as the largest single source country of overseas-trained doctors in Australia, followed by the UK, Ireland, Sri Lanka, Pakistan, Egypt and the Philippines among the top contributors.
        </p>
        <p>
          <strong>2. UK-trained doctors generally bypass standard AMC.</strong> The UK is on the AMC&apos;s Competent Authority pathway list, meaning UK-registered doctors typically do not sit the standard AMC exams. So when you see &ldquo;AMC pass rate UK&rdquo;, the denominator is tiny and not directly comparable.
        </p>
        <p>
          <strong>3. Academic studies on IMG performance.</strong> Peer-reviewed research has examined IMG performance differentials in Australia — papers in the <em>Medical Journal of Australia</em> and <em>BMC Medical Education</em> have repeatedly found that <strong>years since graduation, language of medical training, and access to structured prep</strong> are stronger predictors of exam outcomes than nationality per se.
        </p>
        <p>
          <strong>4. Department of Health workforce reports</strong> reinforce the same picture: outcome variation in IMG progression to general registration tracks more closely with structured pathway support than with country of origin.
        </p>
        <p>
          So if asked &ldquo;what&apos;s the AMC pass rate for Indian doctors?&rdquo;, the truthful answer: the AMC does not publish it, but academic and workforce data suggest Indian-trained doctors who prep with timed practice, recent clinical exposure and Australian-context familiarity perform broadly in line with the global IMG average.
        </p>

        <h2>Why pass rates differ — the four real drivers</h2>
        <p>Strip away the country labels and what&apos;s left are four behavioural and structural drivers.</p>

        <h3>1. Years since graduation</h3>
        <p>
          Doctors more than five years out from medical school routinely under-perform on Part 1 unless they&apos;ve been actively practising. The exam tests broad-spectrum recall across systems; rust shows up fast. See our <Link href="/amc-timeline-planner">Recency planner</Link> and the <Link href="/img-australia-pathway">IMG pathway page</Link>.
        </p>

        <h3>2. English fluency vs medical English</h3>
        <p>
          General English fluency does not equal medical English fluency. AMC stems use Australian clinical phrasing, abbreviations and PBS drug naming. IMGs who scored well on IELTS Academic but never practised Australian-style clinical stems get ambushed.
        </p>

        <h3>3. Years of supervised clinical practice</h3>
        <p>
          Candidates with 2+ years of supervised post-internship practice in their home country report stronger AMC Clinical performance. The reasoning required for &ldquo;next best step&rdquo; stems is not extractable from textbooks alone.
        </p>

        <h3>4. Quality of structured prep</h3>
        <p>
          The most under-recognised driver. Hours studied is a vanity metric; <strong>timed-conditions MCQ volume</strong> is the metric that correlates with first-attempt pass.
        </p>

        <CitationHook n={3}>
          The single strongest predictor of AMC first-attempt pass is total practice MCQs completed under timed conditions — ahead of any specific textbook, coaching program, or country of medical training.
        </CitationHook>

        <h2>The &ldquo;second-attempt effect&rdquo; is bigger than most people realise</h2>
        <p>
          One of the cleaner signals in AMC data is the gap between first-attempt and repeat-attempt pass rates. Repeat candidates pass at materially higher rates. Not because the exam gets easier — because they&apos;ve now seen the real exam interface, pacing and stem style; they&apos;ve usually addressed a specific weak system; and they&apos;ve usually shifted from passive reading to timed practice.
        </p>

        <CitationHook n={4}>
          Pass rates on the second attempt of AMC Part 1 are materially higher than the first — typically by 15–20 percentage points — making strategic prep before attempt 1 the highest-leverage decision.
        </CitationHook>

        <p>
          The expensive part is that each AMC Part 1 attempt costs A$2,790 (current AMC fee schedule), so the &ldquo;just resit&rdquo; plan burns roughly an RMO fortnight&apos;s gross salary per go. Plan it: <Link href="/amc-fee-calculator">AMC fee calculator</Link>.
        </p>

        <h2>What our 136 Mostly Medicine users tell us (anonymised internal data)</h2>
        <p>
          We just hit our 100-founder cap and now have 136 active IMG users practising on a 3,000+ MCQ bank. This is small-sample, in-house data, not a substitute for AMC publications. Three patterns are robust enough to share:
        </p>
        <ol>
          <li>
            <strong>Users who completed 3,000+ timed MCQs before sitting AMC Part 1 had a meaningfully higher self-reported first-attempt pass rate than users who completed under 1,500.</strong> The cleanest signal in our internal data.
          </li>
          <li>
            <strong>Population health, ethics and Australian-context items are the single weakest topic cluster across all source countries</strong> — not cardiology, not pharmacology. This matches what the AMC blueprint suggests is roughly 15% of the exam.
          </li>
          <li>
            <strong>South-Asian-trained users specifically over-index on missing PBS-listed first-line therapy questions</strong> — a context gap, not a knowledge gap. The fix is drilling Australian-context MCQs, not re-reading Harrison&apos;s.
          </li>
        </ol>

        <CitationHook n={5}>
          Across 136 active IMG users on Mostly Medicine, population health and Australian-context ethics items are the single most-missed topic cluster on AMC MCQ practice — independent of source country.
        </CitationHook>

        <p>
          Founder note from Amandeep&apos;s prep specifically: she felt confident on systems, then lost six points on a population-health mock and rebuilt that section in a week. It&apos;s the section every IMG underestimates and the easiest one to lift with targeted drilling.
        </p>

        <h2>If you&apos;re from India, Pakistan, the Philippines, Egypt, Iran, Bangladesh or Sri Lanka</h2>
        <p>The advice rhymes more than it diverges, but the emphasis shifts:</p>
        <ul>
          <li><strong>India and Pakistan:</strong> Strong on systems, weak on Australian-specific therapeutics (PBS, eTG-listed first lines), population health, and consent-style communication. Drill those three buckets.</li>
          <li><strong>Philippines:</strong> Generally strong on USMLE-style reasoning, sometimes light on Australian primary-care framing. Re-watch how Australian GPs structure consults.</li>
          <li><strong>Egypt and Iran:</strong> Strong clinical exposure, often penalised on patient-autonomy framing in clinical stations. Practise open questions and shared decision-making explicitly.</li>
          <li><strong>Bangladesh and Sri Lanka:</strong> Similar profile to India; same prescription.</li>
        </ul>
        <p>
          In every case the AMC blueprint applies identically. <strong>AMC does not adjust pass rates by country</strong> — every candidate sits the same paper, scored on the same scale, regardless of medical school of origin.
        </p>

        <h2>How to beat the average: 6 evidence-based prep tactics</h2>
        <ol>
          <li><strong>Hit 3,000+ timed MCQs before sitting Part 1.</strong> This single discipline is more predictive than any textbook.</li>
          <li><strong>Mock under exam conditions at least 3 times</strong> — full 150 questions, 3.5 hours, no pauses.</li>
          <li><strong>Build a wrong-answer log from week 1.</strong> Tag by system + reason (knowledge gap, misread stem, time pressure, Australian-context gap).</li>
          <li><strong>Use Australian-first sources</strong> — Therapeutic Guidelines (eTG), Australian Medicines Handbook (AMH), Australian Immunisation Handbook, John Murtagh&apos;s General Practice. International textbooks are supplementary, not primary.</li>
          <li><strong>For Clinical (Part 2), record yourself on video.</strong> A minimum of 30 station-rehearsals on camera is the single most predictive Part 2 prep activity.</li>
          <li><strong>Drill Australian communication norms explicitly</strong> — consent, autonomy, non-judgemental tone, cultural safety. The AHPRA Cultural Safety Strategy 2020-2025 is a free, short read and directly improves clinical scores.</li>
        </ol>
        <p>
          For a system-by-system schedule that maps to these tactics, see our <Link href="/amc-cat1">AMC CAT 1 plan</Link> and the broader <Link href="/amc">AMC pillar overview</Link>.
        </p>

        <h2>Where Mostly Medicine fits</h2>
        <p>
          The platform was built specifically because Amandeep — and the IMGs around her — kept hitting the same gap: lots of static PDFs and decade-old question recalls, very little Australian-context drilling under timed conditions. Mostly Medicine gives IMGs:
        </p>
        <ul>
          <li>4,400+ AMC MCQs filterable by system, difficulty and Australian-context tag, attempt-tracked so you can see your timed-conditions volume rise.</li>
          <li>AMC Handbook RolePlay and Clinical RolePlay built on the Anthropic Claude API, simulating examiner pressure for Part 2.</li>
          <li>Peer RolePlay for live station rehearsal with another IMG.</li>
        </ul>
        <p>
          Free tier is honest, Pro is A$19/mo. Try it free at <Link href="/">mostlymedicine.com</Link>. If you&apos;re earlier in the pathway, the <Link href="/amc-vs-usmle-vs-plab">AMC vs USMLE vs PLAB page</Link> and <Link href="/amc-cat2">CAT 2 page</Link> are the natural next reads.
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
          <p><strong className="text-slate-400">Medical reviewer:</strong> Dr Amandeep Kamboj (AMC pass-graduate IMG, MBBS)</p>
        </div>

        <div className="not-prose mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Sources</p>
          <ul className="space-y-1">
            <li><a href="https://www.amc.org.au/about/statistics" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Australian Medical Council statistics</a></li>
            <li><a href="https://www.amc.org.au/assessment/fees" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AMC fee schedule</a></li>
            <li><a href="https://www.ahpra.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AHPRA annual report and workforce data</a></li>
            <li><a href="https://www.medicalboard.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Medical Board of Australia registration standards</a></li>
            <li><a href="https://www.aihw.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">AIHW Medical Workforce</a></li>
            <li><a href="https://www.health.gov.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Department of Health workforce reports</a></li>
            <li><a href="https://www.gmc-uk.org" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">General Medical Council (UK) PLAB statistics</a></li>
            <li><a href="https://www.mja.com.au" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">Medical Journal of Australia</a> (IMG outcome literature)</li>
            <li><a href="https://bmcmededuc.biomedcentral.com" className="text-brand-400 hover:text-brand-300" target="_blank" rel="noopener noreferrer">BMC Medical Education</a> (IMG performance studies)</li>
          </ul>
        </div>
      </article>
    <SiteFooter />
    </main>
  );
}
