import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/aboriginal-health-amc`;
const TITLE = "Aboriginal & Torres Strait Islander Health for AMC: IMG Study Guide 2026";
const DESCRIPTION =
  "Closing the Gap, MBS 715 ATSI health checks, RHD secondary prophylaxis, trachoma SAFE, SEWB and cultural safety — the AMC's most under-prepared topic, mapped for IMGs in one place.";
const PUBLISHED = "2026-06-08";
const UPDATED = "2026-06-08";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "Mostly Medicine Editorial" }],
  keywords: [
    "Aboriginal health AMC",
    "ATSI MBS 715",
    "Closing the Gap exam",
    "RHD AMC",
    "trachoma AMC",
    "SEWB AMC",
    "cultural safety AMC",
    "13YARN",
    "Sorry Business AMC",
    "Closing the Gap PBS copayment",
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
    { "@type": "ListItem", position: 3, name: "Aboriginal & Torres Strait Islander Health for AMC", item: PAGE_URL },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-saffron-50 via-white to-amber-50 border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 pt-12 pb-14">
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 hover:text-saffron-800">
            Mostly Medicine
          </Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-saffron-700">
            AMC Australian-context moat · Updated 8 June 2026
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-[1.08]">
            Aboriginal &amp; Torres Strait Islander Health for AMC: IMG Study Guide 2026
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-700">
            AMC examines Aboriginal and Torres Strait Islander (ATSI) health heavily — and it is the
            single highest-yield topic where overseas-trained doctors lose marks because their home
            curriculum never touched it. This guide maps Closing the Gap, the MBS 715 health check,
            RHD prophylaxis, trachoma SAFE, the SEWB framework, Sorry Business protocols and the
            cultural-safety standards an AMC examiner expects you to know cold.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 px-6 py-3 text-sm font-bold text-ink-950 shadow-sm transition-colors"
            >
              Start studying free →
            </Link>
            <Link
              href="/dashboard/flashcards/aboriginal-health"
              className="inline-flex items-center gap-2 rounded-xl border border-saffron-300 bg-white hover:bg-saffron-50 px-6 py-3 text-sm font-bold text-saffron-800 transition-colors"
            >
              Open Aboriginal Health flashcards
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            By <span className="font-semibold text-gray-800">Mostly Medicine Editorial</span> · Reviewed by clinical-educator IMG team · Updated 8 June 2026
          </p>
        </div>
      </section>

      {/* Acknowledgement */}
      <section className="mx-auto max-w-3xl px-6 sm:px-10 pt-10">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900">
          We acknowledge the Traditional Custodians of the lands on which this guide is written and read,
          and pay our respects to Elders past and present. Aboriginal and Torres Strait Islander health
          knowledge belongs to those communities; this page summarises publicly available NACCHO, RACGP,
          AIDA and NHMRC guidance for AMC exam preparation only.
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 sm:px-10 pt-10 pb-16 prose prose-slate prose-headings:font-display prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:tracking-tight prose-a:text-saffron-700 hover:prose-a:text-saffron-800 prose-strong:text-gray-900">

        <p>
          If you trained outside Australia and are sitting AMC CAT 1 or CAT 2 — and your home medical
          school did not teach the social, historical and legal context of Aboriginal and Torres
          Strait Islander health — the gap between &ldquo;I know cardiology&rdquo; and &ldquo;I will
          pass AMC&rdquo; is exactly this topic. Closing the Gap, MBS 715, RHD secondary prophylaxis,
          the SEWB framework, Sorry Business and cultural safety are not soft electives. They are
          repeatedly examined, they have specific answers, and IMGs who skip them lose marks they
          would otherwise pass on knowledge alone.
        </p>
        <p>
          This page exists because no global IMG-prep product (Neural Consult, AMBOSS, Sketchy,
          Anki decks) covers any of it. The content below is curated from the National Agreement on
          Closing the Gap, the NACCHO–RACGP National Guide (3rd edition), the Australian Government
          MBS Online schedule, the RHDAustralia 2020 Guideline, the WHO/NHMRC SAFE strategy for
          trachoma, and the AHPRA Code of Conduct 2020.
        </p>

        <h2 id="why-amc-examines-this">Why AMC examines this so heavily</h2>
        <p>
          The Medical Board of Australia&apos;s registration standards require culturally safe and
          respectful practice as a baseline competency for general registration. The AMC blueprint
          explicitly examines population health, Indigenous health and cultural safety because
          Australia&apos;s registered medical workforce serves a population in which Aboriginal and
          Torres Strait Islander people experience the largest health-outcome gap in any OECD country
          — life-expectancy difference of roughly 8–10 years, double the rate of cardiovascular and
          chronic kidney disease, and a rheumatic heart disease prevalence that is among the highest
          in the world.
        </p>
        <p>
          AMC examiners are not asking you to memorise statistics. They are testing whether you can
          run a culturally safe consultation, apply MBS 715, recognise when secondary RHD prophylaxis
          is overdue, refer appropriately to Aboriginal Community Controlled Health Organisations
          (ACCHOs), use the SEWB framework when assessing mental health, and price-protect a script
          using the Closing the Gap PBS copayment scheme. These are concrete clinical skills with
          right-and-wrong answers — which is exactly why IMGs lose marks: they get the medicine
          right and the framework wrong.
        </p>

        <h2 id="closing-the-gap">Closing the Gap — what an AMC candidate must know</h2>
        <p>
          The <strong>National Agreement on Closing the Gap</strong> (refreshed 2020 between the
          Coalition of Aboriginal and Torres Strait Islander Peak Organisations and all Australian
          governments) sets 19 socioeconomic targets across health, education, justice, housing and
          land. For AMC purposes you must know the four <strong>Priority Reforms</strong>: formal
          partnerships and shared decision-making, building the community-controlled sector,
          transforming government organisations, and shared access to data. Examiners frame
          scenarios around &ldquo;how would you refer this patient&rdquo; — the right answer is
          almost always &ldquo;to the local ACCHO if one exists, in partnership with the patient,
          using an Aboriginal Health Worker / Practitioner.&rdquo;
        </p>
        <p>
          The relevant health targets you should be able to name: Target 1 (close the life-expectancy
          gap by 2031), Target 2 (healthy birthweight babies to 91%), Target 14 (significant
          reduction in suicide rates), and Target 4 (children developmentally on track at school
          entry). You will not be asked the exact number. You will be asked to choose the
          intervention that aligns with Closing the Gap — which is community-controlled, family-led
          and culturally safe rather than top-down clinical.
        </p>

        <h2 id="mbs-715">MBS 715 — the ATSI Adult/Child Health Check</h2>
        <p>
          <strong>MBS item 715</strong> is the Medicare-funded annual health assessment for
          Aboriginal and Torres Strait Islander people of any age. It is one of the highest-value
          single items to know for AMC because it appears in CAT 1 MCQs, CAT 2 OSCE stations, and
          everyday RACGP clinical scenarios. The check has three components: a complete history, an
          appropriate physical examination, and an assessment leading to a written health
          management plan. It must be tailored by age group (0–4 years, 5–14, 15–24, 25–49, 50+),
          each with a different recommended scope.
        </p>
        <p>
          Critical follow-on items examiners expect you to chain on: <strong>MBS 10987</strong>
          (follow-up service by a practice nurse or Aboriginal Health Practitioner, up to 10 per
          year), <strong>MBS 81300–81360</strong> (allied health follow-up, up to 5 per year),
          referral pathways via the National Disability Insurance Scheme where relevant, and PBS
          Closing the Gap registration to drop copayments to nil or concessional. Smoking,
          immunisations (per the Australian Immunisation Handbook ATSI schedule — including
          additional pneumococcal and influenza), alcohol, diet, physical activity, sexual health,
          oral health, social and emotional wellbeing, eye and ear health (especially trachoma in
          remote communities), and chronic disease screening must all be addressed.
        </p>

        <h2 id="rhd">Rheumatic heart disease — secondary prophylaxis you cannot miss</h2>
        <p>
          Acute rheumatic fever (ARF) and rheumatic heart disease (RHD) remain endemic in Aboriginal
          and Torres Strait Islander populations, particularly in northern and central Australia.
          The <strong>RHDAustralia Australian Guideline (2020)</strong> is the canonical reference.
          You must know that <strong>secondary prophylaxis</strong> after a first episode of ARF is
          intramuscular <strong>benzathine benzylpenicillin G (BPG) 1.2 million units (or 600,000
          units if &lt;20 kg) every 21–28 days</strong> — not 4-weekly — for a minimum of 10 years
          after the last ARF episode or until age 21 (whichever is longer), and longer in severe RHD.
        </p>
        <p>
          OSCE-style traps: prescribing oral penicillin (wrong — adherence too poor), using a
          4-weekly interval (wrong — 21–28 days is the recommended window for therapeutic
          trough), or stopping at 5 years (wrong — minimum 10). Also know to register every patient
          with the relevant state/territory RHD Control Program, screen siblings, and never
          discontinue prophylaxis without echocardiographic re-assessment in consultation with a
          specialist.
        </p>

        <h2 id="trachoma-safe">Trachoma — Australia&apos;s SAFE strategy</h2>
        <p>
          Australia is the only high-income country in which trachoma is still endemic, and it
          persists exclusively in remote Aboriginal communities. The WHO <strong>SAFE strategy</strong>
          (Surgery for trichiasis, Antibiotics, Facial cleanliness, Environmental improvement) is
          implemented nationally through the Indigenous Eye Health program at the University of
          Melbourne and state trachoma elimination plans. For AMC, the key clinical pearls:
          single-dose <strong>azithromycin 20 mg/kg (max 1 g) orally</strong> for any child with
          active trachoma (TF/TI) in an endemic community, plus community-wide mass drug
          administration when prevalence is &gt;5% in 5–9-year-olds. Education on face-washing and
          improved sanitation is not optional adjunct — it is half the strategy.
        </p>

        <h2 id="sewb">Social and Emotional Wellbeing (SEWB) framework</h2>
        <p>
          The SEWB framework — developed within Aboriginal and Torres Strait Islander communities
          and codified in the National Strategic Framework for Aboriginal and Torres Strait
          Islander Peoples&apos; Mental Health and Social and Emotional Wellbeing — recognises
          seven interconnected domains of wellbeing: connection to body, mind &amp; emotions,
          family &amp; kinship, community, culture, country, and spirituality &amp; ancestors.
          Two over-arching influences shape every domain: social, political, historical and
          economic determinants on one side, and expressions of self &amp; identity on the other.
        </p>
        <p>
          Practically: a Western depression screen (PHQ-9) used alone is culturally inadequate. The
          <strong>aPHQ-9</strong> (adapted PHQ-9 validated in remote ATSI communities) or the
          Kimberley Indigenous Cognitive Assessment (KICA) for cognitive screening are better
          choices. Always offer referral to an Aboriginal mental health worker, social and
          emotional wellbeing service, or ACCHO. For acute risk, <strong>13YARN (13 92 76)</strong>
          is the 24/7 Aboriginal- and Torres-Strait-Islander-led crisis support line — the
          culturally safe analogue of Lifeline that AMC examiners expect you to name.
        </p>

        <h2 id="sorry-business">Sorry Business and bereavement protocols</h2>
        <p>
          &ldquo;Sorry Business&rdquo; describes the period of mourning, ceremony and cultural
          obligation that follows a death in many Aboriginal and Torres Strait Islander
          communities. It can extend for weeks to months and involves extended family travel and
          gatherings. For AMC, key competencies: do not pressure a patient to attend a routine
          appointment during Sorry Business; reschedule with cultural humility; in inpatient
          settings, accommodate large family groups and ceremony where safe; and avoid using the
          name or showing images of a deceased person without checking community protocols (in
          some communities, the name is not spoken for a defined mourning period). The right OSCE
          move is to ask the patient or family how they would like the deceased referred to, and
          to offer involvement of an Aboriginal Liaison Officer.
        </p>

        <h2 id="cultural-safety-mental-health">Cultural safety in mental health practice</h2>
        <p>
          Cultural safety is determined by the recipient of care, not the clinician — this is the
          definition embedded in the <Link href="/img-cultural-safety-australia">AHPRA Code of
          Conduct 2020</Link> and tested in AMC. In mental health specifically: never assume a
          presenting symptom (e.g. hearing the voice of a deceased relative) is psychotic — in
          many communities this is a normative cultural and spiritual experience. Use the
          <em>Working Together</em> framework or the <em>Dadirri</em> approach (deep, respectful
          listening) and routinely offer an Aboriginal mental health worker as a co-practitioner.
          Mandatory reporting obligations still apply — cultural safety does not override child
          protection law.
        </p>

        <h2 id="smoking-cessation">Smoking cessation in ATSI patients</h2>
        <p>
          Smoking is the leading preventable contributor to the life-expectancy gap. Use the
          <strong>5 A&apos;s</strong> (Ask, Advise, Assess, Assist, Arrange) at every visit.
          First-line pharmacotherapy is nicotine replacement therapy (combination patch + short-acting),
          with varenicline and bupropion as second-line per RACGP <em>Supporting smoking cessation</em>
          guideline. Critically, varenicline and NRT are <strong>PBS-listed</strong> for ATSI
          patients with reduced or nil copayment under the Closing the Gap PBS Co-payment Programme.
          Quitline Aboriginal counsellors are available on 13 7848. The <em>Tackling Indigenous
          Smoking</em> programme funds local workforce — refer patients to local ATSI tobacco
          workers where possible.
        </p>

        <h2 id="pbs-ctg">PBS Closing the Gap copayment scheme</h2>
        <p>
          The <strong>PBS Closing the Gap (CTG) Co-payment Programme</strong> reduces or eliminates
          PBS copayments for Aboriginal and Torres Strait Islander patients living with, or at
          risk of, chronic disease. Concession-card holders pay nothing; general patients pay the
          concessional rate. To activate: the patient must be registered for CTG through the
          practice (PRODA / HPOS), and the prescriber must <strong>annotate &ldquo;CTG&rdquo; on
          every script</strong> — the pharmacy will not apply the reduction without that annotation.
          This is a common OSCE trap: candidate prescribes the correct drug, forgets the
          annotation, patient cannot afford it, scenario marks lost.
        </p>

        <h2 id="how-imgs-lose-marks">How IMGs lose marks on cultural items</h2>
        <ul>
          <li>Defaulting to a Western mental health screen instead of aPHQ-9, KICA or 13YARN referral.</li>
          <li>Missing the CTG annotation on a PBS script — the medicine is right, the access is wrong.</li>
          <li>Using oral penicillin V for RHD secondary prophylaxis instead of IM benzathine 21–28-daily.</li>
          <li>Referring to a mainstream service when an ACCHO or Aboriginal Health Practitioner is available locally.</li>
          <li>Pressuring a patient to keep an appointment during Sorry Business.</li>
          <li>Pathologising a culturally normative bereavement experience as psychosis.</li>
          <li>Forgetting trachoma screening in any remote-living child or family member.</li>
          <li>Skipping the &ldquo;is there an Aboriginal Health Worker or interpreter available?&rdquo; safety opener.</li>
        </ul>

        <h2 id="recommended-sources">Recommended AU study sources</h2>
        <ul>
          <li><a href="https://www.naccho.org.au" target="_blank" rel="noopener noreferrer">NACCHO–RACGP National Guide to a Preventive Health Assessment for Aboriginal and Torres Strait Islander People (3rd edition)</a></li>
          <li><a href="https://www.rhdaustralia.org.au" target="_blank" rel="noopener noreferrer">RHDAustralia — 2020 Australian Guideline for the prevention, diagnosis and management of ARF and RHD</a></li>
          <li><a href="https://www.health.gov.au/our-work/closing-the-gap-pbs-co-payment-program" target="_blank" rel="noopener noreferrer">Australian Government — PBS Closing the Gap Co-payment Programme</a></li>
          <li><a href="https://www.mbsonline.gov.au" target="_blank" rel="noopener noreferrer">MBS Online — items 715, 10987, 81300–81360</a></li>
          <li><a href="https://www.indigenouseyehealth.unimelb.edu.au" target="_blank" rel="noopener noreferrer">Indigenous Eye Health — University of Melbourne (trachoma SAFE)</a></li>
          <li><a href="https://www.13yarn.org.au" target="_blank" rel="noopener noreferrer">13YARN — Aboriginal &amp; Torres Strait Islander crisis support</a></li>
          <li><a href="https://www.health.gov.au" target="_blank" rel="noopener noreferrer">National Strategic Framework for Aboriginal and Torres Strait Islander Peoples&apos; Mental Health and SEWB 2017–2023</a></li>
          <li><a href="https://www.ahpra.gov.au" target="_blank" rel="noopener noreferrer">AHPRA Code of Conduct 2020 — cultural safety standards</a></li>
          <li>Murtagh&apos;s General Practice (8th ed.) — Aboriginal &amp; Torres Strait Islander health chapter</li>
          <li>Therapeutic Guidelines (eTG complete) — Antibiotic and Respiratory volumes (ARF/RHD, trachoma)</li>
        </ul>

        <h2 id="study-with-mostly-medicine">Study with Mostly Medicine</h2>
        <p>
          The Mostly Medicine <Link href="/dashboard/flashcards/aboriginal-health">Aboriginal &amp;
          Torres Strait Islander Health flashcard deck</Link> drills every item above with
          spaced-repetition cards mapped to MBS, PBS, eTG and NACCHO source pages. Pair it with
          the <Link href="/dashboard/flashcards/cultural-safety">Cultural Safety deck</Link> and
          our <Link href="/osce-guide">OSCE preparation guide</Link> for end-to-end coverage of
          this AMC topic. If you are still mapping your AMC pathway from India, start with the
          <Link href="/amc-from-india">AMC from India</Link> guide, and if you are weighing
          Australia versus the UK, the <Link href="/amc-vs-plab">AMC vs PLAB</Link> comparison
          spells out the country-level differences.
        </p>

        <h2 id="related-reading">Related reading</h2>
        <ul>
          <li><Link href="/img-cultural-safety-australia">Cultural Safety for IMGs in Australia — AHPRA Code 2020</Link></li>
          <li><Link href="/amc-ethics-medico-legal-au">AMC Ethics &amp; Medico-Legal — AHPRA, VAD, Austroads</Link></li>
          <li><Link href="/amc-pharmacology-australia">AMC Pharmacology — PBS, S8, RTPM, TGA</Link></li>
          <li><Link href="/rural-gp-amc-pathway">Rural GP Pathway in Australia for IMGs</Link></li>
          <li><Link href="/amc-cat1">AMC CAT 1 MCQ plan</Link></li>
          <li><Link href="/amc-cat2">AMC CAT 2 clinical plan</Link></li>
        </ul>

        <hr className="border-slate-200 my-10" />

        <div className="not-prose rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-gray-700">
          <p className="font-semibold text-gray-900 mb-2">Built by IMGs and IT professionals who walked the AMC pathway.</p>
          <p>
            Mostly Medicine is an AMC exam-prep platform — not affiliated with the AMC, AHPRA,
            NACCHO, the Department of Health, or any official body. All clinical content on this
            page is summarised from publicly available Australian guidelines for educational
            purposes only and does not replace the source documents or clinical supervision.
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
