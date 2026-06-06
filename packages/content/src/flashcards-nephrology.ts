import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 nephrology high-yield,
// AU-anchored (KHA-CARI, RACGP CKD, KDIGO, AU dialysis/transplant inequity).
export const nephrologyFlashcards: Flashcard[] = [
  {
    id: "fc-renal-001",
    specialty: "nephrology",
    subtopic: "CKD staging heat map",
    front_md:
      "CKD is staged by {{c1::eGFR (G1 ≥90 → G5 <15)}} and {{c2::albuminuria category (A1 <3, A2 3-30, A3 >30 mg/mmol uACR)}} using the KDIGO/Kidney Health Australia heat map.",
    back_md:
      "Stages G3a-G5 OR A2-A3 = CKD with prognostic implications. CKD is defined by eGFR <60 OR markers of damage for ≥3 months. Repeat eGFR at 7-90 days to confirm chronicity before labelling.",
    citation: "Kidney Health Australia CKD Management in Primary Care (4th ed) · KDIGO 2024",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-002",
    specialty: "nephrology",
    subtopic: "CKD risk factors",
    front_md:
      "Major modifiable and non-modifiable CKD risk factors in Australia include {{c1::T2DM, hypertension, obesity, smoking, family history}} and being {{c2::Aboriginal or Torres Strait Islander (3-4× higher CKD prevalence, much higher ESKD rates)}}.",
    back_md:
      "RACGP Red Book CKD screen (eGFR + uACR + BP) every 1-2 years in at-risk: T2DM, HTN, CVD, ≥60, ATSI ≥30, family history, smoker, obese. Earlier and more intensive in ATSI populations and remote communities.",
    citation: "RACGP Red Book · KHA · NACCHO",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-003",
    specialty: "nephrology",
    subtopic: "CKD BP and RAAS",
    front_md:
      "BP target in CKD (AU/KDIGO) is {{c1::<130/80 mmHg}}; first-line agent if albuminuria (uACR ≥3 mg/mmol) or diabetes is an {{c2::ACE inhibitor or ARB}}, titrated to maximum tolerated dose.",
    back_md:
      "Check eGFR + potassium 1-2 weeks after starting/titrating: up to 25% creatinine rise acceptable. Stop or reduce if hyperkalaemia (>6) or AKI. Dual ACE+ARB is contraindicated. Add SGLT2 inhibitor (dapagliflozin or empagliflozin) for renal protection in eGFR ≥20 with albuminuria, irrespective of diabetes.",
    citation: "KHA CKD · KDIGO BP 2021 · eTG cardiovascular",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-004",
    specialty: "nephrology",
    subtopic: "Renal anaemia",
    front_md:
      "In CKD-related anaemia, optimise {{c1::iron stores first (target ferritin >100 µg/L, TSAT >20%)}}; consider an ESA when Hb persistently {{c2::<100 g/L}}, targeting Hb 100-115 (not normalisation — increased stroke/CV risk).",
    back_md:
      "IV iron preferred in CKD G3b-G5 / dialysis. Exclude other causes (B12/folate, GI loss, haemolysis, marrow suppression) before attributing to CKD. ESA contraindicated in active malignancy unless palliative.",
    citation: "KDIGO Anaemia · KHA · Cancer Council AU",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-005",
    specialty: "nephrology",
    subtopic: "CKD-MBD",
    front_md:
      "CKD-Mineral Bone Disorder management aims to control {{c1::phosphate (with dietary restriction + non-calcium phosphate binders)}} and {{c2::secondary hyperparathyroidism (with active vitamin D, e.g. calcitriol, and cinacalcet)}}, per KDIGO targets.",
    back_md:
      "Avoid hypercalcaemia and aggressive PTH suppression (adynamic bone disease). Bone biopsy occasionally needed to differentiate. Skin: avoid calciphylaxis triggers (warfarin, very high calcium-phosphate product). Refer to nephrology before dialysis for vascular access planning.",
    citation: "KDIGO CKD-MBD · KHA",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-006",
    specialty: "nephrology",
    subtopic: "AKI KDIGO criteria",
    front_md:
      "KDIGO AKI = {{c1::creatinine rise ≥26.5 µmol/L in 48 h, OR ≥1.5× baseline within 7 days, OR urine output <0.5 mL/kg/h for 6+ hours}}. Triage cause as pre-renal vs intrinsic vs post-renal.",
    back_md:
      "Initial workup: urinalysis (blood/protein/casts), bladder scan, USS KUB if obstruction possible, FBE/UEC/CMP, CK if rhabdomyolysis. Stop nephrotoxins (NSAIDs, ACEi/ARB, metformin, SGLT2i, contrast where possible). Sick-day rules document essential for GP review.",
    citation: "KDIGO AKI · eTG renal",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-007",
    specialty: "nephrology",
    subtopic: "Contrast nephropathy",
    front_md:
      "Contrast-associated AKI risk is now low with iso/low-osmolar agents; key prevention is {{c1::IV isotonic saline 1-1.5 mL/kg/h pre- and post-procedure}} in high-risk patients (eGFR <30, diabetes, heart failure, hypovolaemia) and {{c2::holding nephrotoxins (NSAIDs, diuretics, ACEi/ARB) peri-procedure}}.",
    back_md:
      "N-acetylcysteine no longer routinely recommended (PRESERVE trial). Metformin must be held only if eGFR <30 or with AKI; gadolinium for MRI: avoid group I agents if eGFR <30 (NSF risk). Document risk discussion before non-urgent contrast.",
    citation: "RANZCR · KDIGO · PRESERVE trial",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-008",
    specialty: "nephrology",
    subtopic: "Nephrotic syndrome",
    front_md:
      "Nephrotic syndrome tetrad: {{c1::proteinuria >3.5 g/day (or uPCR >300 mg/mmol), hypoalbuminaemia, oedema, hypercholesterolaemia}}. In adults the commonest primary causes are {{c2::membranous nephropathy and FSGS}}; secondary causes include diabetes, amyloid, SLE, infections.",
    back_md:
      "Refer to nephrology for renal biopsy. Risk of VTE (especially renal vein thrombosis) — anticoagulate if albumin <25. ACE-I/ARB to reduce proteinuria, statin for dyslipidaemia, salt restriction, diuretics for oedema. Pneumococcal and influenza vaccines.",
    citation: "KDIGO Glomerular Diseases · ANZSN",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-009",
    specialty: "nephrology",
    subtopic: "Nephritic syndrome",
    front_md:
      "Nephritic syndrome = {{c1::haematuria (often dysmorphic RBCs ± red cell casts), hypertension, oliguria, AKI, mild-moderate proteinuria}}. In Australian adults the most common primary glomerulonephritis is {{c2::IgA nephropathy}}.",
    back_md:
      "Classic IgA: synpharyngitic macroscopic haematuria 1-2 days after URTI. Investigate with complement (C3/C4), ANA, ANCA, anti-GBM, hep B/C, ASOT, blood and urine cultures, renal biopsy. Manage BP <130/80, ACEi/ARB; immunosuppression if progressive.",
    citation: "KDIGO Glomerular · ANZSN · Murtagh 8th",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-010",
    specialty: "nephrology",
    subtopic: "Rapidly progressive GN",
    front_md:
      "Rapidly progressive glomerulonephritis (e.g. {{c1::ANCA-associated vasculitis, anti-GBM, lupus nephritis}}) presents with AKI + active urine sediment and demands {{c2::same-day nephrology referral and renal biopsy}}; delay = irreversible loss of function.",
    back_md:
      "Send ANCA, anti-GBM, ANA/anti-dsDNA, complement, hep B/C, HIV, urine PCR, blood cultures. Initial immunosuppression (pulsed methylprednisolone, cyclophosphamide or rituximab, plasma exchange in selected) decided by nephrology. Post-streptococcal GN: usually self-limiting; supportive care.",
    citation: "KDIGO Glomerular · ANZSN",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-011",
    specialty: "nephrology",
    subtopic: "Renal colic management",
    front_md:
      "A ureteric stone {{c1::<6 mm}} on CT KUB with controlled pain and no obstruction or infection is managed conservatively with hydration and an {{c2::α-blocker (tamsulosin) as medical expulsive therapy}}; stones >6 mm or persistent obstruction need urological intervention (ESWL or ureteroscopy).",
    back_md:
      "Red flags = solitary kidney, bilateral obstruction, infection (sepsis), AKI → same-day urology and decompression (stent or nephrostomy). Analgesia: NSAIDs first-line if renal function preserved, plus opioids for breakthrough. Strain urine, send stone for analysis.",
    citation: "EAU urolithiasis · RACGP · eTG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-012",
    specialty: "nephrology",
    subtopic: "Calcium stones prevention",
    front_md:
      "Most renal stones in Australia are {{c1::calcium oxalate}}; lifestyle prevention = fluid intake to achieve {{c2::urine output >2-2.5 L/day}}, low sodium (<100 mmol/d), moderate animal protein, normal dietary calcium, and a thiazide if hypercalciuria persists.",
    back_md:
      "Counter-intuitive: LOW dietary calcium increases stones (more oxalate absorption). Citrate (lemon juice, potassium citrate) inhibits stone formation. Reduce oxalate-rich foods only if confirmed hyperoxaluria. Investigate metabolic cause after first stone in young patients or recurrent stones.",
    citation: "RACGP · EAU · NHMRC",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-013",
    specialty: "nephrology",
    subtopic: "Uncomplicated UTI vs upper tract",
    front_md:
      "Differentiate lower UTI (dysuria, frequency, suprapubic pain) from {{c1::pyelonephritis (fever, flank pain, vomiting, systemic features)}}; sterile pyuria suggests {{c2::TB, partially treated UTI, urethritis, or interstitial nephritis}}.",
    back_md:
      "Nitrofurantoin avoided if eGFR <60 (urinary concentrations sub-therapeutic). Pregnancy: SCREEN and treat asymptomatic bacteriuria (cefalexin, nitrofurantoin (not at term), amoxicillin). Recurrent UTI in adult men → urology referral.",
    citation: "eTG Antibiotic · RACGP",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-014",
    specialty: "nephrology",
    subtopic: "Pyelonephritis treatment",
    front_md:
      "Empirical IV therapy for acute pyelonephritis in a non-allergic, non-septic adult per eTG is {{c1::amoxicillin + gentamicin}} (or ceftriaxone monotherapy if gentamicin contraindicated); duration 10-14 days total including step-down to {{c2::oral trimethoprim or amoxicillin-clavulanate guided by susceptibilities}}.",
    back_md:
      "Send urine MCS BEFORE antibiotics; blood cultures if systemic features. Imaging (USS or CT) if no improvement at 48 h, recurrent, complicated, or anatomical concern. Source control (relieve obstruction, drain perinephric abscess) is critical.",
    citation: "eTG Antibiotic · TSANZ",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-015",
    specialty: "nephrology",
    subtopic: "Diabetic nephropathy",
    front_md:
      "In diabetic kidney disease, start an {{c1::ACE-I or ARB irrespective of BP whenever uACR ≥3 mg/mmol}} and add {{c2::an SGLT2 inhibitor (e.g. dapagliflozin, empagliflozin) for renal and cardiovascular protection}} once eGFR ≥20.",
    back_md:
      "HbA1c target individualised; relax to 7.5-8.5% in advanced CKD/older patients due to hypoglycaemia risk. Metformin: continue if eGFR ≥30 with caution. Finerenone (non-steroidal MRA) PBS-listed for T2DM CKD with albuminuria as add-on. Statin for primary prevention in CKD.",
    citation: "KDIGO Diabetes-CKD · KHA · ADS-ADEA",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-016",
    specialty: "nephrology",
    subtopic: "Hyperkalaemia ECG and Rx",
    front_md:
      "ECG features of significant hyperkalaemia progress from {{c1::peaked T waves → PR prolongation → widened QRS → sine wave / VF/asystole}}. First-line stabilisation is {{c2::IV calcium gluconate 10 mL 10% over 10 min}}.",
    back_md:
      "Shift potassium: insulin 10 units + 50 mL 50% dextrose IV; salbutamol 10-20 mg nebulised. Remove: cation-exchange resin (sodium polystyrene sulfonate or patiromer) or dialysis if refractory / oligo-anuric / severe AKI. Stop ACEi, ARB, K+-sparing diuretics, NSAIDs, trimethoprim.",
    citation: "eTG · ARC",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-017",
    specialty: "nephrology",
    subtopic: "Hyponatraemia approach",
    front_md:
      "Workup of hyponatraemia: assess {{c1::volume status, then serum + urine osmolality, and urinary sodium}} — SIADH (euvolaemic, urine osm >100, urine Na >30, low uric acid). Correction rate {{c2::should not exceed 10 mmol/L in any 24-hour period}} (central pontine myelinolysis risk).",
    back_md:
      "Acute symptomatic (seizures, coma) → 3% saline 100 mL bolus, repeat to a max 5 mmol/L rise. Chronic asymptomatic SIADH → fluid restrict, treat underlying cause, consider tolvaptan. Hypovolaemic → cautious saline replacement and re-test frequently.",
    citation: "Hyponatraemia AU guideline · eTG renal",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-018",
    specialty: "nephrology",
    subtopic: "RRT indications",
    front_md:
      "Urgent renal replacement therapy indications spell {{c1::AEIOU — refractory Acidosis, Electrolytes (hyperkalaemia), Intoxication, fluid Overload, Uraemia (pericarditis, encephalopathy)}}; planned RRT in advanced CKD is usually initiated when eGFR is {{c2::approximately 6-10 mL/min/1.73 m² with symptoms}}.",
    back_md:
      "Modalities: haemodialysis (in-centre, satellite, home), peritoneal dialysis, kidney transplant (preferred when eligible). Vascular access (AV fistula) referral when eGFR ~15-20 to allow maturation. Conservative care a valid pathway for frail/elderly — joint decision with renal supportive care.",
    citation: "KDIGO · KHA · ANZSN",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-renal-019",
    specialty: "nephrology",
    subtopic: "Transplant GP role",
    front_md:
      "GP shared-care role for the renal transplant recipient includes {{c1::immunosuppression monitoring (trough tacrolimus / mycophenolate) and watching for drug interactions (CCBs, macrolides, azoles raise tacrolimus levels)}} and {{c2::regular skin cancer surveillance (SCC risk 100×) and avoiding live vaccines}}.",
    back_md:
      "Vaccines: annual influenza, COVID-19, pneumococcal, hep B titres — avoid MMR, VZV, yellow fever, BCG, oral typhoid. Sun protection counselling at every visit; dermatology referral early for any non-healing lesion. CKD-MBD, CVD, diabetes screening ongoing.",
    citation: "ANZSN · TSANZ post-transplant care · RACGP Red Book",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-renal-020",
    specialty: "nephrology",
    subtopic: "ATSI CKD and ESKD equity",
    front_md:
      "Aboriginal and Torres Strait Islander Australians experience {{c1::6-8× higher ESKD incidence}} and significantly lower kidney transplantation rates than non-Indigenous Australians — addressing this requires {{c2::culturally safe care, home haemodialysis access in remote communities, and equitable transplant pathways}}.",
    back_md:
      "Strategies: NACCHO-led community screening, on-Country dialysis (Purple Truck, satellite units), Indigenous Kidney Transplantation Taskforce recommendations, family-based education, interpreter services, addressing structural racism. RACGP and NACCHO position statements explicit.",
    citation: "ANZDATA · IKTT · NACCHO · KHA Closing the Gap",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
