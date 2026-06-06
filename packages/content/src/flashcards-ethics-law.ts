import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC-aligned Australian medico-legal + ethics.
// AU-specific: National Law 2010, AHPRA, state coroners acts, VAD, Austroads.
// Mirrors flashcards-gastro.ts conventions — cloze ≤2, AU-cited, no fluff.
export const ethicsLawFlashcards: Flashcard[] = [
  {
    id: "fc-ethics-001",
    specialty: "ethics_law",
    subtopic: "AHPRA registration standard",
    front_md:
      "Annual AHPRA registration renewal requires the medical practitioner to declare {{c1::recency of practice (≥4 weeks equivalent FTE in the last 12 months, or ≥80 hours per year averaged over 36 months)}}, completion of CPD, and continued meeting of the {{c2::English language skills registration standard}}.",
    back_md:
      "Health Practitioner Regulation National Law Act 2010 underpins every state/territory except WA (which adopted by mirror legislation). Failure to meet recency triggers conditional/limited registration. English standard: IELTS 7.0 in each band, OET grade B, or equivalent — exemptions for school-of-medicine pathway in AU/NZ/UK/US/Canada/Ireland.",
    citation: "AHPRA National Law 2010 · Medical Board of Australia registration standards",
    mark_sheet_domain: "knowledge",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-ethics-002",
    specialty: "ethics_law",
    subtopic: "Good Medical Practice code",
    front_md:
      "The Medical Board of Australia's Good Medical Practice code is structured around the doctor's responsibilities across {{c1::patients, professional performance, teaching/research, collegiality, performance issues, and personal health}} — duty to maintain {{c2::competence through CPD and self-reflection}} is non-negotiable.",
    back_md:
      "Domain headings (2020 revision): providing good care; working with patients; working with other practitioners; working within the healthcare system; minimising risk; maintaining performance; teaching/supervising/assessing; research; maintaining own health. Used as the benchmark in AHPRA disciplinary hearings.",
    citation: "Medical Board of Australia · Good Medical Practice 2020",
    mark_sheet_domain: "knowledge",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-ethics-003",
    specialty: "ethics_law",
    subtopic: "Notifiable conduct",
    front_md:
      "Under s140 of the National Law, mandatory notification to AHPRA about another registered practitioner is triggered by {{c1::practising while intoxicated, sexual misconduct with a patient, an impairment placing the public at substantial risk, or significant departure from accepted professional standards}}.",
    back_md:
      "Treating practitioners in WA are exempt for impairment notifications (state amendment). 'Substantial risk of harm' is the threshold — not merely 'risk'. Vexatious notifications are themselves notifiable. Self-notification required when own conduct meets threshold.",
    citation: "AHPRA National Law s140 · Medical Board Notifications Guidelines",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-004",
    specialty: "ethics_law",
    subtopic: "Mandatory reporting child abuse",
    front_md:
      "Mandatory reporting of suspected child abuse by medical practitioners exists in {{c1::all 8 Australian states/territories}}, but the scope (physical, sexual, neglect, emotional, exposure to DV) and threshold (suspect vs reasonable belief) {{c2::vary by jurisdiction}}.",
    back_md:
      "NSW (Children and Young Persons (Care and Protection) Act 1998), Vic (CYFA 2005 — sexual + physical only for doctors), Qld (Child Protection Act 1999), SA, WA, Tas, NT, ACT all mandate. Elder abuse is NOT universally mandatory (only NSW + SA aged-care residents). DV mandatory for children in care; adult DV is discretionary except NT.",
    citation: "AIFS state mandatory reporting table · RACGP child protection",
    mark_sheet_domain: "knowledge",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-ethics-005",
    specialty: "ethics_law",
    subtopic: "Capacity assessment",
    front_md:
      "The 4-element functional test for decision-making capacity requires the patient to {{c1::understand the information, retain it long enough to decide, weigh it as part of the decision, and communicate the decision}} — assessed for {{c2::this specific decision at this time}}.",
    back_md:
      "Capacity is decision-specific and time-specific — never global. Presume capacity in adults. Cognitive impairment ≠ incapacity. Gillick competence (under-16s) and Mature Minor doctrine (codified in NSW Minors Property and Contracts Act + Vic common law) permit consent without parental involvement if the minor demonstrates sufficient understanding.",
    citation: "MCA-equivalent AU common law · NSW Guardianship Act 1987",
    mark_sheet_domain: "communication",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-ethics-006",
    specialty: "ethics_law",
    subtopic: "Informed consent — Rogers v Whitaker",
    front_md:
      "The Australian standard for risk disclosure in consent (Rogers v Whitaker 1992) is the {{c1::reasonable patient (material risk) test}} — disclose any risk to which a reasonable person in the patient's position would attach significance, OR which {{c2::this particular patient would attach significance to}}.",
    back_md:
      "Rejected the Bolam (UK reasonable-doctor) test. Material risk = either reasonable patient OR this patient. Three elements of valid consent: voluntary (no coercion), informed (material risks + alternatives + consequences of refusal), specific (to this procedure). Documentation is evidence — not consent itself.",
    citation: "Rogers v Whitaker [1992] HCA · Medical Board GMP",
    mark_sheet_domain: "communication",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-ethics-007",
    specialty: "ethics_law",
    subtopic: "Substitute decision-making hierarchy",
    front_md:
      "When an adult patient lacks capacity, the substitute decision-maker hierarchy is broadly {{c1::Advance Care Directive → appointed Enduring Guardian / Medical Treatment Decision-Maker → spouse/partner → adult child / parent / sibling → close friend}}, with {{c2::VCAT (Vic) or NCAT (NSW) or equivalent tribunal}} as ultimate decision-maker for disputes.",
    back_md:
      "Exact order is state-specific — Vic uses Medical Treatment Planning and Decisions Act 2016 (person responsible hierarchy s55), NSW Guardianship Act 1987 (Part 5). ACDs trump appointed substitute decision-makers. Tribunal can appoint Public Guardian if no person responsible available. Emergency treatment proceeds without consent under doctrine of necessity.",
    citation: "Vic MTPDA 2016 · NSW Guardianship Act · QLD POAA 1998",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-008",
    specialty: "ethics_law",
    subtopic: "Confidentiality exceptions",
    front_md:
      "Confidentiality may be lawfully breached without consent when {{c1::compelled by court subpoena/search warrant, a mandatory report is triggered, public health legislation requires notification, or serious imminent harm to identifiable third party}} exists.",
    back_md:
      "AU has no statutory 'Tarasoff duty', but Hunter v Hunter and PD v Harvey (NSW 2003) recognise a limited common-law duty to warn identifiable third parties of HIV/serious infectious risk. HIV partner notification varies — NSW + Vic prefer doctor-assisted disclosure pathways via Public Health Unit. Document deliberation before any breach.",
    citation: "PD v Harvey [2003] NSWSC · OAIC privacy guidance · ASHM HIV",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-009",
    specialty: "ethics_law",
    subtopic: "Privacy Act + APPs",
    front_md:
      "The Privacy Act 1988 (Cth) sets {{c1::13 Australian Privacy Principles}} governing collection, use, disclosure, quality, security, access and correction of personal/health information — health is 'sensitive information' attracting the {{c2::highest protection}}.",
    back_md:
      "APP 1 (open management) · APP 3 (collection) · APP 6 (use/disclosure — primary purpose, plus related secondary if reasonably expected) · APP 11 (security — reasonable steps) · APP 12 (access — within 30 days) · APP 13 (correction). Complaints to Office of the Australian Information Commissioner (OAIC). Notifiable Data Breach scheme since 2018.",
    citation: "Privacy Act 1988 (Cth) · OAIC APP Guidelines",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-ethics-010",
    specialty: "ethics_law",
    subtopic: "My Health Record",
    front_md:
      "My Health Record operates on an {{c1::opt-out}} basis since 2019 — patients may withdraw at any time, cancel access for individual practitioners, or set access codes; uploaded clinical documents {{c2::cannot be deleted, only hidden}}.",
    back_md:
      "Governed by My Health Records Act 2012. Default access to all healthcare providers in patient's care. Patient can set Personal Access Code (PAC) per document or set a Limited Document Access Code (LDAC). Emergency access ('break glass') for 5 days. Operated by the Australian Digital Health Agency.",
    citation: "My Health Records Act 2012 · ADHA · OAIC",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-ethics-011",
    specialty: "ethics_law",
    subtopic: "Coronial law",
    front_md:
      "A death is reportable to the Coroner when it is {{c1::sudden, unexpected, violent, suspicious, occurred during/within 24h of anaesthetic or invasive procedure, in custody/care, or where the deceased had not seen a doctor within reasonable time before death}}.",
    back_md:
      "Each state has its own Coroners Act (Vic 2008, NSW 2009, Qld 2003) — categories overlap but are not identical. 'Death in care' includes residential mental health, disability, immigration detention. Cremation certificates require coroner clearance for any reportable death. Form 1 (Vic) / NOLR (NSW) submitted by attending doctor.",
    citation: "State Coroners Acts · Vic Coroners Court Form 1 guide",
    mark_sheet_domain: "knowledge",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-ethics-012",
    specialty: "ethics_law",
    subtopic: "Voluntary Assisted Dying",
    front_md:
      "VAD eligibility in Victoria (the first state, 2019) requires Australian citizenship/PR ≥12 months, age ≥18, decision-making capacity, advanced disease causing intolerable suffering, and prognosis ≤{{c1::6 months (or 12 months for neurodegenerative disease)}} — with {{c2::two independent doctor assessments and a minimum 9-day cooling period}}.",
    back_md:
      "All 6 states now have VAD legislation (Vic 2019, WA 2021, Tas/Qld/SA 2023, NSW 2023). Prognosis varies: Qld is 12 months regardless of disease type; WA 6 (12 neuro). Both consulting + coordinating doctors must complete approved training. Patient initiates — gag clause (Vic, WA) prevented doctor from raising it until recent reforms. ACT + NT progressing.",
    citation: "Vic Voluntary Assisted Dying Act 2017 · state VAD Acts",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-013",
    specialty: "ethics_law",
    subtopic: "Advance Care Planning",
    front_md:
      "Advance Care Directives in Australia exist in two forms: {{c1::common-law (any clear, capacitous, informed refusal of future treatment is binding)}} and {{c2::statutory (written under state-specific legislation — Vic MTPDA, NSW common law, Qld AHD form)}}.",
    back_md:
      "Vic uses Instructional Directive (binding) + Values Directive (guides) under MTPDA 2016. NSW relies on common-law ACDs + appointed Enduring Guardian. Qld has standardised AHD form requiring doctor + JP witness. Federal DOH framework guides quality conversations. ACDs survive loss of capacity; can be revoked while capacitous.",
    citation: "AU Dept Health ACP framework · state legislation",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-014",
    specialty: "ethics_law",
    subtopic: "Resuscitation planning",
    front_md:
      "A NFR (Not For Resuscitation) / Resuscitation Plan order requires {{c1::documented discussion with the patient (or substitute decision-maker if incapacitous), clinical justification, and clear escalation triggers}} — signed by the {{c2::consultant or senior treating doctor}}.",
    back_md:
      "Not a unilateral medical decision when patient has capacity — must be a shared decision-making conversation. Reviewed each admission. Includes parameter limits (e.g. ward ceiling, no ICU, no CPR). NSW Resuscitation Plan form, Vic Goals of Care form, Qld Acute Resuscitation Plan. Document family meeting attendees + content verbatim where possible.",
    citation: "ANZICS End-of-Life Care statement · state ARP forms",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-015",
    specialty: "ethics_law",
    subtopic: "Austroads fitness to drive",
    front_md:
      "Per Austroads Assessing Fitness to Drive 2022, a private licence holder with a first unprovoked seizure must be {{c1::seizure-free for 6 months}}; established epilepsy requires {{c2::12 months seizure-free}}. Commercial licence: {{c2::10 years seizure-free off all anti-epileptics}}.",
    back_md:
      "Other standards: insulin-treated diabetes — annual review, no severe hypos in 12 months. Dementia — annual driving review by GP, on-road assessment if uncertain. Cardiac syncope — 4 weeks private / 3 months commercial after cause treated. Doctor must advise patient; reporting to the licensing authority is discretionary except in SA + NT (mandatory).",
    citation: "Austroads Assessing Fitness to Drive 2022",
    mark_sheet_domain: "knowledge",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-ethics-016",
    specialty: "ethics_law",
    subtopic: "Firearms licensing health",
    front_md:
      "A doctor reviewing a firearms licence applicant or current holder must disclose to the {{c1::state Firearms Registry}} any condition (psychotic illness, severe depression with suicidality, substance dependence, dementia, uncontrolled epilepsy) that creates {{c2::a substantial safety risk}} — requirement is state-specific.",
    back_md:
      "NSW Firearms Act 1996 (s79) allows doctor reporting with statutory immunity. Vic Firearms Act 1996 requires applicant medical certificate. WA Firearms Act 1973 (proposed reforms 2024). Mandatory reporting is NOT uniform across AU — but defensible disclosure for public safety is protected. Document clinical reasoning.",
    citation: "NSW Firearms Act 1996 s79 · state firearms legislation",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-017",
    specialty: "ethics_law",
    subtopic: "Adolescent consent + vaccination",
    front_md:
      "A 14-15 year old seeking consent without parental involvement is assessed for {{c1::Gillick/Mature Minor competence}} — record reasoning. For the National Immunisation Program, the 'No Jab No Pay/Play' policy ties {{c2::Family Tax Benefit A supplement + childcare subsidy + state preschool/childcare enrolment}} to up-to-date vaccination.",
    back_md:
      "Vic + NSW + Qld have 'No Jab No Play' (childcare/preschool) — only medical exemptions accepted, not conscientious objection. Federal 'No Jab No Pay' since 2016 removed conscientious objection from FTB-A end-of-year supplement. Mature minor capacity is granular — consent for contraception ≠ consent for surgery. Encourage parental involvement.",
    citation: "Family Assistance Act · state Public Health Acts · NCIRS",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-018",
    specialty: "ethics_law",
    subtopic: "Termination of pregnancy",
    front_md:
      "Abortion is decriminalised in {{c1::all Australian states and territories}}, with gestational limits varying — typically requested up to 22-24 weeks, beyond which {{c2::two doctors must agree (and consideration of all relevant medical/psychosocial/familial circumstances)}}.",
    back_md:
      "NSW 22 wks (Abortion Law Reform Act 2019), Vic 24 wks (Abortion Law Reform Act 2008), Qld 22 wks (TOP Act 2018), SA 22 wks 6 days (2021), Tas 16 wks, WA 23 wks. Conscientious objection permitted but doctor MUST refer or transfer care to a non-objecting practitioner — refusal to refer is itself a breach (Vic s8, Qld s8). Emergency overrides objection.",
    citation: "state TOP Acts · Medical Board GMP s2.4",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-019",
    specialty: "ethics_law",
    subtopic: "STI partner notification",
    front_md:
      "Partner notification for chlamydia, gonorrhoea and syphilis is supported by the {{c1::Let Them Know patient-letter/SMS/email system}} and clinician-assisted contact tracing — NSW Public Health Act enables {{c2::no-fault disclosure of HIV status to at-risk partners via the Public Health Unit}}.",
    back_md:
      "HIV partner notification: voluntary first, escalates to PHU-assisted disclosure if patient refuses. NSW + Vic operate sexual health partner notification officers. Hepatitis B/C — patient-led, no statutory contact tracing. Syphilis is notifiable in all states. Document the conversation about onward transmission risk.",
    citation: "ASHM partner notification guidelines · state PH Acts",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-020",
    specialty: "ethics_law",
    subtopic: "Boundary violations",
    front_md:
      "The Medical Board sexual boundaries guideline prohibits {{c1::any sexual, romantic or financially exploitative relationship with a current patient — and a former patient where the doctor-patient power imbalance persists}}; social media must maintain {{c2::professional boundaries (no friending current patients, no clinical advice via DM)}}.",
    back_md:
      "Sexual misconduct = mandatory notification (s140). No 'consent defence' — the inherent power imbalance vitiates consent. Gifts: low-value tokens of gratitude OK; significant gifts should be declined. Self-prescribing for self or close family is generally prohibited except emergencies (Sch 8 absolutely prohibited).",
    citation: "Medical Board Sexual Boundaries Guidelines 2018 · Social Media Policy",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-021",
    specialty: "ethics_law",
    subtopic: "Aboriginal cultural protocols",
    front_md:
      "Culturally safe care for Aboriginal and Torres Strait Islander patients includes asking about preferred {{c1::name use after death (some communities avoid naming the deceased), Sorry Business obligations, and same-gender clinician preference for intimate examinations}} — autopsy and organ donation discussions require {{c2::engagement with family and Aboriginal Liaison Officer}}.",
    back_md:
      "AHPRA Cultural Safety Strategy 2020-2025 is now embedded in the code. Sorry Business may delay treatment decisions — accommodate where safe. Aboriginal Health Workers, ILOs, ACCHOs (Aboriginal Community Controlled Health Organisations) are key partners. Coronial autopsies that are reportable proceed despite objection — discuss minimisation respectfully.",
    citation: "AHPRA Cultural Safety Strategy 2020-2025 · NACCHO · CARPA",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-ethics-022",
    specialty: "ethics_law",
    subtopic: "Aged care assessment",
    front_md:
      "An older person seeking subsidised aged care services (home care package, residential care, transition care) requires a free comprehensive assessment by an {{c1::Aged Care Assessment Team (ACAT, or ACAS in Vic)}}; lower-level home support comes via the {{c2::Regional Assessment Service (RAS)}} under the Commonwealth Home Support Programme.",
    back_md:
      "My Aged Care (1800 200 422) is the entry portal. Charter of Aged Care Rights (14 rights, 2019) must be signed by/explained to all residents. New Aged Care Act from July 2025 collapses HCP + CHSP into a single Support at Home program. Reportable Incidents Scheme (SIRS) mandates notification of abuse/neglect/unexpected death.",
    citation: "Aged Care Act 1997 · Aged Care Quality Standards · Charter of Rights",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
