import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 endocrinology high-yield.
// Mirrors flashcards-cardiology.ts conventions — cloze ≤2, AU-cited, no fluff.
export const endocrineFlashcards: Flashcard[] = [
  {
    id: "fc-endo-001",
    specialty: "endocrinology",
    subtopic: "T2DM diagnosis",
    front_md:
      "Type 2 diabetes mellitus is diagnosed in an asymptomatic adult by any one of: HbA1c ≥{{c1::6.5% (48 mmol/mol)}}, fasting plasma glucose ≥7.0, 2-hour OGTT glucose ≥{{c2::11.1 mmol/L}} — confirmed on a separate day.",
    back_md:
      "A single test plus classical symptoms (polyuria, polydipsia, weight loss) or random glucose ≥11.1 is sufficient. HbA1c is unreliable in haemoglobinopathies, recent transfusion, pregnancy, renal failure — use OGTT. RACGP Red Book recommends 3-yearly AUSDRISK screen from 40 (25 for ATSI).",
    citation: "Diabetes Australia · RACGP Red Book · NHMRC",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-002",
    specialty: "endocrinology",
    subtopic: "HbA1c targets",
    front_md:
      "Standard glycaemic target for most adults with T2DM is HbA1c ≤{{c1::7.0% (53 mmol/mol)}}; in frail older adults or those with limited life expectancy the target is {{c2::relaxed (≤8.0%)}} to avoid hypoglycaemia.",
    back_md:
      "Tighter target (≤6.5%) acceptable in younger, newly diagnosed patients without CVD on agents with low hypoglycaemia risk. Pregnancy targets are stricter — fasting 4.0–5.0 and 1-hour postprandial <7.4 (Diabetes Australia ADIPS). Individualise to avoid hypoglycaemia.",
    citation: "Diabetes Australia · RACGP · ADIPS pregnancy targets",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-003",
    specialty: "endocrinology",
    subtopic: "T2DM stepwise",
    front_md:
      "First-line pharmacotherapy for T2DM in Australia remains {{c1::metformin}}; second-line is now preferentially an {{c2::SGLT2 inhibitor or GLP-1 receptor agonist}} for patients with established CVD, heart failure or CKD.",
    back_md:
      "PBS subsidises SGLT2i (empagliflozin, dapagliflozin) and GLP-1RA (semaglutide, dulaglutide) as add-on under criteria. SGLT2i — beware euglycaemic DKA, genitourinary infections, withhold during illness/surgery (sick-day rules). GLP-1RA — GI side-effects, pancreatitis warning. Insulin reserved when triple oral therapy inadequate.",
    citation: "Diabetes Australia · PBS · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-004",
    specialty: "endocrinology",
    subtopic: "DKA diagnosis",
    front_md:
      "Diagnostic triad of diabetic ketoacidosis: glucose >{{c1::11 mmol/L}}, venous pH <{{c2::7.3 (or HCO₃ <15)}}, and ketones ≥3 mmol/L (or moderate-large urine ketones).",
    back_md:
      "Euglycaemic DKA increasingly seen on SGLT2 inhibitors — check ketones even if glucose normal. Always search for a precipitant: Infection, Infarction, Insulin omission, Iatrogenic (steroids), Indiscretion (alcohol). Type 1 onset DKA in ~25% of new paediatric T1DM presentations.",
    citation: "ADS-ADEA DKA guideline · eTG Endocrinology",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-005",
    specialty: "endocrinology",
    subtopic: "DKA management",
    front_md:
      "DKA resuscitation per ADS 2020: IV fluids (1 L 0.9% saline over the first hour), fixed-rate insulin infusion at {{c1::0.1 U/kg/hr}}, and start {{c2::potassium replacement once K⁺ <5.5}}.",
    back_md:
      "Continue basal long-acting insulin throughout. Switch to 5% dextrose + saline once glucose <14 to allow insulin to clear ketones without hypoglycaemia. Watch for cerebral oedema (esp. children — slow fluids, monitor neuro status). Anion gap closure and pH >7.3 = resolution.",
    citation: "ADS-ADEA DKA 2020 · eTG Endocrinology",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-006",
    specialty: "endocrinology",
    subtopic: "HHS",
    front_md:
      "Hyperosmolar hyperglycaemic state typically presents in T2DM with glucose >{{c1::33 mmol/L}}, serum osmolality >320 mOsm/kg, and {{c2::minimal ketosis/acidosis}} (pH >7.3).",
    back_md:
      "Higher mortality than DKA (~10–20%). Rehydrate cautiously over 24–48 hours to avoid cerebral oedema; start insulin only after fluids unless K⁺ low. Look for precipitant — sepsis, MI, CVA, steroids. VTE prophylaxis essential.",
    citation: "ADS-ADEA · eTG Endocrinology",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-007",
    specialty: "endocrinology",
    subtopic: "T1DM presentation",
    front_md:
      "Classical paediatric T1DM presents with the {{c1::3 P's — polyuria, polydipsia, polyphagia}} plus weight loss; ~25% of new diagnoses in Australia present in {{c2::diabetic ketoacidosis}}.",
    back_md:
      "Any child with unexplained enuresis, lethargy, candidiasis or weight loss → fingerprick glucose then formal labs. Don't wait for HbA1c — start insulin and refer same day. Screen for coeliac (anti-tTG) and autoimmune thyroid disease at diagnosis and annually.",
    citation: "Diabetes Australia · APEG · RCH Melbourne CPG",
    mark_sheet_domain: "history",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-008",
    specialty: "endocrinology",
    subtopic: "Hypoglycaemia",
    front_md:
      "Hypoglycaemia in a diabetic patient = blood glucose <{{c1::4.0 mmol/L}} ('4 is the floor'). Conscious + able to swallow → 15 g fast-acting oral glucose; unconscious → {{c2::IM glucagon 1 mg or IV 10% dextrose 100–200 mL}}.",
    back_md:
      "Recheck BGL at 15 minutes, repeat treatment if still <4. Once recovered, give long-acting carbohydrate (sandwich/biscuits). Investigate cause — missed meal, alcohol, sulfonylurea/insulin error. Sulfonylurea hypoglycaemia is prolonged — admit for monitoring + dextrose infusion.",
    citation: "Diabetes Australia · eTG Endocrinology · ANZCOR",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-009",
    specialty: "endocrinology",
    subtopic: "Hyperthyroidism causes",
    front_md:
      "Causes of primary hyperthyroidism by frequency in Australia: {{c1::Graves disease}} (most common, autoimmune), toxic multinodular goitre, toxic adenoma, and {{c2::subacute (De Quervain) thyroiditis}}.",
    back_md:
      "Graves diagnosed by raised TSH-receptor antibodies (TRAb) and diffuse uptake on technetium scan. Thyroiditis = painful goitre, low uptake on scan, transient — symptomatic treatment only. Postpartum thyroiditis presents 3–6 months post-delivery.",
    citation: "ESA position statement · Murtagh 8th ed · eTG Endocrinology",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-010",
    specialty: "endocrinology",
    subtopic: "Graves management",
    front_md:
      "Initial pharmacotherapy for Graves disease in Australia is {{c1::carbimazole 15–45 mg daily titrated to TFTs}} plus a {{c2::beta-blocker (propranolol 20–40 mg QID)}} for symptom control until euthyroid.",
    back_md:
      "Warn about agranulocytosis — sore throat / fever → stop drug, get FBE same day. Definitive options after 12–18 months of antithyroid therapy: radioactive iodine (avoid in pregnancy, breastfeeding, severe orbitopathy) or near-total thyroidectomy. Switch to propylthiouracil in first trimester (carbimazole embryopathy).",
    citation: "ESA · eTG Endocrinology · RANZCOG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-011",
    specialty: "endocrinology",
    subtopic: "Hypothyroidism Rx",
    front_md:
      "Levothyroxine replacement in primary hypothyroidism is titrated to TSH in the lower half of the reference range ({{c1::0.5–2.0 mIU/L}}); recheck TSH ≥{{c2::6 weeks}} after each dose change.",
    back_md:
      "Take on empty stomach, separate from calcium, iron and PPIs by 4 hours. Subclinical hypothyroidism (TSH 4–10, normal T4) — treat if symptomatic, pregnant, anti-TPO positive, or TSH >10. Pregnancy: increase dose by ~25–30% as soon as confirmed, target TSH <2.5 first trimester.",
    citation: "ESA · RACGP · eTG Endocrinology · RANZCOG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-012",
    specialty: "endocrinology",
    subtopic: "Thyroid nodules",
    front_md:
      "Workup of a palpable thyroid nodule begins with TSH and {{c1::thyroid ultrasound}} — high-risk features on ultrasound (TIRADS 4–5: hypoechoic, taller-than-wide, irregular margins, microcalcifications) warrant {{c2::FNA cytology}}.",
    back_md:
      "Sub-cm nodules generally not FNA'd unless suspicious features or high-risk patient (prior neck irradiation, family history of MTC). Bethesda classification for cytology guides surgery vs surveillance. Hot nodule on scan (suppressed TSH) — virtually never malignant.",
    citation: "ATA · ESA · RANZCR · Murtagh 8th ed",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-013",
    specialty: "endocrinology",
    subtopic: "Cushing's screen",
    front_md:
      "First-line outpatient screening tests for Cushing's syndrome are {{c1::24-hour urinary free cortisol, late-night salivary cortisol, or 1-mg overnight dexamethasone suppression test}} — ≥2 abnormal tests needed before localisation.",
    back_md:
      "Once confirmed, plasma ACTH distinguishes ACTH-dependent (pituitary adenoma = Cushing disease, ectopic ACTH) from ACTH-independent (adrenal adenoma/carcinoma). High-dose dex suppression and pituitary MRI/IPSS for localisation. Exclude exogenous steroid first — by far the commonest cause.",
    citation: "ESA · Endocrine Society · eTG Endocrinology",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-014",
    specialty: "endocrinology",
    subtopic: "Addison's",
    front_md:
      "Diagnostic test of choice for primary adrenal insufficiency is the {{c1::short Synacthen (250 µg) test}} — inadequate cortisol rise to <500 nmol/L at 30/60 min confirms the diagnosis.",
    back_md:
      "Primary (Addison's) = high ACTH, low cortisol, low aldosterone → hyperpigmentation, hyperkalaemia, hyponatraemia. Lifelong hydrocortisone (15–25 mg/day split) + fludrocortisone 0.05–0.2 mg. Sick-day rules: double dose with febrile illness, IM hydrocortisone if vomiting. MedicAlert bracelet essential.",
    citation: "ESA · eTG Endocrinology · Murtagh 8th ed",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-015",
    specialty: "endocrinology",
    subtopic: "Secondary HTN screen",
    front_md:
      "Screening for primary hyperaldosteronism (Conn's) in a hypertensive patient uses the {{c1::aldosterone-to-renin ratio}}; for phaeochromocytoma the first-line test is {{c2::plasma free or 24-hour urinary fractionated metanephrines}}.",
    back_md:
      "Indications for screening: resistant HTN, HTN with hypokalaemia, adrenal incidentaloma, family history, age <40 with HTN. Stop spironolactone, eplerenone, ACEi/ARBs (interfere with ARR); avoid TCAs, caffeine prior to metanephrines. Confirmation = salt-load suppression / clonidine suppression.",
    citation: "ESA · Endocrine Society · eTG",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-016",
    specialty: "endocrinology",
    subtopic: "Hyponatraemia approach",
    front_md:
      "Hyponatraemia work-up: first classify by {{c1::volume status (hypovolaemic / euvolaemic / hypervolaemic)}}, then check {{c2::serum + urine osmolality and urine sodium}} to refine the cause (SIADH, true volume depletion, CCF/cirrhosis).",
    back_md:
      "SIADH = euvolaemic, urine osm >100, urine Na >30, normal TFTs and cortisol. Acute symptomatic (seizures, coma) → 3% saline 150 mL bolus. Chronic correction limit ≤10 mmol/L in 24 h, ≤18 mmol/L in 48 h to avoid osmotic demyelination (central pontine myelinolysis).",
    citation: "ESA · eTG Endocrinology · Murtagh 8th ed",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-017",
    specialty: "endocrinology",
    subtopic: "Hyperkalaemia",
    front_md:
      "Immediate management of hyperkalaemia with ECG changes (peaked T waves, wide QRS) is {{c1::IV calcium gluconate 10 mL of 10% over 2 min}} (cardio-protection) followed by {{c2::insulin 10 U IV + 50 mL of 50% dextrose}} to shift K⁺ intracellularly.",
    back_md:
      "Adjuncts: salbutamol 10–20 mg nebulised, sodium bicarbonate if acidotic. Definitive removal — loop diuretic if euvolaemic, resonium PO/PR, dialysis for refractory. Stop offending drugs: ACEi/ARB, spironolactone, NSAIDs, trimethoprim. Repeat ECG and K⁺ every 30–60 min.",
    citation: "ANZCOR ALS · eTG Endocrinology · CARI",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-018",
    specialty: "endocrinology",
    subtopic: "Osteoporosis diagnosis",
    front_md:
      "Osteoporosis on DEXA is defined by a T-score ≤{{c1::-2.5}} at the hip or spine; treatment is also indicated after a {{c2::minimal-trauma fracture}} regardless of T-score.",
    back_md:
      "Use Garvan or FRAX (AU calibrated) to estimate 5-/10-year fracture risk in osteopenia. RACGP recommends DEXA at 50 with risk factors, all women ≥70 and men ≥70. Baseline workup: Ca, PO₄, vit D, PTH, TSH, testosterone (men), coeliac serology, urine Bence-Jones (myeloma).",
    citation: "RACGP osteoporosis guideline · Osteoporosis Australia · PBS",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-019",
    specialty: "endocrinology",
    subtopic: "Osteoporosis Rx",
    front_md:
      "First-line PBS-subsidised therapy for postmenopausal osteoporosis is {{c1::oral bisphosphonate (alendronate 70 mg weekly or risedronate 35 mg weekly)}} with calcium 1000–1300 mg/day and vitamin D ≥{{c2::800 IU/day}}.",
    back_md:
      "Take fasting with water, remain upright 30 min (oesophagitis). Review need at 5 years (oral) or 3 years (IV zoledronate) — drug holiday for low-risk. Denosumab 60 mg SC 6-monthly is alternative; never miss a dose (rebound vertebral fractures). Romosozumab for very high risk.",
    citation: "PBS · RACGP · Osteoporosis Australia · TGA",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-020",
    specialty: "endocrinology",
    subtopic: "PCOS Rotterdam",
    front_md:
      "Rotterdam criteria diagnose PCOS when ≥{{c1::2 of 3}} are present: oligo/anovulation, clinical or biochemical hyperandrogenism, and {{c2::polycystic ovaries on ultrasound (≥20 follicles per ovary or volume >10 mL)}}.",
    back_md:
      "Exclude thyroid disease, hyperprolactinaemia, non-classical CAH (17-OHP), Cushing's. Long-term risks: T2DM, gestational diabetes, endometrial hyperplasia/cancer, dyslipidaemia, NAFLD, OSA, depression. CESPHN AU evidence-based PCOS guideline (Monash) is the AU reference.",
    citation: "Monash International PCOS Guideline 2023 · RANZCOG · RACGP",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-021",
    specialty: "endocrinology",
    subtopic: "PCOS management",
    front_md:
      "First-line management of PCOS with menstrual irregularity / hyperandrogenism (not seeking pregnancy) is {{c1::lifestyle modification plus combined oral contraceptive pill}}; {{c2::metformin}} is added if there is impaired glucose tolerance or BMI ≥25 to improve metabolic profile.",
    back_md:
      "Letrozole is now first-line ovulation induction (preferred over clomiphene) — refer to fertility specialist. Annual OGTT/HbA1c, BP, lipids. Screen mental health (anxiety, depression, eating disorders). Endometrial protection — ensure withdrawal bleed at least every 3 months.",
    citation: "Monash International PCOS Guideline 2023 · RANZCOG · eTG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-endo-022",
    specialty: "endocrinology",
    subtopic: "Gestational diabetes",
    front_md:
      "Universal AU screening for gestational diabetes uses the {{c1::75 g OGTT at 24–28 weeks}}; diagnostic ADIPS thresholds are fasting ≥{{c2::5.1, 1-h ≥10.0, 2-h ≥8.5 mmol/L}} (any one).",
    back_md:
      "Early OGTT at booking for high-risk women (prior GDM, BMI ≥30, PCOS, family history, ATSI, South-Asian/Pacific origin). First-line is diet + exercise + SMBG; add insulin (metformin acceptable adjunct) if targets not met. Postnatal OGTT at 6–12 weeks then 3-yearly screen — 50% lifetime T2DM risk.",
    citation: "ADIPS 2014 · RANZCOG · Diabetes Australia",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
];
