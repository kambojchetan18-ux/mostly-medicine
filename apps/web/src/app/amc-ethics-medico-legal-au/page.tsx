import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/amc-ethics-medico-legal-au`;
const TITLE = "AMC Ethics & Medico-Legal: AHPRA, VAD, Austroads — IMG Study Guide 2026";
const DESCRIPTION =
  "AHPRA notifiable conduct, Rogers v Whitaker informed consent (not Bolam), capacity and Gillick, Voluntary Assisted Dying eligibility by state, Austroads fitness-to-drive, Privacy Act 1988 — the AU ethics layer AMC examines.";
const PUBLISHED = "2026-06-08";
const UPDATED = "2026-06-08";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "Mostly Medicine Editorial" }],
  keywords: [
    "AMC ethics IMG",
    "AHPRA notifiable conduct",
    "VAD eligibility AU",
    "Rogers v Whitaker",
    "Austroads fitness to drive",
    "Gillick AU",
    "Privacy Act 1988 APP",
    "coronial reportable death",
    "mandatory reporting AU",
    "boundary violation AHPRA",
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
    { "@type": "ListItem", position: 3, name: "AMC Ethics & Medico-Legal AU", item: PAGE_URL },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-100 via-white to-violet-50 border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 pt-12 pb-14">
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700 hover:text-violet-800">
            Mostly Medicine
          </Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
            AMC ethics &amp; medico-legal · Updated 8 June 2026
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-[1.08]">
            AMC Ethics &amp; Medico-Legal: AHPRA, VAD, Austroads — IMG Study Guide 2026
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-700">
            Australian medical ethics is statute-driven and state-variable. AMC asks specific
            questions with specific right answers — Rogers v Whitaker (not Bolam) for consent,
            AHPRA s140 notifiable conduct, Voluntary Assisted Dying eligibility that differs by
            state, Austroads driver-fitness intervals, and the Privacy Act 1988 with its 13
            Australian Privacy Principles. This page maps every one of them.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors"
            >
              Start studying free →
            </Link>
            <Link
              href="/dashboard/flashcards/ethics"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-300 bg-white hover:bg-violet-50 px-6 py-3 text-sm font-bold text-violet-800 transition-colors"
            >
              Open Ethics &amp; Law flashcards
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            By <span className="font-semibold text-gray-800">Mostly Medicine Editorial</span> · Reviewed by clinical-educator IMG team · Updated 8 June 2026
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 sm:px-10 pt-12 pb-16 prose prose-slate prose-headings:font-display prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:tracking-tight prose-a:text-violet-700 hover:prose-a:text-violet-800 prose-strong:text-gray-900">

        <p>
          Ethics and medico-legal scenarios are where AMC differentiates candidates who know
          medicine from candidates who can practise it in Australia. The questions are concrete and
          the answers are statutory. This page covers the AHPRA registration standards, the
          consent doctrine, capacity (including Gillick / mature minor), mandatory reporting,
          confidentiality and duty to warn, Privacy Act 1988, coronial reporting, Voluntary
          Assisted Dying by state, Austroads <em>Assessing Fitness to Drive 2022</em>,
          decriminalised termination, and boundary violations.
        </p>
        <p>
          Sources: <em>Good Medical Practice: A Code of Conduct for Doctors in Australia</em>
          (Medical Board of Australia, current edition), AHPRA registration standards, the
          <em>Health Practitioner Regulation National Law</em>, NHMRC ethical guidelines, the
          Office of the Australian Information Commissioner (Privacy Act 1988 and APPs), Austroads
          <em>Assessing Fitness to Drive 2022</em>, and the relevant state Voluntary Assisted
          Dying Acts.
        </p>

        <h2 id="ahpra-standards">AHPRA registration standards</h2>
        <p>
          AHPRA and the Medical Board of Australia set the registration standards every doctor
          must meet for general registration: <strong>continuing professional development</strong>
          (50 hours per year minimum, including reviewing performance and measuring outcomes),
          <strong>recency of practice</strong> (clinical hours within the last 3 years),
          <strong>professional indemnity insurance</strong>, <strong>criminal history declaration</strong>,
          <strong>English language skills</strong>, and the <strong>Code of Conduct</strong>
          (Good Medical Practice). For AMC, expect MCQs on each component and OSCE prompts where
          the candidate must recognise a registration-impacting issue (e.g. a colleague returning
          after 4 years out of practice triggers recency-of-practice).
        </p>

        <h2 id="notifiable-conduct">Section 140 — notifiable conduct</h2>
        <p>
          Under <strong>section 140 of the Health Practitioner Regulation National Law</strong>,
          a registered health practitioner has a <strong>mandatory duty to notify AHPRA</strong>
          about another practitioner who has engaged in notifiable conduct. The four categories of
          notifiable conduct are: (1) practising while intoxicated by alcohol or drugs; (2)
          engaging in sexual misconduct in connection with practice; (3) placing the public at
          risk of substantial harm because of an impairment; and (4) placing the public at risk
          of harm by practising in a way that constitutes a significant departure from accepted
          professional standards.
        </p>
        <p>
          A 2020 national-law reform allows treating practitioners to use clinical judgement
          before notifying about a colleague who is also their patient — but the mandatory floor
          is still &ldquo;substantial risk of harm to the public.&rdquo; AMC traps: don&apos;t
          confuse mandatory <em>professional</em> notifications under s140 with mandatory child
          protection reporting (different statute, different process), and don&apos;t assume your
          medical defence organisation can waive a mandatory notification — it cannot.
        </p>

        <h2 id="rogers-v-whitaker">Informed consent — Rogers v Whitaker, not Bolam</h2>
        <p>
          Australia abandoned the <em>Bolam</em> standard for informed consent in <strong>Rogers v
          Whitaker (1992) 175 CLR 479</strong>. The High Court held that a doctor has a duty to
          warn a patient of a <strong>material risk</strong> inherent in a proposed treatment.
          A risk is <strong>material</strong> if either: (a) a reasonable person in the patient&apos;s
          position would attach significance to it (the <em>objective</em> limb), <strong>or</strong>
          (b) the doctor knows, or ought reasonably to know, that this particular patient would
          attach significance to it (the <em>subjective</em> limb). The subjective limb is what
          makes Rogers different — peer practice is not a defence if the patient would have
          regarded the risk as material.
        </p>
        <p>
          Practical OSCE: do not present consent as a checklist of percentages. Ask what matters
          to the patient (occupation, family, hobbies — concert pianist + finger surgery is the
          textbook example), then disclose risks that engage either limb. Document the
          conversation, not just the form signature.
        </p>

        <h2 id="mandatory-reporting">Mandatory reporting — child, elder, DV (state-varying)</h2>
        <p>
          Child protection reporting is state-legislated. Doctors are <strong>mandatory reporters
          for suspected child physical or sexual abuse in every state and territory</strong>; the
          full scope (neglect, emotional abuse, exposure to family violence) varies. Reports go to
          the relevant state child protection agency, not police directly. Elder abuse reporting
          is patchier and largely non-mandatory federally, though aged-care providers have
          mandatory reportable-incident obligations under the Aged Care Act. Domestic and family
          violence reporting obligations also vary by state and are generally permissive for
          adults (mandatory if a child is involved). For AMC, the safe defaults are: <strong>any
          suspected child abuse → mandatory report; document; preserve evidence; safety plan</strong>.
        </p>

        <h2 id="capacity-gillick">Capacity, Gillick competence, mature minor</h2>
        <p>
          <strong>Decision-making capacity</strong> in Australian law is the four-element test
          (often quoted from <em>Re T [1992]</em> and codified in Australian guardianship Acts):
          the patient must be able to (1) understand the relevant information; (2) retain it long
          enough to make a decision; (3) weigh it against alternatives; and (4) communicate the
          decision. Capacity is decision-specific and time-specific — a patient may have capacity
          for one decision but not another. Capacity is presumed in adults; the burden is on the
          clinician to show otherwise.
        </p>
        <p>
          For minors, <strong>Gillick competence</strong> (adopted in Australia via <em>Marion&apos;s
          Case (1992) 175 CLR 218</em>) allows a child under 18 to consent to a treatment if they
          can fully understand its nature, consequences and alternatives. The Australian variant
          is sometimes called the <strong>mature minor</strong> doctrine. The clinician assesses
          this on the specific decision. Note that contraception, mental health treatment and
          minor procedures are commonly assessed under mature minor; sterilisation and some other
          &ldquo;special&rdquo; categories require court approval regardless of competence.
        </p>

        <h2 id="substitute-decision-makers">Substitute decision-makers — VCAT / NCAT</h2>
        <p>
          When an adult patient lacks capacity, decisions are made by a hierarchy of substitute
          decision-makers, defined by state Guardianship and Administration Acts. Order varies but
          typically: appointed guardian → enduring guardian → spouse/de facto → adult child →
          parent → sibling → close friend. If none, the public guardian or a tribunal-appointed
          guardian. Tribunals: <strong>VCAT</strong> in Victoria, <strong>NCAT</strong> in NSW,
          <strong>QCAT</strong> in Queensland, <strong>SACAT</strong> in SA, <strong>WASAT</strong>
          in WA, <strong>ACAT</strong> in the ACT. For AMC: name the substitute decision-maker
          process and refer to the relevant state tribunal rather than improvising a clinical
          override.
        </p>

        <h2 id="privacy">Privacy Act 1988 and 13 Australian Privacy Principles</h2>
        <p>
          The <strong>Privacy Act 1988 (Cth)</strong> applies to most healthcare providers and
          contains 13 <strong>Australian Privacy Principles (APPs)</strong>. The ones you will
          meet most: APP 1 (open and transparent privacy practices), APP 3 (only collect what you
          need), APP 6 (use and disclosure for the primary purpose), APP 11 (security of personal
          information), APP 12 (access on request) and APP 13 (correction on request). Health
          information is &ldquo;sensitive information&rdquo; under the Act and attracts stricter
          rules. The <strong>My Health Records Act 2012</strong> overlays additional requirements
          for My Health Record access and disclosure.
        </p>

        <h2 id="duty-to-warn">Confidentiality and duty to warn</h2>
        <p>
          Australia does not have a clean equivalent of the US <em>Tarasoff</em> duty to warn.
          Confidentiality may be overridden where there is a <strong>serious and imminent threat
          to an identifiable person or persons</strong>, but the framework is permissive
          (APP 6.2(c) — permitted disclosure) rather than mandatory. RACGP and AHPRA guidance is
          to consult your medical defence organisation early; document the threat, the assessment
          and the disclosure. Mandatory exceptions still apply (child protection, communicable
          disease notification, gunshot/knife wound in some jurisdictions, court orders).
        </p>

        <h2 id="coronial">Coronial reportable deaths</h2>
        <p>
          Each state and territory has a Coroners Act that defines <strong>reportable deaths</strong>
          that must be referred to the coroner. The list typically includes: unexpected, unnatural
          or violent deaths; deaths during or shortly after a medical procedure; deaths of persons
          in care, custody or care of a person under guardianship; deaths where the cause is
          unknown; deaths where the deceased had not been seen by a doctor within an appropriate
          window. <strong>If in doubt, report</strong> — the coroner&apos;s office will guide on
          whether autopsy is required. Issuing a death certificate that should have been a coroner&apos;s
          case is a notifiable medico-legal error.
        </p>

        <h2 id="vad">Voluntary Assisted Dying — eligibility by state</h2>
        <p>
          VAD legislation differs across Australian jurisdictions. As of 2026 all six states have
          operative laws; the ACT&apos;s legislation came into effect in late 2025; the NT&apos;s
          regulatory framework is the most recent. Core eligibility is broadly common across
          states: adult Australian citizen or permanent resident, resident in the relevant state
          for the required period, decision-making capacity throughout, an advanced and progressive
          disease/illness/medical condition expected to cause death within a defined timeframe,
          and intolerable suffering.
        </p>
        <p>
          The prognosis window differs by state — Victoria&apos;s Act uses <strong>6 months
          (12 months for neurodegenerative conditions)</strong>; most other states adopt a
          <strong>12-month</strong> prognosis for any qualifying condition. The doctor-initiated
          discussion rule also differs (Victoria initially prohibited it, was reformed; some
          states permit it within counselling). For AMC purposes, learn the <em>structure</em>
          (request, two doctor assessments, capacity throughout, cooling-off period, voluntary at
          the time of administration) and that <strong>specifics differ by state</strong> —
          examiners reward candidates who say &ldquo;check the relevant state Act&rdquo; rather
          than invent a national rule.
        </p>

        <h2 id="austroads">Austroads — Assessing Fitness to Drive 2022</h2>
        <p>
          <strong>Austroads &amp; the National Transport Commission</strong> publish <em>Assessing
          Fitness to Drive: Medical Standards for Licensing and Clinical Management
          Guidelines</em> (current edition 2022). It is the canonical AU reference for driver
          fitness — and AMC examines it directly. Common standards you must know:
        </p>
        <ul>
          <li><strong>Seizure — first unprovoked, private vehicle:</strong> not fit to drive for at least 6 months; commercial: at least 12 months (with neurology review).</li>
          <li><strong>Established epilepsy, private:</strong> seizure-free 12 months on stable treatment; commercial: 10 years off treatment.</li>
          <li><strong>Single episode syncope (uncomplicated, cardiac excluded):</strong> typically 4 weeks off driving private; commercial 3 months.</li>
          <li><strong>Dementia:</strong> mild may continue with annual review and on-road assessment; moderate to severe is not fit.</li>
          <li><strong>Acute coronary syndrome:</strong> private not fit 2 weeks; commercial 4 weeks (uncomplicated PCI may shorten).</li>
          <li><strong>Insulin-treated diabetes:</strong> hypoglycaemia history modifies fitness; commercial standards are stricter.</li>
          <li><strong>Obstructive sleep apnoea with excessive daytime sleepiness:</strong> not fit until treated and symptoms controlled.</li>
        </ul>
        <p>
          The doctor&apos;s duty: assess, advise the patient, document. <strong>Reporting</strong>
          to the licensing authority is mandatory in South Australia and the Northern Territory and
          permissive elsewhere (where the doctor may report if the patient continues to drive
          contrary to advice). Always counsel the patient first; document; consider MDO advice.
        </p>

        <h2 id="termination">Decriminalised termination and duty to refer</h2>
        <p>
          Termination of pregnancy is now decriminalised in every Australian state and territory,
          with gestational limits and process requirements varying by jurisdiction. Conscientious
          objection is recognised — but a doctor who objects has a <strong>duty to inform the
          patient of their right to seek the procedure elsewhere and to refer to a practitioner
          known not to object</strong>. Failure to refer is a recurring AMC ethics scenario.
          Several states codify the duty to refer explicitly in the relevant Act.
        </p>

        <h2 id="boundary-violations">Boundary violations</h2>
        <p>
          The Medical Board&apos;s Code of Conduct and AHPRA&apos;s sexual boundaries guidance are
          unambiguous: <strong>sexual relationships with current patients are professional
          misconduct</strong>, and relationships with former patients are heavily restricted by
          the nature and duration of the prior therapeutic relationship (psychiatric, GP and
          long-standing primary-care relationships have the strictest restrictions). Non-sexual
          boundary issues — gifts, social media contact, dual relationships — are also examined.
          The safe AMC answer is: decline, document, escalate to a senior, seek MDO advice.
        </p>

        <h2 id="recommended-sources">Recommended AU study sources</h2>
        <ul>
          <li><a href="https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx" target="_blank" rel="noopener noreferrer">Medical Board of Australia — Good Medical Practice: Code of Conduct</a></li>
          <li><a href="https://www.ahpra.gov.au" target="_blank" rel="noopener noreferrer">AHPRA — registration standards and notifiable conduct guidance</a></li>
          <li><a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">Office of the Australian Information Commissioner — Privacy Act 1988 and Australian Privacy Principles</a></li>
          <li><a href="https://austroads.com.au/publications/assessing-fitness-to-drive" target="_blank" rel="noopener noreferrer">Austroads — Assessing Fitness to Drive 2022</a></li>
          <li><a href="https://www.health.vic.gov.au/patient-care/voluntary-assisted-dying" target="_blank" rel="noopener noreferrer">Voluntary Assisted Dying — state government portals (each jurisdiction)</a></li>
          <li><a href="https://www.nhmrc.gov.au/about-us/publications/national-statement-ethical-conduct-human-research-2023" target="_blank" rel="noopener noreferrer">NHMRC — National Statement on Ethical Conduct in Human Research</a></li>
          <li>Murtagh&apos;s General Practice (8th ed.) — medico-legal chapter</li>
          <li>RACGP — <em>Standards for general practices</em> (5th ed.) — confidentiality and consent</li>
          <li>Avant / MIPS / MIGA medico-legal case digests (member-only, free at registration)</li>
        </ul>

        <h2 id="study-with-mostly-medicine">Study with Mostly Medicine</h2>
        <p>
          The Mostly Medicine <Link href="/dashboard/flashcards/ethics">Ethics &amp; Medico-Legal
          flashcard deck</Link> drills s140 categories, Rogers v Whitaker, capacity, Gillick,
          coronial criteria, VAD eligibility by state, Austroads intervals, Privacy Act and
          boundary scenarios — spaced-repetition cards mapped to the Medical Board Code of
          Conduct and the current Austroads edition. Pair it with the
          <Link href="/dashboard/flashcards/cultural-safety">Cultural Safety deck</Link> for the
          AHPRA 2020 Code update. The full clinical-stations rehearsal lives in the
          <Link href="/osce-guide">OSCE preparation guide</Link>.
        </p>

        <h2 id="related-reading">Related reading</h2>
        <ul>
          <li><Link href="/img-cultural-safety-australia">Cultural Safety for IMGs in Australia — AHPRA Code 2020</Link></li>
          <li><Link href="/amc-pharmacology-australia">AMC Pharmacology — PBS, S8, RTPM, TGA</Link></li>
          <li><Link href="/aboriginal-health-amc">Aboriginal &amp; Torres Strait Islander Health for AMC</Link></li>
          <li><Link href="/rural-gp-amc-pathway">Rural GP Pathway in Australia for IMGs</Link></li>
          <li><Link href="/amc-cat2">AMC CAT 2 clinical plan</Link></li>
          <li><Link href="/osce-guide">OSCE preparation guide</Link></li>
        </ul>

        <hr className="border-slate-200 my-10" />

        <div className="not-prose rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-gray-700">
          <p className="font-semibold text-gray-900 mb-2">Built by IMGs and IT professionals who walked the AMC pathway.</p>
          <p>
            Mostly Medicine is an AMC exam-prep platform — not affiliated with the AMC, AHPRA, the
            Medical Board of Australia, Austroads, the OAIC, any state Voluntary Assisted Dying
            authority, or any official body. This page summarises publicly available Australian
            ethics, statute and regulatory material for educational purposes only — it is not
            legal advice. Cross-check the current edition of every source before clinical or
            medico-legal decisions and seek medical-defence-organisation advice.
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
