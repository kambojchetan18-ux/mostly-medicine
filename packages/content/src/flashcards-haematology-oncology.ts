import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 haematology + oncology
// high-yield: AU screening programs (NBCSP / BreastScreen / NCSP), Authority
// scripts, urgent haematology referrals.
export const haematologyOncologyFlashcards: Flashcard[] = [
  {
    id: "fc-haemonc-001",
    specialty: "haematology_oncology",
    subtopic: "Iron deficiency anaemia",
    front_md:
      "Hypochromic microcytic anaemia with {{c1::ferritin <30 µg/L}} confirms iron-deficiency anaemia; first-line is {{c2::oral elemental iron 100-200 mg daily for at least 3-6 months past Hb normalisation}}.",
    back_md:
      "Ferritin <30 specific even in inflammation (cut-off rises to <100 if CRP elevated or chronic disease). IV iron (ferric carboxymaltose, ferric derisomaltose) if oral intolerance, malabsorption, ongoing losses, or pregnancy >2nd trimester. Workup the cause: coeliac serology, iFOBT/colonoscopy in >50 or post-menopausal women.",
    citation: "RACGP Red Book · Murtagh 8th · GESA",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-002",
    specialty: "haematology_oncology",
    subtopic: "B12 and folate",
    front_md:
      "Macrocytic anaemia with low B12 and low folate — replace {{c1::B12 BEFORE folate}} to avoid {{c2::precipitating or worsening subacute combined degeneration of the cord}}.",
    back_md:
      "B12 replacement: IM hydroxocobalamin 1 mg alternate days ×3 (or 5-7 doses if neuro), then 1 mg every 2-3 months for life if pernicious anaemia/malabsorption. Folate 5 mg PO daily 4 months. Always test serum methylmalonic acid + homocysteine if B12 borderline. Pernicious anaemia → intrinsic factor antibodies.",
    citation: "RACGP · Murtagh 8th · BCSH",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-003",
    specialty: "haematology_oncology",
    subtopic: "Haemolytic anaemia",
    front_md:
      "Lab clues to haemolysis: raised {{c1::LDH and unconjugated bilirubin}}, low haptoglobin, reticulocytosis. A {{c2::positive direct antiglobulin (Coombs) test}} points to autoimmune haemolytic anaemia (warm IgG most common).",
    back_md:
      "Coombs-negative haemolysis → intrinsic RBC defects (hereditary spherocytosis, G6PD deficiency, sickle, thalassaemia) or mechanical (TTP, HUS, prosthetic valve). AIHA: prednisolone 1 mg/kg, ± rituximab; check for underlying lymphoma, SLE, drugs. Urgent haematology referral if rapidly falling Hb.",
    citation: "BCSH · Murtagh 8th",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-004",
    specialty: "haematology_oncology",
    subtopic: "Anaemia of chronic disease",
    front_md:
      "Normocytic anaemia with low serum iron, low TIBC, normal/high ferritin and raised CRP = {{c1::anaemia of chronic disease/inflammation}}; the priority is {{c2::treat the underlying disease}}, not iron supplementation.",
    back_md:
      "Hepcidin (raised in inflammation) blocks iron release from stores → functional iron deficiency. Common in CKD, malignancy, RA, IBD. ESA only if Hb <100 in CKD after iron repletion. Be cautious — ESA targets Hb 100-115, NOT normal (raised stroke/thrombosis risk above).",
    citation: "KDIGO · Murtagh 8th",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-005",
    specialty: "haematology_oncology",
    subtopic: "Thalassaemia screening",
    front_md:
      "A patient of Mediterranean or SE-Asian background with microcytic anaemia, normal ferritin, and Mentzer index <13 should have {{c1::Hb electrophoresis or HPLC}} performed. {{c2::Antenatal carrier screening of both partners}} is recommended in at-risk populations.",
    back_md:
      "α-thalassaemia trait often missed on electrophoresis — DNA analysis needed. Beta-thalassaemia trait: raised HbA2. Iron supplementation harmful in non-deficient thalassaemia carriers. Pre-conception genetic counselling if both partners carriers — 25% risk of severe disease.",
    citation: "RANZCOG · Thalassaemia Australia · RACGP",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-006",
    specialty: "haematology_oncology",
    subtopic: "Hereditary haemochromatosis",
    front_md:
      "Australia's most common hereditary iron-overload condition is {{c1::HFE C282Y homozygosity}}; treatment is {{c2::weekly venesection 500 mL until ferritin <50}}, then maintenance 3-4 times yearly.",
    back_md:
      "Workup triggered by raised transferrin saturation (>45%) ± ferritin. Carrier rate ~1 in 200 Anglo-Celtic Australians. Screen first-degree relatives. End-organ surveillance: LFTs, glucose, echocardiogram, joint review, hepatocellular carcinoma surveillance if cirrhotic.",
    citation: "RACGP Red Book · GESA · Haemochromatosis Australia",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-007",
    specialty: "haematology_oncology",
    subtopic: "Acute leukaemia red flags",
    front_md:
      "An adult with pancytopenia and {{c1::≥20% blasts on peripheral film or bone marrow}} has acute leukaemia and requires {{c2::same-day haematology referral}}; pre-treatment risks include tumour lysis, neutropenic sepsis and DIC (APL).",
    back_md:
      "Don't transfuse platelets prophylactically pre-referral unless bleeding (some protocols). Send DIC screen, urate, K+, phosphate, calcium. Suspect APL (M3) if bleeding + low fibrinogen → all-trans retinoic acid (ATRA) urgently while awaiting cytogenetics. Discuss fertility preservation before chemotherapy.",
    citation: "Cancer Council AU · Haematology Society of Australia/NZ",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-008",
    specialty: "haematology_oncology",
    subtopic: "Lymphoma staging",
    front_md:
      "Lymphoma B-symptoms = {{c1::fevers, drenching night sweats, and weight loss >10% in 6 months}}. Standard staging is {{c2::PET-CT}}; first-line therapy for DLBCL is R-CHOP.",
    back_md:
      "Hodgkin lymphoma: bimodal age, Reed-Sternberg cells, ABVD ± radiotherapy; excellent cure rates. Non-Hodgkin (DLBCL most common aggressive subtype): rituximab + CHOP every 21 days ×6. Pre-treatment: echocardiogram (anthracycline), hep B/C/HIV, fertility counselling.",
    citation: "Cancer Council AU · eviQ protocols",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-009",
    specialty: "haematology_oncology",
    subtopic: "Multiple myeloma CRAB",
    front_md:
      "Multiple myeloma end-organ damage = {{c1::CRAB — hyperCalcaemia, Renal insufficiency, Anaemia, Bone lesions}}, plus marrow plasma cells {{c2::≥10%}} on bone marrow biopsy.",
    back_md:
      "Initial workup: SPEP + serum free light chains + immunofixation, urine Bence-Jones, skeletal survey (low-dose whole-body CT or PET-CT preferred over X-ray series). MGUS = monoclonal protein, no end-organ damage; smouldering myeloma between. Manage by haematologist; bisphosphonates / denosumab for skeletal events.",
    citation: "International Myeloma Working Group · eviQ",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-010",
    specialty: "haematology_oncology",
    subtopic: "DVT/PE workup",
    front_md:
      "In a haemodynamically stable adult, suspected DVT/PE is risk-stratified with the {{c1::Wells score}}; low risk + negative {{c2::age-adjusted D-dimer}} excludes VTE without imaging.",
    back_md:
      "Confirmed DVT/PE: DOAC (apixaban or rivaroxaban) 3-6 months. Cancer-associated VTE: edoxaban or rivaroxaban now preferred over LMWH in most cases (CARAVAGGIO). Unprovoked VTE → screen for occult malignancy clinically + age-appropriate cancer screening; thrombophilia testing rarely changes management.",
    citation: "Thrombosis Australia · eTG cardiovascular · NICE NG158",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-011",
    specialty: "haematology_oncology",
    subtopic: "Thrombophilia testing",
    front_md:
      "Thrombophilia screening (Factor V Leiden, prothrombin gene, antithrombin, protein C/S, antiphospholipid) should be performed {{c1::AFTER stopping anticoagulation}} and {{c2::only when results would change management}} (e.g. recurrent VTE, unusual sites, young patient with family history).",
    back_md:
      "Anticoagulants and acute thrombosis distort results. Routine testing after a single provoked VTE is NOT recommended (does not predict recurrence). Antiphospholipid syndrome is the most actionable — warfarin (target INR 2-3) preferred over DOACs in triple-positive APS.",
    citation: "Thrombosis Australia · BSH guidelines",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-012",
    specialty: "haematology_oncology",
    subtopic: "BreastScreen Australia",
    front_md:
      "BreastScreen Australia invites women aged {{c1::50-74}} to free biennial mammography; women aged {{c2::40-49 and ≥75}} may self-refer and receive a free screen.",
    back_md:
      "High-risk (BRCA1/2, strong family history, prior chest XRT, Li-Fraumeni): annual MRI + mammography from 30 (or 5-10 years before youngest affected relative). Symptomatic breast lump → triple assessment (clinical, imaging, FNA/core), not screening pathway.",
    citation: "BreastScreen Australia · Cancer Council AU · RACGP Red Book",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-013",
    specialty: "haematology_oncology",
    subtopic: "BRCA1/2 testing",
    front_md:
      "Red flags for hereditary breast/ovarian cancer requiring {{c1::familial cancer centre referral}}: ≥3 first/second-degree relatives with breast/ovarian/prostate/pancreas cancer, breast cancer <40, bilateral breast cancer, ovarian cancer at any age, or {{c2::Ashkenazi Jewish heritage with breast/ovarian cancer}}.",
    back_md:
      "MBS-funded BRCA testing for eligible probands and affected relatives. Carriers: risk-reducing mastectomy and BSO (after childbearing) reduce mortality. Annual MRI + mammography from 30. PARP inhibitor olaparib PBS-listed for BRCA-mutated advanced ovarian and metastatic breast cancer.",
    citation: "eviQ Cancer Genetics · MBS · Cancer Council AU",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-014",
    specialty: "haematology_oncology",
    subtopic: "NBCSP bowel screening",
    front_md:
      "The National Bowel Cancer Screening Program mails an iFOBT every {{c1::2 years from age 45 to 74}} (lowered from 50 in 2024); a positive kit warrants colonoscopy within {{c2::30 days}}.",
    back_md:
      "Average risk = NHMRC Cat 1, iFOBT pathway. Cat 2 (one FDR with CRC <55, or two FDRs any age) = 5-yearly colonoscopy from 50 (or 10 y before youngest case). Cat 3 (FAP, Lynch suspected) → familial cancer service. RACGP prompts opportunistic NBCSP recommendation at every visit in eligible age band.",
    citation: "Department of Health AU · NHMRC CRC surveillance · RACGP Red Book",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-015",
    specialty: "haematology_oncology",
    subtopic: "Prostate cancer screening",
    front_md:
      "Australia has {{c1::no population PSA screening program}}; PSA testing is a {{c2::shared decision}} for men 50-69 with ≥7 years life expectancy. Abnormal PSA → multiparametric MRI before considering targeted biopsy.",
    back_md:
      "RACGP advises against PSA in men <50 or >70 without symptoms. Family history (FDR <65, BRCA2): start discussion from 40-45. MRI-targeted transperineal biopsy reduces over-detection of clinically insignificant disease. Active surveillance for low-risk localised disease.",
    citation: "RACGP Red Book · PCFA / Cancer Council AU",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-016",
    specialty: "haematology_oncology",
    subtopic: "Cervical screening NCSP",
    front_md:
      "Since 2017 the National Cervical Screening Program uses {{c1::primary HPV testing every 5 years for people aged 25-74}}; from 2022 {{c2::self-collected vaginal swab}} is available for all eligible participants.",
    back_md:
      "Exit screen 70-74. HPV 16/18 positive → straight to colposcopy. Other oncogenic HPV → reflex LBC. Continue 2-yearly co-test for DES-exposed, treated HSIL, and immunocompromised. Pregnancy: routine screen still due if timing falls within antenatal period.",
    citation: "NCSP Clinical Guidelines · Department of Health AU",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-017",
    specialty: "haematology_oncology",
    subtopic: "Lung cancer referral",
    front_md:
      "Red-flag presentations mandating {{c1::urgent (within 2 weeks) chest imaging and respiratory referral}}: haemoptysis in a smoker ≥40, persistent unexplained cough >3 weeks, unexplained weight loss + finger clubbing, persistent unilateral hilar abnormality, or recurrent same-lobe pneumonia.",
    back_md:
      "Australia is implementing a National Lung Cancer Screening Program (low-dose CT for high-risk current/former smokers aged 50-70 with ≥30 pack-years) — rollout from 2025. Until then no population screening. CXR insensitive; CT chest is the gateway investigation if suspicion remains.",
    citation: "Cancer Council AU · RACGP Red Book · MSAC",
    mark_sheet_domain: "ddx",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-018",
    specialty: "haematology_oncology",
    subtopic: "Cancer pain WHO ladder",
    front_md:
      "WHO cancer pain ladder: step 1 paracetamol ± NSAID, step 2 weak opioid (codeine, tramadol) ± step 1, step 3 strong opioid (morphine, oxycodone, hydromorphone). Breakthrough dose = {{c1::1/6 of the total 24-hour background opioid}}, available {{c2::1-2 hourly PRN}}.",
    back_md:
      "Always co-prescribe a stimulant laxative (e.g. senna + macrogol) and anti-emetic for first 5 days. Renal impairment → hydromorphone or fentanyl over morphine. Neuropathic: add pregabalin/gabapentin or amitriptyline. Refer to palliative care early.",
    citation: "eTG Palliative Care · WHO · Palliative Care Australia",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-019",
    specialty: "haematology_oncology",
    subtopic: "Febrile neutropenia",
    front_md:
      "Febrile neutropenia = single temp ≥38.3 °C or sustained ≥38.0 °C with {{c1::ANC <0.5 ×10⁹/L}}; give broad-spectrum antibiotic ({{c2::piperacillin-tazobactam 4.5 g IV}}) within {{c2::1 hour}} of presentation.",
    back_md:
      "Add vancomycin if line sepsis, mucositis, MRSA risk, or septic shock. MASCC score ≥21 may allow outpatient oral management in selected low-risk patients with reliable follow-up. Common errors: delaying first dose for cultures, missing tumour lysis or neutropenic enterocolitis (typhlitis).",
    citation: "eTG Antibiotic · COSA febrile neutropenia",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-020",
    specialty: "haematology_oncology",
    subtopic: "Tumour lysis syndrome",
    front_md:
      "Tumour lysis syndrome features {{c1::hyperuricaemia, hyperkalaemia, hyperphosphataemia and hypocalcaemia}}; prophylaxis in high-risk haematological malignancy is {{c2::IV hydration + allopurinol (low risk) or rasburicase (high risk)}}.",
    back_md:
      "Highest risk: high-burden Burkitt/ALL, bulky aggressive lymphoma, high LDH. Avoid potassium-containing fluids. Rasburicase contraindicated in G6PD deficiency (haemolysis). Monitor electrolytes 6-12 hourly during first 72 h of chemo; dialysis for refractory hyperkalaemia or oligo-anuric AKI.",
    citation: "eviQ · Cancer Council AU",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-haemonc-021",
    specialty: "haematology_oncology",
    subtopic: "Immunotherapy melanoma",
    front_md:
      "Adjuvant therapy for resected stage III melanoma in Australia includes the PD-1 inhibitor {{c1::pembrolizumab or nivolumab via PBS Authority}} for 12 months; key adverse events to flag urgently are {{c2::immune-related thyroiditis, hepatitis, colitis, pneumonitis and hypophysitis}}.",
    back_md:
      "GP role: educate on irAEs, baseline + monthly TFTs, LFTs, cortisol, fasting glucose. Steroids (prednisolone 1-2 mg/kg) for grade ≥2 toxicity, withholding immunotherapy. Skin: dermoscopic surveillance and sun-safety advice ongoing. Refer back to oncology promptly for any new symptom.",
    citation: "PBS · eviQ · Melanoma Institute Australia",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
