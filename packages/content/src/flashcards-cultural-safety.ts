import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 cultural safety,
// LGBTQI+ inclusive care, refugee + CALD health, interpreter use, religious
// considerations, FGC and trauma-informed care — AU regulator-mandated content
// that no US/UK platform builds for. Mirrors flashcards-gastro conventions —
// cloze ≤2, AU-cited, no fluff.
export const culturalSafetyFlashcards: Flashcard[] = [
  {
    id: "fc-cultural-001",
    specialty: "cultural_safety",
    subtopic: "Cultural safety vs competence vs awareness",
    front_md:
      "Per the AHPRA 2020 Code of Conduct, {{c1::cultural safety is judged by the patient/consumer of care}}, while cultural competence is a clinician-defined skill set — all registered health practitioners must demonstrate {{c2::cultural safety CPD}} since the March 2020 update.",
    back_md:
      "Awareness → sensitivity → competence → safety. Safety requires the clinician to examine power, privilege, racism and bias — a self-reflective practice, not a tick-box. National Scheme covers all 16 regulated professions. Document patient feedback as evidence of CPD reflection.",
    citation: "AHPRA Cultural Safety Code (Mar 2020) · NSQHS Standard 2 v2.0",
    mark_sheet_domain: "communication",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-cultural-002",
    specialty: "cultural_safety",
    subtopic: "LGBTQI+ inclusive care",
    front_md:
      "Inclusive intake includes asking {{c1::pronouns + gender identity + sex recorded at birth (the '2-step' question)}}; gender-affirming oestrogen or testosterone is initiated under the AU informed-consent model after referral to a {{c2::gender clinic / experienced GP}}.",
    back_md:
      "AusPATH Standards of Care (2022). Avoid pathologising; transition is a normal variant of human experience. Pre-initiation work-up: baseline bloods, BP, BMI, smoking, fertility counselling, mental health screen. Display rainbow lanyard / inclusive signage. Use the patient's chosen name even if not yet legally changed.",
    citation: "AusPATH SoC 2022 · RACGP LGBTI Healthy Communities",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-cultural-003",
    specialty: "cultural_safety",
    subtopic: "Refugee Health Assessment",
    front_md:
      "The MBS Refugee Health Assessment (items {{c1::701-707}}) is a one-off comprehensive review available within {{c2::12 months of arrival}}, covering communicable disease screen, nutritional status, mental health and catch-up immunisation.",
    back_md:
      "Recommended screening: latent TB (IGRA, plus CXR), HBV/HCV/HIV, schistosoma + strongyloides serology, faecal OCP ×3, Hb + iron + B12 + folate + vit D, lead in children, RhD + rubella. Catch-up via ACIR. Refer to ASID/RHN tropical/refugee health network for complex cases. Free interpreter via TIS.",
    citation: "ASID-RHN Refugee Health Guidelines · MBS Online · RACGP",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-cultural-004",
    specialty: "cultural_safety",
    subtopic: "TIS National interpreter",
    front_md:
      "Translating & Interpreting Service (TIS National, {{c1::131 450}}) is funded {{c2::free of charge to private medical practitioners}} for CALD consultations; face-to-face is preferred for complex consults, phone for urgent/short, video for remote.",
    back_md:
      "Never use family (especially children) as interpreters for medical content — confidentiality, accuracy and consent concerns. Doctors Priority Line for time-critical calls. NAATI-credentialed interpreters only. Address the patient, not the interpreter. Document interpreter name/ID + language + modality in the notes.",
    citation: "Dept of Home Affairs TIS · RACGP CALD guide",
    mark_sheet_domain: "communication",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-cultural-005",
    specialty: "cultural_safety",
    subtopic: "Consent across cultures",
    front_md:
      "When a CALD patient defers to family for decisions, the clinician must still confirm {{c1::individual decision-making capacity and voluntariness}} — direct the consent conversation to the patient via interpreter while {{c2::respecting their preference for family involvement}}.",
    back_md:
      "Capacity (per AU common law / state guardianship Acts) is decision-specific. Document whom the patient wants present. Check coercion (especially with female patients, domestic-violence concerns). Substituted decision-making applies only after a formal capacity finding. Religious/cultural views may shape, but cannot replace, valid consent.",
    citation: "AU common law (Re T) · NHMRC Consent Guidelines · NSW Guardianship Act 1987",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-cultural-006",
    specialty: "cultural_safety",
    subtopic: "Health literacy",
    front_md:
      "The single most evidence-based health-literacy intervention is the {{c1::teach-back method}} — ask the patient to repeat back the plan in their own words — paired with {{c2::plain language (Year 6 reading level)}} and avoidance of medical jargon.",
    back_md:
      "Approx 60% of AU adults have below-adequate health literacy. Use the Newest Vital Sign or single-item screener if formal screening required. Written info in community language; visual aids; chunk + check. Document teach-back outcome in notes for AMC marks.",
    citation: "AIHW Health Literacy 2018 · ACSQHC NSQHS Std 2",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-cultural-007",
    specialty: "cultural_safety",
    subtopic: "Trauma-informed care (asylum seekers)",
    front_md:
      "SAMHSA's 6 principles of trauma-informed care are: {{c1::Safety, Trustworthiness, Peer support, Collaboration, Empowerment, Cultural/Historical/Gender humility}} — applied especially in asylum-seeker, refugee and {{c2::torture/trauma}} presentations.",
    back_md:
      "Avoid retraumatisation: never demand the trauma story before therapeutic relationship. Use specialist services (Foundation House Vic, STARTTS NSW, QPASTT Qld, ASeTTS WA). Beware sleep, somatic, dissociative presentations. Screen for current safety / detention experiences. Free MBS GPMHTP + extended psychology Medicare for refugees.",
    citation: "SAMHSA TIC 2014 · Forum of Australian Services for Survivors of Torture & Trauma (FASSTT)",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-cultural-008",
    specialty: "cultural_safety",
    subtopic: "Disability + cultural intersection",
    front_md:
      "{{c1::NDIS}} access for CALD patients requires an eligible disability + permanence, with reasonable & necessary supports — communication adjustments (interpreter, AAC, Easy Read) are funded as {{c2::capacity-building or core supports}}.",
    back_md:
      "Local Area Coordinators help with access; Disability Advocacy Network AU for navigation. Use plain language. Allow longer consults — claim level-D / level-E MBS item. Consider co-occurring trauma in refugees with acquired disability. Carers may also be eligible for Carer Payment / Allowance.",
    citation: "NDIS Act 2013 · National Disability Strategy · MBS Levels C/D",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-cultural-009",
    specialty: "cultural_safety",
    subtopic: "Religious considerations",
    front_md:
      "During Ramadan, Muslim patients with diabetes typically need {{c1::dose-reduction or rescheduling of insulin / sulfonylureas to dusk meal (iftar)}} — Jehovah's Witnesses may refuse {{c2::whole blood and major components (RBC, platelets, plasma)}} but often accept albumin, cell-salvage, and recombinant factors.",
    back_md:
      "Pre-Ramadan diabetes assessment (IDF-DAR risk stratification). Always confirm individual JW patient's specific position in writing (advance directive). Porcine-derived heparin / porcine valve — discuss with patient; halal/kosher concerns sometimes overridden in life-saving contexts. Document the conversation.",
    citation: "IDF-DAR Practical Guidelines · ANZSBT JW Statement · RACGP",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-cultural-010",
    specialty: "cultural_safety",
    subtopic: "Female Genital Cutting (FGC)",
    front_md:
      "Female Genital Cutting / Mutilation is a {{c1::criminal offence in every Australian state and territory}}, including taking a child overseas for the procedure — antenatal assessment of FGC requires referral to a {{c2::specialist FGC / women's health clinic}} for de-infibulation planning.",
    back_md:
      "WHO classification: Type I (clitoridectomy), II (excision), III (infibulation), IV (other). Mandatory reporting if a child is at risk. Use non-judgmental terminology — many women describe it as 'cut' or 'closed'. Family Planning AU, FARREP (Vic) provide culturally-safe care. Antenatal de-infibulation usually at 20-28w.",
    citation: "WHO FGM Classification · NSW Health FGC Policy · Family Planning AU",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-cultural-011",
    specialty: "cultural_safety",
    subtopic: "End-of-life across faiths",
    front_md:
      "Organ donation views vary widely — most major faiths (including Islam, Judaism, Buddhism, Hinduism, most Christian denominations) {{c1::permit or actively encourage donation}}, but the family conversation must explicitly invite {{c2::religious or community advisor}} input.",
    back_md:
      "Autopsy: religious objection common in Islam, Orthodox Judaism (delay burial considerations); coronial autopsy may proceed by law but discuss minimal-invasive imaging-based autopsy. Sorry Business for ATSI patients (see ATSI deck). Document Advance Care Directive in shared eHealth record.",
    citation: "DonateLife AU · Palliative Care AU · RACGP Advance Care Planning",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-cultural-012",
    specialty: "cultural_safety",
    subtopic: "Mental Health Act + cultural advocate",
    front_md:
      "When involuntarily detaining an ATSI or CALD patient under a state Mental Health Act, the clinician must engage a {{c1::nominated person, cultural assessor or Aboriginal mental health worker}} — failure to do so may invalidate the {{c2::treatment order}} on review.",
    back_md:
      "NSW MHA 2007 ss15-19 require attention to culture, religion and language. Use interpreter for assessment + capacity. Cultural assessor explains involuntary treatment in cultural framework. Document offers of family/community involvement. Mental Health Review Tribunal reviews orders within 14 days.",
    citation: "NSW Mental Health Act 2007 · Vic MHWA 2022 · RANZCP cultural statement",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-cultural-013",
    specialty: "cultural_safety",
    subtopic: "Domestic violence in CALD",
    front_md:
      "CALD women face additional DV barriers: visa dependence on perpetrator, language, isolation, fear of community gossip — disclosure rates rise with {{c1::routine non-judgmental enquiry by a female clinician via a same-gender interpreter}} and {{c2::1800RESPECT / inTouch (Vic) / Immigrant Women's Speakout (NSW)}} referrals.",
    back_md:
      "Family violence provisions of the Migration Act allow partner-visa applicants to remain in AU after relationship breakdown if DV is documented — refer to a Migration Information Service or community legal centre. Safety plan, document injuries with photos (consent). Mandatory child-safety report if children exposed.",
    citation: "ANROWS · 1800RESPECT · Migration Act family-violence provisions",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-cultural-014",
    specialty: "cultural_safety",
    subtopic: "Children of CALD parents",
    front_md:
      "Migrant + refugee children require {{c1::AIR (Australian Immunisation Register) review and catch-up schedule}} per the National Immunisation Handbook — combined with the {{c2::Immigration Health Assessment}} and trauma-informed paediatric review.",
    back_md:
      "Check Hb + iron + vit D + lead. Developmental screening with cultural sensitivity (Parent's Evaluation of Developmental Status). Hearing + vision screen. School enrolment medical. Catch-up MMR, varicella, polio, dTpa, HPV. ASCIA allergy review for children newly arrived from low-prevalence regions.",
    citation: "National Immunisation Handbook · ASID-RHN · Department of Home Affairs",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-cultural-015",
    specialty: "cultural_safety",
    subtopic: "Sexual health + CALD equity",
    front_md:
      "Sexual-health barriers in CALD communities (shame, stigma, partner-notification fear) are reduced by {{c1::female clinician + same-gender interpreter + private waiting space}} — HIV PrEP is PBS-listed and {{c2::available regardless of Medicare status via s100 or compassionate access}}.",
    back_md:
      "PrEP (tenofovir-emtricitabine) — daily or on-demand (2-1-1). PEP within 72 h. Many CALD communities under-tested for STIs; opportunistic offer at every visit. Partner notification anonymous via Let Them Know. Sex-worker outreach via Scarlet Alliance state branches.",
    citation: "ASHM PrEP Guidelines · Scarlet Alliance · MSHC · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-cultural-016",
    specialty: "cultural_safety",
    subtopic: "AMC safety-net for CALD",
    front_md:
      "Safety-net for a CALD patient discharged with new chronic disease: schedule {{c1::interpreter-mediated follow-up within 1-2 weeks}}, provide written info in {{c2::the patient's preferred language}} (NSW Multicultural Health Communication Service / Health Translations Vic), and confirm via teach-back.",
    back_md:
      "Always document the interpreter used, the materials provided in language, and the teach-back outcome. Provide an after-hours number patient can call with interpreter access. Cultural follow-up may require a community-controlled health service or settlement nurse referral.",
    citation: "AMC clinical examiner notes · NSW MHCS · Health Translations Vic",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
