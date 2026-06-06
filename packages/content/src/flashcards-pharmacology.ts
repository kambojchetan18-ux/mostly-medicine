import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AU-specific pharmacology high-yield for AMC CAT 1 + CAT 2.
// Niche AU content — PBS Authority, TGA scheduling, RTPM, Closing-the-Gap, eTG.
// Mirrors flashcards-gastro.ts conventions — cloze ≤2, AU-cited, no fluff.
export const pharmacologyFlashcards: Flashcard[] = [
  {
    id: "fc-pharm-001",
    specialty: "pharmacology",
    subtopic: "PBS basics",
    front_md:
      "PBS co-payments (2025): General patient pays up to {{c1::$31.60 per script (with optional 1-year prescription discount keeping it $19.60)}}, Concessional pays $7.70 — Safety Net thresholds {{c2::$1,694 general and $277.20 concessional}} per calendar year drop subsequent scripts to concessional / nil.",
    back_md:
      "Section 100 (Highly Specialised Drugs) covers hospital-only items (e.g. HIV ART, anti-TNF biologics, MS DMTs, IVF, hep C DAAs). Authority Required scripts need PBS approval before dispense — either Streamlined (write code on script) or full phone/online Authority via PRODA. RPBS for veterans uses parallel co-pay.",
    citation: "PBS Schedule · Services Australia PBS",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-002",
    specialty: "pharmacology",
    subtopic: "Closing the Gap PBS",
    front_md:
      "The PBS Closing the Gap Co-payment scheme eliminates or reduces co-payments for {{c1::Aboriginal and Torres Strait Islander patients with (or at risk of) chronic disease}} — registered once via {{c2::CTG-eligible PBS prescriber tick on the script}} (no separate enrolment since 2021 reforms).",
    back_md:
      "Pre-2021 required CTG database registration; now any PBS-prescriber-eligible practice ticks CTG box. Patient pays $0 (instead of $7.70 concessional) or $7.70 (instead of $31.60 general). Available at any PBS pharmacy. Doesn't cover Section 100 HSDs — those follow their own co-pay.",
    citation: "PBS Closing the Gap · Department of Health",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-003",
    specialty: "pharmacology",
    subtopic: "PBS Authority types",
    front_md:
      "PBS Authority categories: {{c1::Streamlined Authority (write 4-digit code on script, no call needed)}} for common indications, vs {{c2::Phone or Online Authority via PRODA / HPOS}} for more restrictive items (e.g. high-cost biologics, off-label oncology).",
    back_md:
      "Telehealth Authority since COVID — PRODA login + HPOS portal. 'Authority Required' restricted indications cover ~30% of PBS items by volume but most by spend. Increasing prescriptions can use Authority Required prescription with 6 repeats. Restricted Benefit ≠ Authority Required — restricted just means prescribe for listed indication only.",
    citation: "Services Australia HPOS · PBS Schedule",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-004",
    specialty: "pharmacology",
    subtopic: "TGA Poisons Standard",
    front_md:
      "TGA Schedules under the Poisons Standard (SUSMP): {{c1::S2 pharmacy medicine (OTC behind counter)}}, {{c2::S3 pharmacist-only (mandatory counselling)}}, S4 prescription-only, S8 controlled drug. Schedule 5/6/7 cover poisons. Schedule 9 = prohibited substances.",
    back_md:
      "S3 examples: codeine 12.8mg used to be — upscheduled to S4 in 2018; salbutamol inhaler; PPIs (small packs). S4 = standard Rx. S8 = morphine/oxycodone/methadone/fentanyl/methylphenidate — special prescription forms, drug register, lockable storage. States can up-schedule via Drugs Poisons & Controlled Substances Act.",
    citation: "TGA SUSMP · Vic DPCSA · NSW Poisons Standard",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-005",
    specialty: "pharmacology",
    subtopic: "Schedule 8 + RTPM",
    front_md:
      "Long-term S8 opioid prescribing for chronic non-cancer pain requires {{c1::state Authority/Permit (varies — Vic SafeScript permit >12 weeks, NSW Authority Section 28 >8 weeks)}}; Real-Time Prescription Monitoring ({{c2::SafeScript Vic, ScriptCheckSA, NSW SafeScript, QScript Qld, RTPM WA/Tas/ACT/NT}}) flags doctor-shopping at point of prescribing.",
    back_md:
      "Mandatory check before prescribing S8 + high-risk S4 (benzodiazepines, gabapentinoids, codeine, tramadol, quetiapine). Authority required even for tapering some agents. Avoid co-prescribing opioid + benzodiazepine (synergistic respiratory depression — black box). Use eTG opioid analgesia + Faculty of Pain Medicine guidance.",
    citation: "TG Pain · state RTPM legislation · ANZCA FPM",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-pharm-006",
    specialty: "pharmacology",
    subtopic: "Antibiotic stewardship",
    front_md:
      "Antibiotic stewardship per eTG demands {{c1::narrowest-spectrum effective agent, shortest evidence-based duration, IV-to-oral switch as soon as clinically appropriate}}; review at {{c2::48-72 hours with culture results and de-escalate}}.",
    back_md:
      "5 Rights: right drug, right dose, right route, right duration, right indication. Australian Strategic + Technical Advisory Group on AMR (ASTAG). AURA reports rising fluoroquinolone resistance — restrict to specific indications. Cancel prophylactic surgical antibiotics at 24h.",
    citation: "eTG Antibiotic · ASTAG · AURA report",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-007",
    specialty: "pharmacology",
    subtopic: "Empirical antibiotics",
    front_md:
      "eTG empirical first-line: community-acquired pneumonia (mild–moderate) = {{c1::amoxicillin 1g TDS PO ± doxycycline 100mg BD if atypical suspected}}; uncomplicated cystitis = {{c2::trimethoprim 300mg nocte OR nitrofurantoin 100mg QID for 5 days}}; non-purulent cellulitis = cefalexin 500mg QID; suspected bacterial meningitis = ceftriaxone 2g IV ± benzylpenicillin if Listeria risk + dexamethasone before/with first dose.",
    back_md:
      "CAP severe (CORB ≥1) = benzylpenicillin IV + doxycycline/azithromycin. Pyelonephritis = amoxicillin+clavulanate or cefalexin + gentamicin if septic. Cellulitis with MRSA risk = clindamycin or doxy. Eye on local antibiogram. Aminoglycoside dosing weight + renal-based. Meningococcal household contacts get rifampicin/ciprofloxacin prophylaxis + notify PHU.",
    citation: "eTG Antibiotic v2024 · TG meningitis",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-008",
    specialty: "pharmacology",
    subtopic: "Anticoagulant choice",
    front_md:
      "Warfarin requires INR target {{c1::2.0-3.0 (mechanical mitral valve 2.5-3.5)}}; major bleeding reversed with {{c2::IV vitamin K 10mg + prothrombinex (Prothrombinex-VF) ± FFP}}. DOAC dabigatran is reversed with idarucizumab 5g IV; apixaban/rivaroxaban with andexanet alfa (limited AU availability) or prothrombinex.",
    back_md:
      "DOACs preferred over warfarin for non-valvular AF + VTE (PBS-listed). No INR monitoring but renal dose adjustment essential. Apixaban dose-reduce to 2.5mg BD if 2 of: age ≥80, weight ≤60kg, creat ≥133. Rivaroxaban CrCl 15-49 → 15mg daily. Dabigatran avoid CrCl <30. Warfarin retained for mechanical valves + severe renal impairment.",
    citation: "TG Cardiovascular · NHFA AF guideline · PBS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-009",
    specialty: "pharmacology",
    subtopic: "Insulins available in AU",
    front_md:
      "Insulin categories in AU: rapid-acting {{c1::Humalog (lispro), NovoRapid (aspart), Apidra (glulisine), Fiasp (faster aspart)}} onset 10-20 min; long-acting basal {{c2::Lantus/Optisulin (glargine U100), Toujeo (glargine U300), Levemir (detemir), Tresiba (degludec)}} duration 24-42h.",
    back_md:
      "Short-acting (regular): Actrapid, Humulin R — onset 30 min, duration 6-8h. Intermediate (NPH): Protaphane, Humulin NPH — peak 4-12h. Pre-mixed: Mixtard 30/70, NovoMix 30, Humalog Mix 25/50 — common in T2DM. Patients pay PBS price; pumps + CGM subsidised in T1DM under NDSS. Switching basals not 1:1 — reduce ~20% when changing.",
    citation: "RACGP T2DM management · NDSS · PBS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-010",
    specialty: "pharmacology",
    subtopic: "Antihypertensive ladder",
    front_md:
      "RACGP/NHFA first-line antihypertensive selection: {{c1::ACE-I or ARB}} for patients with diabetes, microalbuminuria, CKD or LV dysfunction; {{c2::CCB (amlodipine) or thiazide-like diuretic (indapamide / chlorthalidone)}} for older patients or African heritage. Add second agent if BP not at target after 4-6 weeks.",
    back_md:
      "Target BP <140/90 generally; <130/80 if diabetes, CKD, post-stroke, established CV disease. β-blockers no longer first-line for uncomplicated HTN — reserved for IHD, HF, AF rate control. Spironolactone 25-50mg added for resistant HTN. Avoid ACE-I + ARB combination (renal harm). Bilateral RAS contraindicates ACE-I/ARB.",
    citation: "NHFA HTN guideline 2016 · RACGP Red Book",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-011",
    specialty: "pharmacology",
    subtopic: "Analgesic dosing safety",
    front_md:
      "Paracetamol maximum {{c1::4 g per 24 h in adults (reduce to 3 g if frail, low body weight <50kg, or chronic liver disease/regular alcohol)}}; opioid-naive starting oxycodone IR {{c2::2.5-5 mg PO q4h PRN with regular paracetamol, never co-prescribed with a benzodiazepine}}.",
    back_md:
      "NSAIDs caution: eGFR <60, age >75, hypertension, heart failure, peptic ulcer history, dual antiplatelet/anticoagulant. Topical NSAIDs preferred in OA elderly. Always state PRN frequency + max daily on script + bowel regimen (docusate + senna) for opioid initiation. Naloxone take-home for high-risk patients.",
    citation: "TG Pain · ANZCA Acute Pain Management",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-012",
    specialty: "pharmacology",
    subtopic: "Steroid tapering",
    front_md:
      "Patients on prednisolone >{{c1::3 weeks at supraphysiological dose (>7.5mg daily)}} risk HPA axis suppression — wean by {{c2::5 mg per week until 7.5 mg, then 1 mg every 2-4 weeks}} to avoid adrenal crisis.",
    back_md:
      "Stress-dose steroids (hydrocortisone 100 mg IV) during surgery, sepsis, severe illness for any patient on long-term steroid. Side-effect surveillance: BP, BSL, bone density (Vit D + Ca + bisphosphonate if >3 months therapy), cataract, skin atrophy, weight, mood. Steroid card / MedicAlert for long-term users.",
    citation: "TG Endocrinology · RACGP corticosteroid use",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-013",
    specialty: "pharmacology",
    subtopic: "Lithium monitoring",
    front_md:
      "Lithium therapeutic monitoring: trough level taken {{c1::12 hours post-dose}}, target {{c2::0.6-0.8 mmol/L (up to 1.0 in acute mania)}}; toxicity emerges >1.2 (severe >2.0).",
    back_md:
      "Pre-treatment workup: U&E, eGFR, TFT, Ca, ECG (>40 or CV risk), pregnancy test (Ebstein's anomaly risk T1). 3-monthly: levels, U&E, TFT, Ca. NSAIDs, ACE-I/ARB, thiazide diuretics, dehydration ALL raise levels. Toxicity = tremor, ataxia, confusion, seizures, AKI. Treat: stop lithium, IV saline, haemodialysis if level >4 or symptomatic >2.5.",
    citation: "TG Psychotropic · RANZCP mood disorders",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-014",
    specialty: "pharmacology",
    subtopic: "Methotrexate weekly",
    front_md:
      "Methotrexate for RA/psoriasis is dosed {{c1::ONCE WEEKLY (not daily — fatal error)}}, with folic acid {{c2::5 mg the day after the methotrexate dose}}; baseline + 4-weekly FBE + LFT + U&E.",
    back_md:
      "Absolute contra: pregnancy (teratogen — wash-out 3 months M+F before conception), severe liver disease, eGFR <30, active infection, alcohol misuse. NSAID + trimethoprim raise toxicity. Pneumonitis is rare but life-threatening — cease if new dyspnoea/cough. PBS Authority required. Use specific MTX prescription pad with bolded WEEKLY label to prevent LASA error.",
    citation: "Australian Rheumatology Association · PBS Authority",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-015",
    specialty: "pharmacology",
    subtopic: "Statins",
    front_md:
      "PBS Authority for statins in primary prevention requires absolute CV risk ≥{{c1::15% over 5 years (or 10-15% with specific risk modifiers)}}; rosuvastatin 10-20 mg or atorvastatin 20-40 mg are common first-line; monitor for {{c2::myalgia + creatine kinase rise (rhabdomyolysis), and LFT if baseline abnormal}}.",
    back_md:
      "All patients with established ASCVD, diabetes + microalbuminuria, familial hypercholesterolaemia, prior stroke = automatic Authority. NHFA/Heart Foundation calculator 2024. Switch statin (not stop) if myalgia mild. Stop + investigate if CK >10× ULN or rhabdo signs. Coenzyme Q10 evidence weak. Pravastatin if drug interactions (less CYP3A4).",
    citation: "PBS Authority · NHFA Heart Foundation 2024",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-016",
    specialty: "pharmacology",
    subtopic: "OCP interactions",
    front_md:
      "Enzyme-inducing drugs that reduce combined oral contraceptive efficacy: {{c1::rifampicin/rifabutin, carbamazepine, phenytoin, phenobarbital, topiramate >200mg, St John's wort, some HIV antiretrovirals}}. Most broad-spectrum antibiotics {{c2::do NOT reduce COC efficacy}} (myth — only rifampicin family does).",
    back_md:
      "If unavoidable enzyme inducer: switch to non-hormonal method, depot medroxyprogesterone, or copper IUD. Levonorgestrel-IUD is largely unaffected. Lamotrigine reduced by COC (not the other way) — monitor for lamotrigine breakthrough seizures when starting/stopping COC. Ulipristal-EC dose double in enzyme inducers; copper IUD always preferred for emergency contraception in this scenario.",
    citation: "RACGP Contraception · FSRH UK guidance · eTG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-017",
    specialty: "pharmacology",
    subtopic: "Sick day rules SADMANS",
    front_md:
      "SADMANS sick-day medication rules: temporarily hold {{c1::Sulphonylureas, ACE-I, Diuretics, Metformin, ARBs, NSAIDs, SGLT2 inhibitors}} during acute illness with dehydration, vomiting, or reduced PO intake — to prevent {{c2::AKI, lactic acidosis (metformin), euglycaemic DKA (SGLT2i), or hypoglycaemia (sulphonylurea)}}.",
    back_md:
      "Resume when eating/drinking normally for 24-48 h. Educate at every chronic disease review + provide written sick-day plan. SGLT2i euglycaemic DKA can occur even with BSL <14 — check ketones if SGLT2i + unwell. Insulin is NOT held in T1DM — basal continues. Continue antihypertensives if BP not dropping.",
    citation: "Diabetes Australia · RACGP T2DM · TG Endocrinology",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-pharm-018",
    specialty: "pharmacology",
    subtopic: "Generic substitution + brand price premium",
    front_md:
      "Pharmacists may substitute a {{c1::bioequivalent generic for the brand on the script}} unless the prescriber ticks 'brand substitution not permitted' — if the patient insists on a higher-priced brand, they pay the {{c2::brand price premium on top of the PBS co-payment}}.",
    back_md:
      "PBS Schedule lists 'a' flag for items where brand substitution is appropriate. Bioequivalence accepted within ±20% of AUC/Cmax. Narrow therapeutic-index drugs (warfarin, lithium, antiepileptics, cyclosporine, levothyroxine) — keep one brand. Indigenous patients on CTG must consent to brand switch. Document any brand-only prescribing reason.",
    citation: "PBS Schedule · TGA bioequivalence guidance",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-019",
    specialty: "pharmacology",
    subtopic: "DOAC renal dosing",
    front_md:
      "DOAC dose modification: apixaban 2.5 mg BD if {{c1::any 2 of age ≥80, weight ≤60 kg, serum creatinine ≥133 µmol/L}}; rivaroxaban 15 mg daily if CrCl 15-49; dabigatran avoided if CrCl {{c2::<30 mL/min}}; no DOAC if CrCl <15 (use warfarin or LMWH).",
    back_md:
      "Edoxaban 30 mg daily if CrCl 15-50 OR weight ≤60 kg OR P-gp inhibitor. Reassess renal function 6-12 monthly (every 3 months if CrCl <60). Cockcroft-Gault is the validated formula for DOAC dosing — NOT MDRD/CKD-EPI. Avoid DOACs in pregnancy + breastfeeding + APS triple-positive + mechanical valves.",
    citation: "NHFA AF · NPS MedicineWise DOAC",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-020",
    specialty: "pharmacology",
    subtopic: "PSA shared decision-making",
    front_md:
      "RACGP Red Book + USPSTF position: routine population PSA screening is {{c1::NOT recommended}} due to overdiagnosis and overtreatment harms. If a man aged 50-69 requests screening after balanced discussion, offer {{c2::PSA every 2 years with shared decision-making}}; >70 generally not recommended.",
    back_md:
      "Cancer Council + Prostate Cancer Foundation AU produced consensus 2016 — informed choice not screening. Discuss false positives (BPH, prostatitis raise PSA), biopsy complications (sepsis, bleeding), and active surveillance for low-risk disease. Family hx prostate ca first-degree < 65 → start age 45 with shared decision-making.",
    citation: "RACGP Red Book · Cancer Council AU · USPSTF",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-021",
    specialty: "pharmacology",
    subtopic: "Vaccine cold chain",
    front_md:
      "National Vaccine Storage Guidelines 'Strive for 5' require vaccines stored at {{c1::+2 °C to +8 °C}} with continuous data-logging temperature monitoring; cold-chain breaches mandate {{c2::quarantine of affected vaccines + notification to state immunisation unit for advice (do not destroy/use until clearance)}}.",
    back_md:
      "Purpose-built vaccine fridge (not domestic). Min/max recorded daily. Annual cold-chain audit. Breach categories: type/duration determines re-use vs discard. Most live vaccines (MMR, varicella, zoster) more heat-sensitive. Power outage planning: backup ice bricks + esky + thermometer. Document all breaches in cold-chain breach log.",
    citation: "Strive for 5 · Australian Immunisation Handbook · ATAGI",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-pharm-022",
    specialty: "pharmacology",
    subtopic: "LASA + Section 100",
    front_md:
      "Section 100 Highly Specialised Drugs Programme covers {{c1::HIV ART, hepatitis B/C DAAs, anti-TNF/IL biologics for IBD-RA-psoriasis, MS disease-modifying therapies, IVF, growth hormone, pulmonary hypertension agents}} — accessed via {{c2::specialist-led prescribing through approved hospital pharmacies}}. Watch for Look-Alike Sound-Alike (LASA) errors: methotrexate vs metolazone, hydroxyzine vs hydralazine, prednisolone vs prednisone, lamotrigine vs lamivudine, cycloSPORINE vs cycloSERINE.",
    back_md:
      "S100 split — public hospital (community access) and private hospital. GPs can co-prescribe HCV DAAs (s100 community access). Tall-Man lettering on labels (e.g. predniSOLone vs predniSONE) recommended by ACSQHC. Always confirm indication + dose + frequency against original specialist letter when continuing S100 scripts. Prescribe by active ingredient + brand for narrow-TI drugs.",
    citation: "PBS Section 100 · ACSQHC LASA · NPS MedicineWise",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
];
