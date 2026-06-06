import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 geriatric medicine high-yield.
// Mirrors flashcards-gastro.ts conventions — cloze ≤2, AU-cited, no fluff.
export const geriatricsFlashcards: Flashcard[] = [
  {
    id: "fc-geri-001",
    specialty: "geriatrics",
    subtopic: "Comprehensive Geriatric Assessment",
    front_md:
      "The Comprehensive Geriatric Assessment (CGA) spans four domains — {{c1::medical, functional, psychological, social}} — and is the cornerstone of evaluating frailty, falls, and aged-care entry under {{c2::My Aged Care / ACAT}}.",
    back_md:
      "CGA reduces mortality and aged-care home admission compared with usual care (Cochrane). Multidisciplinary: geriatrician, OT, PT, social worker, pharmacist. Outputs feed into a care plan, MBS GP Management Plan (item 721) or Aged Care Funding Instrument.",
    citation: "ANZSGM CGA · RACGP Aged Care · My Aged Care",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-002",
    specialty: "geriatrics",
    subtopic: "Frailty",
    front_md:
      "Fried's frailty phenotype is defined as ≥3 of {{c1::unintentional weight loss ≥5 kg/year, exhaustion, weakness (low grip strength), slow gait speed, low physical activity}}. Frailty independently predicts {{c2::falls, hospitalisation, mortality}}.",
    back_md:
      "Alternative: Rockwood Clinical Frailty Scale (1–9). Interventions: resistance + balance exercise (Otago program), nutrition optimisation, deprescribing, vitamin D, social engagement. Surgical risk stratification — frail patients benefit from prehabilitation.",
    citation: "ANZSGM frailty · Fried 2001 · Rockwood CFS",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-003",
    specialty: "geriatrics",
    subtopic: "Falls assessment",
    front_md:
      "A Timed Up-and-Go >{{c1::12 seconds}} indicates increased fall risk. Multifactorial falls assessment covers vision, postural BP, medications, cognition, gait + balance, footwear and {{c2::home hazards (OT home assessment via My Aged Care)}}.",
    back_md:
      "Falls affect ~1 in 3 ≥65 yr annually; ~50% of those who fall do so again within a year. Effective interventions: Otago / Stepping On exercise programs, cataract surgery, vitamin D if deficient, deprescribing benzodiazepines / antipsychotics, home modification. Refer fracture-risk patients for DEXA.",
    citation: "ACSQHC Falls Standard · ANZSGM · Otago",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-004",
    specialty: "geriatrics",
    subtopic: "Polypharmacy",
    front_md:
      "Polypharmacy is broadly defined as concurrent use of ≥{{c1::5 medications}}. Structured deprescribing tools include {{c2::STOPP/START criteria and the Beers list}} — identify potentially inappropriate medications and missed indicated therapy.",
    back_md:
      "High-yield anticholinergic burden meds (TCAs, oxybutynin, sedating antihistamines, antipsychotics) drive cognitive decline + falls. Home Medicines Review (HMR — MBS item 900) by accredited pharmacist subsidises annual review for community-dwelling patients on complex regimens.",
    citation: "STOPP/START v3 · ANZSGM · MBS HMR item 900",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-005",
    specialty: "geriatrics",
    subtopic: "Delirium",
    front_md:
      "Delirium screening at the bedside uses the {{c1::Confusion Assessment Method (CAM)}} — acute onset + fluctuating course + inattention + (disorganised thinking OR altered consciousness). First-line management is {{c2::identify and treat the precipitant + non-pharmacological measures}}.",
    back_md:
      "Common precipitants: infection (UTI, pneumonia), drugs (anticholinergic, benzo, opioid), constipation, urinary retention, electrolyte derangement, hypoxia. Use low-dose haloperidol 0.25–0.5 mg PRN only if severely agitated and risk of harm; avoid in Lewy body / Parkinson's — use quetiapine. Sustained orientation, family presence, day-night cues.",
    citation: "ACSQHC Delirium Standard · ANZSGM",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-006",
    specialty: "geriatrics",
    subtopic: "Dementia subtypes",
    front_md:
      "Differentiate dementia subtypes: {{c1::Alzheimer's (gradual amnestic onset), vascular (stepwise + vascular risk), Lewy body (fluctuating cognition + visual hallucinations + parkinsonism + REM sleep disorder), frontotemporal (behavioural / language change <65)}}. Cognitive screen — MoCA <{{c2::26/30}} suggests impairment.",
    back_md:
      "Workup: bloods (FBE, U&E, Ca, TFT, B12, folate, glucose, syphilis if risk), MRI brain, depression screen. MMSE has ceiling effect in mild disease — MoCA more sensitive. Driving cessation discussion early. Refer to memory clinic for formal diagnosis + family support.",
    citation: "RACGP dementia · Dementia Australia · ANZSGM",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-007",
    specialty: "geriatrics",
    subtopic: "Cholinesterase inhibitor",
    front_md:
      "Cholinesterase inhibitor (donepezil 5 mg, rivastigmine, galantamine) is PBS Authority for mild-to-moderate Alzheimer's; ongoing supply requires {{c1::documented MMSE 10–24 improvement / stabilisation at 12-week review}}. Memantine reserved for {{c2::moderate-to-severe disease (MMSE 10–14)}}.",
    back_md:
      "Common side effects: nausea, diarrhoea, bradycardia (check ECG/HR baseline), syncope, vivid dreams. Counsel families re: modest symptomatic benefit only — not disease-modifying. Discontinue once severe / institutionalised + no clear benefit.",
    citation: "PBS Authority · Dementia Australia",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-008",
    specialty: "geriatrics",
    subtopic: "BPSD",
    front_md:
      "Behavioural and psychological symptoms of dementia (BPSD) — agitation, wandering, hallucinations — should be managed with {{c1::non-pharmacological strategies first (music therapy, validation, structured routine, pain assessment)}}; atypical antipsychotic ({{c2::risperidone 0.25–0.5 mg}}) is last-resort and time-limited (≤12 weeks).",
    back_md:
      "Antipsychotics carry stroke + mortality black-box warning in dementia. Always exclude reversible drivers — pain (assess with PAINAD), constipation, UTI, polypharmacy. Dementia Behaviour Management Advisory Service (DBMAS) 1800-699-799 supports family + RACF staff nationally.",
    citation: "RACGP BPSD · DBMAS · ANZSGM",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-geri-009",
    specialty: "geriatrics",
    subtopic: "My Aged Care",
    front_md:
      "Australian aged-care entry pathway: contact {{c1::My Aged Care 1800-200-422}} → Regional Assessment Service for home-support, or Aged Care Assessment Team (ACAT) for Home Care Packages and {{c2::residential aged care entry}}.",
    back_md:
      "Commonwealth Home Support Programme = entry-level (cleaning, transport). Home Care Packages levels 1–4 fund increasing complex needs at home. Residential aged care requires ACAT approval. From mid-2025 the Support at Home program replaces HCP. CDC = consumer-directed care.",
    citation: "Department of Health AU · My Aged Care",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-geri-010",
    specialty: "geriatrics",
    subtopic: "Advance Care Planning",
    front_md:
      "Advance Care Planning documents — typically called {{c1::Advance Care Directive or Statement of Choices}} — capture treatment preferences while the patient has capacity. They must be completed BEFORE incapacity and use the {{c2::state-specific AHPRA-recognised form}}.",
    back_md:
      "Triggers: chronic illness, frailty, dementia diagnosis, RACF entry. Conversation framework: explore values, prognosis, specific scenarios (CPR, intubation, artificial nutrition). Substitute decision-maker formally appointed (Enduring Power of Attorney / Guardian). Copy to GP record, RACF and My Health Record.",
    citation: "Advance Care Planning Australia · ANZSGM",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-geri-011",
    specialty: "geriatrics",
    subtopic: "Postural hypotension",
    front_md:
      "Orthostatic / postural hypotension is a drop of ≥{{c1::20 mmHg systolic or 10 mmHg diastolic within 3 minutes of standing}}. Common offenders include antihypertensives, alpha-blockers, TCAs and {{c2::diuretics}} — review and deprescribe where possible.",
    back_md:
      "Non-pharmacological: rise slowly, compression stockings, increase salt + fluid (if no heart failure), head-of-bed elevation. Pharmacological adjuncts (midodrine, fludrocortisone) only if conservative fails. Major contributor to fall-fracture cascade.",
    citation: "ANZSGM · eTG Cardiovascular",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-012",
    specialty: "geriatrics",
    subtopic: "Pressure injury",
    front_md:
      "Pressure injury risk is screened with the {{c1::Braden or Norton scale}}. Prevention bundle: reposition every 2 hours (or 30-degree tilt), pressure-relieving mattress, nutrition optimisation, skin care, manage incontinence and {{c2::moisture-associated skin damage}}.",
    back_md:
      "Stages 1–4 + unstageable + deep tissue injury (NPIAP). Stage 3–4 requires wound-care specialist; off-load completely; dietitian for protein 1.2–1.5 g/kg, zinc, vitamin C. ACSQHC mandatory reportable when hospital-acquired. Indigenous patients in remote care may need air-transfer for stage 3+.",
    citation: "ACSQHC Pressure Injury Standard · NPIAP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-013",
    specialty: "geriatrics",
    subtopic: "Continence",
    front_md:
      "Urinary incontinence subtypes: {{c1::stress (post-void leak with cough/sneeze), urge (sudden urgency with detrusor overactivity), mixed, overflow (retention)}}. First-line for stress + urge is {{c2::pelvic floor muscle training (continence physiotherapist)}}; anticholinergics for urge with caution in elderly (cognitive impact).",
    back_md:
      "Always exclude reversible causes (DIAPPERS — Delirium, Infection, Atrophic vaginitis, Pharmacology, Psychological, Endocrine, Restricted mobility, Stool impaction). Tools: ICIQ-SF, bladder diary. Continence Foundation of Australia helpline 1800-330-066. Indwelling catheter is last resort.",
    citation: "Continence Foundation AU · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-014",
    specialty: "geriatrics",
    subtopic: "Constipation",
    front_md:
      "Geriatric constipation stepwise: assess with {{c1::Bristol Stool Chart}} + DRE; first-line is fibre + fluid + mobilisation; pharmacology starts with osmotic laxative ({{c2::macrogol / lactulose}}), then stimulant (senna), then prosecretory (lubiprostone) or PR enema for impaction.",
    back_md:
      "Always co-prescribe regular laxative with opioid analgesia (docusate + senna). Opioid-induced constipation refractory to standard laxatives: methylnaltrexone or naloxegol (PBS Authority). Faecal impaction can present as 'overflow diarrhoea' in dementia.",
    citation: "eTG Gastrointestinal · ANZSGM",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-015",
    specialty: "geriatrics",
    subtopic: "Sarcopenia + nutrition",
    front_md:
      "Sarcopenia is screened with {{c1::SARC-F questionnaire (≥4 suggests sarcopenia)}}. Recommended protein intake in older adults is {{c2::1.0–1.2 g/kg/day (1.2–1.5 if acute illness)}}, alongside resistance exercise.",
    back_md:
      "Malnutrition screening with MNA-SF in community + hospital. Refer Accredited Practising Dietitian under CDM plan (5 sessions / year). Oral nutritional supplements for documented loss >5% body weight in 6 months. Treat reversible causes — dentition, dysphagia, depression, dementia (4 D's).",
    citation: "ESPEN sarcopenia · Dietitians Australia · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-geri-016",
    specialty: "geriatrics",
    subtopic: "Driving + cognition",
    front_md:
      "Medical fitness to drive in older Australians is judged against the {{c1::Austroads 'Assessing Fitness to Drive' standards}}. Patients with dementia / significant cognitive impairment usually require an {{c2::on-road occupational therapy driving assessment}} before licence decision.",
    back_md:
      "GPs in NSW/QLD/WA/SA/TAS/ACT/NT/VIC have notification obligations to driver licensing authority (state-specific). Document the conversation in the clinical record. Loss of licence is a major bereavement — discuss alternatives (community transport, taxi voucher schemes, family).",
    citation: "Austroads Assessing Fitness to Drive · RACGP",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
