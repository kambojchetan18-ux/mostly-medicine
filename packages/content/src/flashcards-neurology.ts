import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 neurology high-yield.
// Mirrors flashcards-cardiology.ts conventions — cloze ≤2, AU-cited, no fluff.
export const neurologyFlashcards: Flashcard[] = [
  {
    id: "fc-neuro-001",
    specialty: "neurology",
    subtopic: "Acute stroke recognition",
    front_md:
      "Pre-hospital stroke screening in Australia uses the {{c1::FAST}} mnemonic — Face droop, Arm weakness, Speech disturbance, Time critical — to trigger {{c2::Code Stroke}} activation and bypass to a thrombolysis-capable centre.",
    back_md:
      "Stroke Foundation Australia clinical guidelines emphasise FAST for community recognition and NIHSS in ED for severity (≥6 suggests large-vessel occlusion). 'Time is brain' — every minute of LVO ischaemia loses ~1.9 million neurons.",
    citation: "Stroke Foundation Australia · NHF Clinical Guidelines",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-002",
    specialty: "neurology",
    subtopic: "Thrombolysis window",
    front_md:
      "IV alteplase (tPA) for acute ischaemic stroke in Australia is indicated within {{c1::4.5 hours}} of symptom onset, after CT excludes haemorrhage and inclusion/exclusion criteria are checked.",
    back_md:
      "Endovascular thrombectomy is offered for proven large-vessel occlusion up to 6 hours from onset (and 6–24 hours in selected patients meeting DAWN/DEFUSE-3 perfusion-imaging criteria). Tenecteplase is now equivalent first-line at many AU centres.",
    citation: "Stroke Foundation Australia · NHF guidelines",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-003",
    specialty: "neurology",
    subtopic: "Stroke BP targets",
    front_md:
      "Pre-thrombolysis blood pressure must be lowered below {{c1::185/110 mmHg}}; after successful reperfusion or in haemorrhagic conversion, target SBP <{{c2::140 mmHg}} for the first 24 hours.",
    back_md:
      "Use titratable IV labetalol or GTN — avoid large drops which extend the penumbra. In untreated ischaemic stroke, permissive hypertension up to 220/120 is tolerated for 24 hours. INTERACT-3 supports early intensive BP lowering in ICH.",
    citation: "Stroke Foundation Australia · INTERACT-3",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-004",
    specialty: "neurology",
    subtopic: "TIA assessment",
    front_md:
      "After a suspected TIA, the ABCD² score has {{c1::limited predictive value}} in isolation — AU guidelines recommend {{c2::urgent assessment in a TIA clinic within 24 hours}} regardless of score.",
    back_md:
      "All TIA patients get aspirin 300 mg loading, urgent carotid imaging, ECG (paroxysmal AF), and brain imaging. CHANCE/POINT evidence supports 21-day dual antiplatelet (aspirin + clopidogrel) for high-risk TIA or minor stroke (NIHSS ≤3).",
    citation: "Stroke Foundation Australia · CHANCE/POINT trials",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-005",
    specialty: "neurology",
    subtopic: "Stroke secondary prevention",
    front_md:
      "Secondary prevention after non-cardioembolic ischaemic stroke includes {{c1::long-term antiplatelet (aspirin or clopidogrel), high-intensity statin, and BP control <130/80}}; AF stroke requires lifelong {{c2::DOAC anticoagulation}} instead.",
    back_md:
      "DOAC (apixaban/rivaroxaban/dabigatran) preferred over warfarin in non-valvular AF — start 2–14 days post-stroke depending on infarct size. Atorvastatin 40–80 mg or rosuvastatin 20–40 mg regardless of baseline LDL. Manage diabetes, smoking, OSA.",
    citation: "Stroke Foundation Australia · NHF · eTG Neurology",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-006",
    specialty: "neurology",
    subtopic: "Stroke ATSI disparity",
    front_md:
      "Aboriginal and Torres Strait Islander Australians experience stroke at approximately {{c1::twice the rate}} of non-Indigenous Australians and at a {{c2::younger mean age (~10 years)}}.",
    back_md:
      "Drivers include higher prevalence of hypertension, diabetes, smoking, rheumatic heart disease and AF. NHF and Stroke Foundation prioritise culturally safe primary prevention via ACCHOs, the absolute CVD risk calculator (recalibrated for ATSI) and yearly health checks under MBS 715.",
    citation: "NHF AU · Stroke Foundation 2023 audit · RACGP National Guide",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-neuro-007",
    specialty: "neurology",
    subtopic: "Seizure classification",
    front_md:
      "ILAE 2017 framework classifies seizures by onset: {{c1::focal, generalised, or unknown}} — and a single unprovoked seizure with a 60% recurrence risk (e.g. abnormal EEG or MRI lesion) meets the operational definition of {{c2::epilepsy}}.",
    back_md:
      "Two unprovoked seizures >24h apart also defines epilepsy. Provoked seizures (alcohol withdrawal, hyponatraemia, eclampsia) do not. Always do bedside glucose, ECG, electrolytes, CT brain on first event; non-urgent MRI + EEG via neurology.",
    citation: "ILAE 2017 · eTG Neurology · Murtagh 8th ed",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-008",
    specialty: "neurology",
    subtopic: "AED in women of reproductive age",
    front_md:
      "Sodium valproate is {{c1::contraindicated in women of reproductive age}} unless no alternative exists, due to a ~10% risk of major congenital malformation and significant neurodevelopmental harm — preferred AU first-line is {{c2::levetiracetam or lamotrigine}}.",
    back_md:
      "TGA pregnancy category D. Valproate Pregnancy Prevention Program requires annual specialist review, contraception counselling and signed risk-acknowledgement form. Folate 5 mg/day preconception. Lamotrigine doses need uptitration in pregnancy (oestrogen induces glucuronidation).",
    citation: "TGA Valproate PPP · eTG Neurology · RANZCOG",
    mark_sheet_domain: "safety_net",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-009",
    specialty: "neurology",
    subtopic: "AU driving rules — seizures",
    front_md:
      "Austroads 'Assessing Fitness to Drive' — after a first unprovoked seizure, a private driver must not drive for {{c1::6 months}}; a diagnosed epileptic must be {{c2::seizure-free for 12 months}} (private) or 10 years off AEDs (commercial).",
    back_md:
      "Doctor's duty is to advise the patient; mandatory reporting only in NT and SA. Document the advice in the notes. Commercial vehicle drivers face stricter criteria — 10-year seizure-free interval off all AEDs.",
    citation: "Austroads AFTD 2022 · RACGP",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-neuro-010",
    specialty: "neurology",
    subtopic: "Status epilepticus",
    front_md:
      "ANZCOR-aligned management of convulsive status epilepticus in an adult: first-line IV {{c1::lorazepam 4 mg (or midazolam 10 mg IM if no IV access)}}; if seizures persist beyond 5–10 minutes, second-line {{c2::levetiracetam 60 mg/kg IV (max 4.5 g)}}.",
    back_md:
      "Check glucose, give thiamine if alcohol/malnutrition suspected. Refractory status (>30 min) — call ICU, intubate, propofol or thiopentone infusion. ESETT showed levetiracetam, fosphenytoin and valproate equivalent as second-line; AU prefers levetiracetam for tolerability.",
    citation: "ANZCOR · eTG Neurology · ESETT trial",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-011",
    specialty: "neurology",
    subtopic: "Migraine prophylaxis",
    front_md:
      "PBS-listed first-line oral migraine prophylaxis options in Australia include {{c1::propranolol, amitriptyline, topiramate, and candesartan}} — choose based on comorbidities and start when attacks exceed ~{{c2::2 per month}}.",
    back_md:
      "Avoid topiramate in women planning pregnancy (oral cleft, low birthweight); avoid propranolol in asthma. CGRP monoclonal antibodies (erenumab, galcanezumab, fremanezumab) PBS-subsidised after failure of ≥3 oral preventatives. Encourage headache diary.",
    citation: "eTG Neurology · PBS · Murtagh 8th ed",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-012",
    specialty: "neurology",
    subtopic: "Headache red flags",
    front_md:
      "The {{c1::SNOOP}} mnemonic flags secondary headache — Systemic symptoms/Secondary risk (HIV, cancer), Neurological signs, Onset sudden (thunderclap), Older (>50 new headache), Pattern change.",
    back_md:
      "Add: positional, pregnancy/postpartum (CVST), papilloedema. Any red flag → urgent non-contrast CT; if SAH suspected and CT negative within 6 hours go to LP for xanthochromia at 12 hours. Giant cell arteritis in over-50s: ESR/CRP and empirical prednisolone before biopsy.",
    citation: "eTG Neurology · Murtagh 8th ed · RACGP",
    mark_sheet_domain: "safety_net",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-neuro-013",
    specialty: "neurology",
    subtopic: "Migraine abortive",
    front_md:
      "Acute migraine first-line abortive therapy is a {{c1::triptan (e.g. sumatriptan 50–100 mg PO or 6 mg SC) plus an NSAID}} — combination outperforms either alone (PBS-listed).",
    back_md:
      "Triptan contraindications: ischaemic heart disease, uncontrolled hypertension, hemiplegic/basilar migraine, recent ergot. Limit to 10 days/month to avoid medication-overuse headache. Add antiemetic (metoclopramide 10 mg) for nausea + gastric stasis.",
    citation: "eTG Neurology · PBS · Murtagh 8th ed",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-014",
    specialty: "neurology",
    subtopic: "Subarachnoid haemorrhage",
    front_md:
      "A sudden 'worst-ever' thunderclap headache reaching maximal intensity within {{c1::1 minute}} requires non-contrast CT brain immediately; if negative beyond 6 hours from onset, proceed to {{c2::lumbar puncture for xanthochromia}} at ≥12 hours.",
    back_md:
      "CT within 6 hours has ~100% sensitivity for SAH on modern multi-slice scanners. If SAH confirmed, neurosurgical referral, BP <160 SBP, nimodipine 60 mg PO 4-hourly for vasospasm prevention, CTA to identify aneurysm for coiling/clipping.",
    citation: "Murtagh 8th ed · eTG Neurology · RANZCR",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-015",
    specialty: "neurology",
    subtopic: "Bell's palsy",
    front_md:
      "First-line treatment of Bell's palsy presenting within 72 hours is {{c1::prednisolone 60 mg daily for 10 days}}; routine antivirals are {{c2::not recommended}} unless herpes zoster (Ramsay Hunt) is suspected.",
    back_md:
      "Eye care is critical — lubricating drops by day, ointment + tape eye shut overnight to prevent exposure keratopathy. Most recover within 3 months; refer to ENT or neurology if no improvement at 3 weeks, atypical features, or bilateral involvement (think Lyme, sarcoid, GBS).",
    citation: "Murtagh 8th ed · eTG Neurology · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-016",
    specialty: "neurology",
    subtopic: "Dementia subtypes",
    front_md:
      "Stepwise cognitive decline with focal neurological signs and vascular risk factors suggests {{c1::vascular dementia}}, while fluctuating cognition, visual hallucinations and parkinsonism in the first year suggest {{c2::dementia with Lewy bodies}}.",
    back_md:
      "Alzheimer's is gradual, amnestic, with temporal-lobe atrophy on MRI. Frontotemporal dementia presents with behavioural change or progressive aphasia in under-65s. Antipsychotics worsen DLB (severe neuroleptic sensitivity). All types need driving assessment and advance care planning.",
    citation: "RACGP cognitive impairment · Murtagh 8th ed · Dementia Australia",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-017",
    specialty: "neurology",
    subtopic: "Dementia screening + Rx",
    front_md:
      "RACGP-endorsed primary-care cognitive screen for suspected dementia is the {{c1::GPCOG or MoCA}}; first-line pharmacotherapy for mild-to-moderate Alzheimer's is a cholinesterase inhibitor — {{c2::donepezil 5 mg nocte, uptitrate to 10 mg after 4 weeks}}.",
    back_md:
      "MMSE is no longer copyright-free; GPCOG is brief and validated for AU primary care. Donepezil/rivastigmine/galantamine are PBS-subsidised under Authority. Memantine (NMDA antagonist) added for moderate-severe disease. Refer to memory clinic; document capacity and EPOA.",
    citation: "RACGP · PBS · eTG Psychotropic · Dementia Australia",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-018",
    specialty: "neurology",
    subtopic: "Parkinson's disease",
    front_md:
      "Cardinal motor features of idiopathic Parkinson's disease are {{c1::asymmetric resting tremor, bradykinesia, rigidity, and postural instability}}; first-line pharmacotherapy in patients with significant functional impairment is {{c2::levodopa/carbidopa}}.",
    back_md:
      "MAO-B inhibitors (selegiline, rasagiline) or dopamine agonists (pramipexole) are alternatives in younger patients to delay levodopa-induced dyskinesia. Red flags for atypical parkinsonism: early falls (PSP), autonomic failure (MSA), early dementia/visual hallucinations (DLB). Non-motor: anosmia, REM-sleep behaviour disorder, constipation predate motor onset by years.",
    citation: "eTG Neurology · Murtagh 8th ed · Parkinson's Australia",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-019",
    specialty: "neurology",
    subtopic: "Multiple sclerosis",
    front_md:
      "McDonald 2017 criteria diagnose MS by demonstrating dissemination in {{c1::space and time}} on MRI (T2 lesions in ≥2 of periventricular, juxtacortical, infratentorial, spinal cord) — CSF oligoclonal bands can substitute for dissemination in time.",
    back_md:
      "Optic neuritis or transverse myelitis classic first presentation. Disease-modifying therapies (PBS): platform (interferon-β, glatiramer), oral (dimethyl fumarate, teriflunomide, fingolimod), high-efficacy (ocrelizumab, natalizumab, cladribine). Treat early to reduce disability accrual.",
    citation: "McDonald 2017 · PBS · MS Australia",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-neuro-020",
    specialty: "neurology",
    subtopic: "Stroke safety-net",
    front_md:
      "AMC clinical safety-net post-TIA discharge: 'If you again get any {{c1::sudden face droop, arm or leg weakness, slurred or confused speech, or loss of vision}} — call 000 immediately and say the word \"{{c2::stroke}}\" — do not drive yourself, do not wait.'",
    back_md:
      "Specific symptoms + specific action + 000 + named transport = full safety-net marks. Confirm patient understands not to drive until cleared (Austroads), arrange GP review within 1 week, and provide written Stroke Foundation FAST card.",
    citation: "Stroke Foundation Australia · AMC examiner notes",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-neuro-021",
    specialty: "neurology",
    subtopic: "Migraine communication",
    front_md:
      "AMC counselling for a young woman with episodic migraine on COCP: oestrogen-containing contraception is {{c1::contraindicated in migraine with aura}} due to increased ischaemic stroke risk — switch to {{c2::progestogen-only pill, implant or IUS}}.",
    back_md:
      "Document aura history, vascular risk factors, smoking status. Migraine without aura on COCP is acceptable if no other risk factors. Offer lifestyle advice (sleep, hydration, regular meals), trigger diary, and prophylaxis if ≥2 attacks/month interfering with function.",
    citation: "FSRH · RANZCOG · eTG Neurology",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
