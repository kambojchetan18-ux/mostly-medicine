import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 rural & remote medicine —
// an AU-specific moat domain (ACRRM/RACGP-FARGP pathway, MM1-MM7 incentives,
// envenomation, tropical infections, RFDS retrieval). Mirrors flashcards-gastro
// conventions — cloze ≤2, AU-cited, no fluff.
export const ruralFlashcards: Flashcard[] = [
  {
    id: "fc-rural-001",
    specialty: "rural_remote",
    subtopic: "Rural Generalist Pathway",
    front_md:
      "The Rural Generalist (RG) pathway in Australia is delivered by {{c1::ACRRM (FACRRM) and RACGP (FARGP)}} via AGPT-funded placements, with at least 12 months of {{c2::Advanced Skills Training (AST)}} in obstetrics, anaesthetics, surgery, emergency, mental health, paediatrics, Indigenous health or palliative care.",
    back_md:
      "Total ACRRM training is 4 years (3 core + 1 AST). RG is now a recognised specialty under AHPRA (2023). FARGP requires additional rural skill modules on top of FRACGP. Both colleges accredit each other's AST posts. AGPT bonded placements lock IMGs into MM2-MM7 catchments for the 19AB moratorium period.",
    citation: "ACRRM Training Program · RACGP-FARGP Handbook · AGPT",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-002",
    specialty: "rural_remote",
    subtopic: "Modified Monash Model",
    front_md:
      "The Modified Monash Model classifies locations from {{c1::MM1 (metro)}} to {{c2::MM7 (very remote)}} — MM2 is large regional (~50k+), MM3-MM5 progressively smaller rural towns, MM6 remote, MM7 very remote.",
    back_md:
      "Drives Workforce Incentive Program (WIP-Doctor Stream) loadings, AGPT bonus payments, HELP debt reduction (RHELP) and rural bulk-billing incentive (item 10990). DPA (Distribution Priority Area) status is separately assessed and gates 19AB moratorium release.",
    citation: "Dept of Health AU MMM 2019 · WIP Doctor Stream",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-003",
    specialty: "rural_remote",
    subtopic: "RVTS",
    front_md:
      "The {{c1::Remote Vocational Training Scheme (RVTS)}} provides distance-supervised FRACGP/FACRRM training for doctors working in remote single-doctor or {{c2::Aboriginal Medical Service}} posts who cannot relocate to a training practice.",
    back_md:
      "Targeted streams: Remote/AMS stream and Tarrant (overseas-trained junior doctor) stream. Weekly tele-supervision, in-practice teaching visits, peer learning. RVTS-trained registrars can prescribe and bill independently from day one — a key option for IMGs serving the 10-year moratorium in DPA.",
    citation: "RVTS Program Handbook · ACRRM · RACGP",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-004",
    specialty: "rural_remote",
    subtopic: "19AB moratorium",
    front_md:
      "Section 19AB of the Health Insurance Act restricts overseas-trained doctors from accessing Medicare provider numbers in metro AU for {{c1::10 years}} unless they work in a {{c2::Distribution Priority Area (DPA) or District of Workforce Shortage (DWS)}}.",
    back_md:
      "Scaling (Bonded Reduction Scheme) — credit accrues with rural service: MM2 cuts 1 yr off, MM3-4 cut 2 yr, MM5 cuts 3 yr, MM6-7 cut 5 yr. Combine with the Workforce Incentive Program loading. RVTS + AGPT Rural Pathway are the two compliant training streams.",
    citation: "Health Insurance Act 1973 s19AB · DoH Bonded Programs",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-005",
    specialty: "rural_remote",
    subtopic: "Rural telehealth",
    front_md:
      "MBS telehealth items {{c1::91790-92127 (video) and 91891-91913 (phone)}} support rural GP consultation; phone is restricted to existing patients with an established relationship except for {{c2::after-hours, mental health, and ATSI patients in MM6-7}}.",
    back_md:
      "Store-and-forward teledermatology supported by ACRRM dermatology network. Tele-stroke (NSW) and tele-ICU (Qld) services reduce retrieval load. Royal Flying Doctor Service runs 24/7 tele-medical consult line for remote GPs and station owners. Document modality + duration + consent.",
    citation: "MBS Online · ACRRM Tele-derm · RFDS Tele-medical",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-006",
    specialty: "rural_remote",
    subtopic: "RFDS retrieval",
    front_md:
      "RFDS aeromedical retrieval is activated through a {{c1::24/7 Medical Officer phone line}} — primary retrieval criteria include haemodynamic instability, GCS <13, suspected MI/stroke, obstetric emergency, severe envenomation, and any patient requiring {{c2::definitive care beyond local capability}}.",
    back_md:
      "Handover uses ISBAR. Pre-flight checklist: secure airway, IV access ×2, decompress pneumothorax (Boyle's law — air expands ~30% at cruise altitude), empty NG/Foley, foetal HR documented. Pressure changes worsen bowel obstruction, gas-containing CT contrast, ocular gas. Coordinate with retrieval registrar before sedation.",
    citation: "RFDS Operating Standards · Australasian Soc of Aerospace Medicine",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-rural-007",
    specialty: "rural_remote",
    subtopic: "Single-doctor town",
    front_md:
      "In a single-doctor town the threshold for escalating to a referral/retrieval consult is {{c1::deliberately low}} — sepsis, head injury with any LOC, suspected obstetric emergency or acute psychosis should trigger a consult call within {{c2::15-30 minutes}} of presentation.",
    back_md:
      "Use ISBAR. Stabilise then transfer; don't await a definitive diagnosis. Document attempts to contact retrieval. Use the local hospital ED telehealth-linked specialist as first port; RFDS or state retrieval (NETS NSW, ARV Vic, RSQ Qld, MedSTAR SA, WACHS WA) for transport. AMC examiners reward early call + documented plan, not solo heroics.",
    citation: "ACRRM Rural Curriculum · CARPA STM · State retrieval services",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-rural-008",
    specialty: "rural_remote",
    subtopic: "Rural mental health access",
    front_md:
      "Limited psychiatry access in MM5-7 is bridged by {{c1::Better Access Telehealth items (91166/91167 etc)}} and the {{c2::Head to Health}} platform — supplemented by RFDS mental-health clinician visits and ATAPS-equivalent PHN-commissioned services.",
    back_md:
      "Up to 10 MBS-rebated psychology sessions per calendar year via Mental Health Treatment Plan (item 2700/2715). Lifeline 13 11 14 and 13YARN (ATSI) for crisis. Document risk + safety plan + warm handover. Distance + stigma + identifiable community → tailor confidentiality discussion.",
    citation: "MBS Better Access · Head to Health · PHN MH Stepped Care",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-rural-009",
    specialty: "rural_remote",
    subtopic: "Rural maternity transfer",
    front_md:
      "When the nearest birthing service closes, antenatal pathway escalates to {{c1::shared care with a regional or tertiary obstetric unit}}, with planned transfer at {{c2::36-38 weeks}} for low-risk pregnancies and earlier for high-risk.",
    back_md:
      "BBA (Born Before Arrival) protocols: warm, dry, delayed cord clamp 1-3 min, skin-to-skin, Vit K, anti-D if indicated. Transfer mother + neonate together. Activate retrieval for postpartum haemorrhage, prematurity <34/40, suspected sepsis. Birthing on Country options for ATSI women preserve cultural safety.",
    citation: "RANZCOG Rural & Remote Statement · CARPA STM Maternity",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-rural-010",
    specialty: "rural_remote",
    subtopic: "Disaster mental health",
    front_md:
      "After bushfire, flood or drought the first-line community mental-health response is {{c1::Psychological First Aid (PFA)}} — listen, link, comfort, protect — not formal debriefing, which can {{c2::worsen PTSD risk}}.",
    back_md:
      "Refer ongoing distress at 4-6 weeks: trauma-focused CBT, EMDR. STARTTS (NSW) and equivalent services support refugees + disaster survivors. Suicide risk rises in farmers during prolonged drought — Rural Adversity Mental Health Program (NSW), MATES in Construction (rural builders). Engage with community resilience networks.",
    citation: "WHO PFA Field Guide · Phoenix Australia · RAMHP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-rural-011",
    specialty: "rural_remote",
    subtopic: "Snake bite",
    front_md:
      "Pre-hospital first aid for any suspected Australian snake bite is the {{c1::Pressure-Immobilisation Bandage (PIB)}} from the bite site upward over the whole limb + splint — keep the patient {{c2::completely still}} and transport supine.",
    back_md:
      "Do NOT wash the bite (venom on skin guides SVDK choice). Mark bite site through bandage. Bloods: VICC panel — INR, aPTT, fibrinogen, D-dimer, CK, U&E. Polyvalent antivenom if specific species unknown; SVDK guides monovalent (brown, tiger, taipan, black, death adder). Re-bleed at 24h. Tetanus prophylaxis. Brown snake = main killer in AU.",
    citation: "TG Antibiotic / Toxicology · CARPA STM · WHO Snakebite Manual",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-012",
    specialty: "rural_remote",
    subtopic: "Spider bite",
    front_md:
      "Funnel-web spider bite requires {{c1::pressure-immobilisation + funnel-web antivenom}}, whereas red-back spider bite is managed with {{c2::ice, analgesia and observation — PIB is NOT recommended}}.",
    back_md:
      "Red-back antivenom (IV) considered only for severe, refractory pain despite opioids — RAVE-II trial showed marginal benefit. Funnel-web (Sydney, Northern, Southern Tree-dwelling): tachycardia, sweating, fasciculations, pulmonary oedema — give antivenom early. White-tail spider does NOT cause necrotic arachnidism (myth).",
    citation: "TG Toxicology · Isbister RAVE-II Lancet 2014 · ACEM",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-013",
    specialty: "rural_remote",
    subtopic: "Marine envenomation",
    front_md:
      "First aid for box jellyfish (Chironex) sting is {{c1::douse with vinegar for ≥30 seconds}}, then CPR + IV antivenom — for Irukandji (Carukia) the priority is {{c2::IV analgesia (opioids) and magnesium}}, antivenom is NOT specific.",
    back_md:
      "Box jellyfish — cardiac arrest within minutes, antivenom CSL. Irukandji — delayed (5-40 min) catecholamine surge: severe pain, hypertension, pulmonary oedema. Blue-ringed octopus (TTX) — no antidote, supportive ventilation. Stonefish — hot water immersion 45 °C for 30-90 min, antivenom for severe pain. Bluebottle — hot water, NOT vinegar.",
    citation: "TG Toxicology · ACEM · Surf Life Saving AU",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-014",
    specialty: "rural_remote",
    subtopic: "Tropical infections NT/Qld",
    front_md:
      "Empirical antibiotics for suspected severe community-acquired pneumonia or sepsis in tropical northern Australia must cover {{c1::Burkholderia pseudomallei (melioidosis)}} with {{c2::IV ceftazidime or meropenem}}.",
    back_md:
      "Risk: diabetes, ETOH, CKD, monsoon season, soil/water exposure. Eradication phase: TMP-SMX + folic acid for 3 months. Ross River, Barmah Forest — arthralgic alphaviruses, supportive. Dengue (NQ) — fluid resuscitation, no aspirin/NSAID. Murray Valley encephalitis — supportive. Leptospirosis — doxycycline. JE vaccine post-2022 Murray Basin outbreak.",
    citation: "TG Antibiotic v17 (Tropical) · CARPA STM · CDNA SoNG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-015",
    specialty: "rural_remote",
    subtopic: "Heat illness",
    front_md:
      "Heat stroke (core T >40°C + altered mental state) requires {{c1::aggressive cooling targeting core T <39°C within 30 minutes}} — ice-water immersion is the most effective method when available — vs heat exhaustion which responds to rest, oral/IV {{c2::isotonic fluids}}.",
    back_md:
      "Mortality of untreated exertional heat stroke approaches 80%. Avoid aspirin/paracetamol (do not lower hypothalamic set-point in heat stroke). Monitor for rhabdomyolysis (CK, K+), AKI, DIC. Outback workers, athletes, elderly without air-con are high-risk groups.",
    citation: "Sports Medicine AU · TG Toxicology · ACEM",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-016",
    specialty: "rural_remote",
    subtopic: "Outback trauma resuscitation",
    front_md:
      "Damage-control resuscitation in remote trauma uses {{c1::permissive hypotension (SBP ~80-90, or 100 with TBI)}} until bleeding is controlled, plus {{c2::tranexamic acid 1 g IV within 3 hours}} and balanced blood products.",
    back_md:
      "CRASH-3 (TXA, TBI), CRASH-2 (TXA, bleeding) — earlier = better. Limit crystalloid (≤1 L). Activate massive transfusion if available; warm fluids. Pelvic binder for unstable pelvis. RFDS retrieval with blood on board. eFAST + chest decompression at the bedside.",
    citation: "CRASH-2/3 trials · Australian Trauma Quality Improvement Program",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-017",
    specialty: "rural_remote",
    subtopic: "Rural drug supply",
    front_md:
      "Highly specialised drugs (e.g. HIV ART, hep B/C antivirals, growth hormone) in remote AU are dispensed under {{c1::PBS Section 100}}, often via hospital pharmacy or {{c2::ACCHO}} — not standard community pharmacy.",
    back_md:
      "RVTS / ACRRM-trained rural doctors can register as authorised prescribers for many s100 streams. CARPA STM lists locally-stocked alternatives. Limited stock = consider longer scripts, multi-week supply, and arranging proxy collection. Anticipate cyclone/road-closure season stock-out planning.",
    citation: "PBS Schedule s100 · CARPA STM · RVTS prescribing",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-018",
    specialty: "rural_remote",
    subtopic: "PESCI for IMGs",
    front_md:
      "Before AHPRA limited registration in a remote DPA post, an IMG must complete the {{c1::Pre-Employment Structured Clinical Interview (PESCI)}} — administered by ACRRM or RACGP — to confirm safety for the proposed scope of practice.",
    back_md:
      "Mandatory for SIMG (Specialist) and the Standard pathway in 'positions of greater complexity'. Tests history, exam, mgmt and safety net in 6-8 OSCE stations. Failure pathways: retake, restricted scope, or alternate role. Fee ~$2,500-$3,500. PESCI outcome is shared with AHPRA + employer + the relevant college.",
    citation: "ACRRM PESCI · RACGP PESCI · AHPRA registration",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rural-019",
    specialty: "rural_remote",
    subtopic: "Clinical judgement under uncertainty",
    front_md:
      "The RACGP/ACRRM Rural Curriculum emphasises decision-making with {{c1::limited investigations, no on-site specialist}}, and reliance on phone/tele-consult — the safe practitioner names uncertainty explicitly, documents the {{c2::differential and reasoning, and arranges short-interval review}}.",
    back_md:
      "Tools: SNAPPS (Summarise, Narrow, Analyse, Probe, Plan, Select), red-flag teach-back to patient, written safety net. Communicate with isolated colleagues via Project ECHO, GPRA learning networks, and college peer-review groups. Always escalate when the diagnosis would change management materially.",
    citation: "ACRRM Rural Curriculum · RACGP Rural Curriculum Framework",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-rural-020",
    specialty: "rural_remote",
    subtopic: "AHW collaboration in rural ATSI care",
    front_md:
      "In rural ATSI care, the {{c1::Aboriginal Health Worker / Aboriginal Health Practitioner (AHP)}} is the cultural broker and often the patient's primary point of contact — escalation pathway is {{c2::AHW → rural GP → RFDS / retrieval consultant}}.",
    back_md:
      "AHPs are AHPRA-registered, can administer scheduled meds under protocol, run chronic-disease cycles of care, and lead community education. Co-consultation models improve attendance and adherence. Always seek AHW input before discharge planning to confirm cultural safety + transport + medication access.",
    citation: "AHPRA AHP register · NACCHO · CARPA STM",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
