import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/img-cultural-safety-australia`;
const TITLE = "Cultural Safety for IMGs in Australia — AHPRA Code 2020 + AMC Guide 2026";
const DESCRIPTION =
  "AHPRA 2020 Code, LGBTQI+ inclusive care, refugee Comprehensive Health Assessment (MBS 701), TIS National interpreters, trauma-informed care, FGC, Ramadan and JW prescribing — the AMC cultural-safety layer for IMGs.";
const PUBLISHED = "2026-06-08";
const UPDATED = "2026-06-08";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "Mostly Medicine Editorial" }],
  keywords: [
    "cultural safety IMG",
    "AHPRA Code 2020",
    "LGBTQI+ inclusive care AU",
    "refugee health MBS 701",
    "TIS National interpreter",
    "trauma-informed care",
    "FGC AU criminalisation",
    "Ramadan insulin",
    "Jehovah's Witness blood",
    "porcine heparin",
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
    { "@type": "ListItem", position: 3, name: "Cultural Safety for IMGs in Australia", item: PAGE_URL },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-ink-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-saffron-50 via-white to-rose-50 border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 pt-12 pb-14">
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 hover:text-saffron-800">
            Mostly Medicine
          </Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-saffron-700">
            AMC cultural safety · Updated 8 June 2026
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-ink-950 leading-[1.08]">
            Cultural Safety for IMGs in Australia — AHPRA Code 2020 + AMC Guide 2026
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink-900/85">
            Cultural safety became a mandatory standard for every registered health practitioner in
            Australia when AHPRA updated its Code of Conduct in 2020. This is what the 2020 update
            actually means for AMC candidates, with the AusPATH LGBTQI+ standards, the MBS 701–707
            refugee health items, TIS National interpreter use, FGC criminalisation, and the
            religious prescribing rules — Ramadan insulin, Jehovah&apos;s Witness blood products,
            pork-derived heparin — that examiners test on directly.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 px-6 py-3 text-sm font-bold text-ink-950 shadow-sm transition-colors"
            >
              Start studying free →
            </Link>
            <Link
              href="/dashboard/flashcards/cultural-safety"
              className="inline-flex items-center gap-2 rounded-xl border border-saffron-300 bg-white hover:bg-saffron-50 px-6 py-3 text-sm font-bold text-saffron-800 transition-colors"
            >
              Open Cultural Safety flashcards
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-900/70">
            By <span className="font-semibold text-ink-950">Mostly Medicine Editorial</span> · Reviewed by clinical-educator IMG team · Updated 8 June 2026
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 sm:px-10 pt-12 pb-16 prose prose-slate prose-headings:font-display prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:tracking-tight prose-a:text-saffron-700 hover:prose-a:text-saffron-800 prose-strong:text-ink-950">

        <p>
          Cultural safety in Australia is not a soft skill — it is a registration standard. Since
          the 2020 update to the AHPRA <em>Code of Conduct</em>, every registered health
          practitioner has a defined duty to provide care that is culturally safe as judged by
          the recipient, not by the clinician. AMC examines this directly, and the questions are
          system-specific: which interpreter service, which MBS item for a refugee, which
          AusPATH-aligned management for a transgender adolescent, and which religious
          considerations to anticipate before prescribing.
        </p>
        <p>
          Sources used on this page: AHPRA <em>Code of Conduct 2020</em>, the joint
          Aboriginal-and-Torres-Strait-Islander-led <em>National Scheme&apos;s Aboriginal and
          Torres Strait Islander Health and Cultural Safety Strategy 2020–2025</em>, AusPATH
          standards, the RACGP refugee health resources and the Australasian Society for HIV,
          Viral Hepatitis and Sexual Health Medicine (ASHM) sexual health guidelines.
        </p>

        <h2 id="ahpra-2020">The AHPRA 2020 Code — what changed</h2>
        <p>
          In 2020 the National Boards (led by the Medical Board of Australia in partnership with
          Aboriginal and Torres Strait Islander leaders) published the <em>National Scheme&apos;s
          Aboriginal and Torres Strait Islander Health and Cultural Safety Strategy 2020–2025</em>
          and updated the Code of Conduct to embed cultural safety as a baseline standard. The
          shift you must understand: <strong>cultural safety is determined by the recipient of
          care, not the clinician</strong>. Self-perceived cultural competence is not the
          benchmark; whether the patient feels safe, respected and heard is.
        </p>
        <p>
          For AMC, this changes how you frame OSCE consultations. Open with a culturally safe
          frame (introduce yourself, ask the patient&apos;s preferred name and pronouns, ask if
          they would like an interpreter or a cultural support person, ask whether they identify
          as Aboriginal or Torres Strait Islander — the standard NACCHO question for any clinical
          encounter), then proceed. Examiners reward candidates who do this without prompting and
          mark down candidates who skip it.
        </p>

        <h2 id="lgbtqi">LGBTQI+ inclusive care and AusPATH</h2>
        <p>
          <strong>AusPATH (Australian Professional Association for Trans Health)</strong> is the
          AU peak body for trans and gender-diverse health. Its standards of care, alongside the
          Royal Children&apos;s Hospital Melbourne <em>Australian Standards of Care and Treatment
          Guidelines for Trans and Gender Diverse Children and Adolescents</em>, are the AU
          reference points. Core principles for AMC:
        </p>
        <ul>
          <li>Ask and document <strong>preferred name, pronouns and assigned sex at birth</strong>; do not assume from appearance or chart.</li>
          <li>For adults seeking gender-affirming hormone therapy, the <strong>informed consent model</strong> is the AU mainstream pathway in primary care (with referral to a specialist when complex).</li>
          <li>For adolescents, treatment is multidisciplinary and stage-based (puberty blockers, then hormones, with mental-health support throughout). Do not commit to a specific intervention timing in an OSCE — defer to multidisciplinary team and AusPATH-aligned services.</li>
          <li>Screening: cervical screening for any patient with a cervix, breast/chest screening based on tissue present and hormone exposure, prostate considerations for any patient with a prostate.</li>
          <li>Recognise the elevated rates of mental-ill-health, suicide and discrimination — assertively screen for psychosocial risk and offer culturally competent referral (QLife 1800 184 527; Switchboard 1800 184 527 in Victoria; ACON in NSW).</li>
        </ul>

        <h2 id="refugee-mbs-701">Refugee health — MBS 701–707 Comprehensive Health Assessment</h2>
        <p>
          The <strong>Refugee Health Assessment</strong> is available via the standard MBS Health
          Assessment items: <strong>MBS items 701 (brief), 703 (standard), 705 (long) and 707
          (prolonged)</strong>, billable for any person from a refugee-like background within
          12 months of arrival. The assessment should be culturally and trauma-informed and cover:
          a comprehensive history (country of origin, journey, immunisation status, prior medical
          care), a complete physical examination, screening investigations (FBC, ferritin, B12,
          25-OH vitamin D, HBV/HCV/HIV serology, syphilis EIA, schistosoma and strongyloides
          serology where indicated, hepatitis B vaccine status, Mantoux/IGRA for TB screening,
          urinalysis, faecal parasite microscopy in symptomatic patients), and immunisation
          catch-up per the Australian Immunisation Handbook.
        </p>
        <p>
          Other relevant MBS items: <strong>MBS 715</strong> (ATSI health check — see our
          <Link href="/aboriginal-health-amc">Aboriginal and Torres Strait Islander Health for
          AMC</Link> guide), and the <strong>Chronic Disease Management plans</strong> (GPMP item
          229, TCA item 230, allied health items 10950–10970) which apply equally to refugee
          patients with chronic conditions.
        </p>

        <h2 id="tis-national">TIS National and interpreter use</h2>
        <p>
          <strong>TIS National (Translating and Interpreting Service)</strong> is the Australian
          Government&apos;s interpreter service. The phone number you must know:
          <strong> 131 450</strong>. TIS is free for medical practitioners providing care to
          non-English-speaking patients via the Doctors Priority Line. AMC consultation principles:
        </p>
        <ul>
          <li>Never use family members (especially children) as interpreters for clinical decisions.</li>
          <li>Use a <strong>professional accredited interpreter</strong> — in-person where available, telephone or video otherwise.</li>
          <li>Address and look at the patient, not the interpreter; speak in short, complete sentences; pause for translation.</li>
          <li>Document the interpreter&apos;s NAATI ID and the service used.</li>
          <li>For Deaf patients, use an Auslan interpreter (NABS — National Auslan Booking and Payment Service, free for medical appointments).</li>
        </ul>

        <h2 id="trauma-informed">Trauma-informed care</h2>
        <p>
          Trauma-informed care is the active recognition that many patients (especially refugees,
          survivors of family violence, Aboriginal and Torres Strait Islander patients, LGBTQI+
          patients and those with mental-health conditions) have experienced trauma that shapes
          their interaction with healthcare. The four R&apos;s: <strong>realise</strong> trauma
          is common, <strong>recognise</strong> signs, <strong>respond</strong> by integrating
          knowledge into practice, and <strong>resist re-traumatisation</strong>. Practical AMC
          actions: ask permission before examination (especially intimate or invasive),
          predict-and-prepare each step, offer a chaperone, allow control over pace, and refer
          to specialised services (Forum of Australian Services for Survivors of Torture and
          Trauma — FASSTT, including STARTTS in NSW and the Victorian Foundation for Survivors of
          Torture).
        </p>

        <h2 id="fgc">Female Genital Cutting — criminalisation and antenatal management</h2>
        <p>
          <strong>Female Genital Cutting (FGC, also Female Genital Mutilation)</strong> is a
          <strong>criminal offence in every Australian state and territory</strong>, both to
          perform and to facilitate (including taking a child overseas for the procedure).
          Reporting obligations vary by jurisdiction but child protection mandatory-reporting
          duties apply where a child is at risk. Clinical management:
        </p>
        <ul>
          <li>Use respectful language — the WHO classification (Type I–IV) is the documentation standard; avoid emotive labels with patients.</li>
          <li>Antenatal: refer to a service experienced in managing pregnancy after FGC (most tertiary maternity hospitals have a multidisciplinary clinic). Plan early for delivery — <strong>de-infibulation</strong> may be required for Type III, ideally before labour or in early second stage.</li>
          <li>Do not perform re-infibulation post-delivery — it is illegal in AU.</li>
          <li>Offer mental-health support; screen for sexual function concerns; involve a female-staffed clinic where appropriate.</li>
          <li>For any at-risk child in the family, follow state mandatory reporting and refer to the relevant child protection authority.</li>
        </ul>

        <h2 id="religious-prescribing">Religious considerations in prescribing</h2>
        <p>
          AMC examines several specific religious-prescribing scenarios. The right answers are
          concrete and the wrong answers are common:
        </p>
        <ul>
          <li><strong>Ramadan and insulin / oral hypoglycaemics:</strong> the Diabetes and Ramadan International Alliance has published practical recommendations widely adopted in AU. Pre-Ramadan risk stratification, dose adjustment of basal-bolus insulin (typically maintain basal, halve mealtime), prefer DPP-4 inhibitors and GLP-1 receptor agonists over sulfonylureas, monitor with continuous glucose where possible. Patients with type 1 diabetes, recent severe hypo, or pregnancy are advised against fasting. Do not assume the patient should not fast — facilitate informed choice.</li>
          <li><strong>Jehovah&apos;s Witnesses and blood products:</strong> most decline whole blood, red cells, platelets, plasma and white cells. Many accept albumin, clotting factor concentrates, immunoglobulins and recombinant products (individual variation — always ask). Erythropoietin, iron infusion and cell salvage are commonly acceptable alternatives. Document an explicit advance care directive or Advance Health Directive; respect competent adult refusal even where life-saving.</li>
          <li><strong>Pork-derived heparin and porcine valves:</strong> some Muslim and Jewish patients prefer to avoid porcine products. Bovine-derived heparin alternatives are limited in AU practice but should be discussed; for valve replacement, mechanical valves or bovine pericardial valves can be offered. Informed consent: disclose source, alternatives and risks.</li>
          <li><strong>Gelatine-containing vaccines and capsules:</strong> e.g. MMR, varicella, some shingles vaccines — disclose to vegetarian, vegan, Hindu, Muslim, Jewish, Jain patients. Most religious authorities permit medical-necessity use; the disclosure itself is the duty.</li>
          <li><strong>Alcohol-containing liquid medicines:</strong> a small but real concern for Muslim patients and those in alcohol recovery — request alcohol-free formulations where available.</li>
          <li><strong>Fasting and procedural sedation:</strong> respect Sabbath, Ramadan, fasting traditions in scheduling elective procedures where clinically possible.</li>
        </ul>

        <h2 id="mental-health-advocate">Mental health cultural advocate role</h2>
        <p>
          State mental health Acts and the AHPRA cultural safety strategy support the role of a
          <strong>cultural advocate</strong> or cultural support person in inpatient and
          community mental health care — particularly for Aboriginal and Torres Strait Islander
          patients, culturally and linguistically diverse patients, refugee patients, and LGBTQI+
          patients. The advocate is not an interpreter — they help the patient and clinician
          bridge cultural and contextual gaps. For AMC, the safe move is to <strong>offer</strong>
          a cultural advocate or peer support worker proactively, especially when the patient is
          under involuntary treatment or in a vulnerable presentation.
        </p>

        <h2 id="how-imgs-lose-marks">How IMGs lose marks on cultural-safety items</h2>
        <ul>
          <li>Using a family member to interpret instead of TIS National 131 450.</li>
          <li>Asking a transgender patient&apos;s &ldquo;real name&rdquo; — there is no real name other than the preferred name.</li>
          <li>Assuming a Muslim patient cannot fast in Ramadan with insulin — denial of autonomy, not protection.</li>
          <li>Forgetting to ask &ldquo;Do you identify as Aboriginal or Torres Strait Islander?&rdquo; in any new clinical encounter.</li>
          <li>Mislabelling FGC as &ldquo;circumcision&rdquo; in documentation, or implying the patient consented to it as a child.</li>
          <li>Pushing blood products on a Jehovah&apos;s Witness with capacity instead of exploring acceptable alternatives.</li>
          <li>Missing the Refugee Health Assessment MBS item (701/703/705/707) and the 12-month window.</li>
          <li>Treating cultural safety as &ldquo;extra-credit politeness&rdquo; rather than a registration standard.</li>
        </ul>

        <h2 id="recommended-sources">Recommended AU study sources</h2>
        <ul>
          <li><a href="https://www.ahpra.gov.au/About-Ahpra/Aboriginal-and-Torres-Strait-Islander-Health-Strategy.aspx" target="_blank" rel="noopener noreferrer">AHPRA — National Scheme&apos;s Aboriginal and Torres Strait Islander Health and Cultural Safety Strategy 2020–2025</a></li>
          <li><a href="https://auspath.org.au" target="_blank" rel="noopener noreferrer">AusPATH — Australian Professional Association for Trans Health</a></li>
          <li><a href="https://www.rch.org.au/adolescent-medicine/gender-service" target="_blank" rel="noopener noreferrer">RCH Melbourne — Australian Standards of Care for Trans and Gender Diverse Children and Adolescents</a></li>
          <li><a href="https://www.racgp.org.au/clinical-resources/clinical-guidelines/key-racgp-guidelines/view-all-racgp-guidelines/refugee-health" target="_blank" rel="noopener noreferrer">RACGP — Refugee Health resources</a></li>
          <li><a href="https://www.tisnational.gov.au" target="_blank" rel="noopener noreferrer">TIS National — Translating and Interpreting Service (131 450)</a></li>
          <li><a href="https://nabs.org.au" target="_blank" rel="noopener noreferrer">NABS — National Auslan Booking and Payment Service</a></li>
          <li><a href="https://www.fasstt.org.au" target="_blank" rel="noopener noreferrer">FASSTT — Forum of Australian Services for Survivors of Torture and Trauma</a></li>
          <li><a href="https://www.mbsonline.gov.au" target="_blank" rel="noopener noreferrer">MBS Online — Refugee Health Assessment items (701, 703, 705, 707)</a></li>
          <li><a href="https://ashm.org.au" target="_blank" rel="noopener noreferrer">ASHM — Australasian Society for HIV, Viral Hepatitis and Sexual Health Medicine</a></li>
          <li>Murtagh&apos;s General Practice (8th ed.) — culturally and linguistically diverse care, refugee health</li>
          <li>Therapeutic Guidelines (eTG complete) — Endocrinology (Ramadan diabetes management)</li>
        </ul>

        <h2 id="study-with-mostly-medicine">Study with Mostly Medicine</h2>
        <p>
          The Mostly Medicine <Link href="/dashboard/flashcards/cultural-safety">Cultural Safety
          flashcard deck</Link> drills the AHPRA 2020 Code, AusPATH standards, refugee MBS items,
          TIS National, religious prescribing scenarios and FGC management — spaced-repetition
          cards aligned to the AHPRA strategy and RACGP refugee health resources. Pair it with
          the <Link href="/dashboard/flashcards/aboriginal-health">Aboriginal &amp; Torres Strait
          Islander Health deck</Link> and the <Link href="/dashboard/flashcards/ethics">Ethics
          deck</Link> for full AMC coverage. The clinical-stations rehearsal lives in the
          <Link href="/osce-guide">OSCE preparation guide</Link>. If you are mapping your AMC
          pathway, start at <Link href="/amc-from-india">AMC from India</Link> or
          <Link href="/amc-vs-plab">AMC vs PLAB</Link>.
        </p>

        <h2 id="related-reading">Related reading</h2>
        <ul>
          <li><Link href="/aboriginal-health-amc">Aboriginal &amp; Torres Strait Islander Health for AMC</Link></li>
          <li><Link href="/amc-ethics-medico-legal-au">AMC Ethics &amp; Medico-Legal — AHPRA, VAD, Austroads</Link></li>
          <li><Link href="/amc-pharmacology-australia">AMC Pharmacology — PBS, S8, RTPM, TGA</Link></li>
          <li><Link href="/rural-gp-amc-pathway">Rural GP Pathway in Australia for IMGs</Link></li>
          <li><Link href="/amc-cat2">AMC CAT 2 clinical plan</Link></li>
          <li><Link href="/osce-guide">OSCE preparation guide</Link></li>
        </ul>

        <hr className="border-slate-200 my-10" />

        <div className="not-prose rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-ink-900/85">
          <p className="font-semibold text-ink-950 mb-2">Built by IMGs and IT professionals who walked the AMC pathway.</p>
          <p>
            Mostly Medicine is an AMC exam-prep platform — not affiliated with the AMC, AHPRA,
            AusPATH, TIS National, NABS, FASSTT, the Department of Health, or any official body.
            All cultural-safety, refugee-health and religious-prescribing content on this page is
            summarised from publicly available Australian guidelines for educational purposes
            only — patient-specific decisions require individual clinical judgement, current
            source documents and, where indicated, advice from culturally appropriate community
            organisations.
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
