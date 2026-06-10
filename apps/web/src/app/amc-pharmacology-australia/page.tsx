import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-pharmacology-australia`;
const TITLE = "AMC Pharmacology — Australian PBS, S8, RTPM & TGA: IMG Guide 2026";
const DESCRIPTION =
  "PBS Authority, S8 controlled drugs, SafeScript / QScript real-time prescription monitoring, TGA scheduling, Closing the Gap copayments and AU drug-name traps — the AMC pharmacology layer no global product covers.";
const PUBLISHED = "2026-06-08";
const UPDATED = "2026-06-08";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "Mostly Medicine Editorial" }],
  keywords: [
    "AMC pharmacology",
    "PBS Authority IMG",
    "S8 controlled drugs",
    "RTPM SafeScript QScript",
    "TGA scheduling",
    "Closing the Gap PBS",
    "Section 100 HSD",
    "SADMANS sick day",
    "look-alike sound-alike",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "article",
    publishedTime: PUBLISHED,
    modifiedTime: UPDATED,
    authors: ["Mostly Medicine Editorial"],
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
  author: { "@type": "Organization", name: "Mostly Medicine Editorial" },
  publisher: {
    "@type": "Organization",
    name: "Mostly Medicine",
    url: SITE_URL,
  },
  datePublished: PUBLISHED,
  dateModified: UPDATED,
  inLanguage: "en-AU",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AMC", item: `${SITE_URL}/amc` },
    { "@type": "ListItem", position: 3, name: "AMC Pharmacology Australia", item: PAGE_URL },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-saffron-50 via-white to-saffron-50 border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 pt-12 pb-14">
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 hover:text-saffron-800">
            Mostly Medicine
          </Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-saffron-700">
            AMC pharmacology · Updated 8 June 2026
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-[1.08]">
            AMC Pharmacology — Australian PBS, S8, RTPM &amp; TGA: IMG Guide 2026
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-700">
            AMC pharmacology is not a re-test of your home country&apos;s drug knowledge. It tests
            whether you can prescribe legally and affordably under the Australian system — PBS
            Authority, TGA scheduling, S8 controlled drugs, SafeScript and QScript real-time
            monitoring, eTG-aligned antibiotic stewardship, and the AU-specific drug names that
            trip every IMG up. This is the layer no global product covers.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 px-6 py-3 text-sm font-bold text-ink-950 shadow-sm transition-colors"
            >
              Start studying free →
            </Link>
            <Link
              href="/dashboard/flashcards/pharmacology"
              className="inline-flex items-center gap-2 rounded-xl border border-saffron-300 bg-white hover:bg-saffron-50 px-6 py-3 text-sm font-bold text-saffron-800 transition-colors"
            >
              Open Pharmacology flashcards
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            By <span className="font-semibold text-gray-800">Mostly Medicine Editorial</span> · Reviewed by clinical-educator IMG team · Updated 8 June 2026
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 sm:px-10 pt-12 pb-16 prose prose-slate prose-headings:font-display prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:tracking-tight prose-a:text-saffron-700 hover:prose-a:text-saffron-800 prose-strong:text-gray-900">

        <p>
          The single most common comment on IMG AMC debriefs is some version of &ldquo;I knew the
          drug, I missed the system.&rdquo; AMC pharmacology stations and MCQs are framed inside the
          Australian regulatory stack — Therapeutic Goods Administration scheduling, the
          Pharmaceutical Benefits Scheme, state-based real-time prescription monitoring, the
          Closing the Gap copayment programme, and eTG-aligned first-line therapy. Knowing
          amoxicillin&apos;s mechanism is not enough; AMC wants the eTG dose, the PBS-listed
          quantity, and the script annotation.
        </p>
        <p>
          This guide consolidates publicly available material from the TGA, Services Australia
          (PBS), the eTG complete (Therapeutic Guidelines), RACGP, the Australian Commission on
          Safety and Quality in Health Care and state RTPM portals.
        </p>

        <h2 id="pbs-structure">PBS structure: General, Concessional, Safety Net, Authority</h2>
        <p>
          The <strong>Pharmaceutical Benefits Scheme (PBS)</strong> is the Commonwealth-funded
          subsidy that makes most medicines affordable in Australia. For AMC purposes you must know
          the four moving parts. <strong>General patient copayment</strong> is the maximum the
          patient pays per PBS-listed item (the rest is paid by the Commonwealth to the pharmacy).
          <strong>Concessional patient copayment</strong> is reduced for holders of a
          Pensioner Concession Card, Health Care Card, Commonwealth Seniors Health Card or DVA
          card. The <strong>PBS Safety Net</strong> further reduces copayments once a household
          reaches the annual safety-net threshold — at which point general patients pay the
          concessional rate and concessional patients pay nothing.
        </p>
        <p>
          <strong>Authority required</strong> medicines need prescriber approval before
          subsidisation. Two flavours: <strong>Authority Required (Streamlined)</strong> — the
          prescriber writes a four-digit streamlined code on the script and no phone call is
          required, and <strong>Authority Required</strong> — the prescriber must phone Services
          Australia or apply via HPOS/PRODA online for individual approval before writing the
          script. AMC examiners love this distinction. Common Authority items include certain
          biologics, high-cost cardiovascular medications above first-line, and specialist
          mental-health prescriptions.
        </p>

        <h2 id="tga-scheduling">TGA scheduling: S2, S3, S4, S8, S9</h2>
        <p>
          The TGA classifies medicines by Schedule under the <em>Standard for the Uniform
          Scheduling of Medicines and Poisons (SUSMP / Poisons Standard)</em>. <strong>Schedule 2
          (Pharmacy Medicine)</strong> is available over the counter from a pharmacy. <strong>Schedule 3
          (Pharmacist Only)</strong> requires a pharmacist consultation before sale (e.g. salbutamol,
          some triptans). <strong>Schedule 4 (Prescription Only)</strong> is the standard prescription
          medicine. <strong>Schedule 8 (Controlled Drug)</strong> is a controlled-drug script —
          opioids, methylphenidate, dexamfetamine, lisdexamfetamine, ketamine, and most
          benzodiazepines (alprazolam was up-scheduled to S8 in 2014). <strong>Schedule 9 (Prohibited
          Substance)</strong> is prohibited except for research.
        </p>
        <p>
          AMC trap: many drugs are S8 in Australia that are not controlled in your country of
          training. Alprazolam, flunitrazepam, hydromorphone, methylphenidate and lisdexamfetamine
          all require an S8 prescription, a paper duplicate or state-specific electronic equivalent,
          and notification under state Drug and Poisons regulations for certain durations of
          therapy. Treat every S8 script as a regulated act, not a clinical decision alone.
        </p>

        <h2 id="rtpm">Real-time prescription monitoring — SafeScript, QScript and equivalents</h2>
        <p>
          <strong>Real-time prescription monitoring (RTPM)</strong> is a clinical decision-support
          system that allows prescribers and dispensers to view a patient&apos;s recent S8 (and
          some S4D) prescriptions instantly. The state implementations:
        </p>
        <ul>
          <li><strong>Victoria — SafeScript</strong> (mandatory check before prescribing monitored medicines)</li>
          <li><strong>Queensland — QScript</strong> (mandatory)</li>
          <li><strong>South Australia — ScriptCheckSA</strong></li>
          <li><strong>Western Australia — ScriptCheckWA</strong></li>
          <li><strong>New South Wales — SafeScript NSW</strong> (rolling out)</li>
          <li><strong>Tasmania — DAPIS / TasScript</strong></li>
          <li><strong>ACT — Canberra Script</strong></li>
          <li><strong>Northern Territory — NTScript</strong></li>
        </ul>
        <p>
          Monitored medicines typically include all S8s plus benzodiazepines (including the S4
          ones), z-drugs (zolpidem, zopiclone), codeine combinations, quetiapine, gabapentin and
          pregabalin. AMC expects you to <strong>check RTPM before any new opioid or benzodiazepine
          script</strong>, document the check, and apply the result to your prescribing decision
          (e.g. multiple recent scripts → de-prescribing conversation, naloxone supply, addiction
          medicine referral).
        </p>

        <h2 id="ctg-pbs">Closing the Gap PBS copayment scheme</h2>
        <p>
          The <strong>PBS Closing the Gap (CTG) Co-payment Programme</strong> reduces or eliminates
          PBS copayments for Aboriginal and Torres Strait Islander patients living with, or at
          risk of, chronic disease. Concessional patients pay nothing; general patients pay the
          concessional rate. The patient must be registered for CTG by the practice via PRODA /
          HPOS, and the prescriber <strong>must annotate &ldquo;CTG&rdquo; on every script</strong>
          — the pharmacy will not apply the reduction without it. See our companion guide on
          <Link href="/aboriginal-health-amc">Aboriginal and Torres Strait Islander Health for
          AMC</Link> for the full clinical context.
        </p>

        <h2 id="antibiotic-stewardship">Antibiotic stewardship per eTG</h2>
        <p>
          The <strong>Therapeutic Guidelines (eTG complete) — Antibiotic</strong> is the canonical
          AU reference. AMC examines from this directly. Key first-line answers IMGs are expected
          to know cold: <strong>cellulitis</strong> — flucloxacillin 500 mg PO QID (or IV if
          severe), not co-amoxiclav. <strong>Acute otitis media</strong> in well children — most
          do not need antibiotics (watchful waiting); when indicated, amoxicillin 15 mg/kg PO TDS
          for 5 days. <strong>Uncomplicated UTI in non-pregnant women</strong> — trimethoprim 300
          mg PO daily for 3 days (nitrofurantoin where trimethoprim resistance is high).
          <strong>Community-acquired pneumonia, mild</strong> — amoxicillin 1 g PO TDS for 5 days.
          <strong>Severe sepsis empirical cover</strong> — piperacillin-tazobactam plus
          gentamicin (single dose, then per renal function).
        </p>

        <h2 id="au-drug-names">AU drug names that trip IMGs up</h2>
        <ul>
          <li><strong>Carbimazole</strong>, not methimazole — Australia uses carbimazole as the standard antithyroid; methimazole is the active metabolite but is not the listed PBS form.</li>
          <li><strong>Flucloxacillin</strong>, not dicloxacillin — both work, but the AU eTG and PBS listing is flucloxacillin. Don&apos;t answer dicloxacillin on AMC; it is the US/Asia choice.</li>
          <li><strong>Paracetamol</strong> maximum: 4 g/24 h adults; reduced to 3 g/24 h for adults &lt;50 kg, the elderly with risk factors, hepatic impairment, malnutrition or chronic alcohol. AMC frames this in vignettes — watch for the trap.</li>
          <li><strong>Propranolol</strong>: not part of the RACGP hypertension first-line ladder. AU first-line for uncomplicated hypertension is an ACE inhibitor or ARB; a thiazide or calcium channel blocker is added second. Propranolol is for migraine prophylaxis, performance anxiety and rate control — not BP.</li>
          <li><strong>Salbutamol</strong>, not albuterol — same drug, AU name only.</li>
          <li><strong>Adrenaline</strong>, not epinephrine — AU pharmacopoeia preference; both are accepted but adrenaline is the AMC-default term.</li>
          <li><strong>Frusemide</strong>, not furosemide — AU spelling.</li>
          <li><strong>Hydrochlorothiazide</strong> was largely de-prescribed in AU after the 2018 PBS rationalisation; chlortalidone and indapamide dominate thiazide use.</li>
          <li><strong>Tramadol</strong> is S4 in AU but high-risk (serotonergic interactions) — eTG advises caution and counsel for serotonin syndrome; some hospitals have removed it from formularies.</li>
        </ul>

        <h2 id="section-100">Section 100 — Highly Specialised Drugs</h2>
        <p>
          <strong>Section 100 (s100)</strong> of the <em>National Health Act 1953</em> covers the
          Highly Specialised Drugs Program — medicines that are only PBS-subsidised when prescribed
          by a specialist (or under specialist supervision) and dispensed through hospital
          pharmacies or designated community pharmacies. Examples: most biologics, HIV
          antiretrovirals, growth hormone, certain MS therapies. For AMC, the takeaways are
          structural: you cannot start an s100 medicine in general practice without specialist
          initiation, and the script type and dispensing channel differ from standard PBS.
        </p>

        <h2 id="sadmans">SADMANS sick-day rules</h2>
        <p>
          The <strong>SADMANS</strong> mnemonic (used by RACGP, NPS MedicineWise and Diabetes
          Australia) identifies medicines that should be temporarily held during acute illness
          with dehydration risk — gastroenteritis, fever with poor oral intake, vomiting. The
          eight classes: <strong>S</strong>ulfonylureas, <strong>A</strong>CE inhibitors,
          <strong>D</strong>iuretics, <strong>M</strong>etformin,
          <strong>A</strong>ngiotensin receptor blockers, <strong>N</strong>SAIDs,
          <strong>S</strong>GLT2 inhibitors (added because of euglycaemic DKA risk),
          plus <strong>direct renin inhibitors</strong>. AMC stations often involve an elderly
          patient with gastroenteritis on multiple sick-day-sensitive medicines — the correct
          answer is to pause these, advise fluids, review in 24–48 h, and not to discontinue them
          permanently without indication.
        </p>

        <h2 id="lasa">Common look-alike sound-alike (LASA) pairs in AU practice</h2>
        <ul>
          <li><strong>Hydralazine</strong> vs <strong>hydroxyzine</strong></li>
          <li><strong>Carbamazepine</strong> vs <strong>oxcarbazepine</strong></li>
          <li><strong>Clonidine</strong> vs <strong>clozapine</strong></li>
          <li><strong>Methotrexate</strong> (weekly only) vs <strong>methylprednisolone</strong> (daily/short course)</li>
          <li><strong>Vincristine</strong> (IV only — fatal if intrathecal) vs <strong>methotrexate intrathecal</strong></li>
          <li><strong>Heparin</strong> 5,000 U/mL vs <strong>10,000 U/mL</strong> ampoules — a classic AU sentinel-event source</li>
          <li><strong>Tramadol</strong> vs <strong>trazodone</strong></li>
          <li><strong>Quetiapine</strong> immediate-release vs XR</li>
        </ul>
        <p>
          The Australian Commission on Safety and Quality in Health Care publishes the National
          Medication Safety standards — read these before sitting AMC if you have not seen them.
        </p>

        <h2 id="recommended-sources">Recommended AU study sources</h2>
        <ul>
          <li><a href="https://www.tg.org.au" target="_blank" rel="noopener noreferrer">Therapeutic Guidelines (eTG complete) — Antibiotic, Cardiovascular, Endocrinology, Psychotropic, Toxicology volumes</a></li>
          <li><a href="https://www.pbs.gov.au" target="_blank" rel="noopener noreferrer">PBS Schedule — Services Australia / Department of Health</a></li>
          <li><a href="https://www.tga.gov.au/products/medicines/poisons-standard-susmp" target="_blank" rel="noopener noreferrer">TGA — Poisons Standard / SUSMP (S2/S3/S4/S8/S9)</a></li>
          <li><a href="https://www.safescript.vic.gov.au" target="_blank" rel="noopener noreferrer">SafeScript Victoria</a> · <a href="https://www.health.qld.gov.au/qscript" target="_blank" rel="noopener noreferrer">QScript Queensland</a></li>
          <li><a href="https://www.safetyandquality.gov.au" target="_blank" rel="noopener noreferrer">Australian Commission on Safety and Quality in Health Care — Medication Safety standards</a></li>
          <li><a href="https://www.nps.org.au" target="_blank" rel="noopener noreferrer">NPS MedicineWise — Australian prescribing resources</a></li>
          <li><a href="https://www.racgp.org.au" target="_blank" rel="noopener noreferrer">RACGP — Red Book, Standards, prescribing guides</a></li>
          <li>Australian Medicines Handbook (AMH) — primary AU prescribing reference</li>
          <li>Murtagh&apos;s General Practice (8th ed.) — therapeutics chapters</li>
        </ul>

        <h2 id="study-with-mostly-medicine">Study with Mostly Medicine</h2>
        <p>
          The Mostly Medicine <Link href="/dashboard/flashcards/pharmacology">Pharmacology
          flashcard deck</Link> drills every PBS rule, S8 protocol, RTPM check, eTG first-line and
          AU drug-name trap above — spaced-repetition cards aligned to the AMC blueprint and to the
          eTG, AMH and PBS. Pair it with <Link href="/dashboard/flashcards/ethics">Ethics &amp;
          Medico-Legal</Link> (consent, capacity, prescribing within scope) and the
          <Link href="/amc-mcq/pharmacology">AMC pharmacology MCQ set</Link>. If you are still
          choosing pathways, start with <Link href="/amc-from-india">AMC from India</Link> or the
          <Link href="/amc-vs-plab">AMC vs PLAB</Link> comparison.
        </p>

        <h2 id="related-reading">Related reading</h2>
        <ul>
          <li><Link href="/amc-ethics-medico-legal-au">AMC Ethics &amp; Medico-Legal — AHPRA, VAD, Austroads</Link></li>
          <li><Link href="/aboriginal-health-amc">Aboriginal &amp; Torres Strait Islander Health for AMC</Link></li>
          <li><Link href="/rural-gp-amc-pathway">Rural GP Pathway in Australia for IMGs</Link></li>
          <li><Link href="/img-cultural-safety-australia">Cultural Safety for IMGs in Australia</Link></li>
          <li><Link href="/amc-cat1">AMC CAT 1 MCQ plan</Link></li>
          <li><Link href="/osce-guide">OSCE preparation guide</Link></li>
        </ul>

        <hr className="border-slate-200 my-10" />

        <div className="not-prose rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-gray-700">
          <p className="font-semibold text-gray-900 mb-2">Built by IMGs and IT professionals who walked the AMC pathway.</p>
          <p>
            Mostly Medicine is an AMC exam-prep platform — not affiliated with the AMC, AHPRA, TGA,
            Services Australia, the eTG / Therapeutic Guidelines publishers, or any official body.
            All prescribing information on this page is summarised from publicly available
            Australian guidelines for educational purposes only — always cross-check the current
            eTG, AMH and PBS entries before clinical prescribing.
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
