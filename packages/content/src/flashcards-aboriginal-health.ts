import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 Aboriginal & Torres Strait
// Islander (ATSI) health — a high-yield, AU-specific domain that no US/UK
// platform builds for. Mirrors flashcards-gastro.ts conventions — cloze ≤2,
// AU-cited, no fluff.
export const aboriginalHealthFlashcards: Flashcard[] = [
  {
    id: "fc-atsi-001",
    specialty: "aboriginal_health",
    subtopic: "Closing the Gap framework",
    front_md:
      "The 2008 Closing the Gap framework set headline targets including narrowing the life-expectancy gap (~{{c1::8 years}} shorter for ATSI Australians) and halving the {{c2::infant mortality rate}} gap within a decade.",
    back_md:
      "2020 National Agreement on Closing the Gap added 17 socio-economic targets co-designed with the Coalition of Peaks. Chronic disease — ischaemic heart disease, type 2 diabetes, CKD, COPD — accounts for the majority of the burden-of-disease gap. AMC examiners expect candidates to frame ATSI presentations within social determinants, not just biology.",
    citation: "Closing the Gap 2020 National Agreement · AIHW Indigenous HPF",
    mark_sheet_domain: "knowledge",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-atsi-002",
    specialty: "aboriginal_health",
    subtopic: "Cultural safety vs competence",
    front_md:
      "Per the AHPRA 2020 Code, {{c1::cultural safety}} is defined by the patient/community (not the clinician) and requires the practitioner to examine their own bias and power, whereas {{c2::cultural competence}} is a clinician-defined skill set.",
    back_md:
      "Hierarchy: cultural awareness → sensitivity → competence → safety. Marmot's social determinants (income, education, housing, racism, employment) underpin the gap. AHPRA requires all 800,000+ registered HCWs in AU to demonstrate cultural safety CPD annually since March 2020.",
    citation: "AHPRA Cultural Safety Code (Mar 2020) · NACCHO · Marmot WHO 2008",
    mark_sheet_domain: "communication",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-atsi-003",
    specialty: "aboriginal_health",
    subtopic: "Trauma-informed care",
    front_md:
      "Trauma-informed care for ATSI patients acknowledges colonisation, the {{c1::Stolen Generations}}, and {{c2::intergenerational trauma}} — anchored on the 4 R's: Realise, Recognise, Respond, resist Re-traumatisation.",
    back_md:
      "Practical: avoid restraint/seclusion where possible, offer choice over consultation room/seating, ask about family/Country, never demand eye contact, allow silence, partner with an Aboriginal Health Worker (AHW) when available. Bringing Them Home Report (1997) is foundational AMC reading.",
    citation: "SAMHSA · Bringing Them Home Report 1997 · RACGP Aboriginal Health curriculum",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-atsi-004",
    specialty: "aboriginal_health",
    subtopic: "MBS 715 Adult Health Check",
    front_md:
      "The annual Aboriginal & Torres Strait Islander Adult Health Assessment is {{c1::MBS item 715}}, available to ATSI patients aged {{c2::≥15 years}}, claimable once every 9 months.",
    back_md:
      "Components: history (CV, diabetes, mental health, social), exam (BP, BMI, waist, ACR, lipids, HbA1c, eye/oral), preventive plan. Triggers follow-up items 10987 (nursing) and 81300-series (allied health, up to 10 per year). Reimbursement ~$240 (2024). Drives access to PBS CTG copayment scheme.",
    citation: "MBS Online item 715 · RACGP National Guide (4th ed)",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-005",
    specialty: "aboriginal_health",
    subtopic: "MBS 715 Child Health Check",
    front_md:
      "The ATSI Child Health Check (MBS 715, under {{c1::15 years}}) includes growth tracking on {{c2::WHO 0-2 / CDC 2-18 charts}}, ear (otoscopy + tymp), eye (acuity + red reflex), developmental milestones and anaemia screen.",
    back_md:
      "Hearing screen mandatory given chronic suppurative otitis media prevalence. Vision screen ties into trachoma SAFE strategy. Iron studies + Hb at 9-12 months and 18 months. Catch-up immunisations via ACIR. Triggers item 81300-series allied-health referrals.",
    citation: "MBS Online item 715 · RACGP National Guide · NACCHO Child Health",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-006",
    specialty: "aboriginal_health",
    subtopic: "Rheumatic Heart Disease",
    front_md:
      "Secondary prophylaxis after acute rheumatic fever is {{c1::IM benzathine benzylpenicillin 1.2 million units every 4 weeks}}, continued for a minimum of {{c2::10 years or until age 21 (whichever is longer)}}.",
    back_md:
      "Jones criteria (2015): 2 major OR 1 major + 2 minor + evidence of recent strep. Majors — carditis (subclinical echo counts in high-risk populations), polyarthritis (mono in high-risk), chorea, erythema marginatum, subcutaneous nodules. NT/WA/Qld run echo-based RHD screening in high-prevalence ATSI communities. AU has world's highest reported ARF rates in remote ATSI children.",
    citation: "RHDAustralia Guideline 3.2 (2024) · CARPA STM 8th ed",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-007",
    specialty: "aboriginal_health",
    subtopic: "Chronic suppurative otitis media",
    front_md:
      "Chronic suppurative otitis media (perforation + discharge >{{c1::2 weeks}}) in an ATSI child is managed with twice-daily aural toilet plus topical {{c2::ciprofloxacin 0.3% drops}}.",
    back_md:
      "Affects up to 40% of children in some remote ATSI communities — WHO threshold for 'massive public health problem' is 4%. Mantis (lateral) position drainage by carer at home. Avoid aminoglycoside drops if perforation (ototoxicity). Refer for tympanoplasty if persistent. Language delay screening at every visit.",
    citation: "CARPA STM 8th ed · TG Antibiotic v17 (Otitis remote)",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-008",
    specialty: "aboriginal_health",
    subtopic: "Trachoma SAFE strategy",
    front_md:
      "Australia is the only {{c1::high-income country}} with endemic trachoma — control uses the WHO SAFE strategy: Surgery (trichiasis), {{c2::Antibiotics (single-dose azithromycin community-wide)}}, Facial cleanliness, Environmental improvement.",
    back_md:
      "Azithromycin 20 mg/kg PO single dose to entire community if active trachoma prevalence ≥5% in 5-9 year-olds (WHO threshold). 'Clean Faces, Strong Eyes' health-promotion model. Active trachoma prevalence in screened ATSI children has dropped from 14% (2009) to <4% (2022) under the National Trachoma Surveillance Program.",
    citation: "Communicable Diseases Network AU · CARPA STM · WHO SAFE",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-009",
    specialty: "aboriginal_health",
    subtopic: "Diabetes in ATSI",
    front_md:
      "Type 2 diabetes onset in ATSI Australians averages {{c1::10-20 years earlier}} than non-Indigenous, with retinopathy and {{c2::nephropathy}} progressing faster — RACGP National Guide recommends HbA1c plus ACR annually from age 18.",
    back_md:
      "MBS 715 anchors the cycle of care. PBS CTG copayment unlocks affordable metformin, SGLT2i, GLP-1RA. Target HbA1c 7.0% (53 mmol/mol) individualised; ACR >2.5 mg/mmol (M)/3.5 (F) → start ACEi/ARB. Annual retinal photo via Optometry CTG scheme; consider portable retinal camera in remote.",
    citation: "RACGP National Guide 4th ed · ADS-ADEA position · KHA-CARI",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-010",
    specialty: "aboriginal_health",
    subtopic: "CKD in ATSI",
    front_md:
      "For ATSI adults aged ≥18, the RACGP National Guide recommends annual CKD screening with {{c1::eGFR plus urine ACR plus BP}}, and early referral to nephrology when eGFR <{{c2::45 mL/min/1.73 m²}} or sustained albuminuria.",
    back_md:
      "ESKD rates are 4× non-Indigenous, 20× in remote NT/WA. Earlier dialysis referral, plan for arteriovenous fistula at eGFR ~20. Transplant disparity: ATSI patients waitlisted later, receive fewer transplants — addressed by Performance Report on Indigenous Transplantation (NIKTT). Discuss returning to country before dialysis commitment.",
    citation: "RACGP National Guide · KHA-CARI · ANZDATA",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-011",
    specialty: "aboriginal_health",
    subtopic: "STIs in remote ATSI",
    front_md:
      "Asymptomatic STI screening for sexually active ATSI adults in remote/high-prevalence regions: {{c1::dual-site NAAT (urine + throat or anorectal as indicated) for chlamydia & gonorrhoea}}, plus syphilis EIA and HIV — repeated {{c2::every 6-12 months}}.",
    back_md:
      "Infectious syphilis outbreak across NT/Qld/WA/SA since 2011 — congenital syphilis re-emerged. Antenatal syphilis serology at booking, 28w, 36w and delivery in outbreak zones. Partner notification via 'Let Them Know' / Contact Tracing Officer. Dual treatment (ceftriaxone + azithromycin or doxycycline) reserved for resistance settings — eTG remains 1st-line.",
    citation: "ASHM STI Management Guidelines · CARPA STM · National Syphilis Surveillance",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-012",
    specialty: "aboriginal_health",
    subtopic: "Hep B in ATSI",
    front_md:
      "Chronic hepatitis B prevalence in remote ATSI communities is up to {{c1::4×}} the non-Indigenous rate — universal infant vaccination plus {{c2::birth-dose HBV vaccine within 24 hours}} is the cornerstone, with screening of all ATSI adults at least once.",
    back_md:
      "Adults: HBsAg + anti-HBs + anti-HBc. Vaccinate susceptible. HBV/C genotype is the unique 'sub-genotype C4' in Northern Territory. Refer chronic HBV for biannual HCC surveillance (US + AFP) per ASHM; treat per AASLD/ASHM criteria. CTG copayment covers tenofovir/entecavir.",
    citation: "ASHM Hep B decision-making · National HBV Strategy · RACGP National Guide",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-013",
    specialty: "aboriginal_health",
    subtopic: "Social & Emotional Wellbeing",
    front_md:
      "ATSI mental health is best framed through the {{c1::Social and Emotional Wellbeing (SEWB)}} model — 7 interrelated domains including connection to body, mind, family, community, culture, Country and {{c2::spirituality/ancestors}}.",
    back_md:
      "SEWB broader than the biomedical DSM. Gee et al. (2014) framework underpins National Strategic Framework for ATSI Mental Health 2017-23. AMC examiners reward candidates who explore SEWB domains before reaching for DSM labels. K10 and aPHQ-9 (adapted) are validated screeners.",
    citation: "Gee et al. 2014 · National SEWB Framework 2017-23 · RACGP National Guide",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-atsi-014",
    specialty: "aboriginal_health",
    subtopic: "Suicide prevention",
    front_md:
      "Suicide is the leading cause of death for ATSI Australians aged {{c1::15-34}}, at rates roughly {{c2::2-3×}} non-Indigenous — community-led, culturally embedded models (e.g. ATSISPEP) outperform mainstream programs.",
    back_md:
      "Gatekeeper training (e.g. QPR adapted). Assess hopelessness, access to means, recent loss/Sorry Business, alcohol/cannabis use. Safety plan with family/cultural support person. Refer to ACCHO mental health team; 13YARN (13 92 76) is the national ATSI crisis line. AMC clinical: never discharge without a written safety plan + follow-up within 7 days.",
    citation: "ATSISPEP 2016 · National ATSI Suicide Prevention Strategy · 13YARN",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-atsi-015",
    specialty: "aboriginal_health",
    subtopic: "End-of-life & Sorry Business",
    front_md:
      "Culturally safe end-of-life care for an ATSI patient includes facilitating {{c1::return to Country}} where possible, accommodating extended-family bedside attendance and observing {{c2::Sorry Business}} (cultural mourning protocols).",
    back_md:
      "Ask permission before saying the deceased person's name; some communities avoid it for 12+ months. Coordinate with ACCHO, Aboriginal Liaison Officer and palliative care. Discuss autopsy/organ donation sensitively — practices vary by language group. Document Advance Care Directive with cultural support person.",
    citation: "Palliative Care AU · IPEPA program · RACGP National Guide",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-atsi-016",
    specialty: "aboriginal_health",
    subtopic: "Yarning and AHW role",
    front_md:
      "Yarning is an Indigenous conversational method used in clinical consultation — it is {{c1::non-linear, relational, story-based}}, and is best facilitated alongside an {{c2::Aboriginal Health Worker (AHW) or Aboriginal Health Practitioner (AHP)}}.",
    back_md:
      "AHPs are AHPRA-registered (since 2012) and can prescribe under supervision in some jurisdictions. Use the patient's preferred language; engage TIS National (1300 131 450) for Aboriginal English / Kriol if needed. Silence is meaningful — do not rush. Open with introductions (your mob/Country) when appropriate.",
    citation: "Bessarab & Ng'andu 2010 · NACCHO · AHPRA AHP register",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-atsi-017",
    specialty: "aboriginal_health",
    subtopic: "PBS CTG copayment",
    front_md:
      "Under the PBS Closing the Gap copayment scheme, eligible ATSI patients with (or at risk of) chronic disease pay {{c1::the concessional rate or nil}} for PBS medicines, after one-off practitioner registration via the {{c2::CTG prescription annotation}}.",
    back_md:
      "Eligibility: ATSI + chronic disease (or risk factors for it). Annotation 'CTG' on script; pharmacist applies reduced copay. Covers all PBS-listed meds including biologics, DAAs, insulin, antihypertensives. Massive equity lever — quote in any AMC mgmt answer for ATSI chronic disease.",
    citation: "PBS CTG scheme · RACGP National Guide",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-018",
    specialty: "aboriginal_health",
    subtopic: "Smoking cessation",
    front_md:
      "Smoking remains the leading preventable cause of ATSI mortality (~{{c1::20%}} of the gap). Pharmacotherapy: {{c2::NRT, varenicline, or bupropion}} — all PBS-listed under CTG, combined with behavioural support (Quitline 13 7848, Tackling Indigenous Smoking program).",
    back_md:
      "Use AUDIT-C alongside (alcohol screening) — co-occurrence is common. Brief intervention 5 A's: Ask, Advise, Assess, Assist, Arrange. Pregnant smokers: NRT preferred over varenicline (lack of pregnancy safety data). Refer to Tackling Indigenous Smoking workers via local ACCHO.",
    citation: "RACGP Supporting Smoking Cessation · TIS program · PBS CTG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-atsi-019",
    specialty: "aboriginal_health",
    subtopic: "Antenatal care",
    front_md:
      "The {{c1::Aboriginal Maternal & Infant Health Service (AMIHS)}} delivers culturally safe shared-care antenatal models that have reduced low-birth-weight rates and {{c2::preterm birth}} in NSW and Qld.",
    back_md:
      "Components: continuity of midwife + AHW, smoking cessation, antenatal syphilis screening (especially outbreak states), birth-dose HBV planning, RHD echo if indicated, mental health screen. MBS items 16590-91 (antenatal). Birthing on Country programs (e.g. Waminda) further reduce gap. Counsel folic acid + iodine; iron earlier given baseline anaemia.",
    citation: "NSW Health AMIHS · Birthing on Country · RACGP National Guide",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-atsi-020",
    specialty: "aboriginal_health",
    subtopic: "Safety net communication",
    front_md:
      "AMC safety-net for an ATSI patient discharged with a new chronic disease diagnosis: arrange follow-up with the {{c1::Aboriginal Community Controlled Health Organisation (ACCHO)}} within 1 week, register for {{c2::PBS CTG copayment}}, and document an AHW-supported teach-back of red flags.",
    back_md:
      "Always offer choice between mainstream GP and ACCHO. Provide written info in plain English (Year 6 reading level) or community-language resource. Confirm transport and phone access — remote dropout is the #1 reason follow-up fails. AMC examiners reward explicit naming of ACCHO + CTG + AHW.",
    citation: "AMC clinical examiner notes · NACCHO · RACGP National Guide",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
