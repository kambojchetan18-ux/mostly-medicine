import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 emergency medicine high-yield.
// Mirrors flashcards-gastro.ts conventions — cloze ≤2, AU-cited, no fluff.
export const emergencyFlashcards: Flashcard[] = [
  {
    id: "fc-em-001",
    specialty: "emergency_medicine",
    subtopic: "ATLS primary survey",
    front_md:
      "ATLS 10th primary survey sequence is {{c1::ABCDE — Airway with c-spine control, Breathing, Circulation with haemorrhage control, Disability, Exposure}}; the preferred airway manoeuvre in suspected c-spine injury is {{c2::jaw thrust (not head-tilt/chin-lift)}}.",
    back_md:
      "ATLS 10th: cervical clearance now permits removal of collar in alert, low-risk patients per NEXUS or Canadian C-spine rule + reliable exam — imaging only if criteria not met. Persistent collar use causes pressure injury and raised ICP. Always reassess A→E after each intervention.",
    citation: "ATLS 10th · ANZCOR ALS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-002",
    specialty: "emergency_medicine",
    subtopic: "Anaphylaxis",
    front_md:
      "First-line treatment for adult anaphylaxis is {{c1::IM adrenaline 0.5 mg (0.5 mL of 1:1000) into the mid-anterolateral thigh}}, repeated every {{c2::5 minutes}} if no response; paediatric dose is 0.01 mg/kg (max 0.5 mg).",
    back_md:
      "Add IV crystalloid 20 mL/kg for hypotension, nebulised salbutamol for bronchospasm, oxygen to SpO2 ≥94%. Observe minimum 4 hours (6 h if biphasic risk factors). On discharge: 2× adrenaline auto-injectors, ASCIA Action Plan, allergist referral, trigger avoidance education. Antihistamines/steroids do NOT replace adrenaline.",
    citation: "ASCIA anaphylaxis guidelines · ANZCOR ALS",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-em-003",
    specialty: "emergency_medicine",
    subtopic: "Sepsis",
    front_md:
      "qSOFA ≥{{c1::2}} (RR ≥22, altered mentation, SBP ≤100) flags high mortality risk in suspected infection; the Surviving Sepsis 1-hour bundle is {{c2::lactate, blood cultures BEFORE antibiotics, broad-spectrum antibiotics, 30 mL/kg crystalloid for hypotension or lactate ≥4}}.",
    back_md:
      "Source control within 6-12 hours where feasible (drain, debride, remove line). Escalate via MEWS/NEWS to MET / Rapid Response. Repeat lactate to track perfusion. Vasopressor of choice is noradrenaline once euvolaemic, target MAP ≥65. Antibiotic choice per local sensitivities — first dose never delayed beyond 1 hour.",
    citation: "Surviving Sepsis 2021 · TG Antibiotic · ANZICS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-004",
    specialty: "emergency_medicine",
    subtopic: "Massive transfusion",
    front_md:
      "In major trauma haemorrhage activate massive transfusion at a ratio of {{c1::1:1:1 RBC : FFP : platelets}}; give {{c2::tranexamic acid 1 g IV over 10 min then 1 g over 8 h, within 3 hours of injury}} (CRASH-2).",
    back_md:
      "Permissive hypotension (SBP 80-90) until haemorrhage controlled, unless TBI suspected (target SBP ≥110). Keep warm (warming blanket, fluid warmer), monitor pH, ionised Ca (citrate chelates), K+. ROTEM/TEG guides targeted product replacement once available.",
    citation: "ATLS 10th · NBA massive transfusion guideline · CRASH-2",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-005",
    specialty: "emergency_medicine",
    subtopic: "Burns",
    front_md:
      "Burn TBSA in adults uses {{c1::Wallace rule of 9s}} (head 9, each arm 9, each leg 18, anterior trunk 18, posterior trunk 18, perineum 1); resuscitate per {{c2::Parkland 4 mL/kg/%TBSA over 24 h, half in the first 8 h from time of burn}} with Hartmann's.",
    back_md:
      "Referral to burns unit if >10% TBSA adult/>5% child, full thickness, face/hands/feet/genitalia/perineum/major joints, inhalation injury, circumferential, electrical/chemical, or significant comorbidity. Early intubation if airway burns or stridor. Tetanus prophylaxis. Analgesia titrated IV opioid + ketamine for dressings.",
    citation: "ANZBA EMSB · ATLS 10th",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-006",
    specialty: "emergency_medicine",
    subtopic: "Toxidromes",
    front_md:
      "Anticholinergic toxidrome: {{c1::hot, dry, red, blind, mad — mydriasis, tachycardia, urinary retention, ileus, hyperthermia}}; serotonin syndrome adds {{c2::clonus (especially lower-limb inducible), hyperreflexia, tremor and autonomic instability}}.",
    back_md:
      "Cholinergic = SLUDGE/DUMBELS (salivation, lacrimation, miosis, bradycardia). Opioid = miosis, bradypnoea, sedation. Sympathomimetic = mydriasis, diaphoresis, tachycardia, agitation (cocaine/amphetamine — sweaty, not dry like anticholinergic). Sympathomimetic + diaphoresis is the discriminator from anticholinergic.",
    citation: "TG Toxicology · Poisons Information 13 11 26",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-007",
    specialty: "emergency_medicine",
    subtopic: "Paracetamol overdose",
    front_md:
      "Plot a paracetamol level taken at ≥{{c1::4 hours post-ingestion}} on the {{c2::Rumack-Matthew nomogram}}; if above the treatment line, give IV N-acetylcysteine over 21 hours (150 mg/kg → 50 mg/kg → 100 mg/kg).",
    back_md:
      "Staggered or unknown-time ingestions → treat empirically with NAC, measure level + ALT + INR. NAC is most effective <8 hours from ingestion but still given regardless if criteria met. Watch for anaphylactoid reactions during loading (slow infusion, antihistamine).",
    citation: "TG Toxicology · Poisons Information",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-008",
    specialty: "emergency_medicine",
    subtopic: "Opioid overdose",
    front_md:
      "Reverse opioid overdose with naloxone {{c1::0.1-0.4 mg IV titrated to respiratory rate (or 0.4-0.8 mg IM/IN if no access)}}, repeated every 2-3 minutes; long-acting opioids (methadone, sustained-release oxycodone) require {{c2::a naloxone infusion}}.",
    back_md:
      "Aim for adequate ventilation, not complete reversal — full reversal triggers acute withdrawal and aggression in opioid-dependent patients. Observe minimum 4-6 hours after last naloxone dose (longer for methadone). Refer to D&A service for take-home naloxone + opioid-substitution therapy.",
    citation: "TG Toxicology · ANZCOR · Poisons Information",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-009",
    specialty: "emergency_medicine",
    subtopic: "TCA overdose",
    front_md:
      "ECG features predicting toxicity in TCA overdose are {{c1::QRS >100 ms and a terminal R wave >3 mm in aVR}}; treat with {{c2::sodium bicarbonate 1-2 mmol/kg IV bolus}} until QRS narrows and pH 7.45-7.55.",
    back_md:
      "Mechanism: fast sodium-channel blockade (QRS widening, VT, hypotension) plus anticholinergic, alpha-block and seizures. AVOID class Ia/Ic and class III antiarrhythmics. Activated charcoal if airway protected and <2 h. Intralipid considered for refractory cardiotoxicity.",
    citation: "TG Toxicology · Poisons Information",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-010",
    specialty: "emergency_medicine",
    subtopic: "Hyperkalaemia",
    front_md:
      "ECG progression in hyperkalaemia: {{c1::peaked T waves → PR prolongation → widening QRS → sine wave → asystole}}; first drug given for cardiac membrane stabilisation is {{c2::IV calcium gluconate 10 mL of 10% (or chloride if central access)}}.",
    back_md:
      "After calcium, shift K+ intracellularly: insulin 10 U + 50 mL of 50% dextrose, nebulised salbutamol 10-20 mg, sodium bicarbonate if acidotic. Remove K+: resonium, frusemide if euvolaemic, dialysis if refractory or AKI. Treat cause (renal failure, ACEi/spironolactone, rhabdo, tumour lysis).",
    citation: "TG Renal · ANZCOR ALS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-011",
    specialty: "emergency_medicine",
    subtopic: "Acute stroke",
    front_md:
      "Activate Code Stroke for any FAST-positive patient; IV {{c1::alteplase 0.9 mg/kg (max 90 mg) within 4.5 hours of onset}} for NIHSS ~4-25; endovascular {{c2::thrombectomy is offered up to 24 hours}} for large-vessel occlusion (DAWN/DEFUSE-3).",
    back_md:
      "Mandatory: non-contrast CT to exclude haemorrhage, BSL, BP <185/110 before lysis, no recent surgery/bleed. Aspirin 300 mg only after 24 h post-lysis. Stroke unit admission halves death/dependency. AU TIA ABCD2 ≥4 → admit or rapid-access TIA clinic within 24 h.",
    citation: "Stroke Foundation AU CPG 2024",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-012",
    specialty: "emergency_medicine",
    subtopic: "STEMI reperfusion",
    front_md:
      "STEMI reperfusion target is {{c1::primary PCI within 90 minutes of first medical contact}}; if PPCI cannot be delivered within {{c2::120 minutes}}, give fibrinolytic (tenecteplase) and transfer for rescue/early PCI.",
    back_md:
      "Pre-PCI dual antiplatelet (aspirin 300 mg + ticagrelor 180 mg or prasugrel 60 mg) plus anticoagulant (heparin or bivalirudin). Add high-intensity statin. Avoid oxygen unless SpO2 <93% (AVOID trial). Document onset time and ECG timestamp meticulously.",
    citation: "NHFA STEMI 2024 update · ANZCOR ACS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-013",
    specialty: "emergency_medicine",
    subtopic: "Acute asthma",
    front_md:
      "Severity in acute asthma: {{c1::life-threatening = silent chest, exhaustion, cyanosis, SpO2 <90%, altered consciousness}}; first-line moderate exacerbation is salbutamol {{c2::4-12 puffs via spacer every 20 min × 3, plus oral prednisolone 37.5-50 mg}}.",
    back_md:
      "Target SpO2 93-95% (not 100%) — hyperoxia worsens outcomes. Severe/life-threatening: continuous nebulised salbutamol + ipratropium, IV magnesium sulphate 2 g over 20 min, escalate to ICU for IV aminophylline / NIV / intubation. Discharge: written Asthma Action Plan + preventer review.",
    citation: "Asthma Australia · National Asthma Handbook 2024",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-014",
    specialty: "emergency_medicine",
    subtopic: "Acute pulmonary oedema",
    front_md:
      "Acute cardiogenic pulmonary oedema management: {{c1::sit upright, high-flow O2 to target SpO2 ≥94%, GTN infusion if SBP >110, IV frusemide 40-80 mg}}; non-invasive ventilation with {{c2::CPAP or BiPAP}} reduces intubation rate and mortality.",
    back_md:
      "Mnemonic LMNOP — Lasix, Morphine (cautious — respiratory depression), Nitrates, Oxygen, Position upright. Identify trigger: ACS, arrhythmia, severe HTN, valvular cause. Avoid IV fluids unless RV infarct. Echo within 24 h. Initiate guideline-directed HF therapy on discharge.",
    citation: "NHFA HF 2025 · ANZCOR ALS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-015",
    specialty: "emergency_medicine",
    subtopic: "Subarachnoid haemorrhage",
    front_md:
      "Thunderclap headache peaking within seconds → {{c1::non-contrast CT brain within 6 hours}} has sensitivity >99% for SAH; if negative and >6 h, perform {{c2::LP looking for xanthochromia (12 h after onset)}}.",
    back_md:
      "Confirmed SAH → CT angiogram, neurosurgical referral, nimodipine 60 mg PO 4-hourly × 21 days (reduces vasospasm). BP target SBP <160 pre-securing. WFNS grade for prognosis. ECG changes (cerebral T waves, QT prolongation) are common — do not chase as primary cardiac.",
    citation: "Stroke Foundation AU · ANZCOR",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-016",
    specialty: "emergency_medicine",
    subtopic: "Status epilepticus",
    front_md:
      "Status epilepticus = seizure ≥{{c1::5 minutes}} or recurrent without recovery; first-line is {{c2::IV lorazepam 4 mg (or midazolam 10 mg IM/IN/buccal if no IV)}}, repeat once at 5 minutes if needed.",
    back_md:
      "Second-line: IV levetiracetam 60 mg/kg (max 4.5 g) over 15 min, or sodium valproate 40 mg/kg, or phenytoin 20 mg/kg with cardiac monitoring. Third-line / refractory >30 min → RSI with propofol or thiopentone, EEG monitoring, ICU. Always check BSL, electrolytes, eclampsia in pregnancy (MgSO4).",
    citation: "TG Neurology · ANZCOR ALS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-017",
    specialty: "emergency_medicine",
    subtopic: "DKA management",
    front_md:
      "DKA management priorities: {{c1::fluid resuscitation BEFORE insulin}} (1 L 0.9% saline over 1 h), then insulin infusion at {{c2::0.1 U/kg/h}} once K+ ≥3.5 — start K+ replacement when K+ <5.5.",
    back_md:
      "Hourly BSL, K+ 2-hourly, VBG 4-hourly. Add 5% dextrose to fluids when BSL <14 to allow continued insulin until ketones cleared. Resolution = pH >7.3, HCO3 >18, ketones <0.6, anion gap normal. Don't stop insulin too early — switch to subcut overlap. Identify trigger (infection, missed insulin, MI).",
    citation: "ADS/AAES DKA · TG Endocrinology",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-em-018",
    specialty: "emergency_medicine",
    subtopic: "Paediatric anaphylaxis discharge",
    front_md:
      "On discharge after paediatric anaphylaxis, prescribe {{c1::two adrenaline auto-injectors}} (300 µg if ≥20 kg, 150 µg if 7.5-20 kg) and provide a personalised {{c2::ASCIA Action Plan for Anaphylaxis}}.",
    back_md:
      "School/childcare must hold the action plan + auto-injector. Refer to paediatric immunology/allergy clinic for confirmatory testing and trigger identification. Counsel families to call 000 immediately after administering adrenaline (biphasic reaction risk). Replace auto-injectors before expiry.",
    citation: "ASCIA anaphylaxis · NHMRC",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-em-019",
    specialty: "emergency_medicine",
    subtopic: "Mass casualty triage",
    front_md:
      "START triage assigns {{c1::Green (walking wounded), Yellow (delayed), Red (immediate), Black (deceased/expectant)}}; first sort step is asking everyone who can walk to {{c2::move to a designated area (Green)}}.",
    back_md:
      "Non-walking patients: assess respirations (none after airway open → Black; >30 → Red), perfusion (no radial pulse or CRT >2 s → Red), mental status (cannot follow commands → Red). The Australasian Triage Scale (ATS 1-5) is for ED triage; START/JumpSTART is for prehospital mass casualty.",
    citation: "ATS · ANZCOR disaster · ATLS 10th",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-em-020",
    specialty: "emergency_medicine",
    subtopic: "SBAR handover",
    front_md:
      "Clinical handover and MET escalation in AU hospitals uses {{c1::ISBAR — Identify, Situation, Background, Assessment, Recommendation}}; MET / Rapid Response is triggered by {{c2::any Red Zone vital sign or staff concern}}.",
    back_md:
      "Track-and-trigger tools: NEWS, MEWS, Between-the-Flags (NSW). Document time of escalation, who was called, response, and patient outcome. Closed-loop communication ('Adrenaline 1 mg given' → 'Confirmed adrenaline 1 mg') reduces errors. Read-back of critical pathology results is mandatory.",
    citation: "ACSQHC National Safety and Quality · ANZCOR ALS",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-em-021",
    specialty: "emergency_medicine",
    subtopic: "Paediatric ALS",
    front_md:
      "Paediatric cardiac arrest defibrillation dose per ANZCOR PALS is {{c1::4 J/kg}}; adrenaline dose is {{c2::10 µg/kg IV/IO every 4 minutes}} (0.1 mL/kg of 1:10,000).",
    back_md:
      "Compression rate 100-120/min, depth one-third AP chest. Ratio 15:2 (two rescuer), 30:2 (single lay rescuer). Reversible 4Hs/4Ts: hypoxia, hypovolaemia, hypo/hyperkalaemia + metabolic, hypothermia / thrombosis, tension pneumothorax, tamponade, toxins. Most paediatric arrests are respiratory — fix the airway first.",
    citation: "ANZCOR Paediatric ALS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
];
