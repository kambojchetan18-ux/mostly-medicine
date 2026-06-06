import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 rheumatology high-yield.
// Mirrors flashcards-gastro.ts conventions — cloze ≤2, AU-cited, no fluff.
export const rheumatologyFlashcards: Flashcard[] = [
  {
    id: "fc-rheum-001",
    specialty: "rheumatology",
    subtopic: "RA diagnosis",
    front_md:
      "Rheumatoid arthritis is diagnosed by the ACR/EULAR 2010 score ≥6/10 — combining joint distribution, serology ({{c1::rheumatoid factor + anti-CCP}}), acute-phase reactants, and symptom duration ≥{{c2::6 weeks}}.",
    back_md:
      "Anti-CCP has higher specificity (~95%) and predicts erosive disease. Plain hand X-rays show juxta-articular osteopenia and marginal erosions (MCP/PIP). Early aggressive DMARD therapy within the 12-week 'window of opportunity' alters long-term joint outcomes.",
    citation: "ACR/EULAR 2010 · ARA RA guidelines",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-002",
    specialty: "rheumatology",
    subtopic: "RA DMARD escalation",
    front_md:
      "First-line DMARD for moderate-severe RA is {{c1::methotrexate (start 10–15 mg weekly, titrate to 25 mg)}} with folic acid 5 mg weekly on a non-MTX day. PBS Authority biologics (anti-TNFα, JAK-i) follow failure/intolerance of {{c2::at least two conventional DMARDs}}.",
    back_md:
      "Combination conventional DMARDs (MTX + sulfasalazine + hydroxychloroquine — 'triple therapy') can match early biologic response. Screen TB (IGRA), hep B/C, HIV, varicella before biologic. Counsel re: live-vaccine avoidance, infection signs, pregnancy planning (MTX teratogenic — stop ≥3 months pre-conception).",
    citation: "ARA · PBS Authority",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-003",
    specialty: "rheumatology",
    subtopic: "Gout acute",
    front_md:
      "Acute gout flare first-line is {{c1::oral colchicine 1 mg stat then 0.5 mg one hour later (max 1.5 mg in 24 h)}} or NSAID; intra-articular steroid if monoarticular. Long-term urate-lowering with allopurinol targets serum urate <{{c2::0.36 mmol/L (0.30 if tophi)}}.",
    back_md:
      "Synovial fluid: needle-shaped, negatively birefringent monosodium urate crystals. Start allopurinol 50–100 mg, uptitrate every 2–4 weeks; cover initiation with colchicine 0.5 mg BD for 3–6 months to prevent paradoxical flare. HLA-B*5801 testing pre-allopurinol in high-risk ancestries (Han Chinese, Thai, Korean).",
    citation: "ARA gout guideline · eTG Rheumatology",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-004",
    specialty: "rheumatology",
    subtopic: "Pseudogout",
    front_md:
      "Synovial fluid showing rhomboid-shaped {{c1::positively birefringent}} calcium pyrophosphate crystals with chondrocalcinosis on X-ray (e.g. wrist triangular fibrocartilage, knee menisci) = {{c2::pseudogout / CPPD arthropathy}}.",
    back_md:
      "Acute pseudogout flare treated like gout — NSAID, colchicine, or intra-articular steroid. No urate-lowering equivalent. Screen for associations: haemochromatosis, hyperparathyroidism, hypomagnesaemia, hypophosphataemia — especially in patient <60 with chondrocalcinosis.",
    citation: "eTG Rheumatology · ARA",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-005",
    specialty: "rheumatology",
    subtopic: "Septic arthritis",
    front_md:
      "Acute hot, swollen, immobile single joint = septic arthritis until proven otherwise. Immediate {{c1::joint aspiration for Gram stain, culture, crystals, cell count}} BEFORE empirical IV {{c2::flucloxacillin 2 g 6-hourly (add ceftriaxone if Gram-negative suspected)}}.",
    back_md:
      "Synovial WCC >50 × 10⁹/L with neutrophil predominance suggests sepsis. Most common organism is S. aureus; consider gonococcal in young sexually-active (tenosynovitis + dermatitis). Native knee usually requires arthroscopic washout; prosthetic joint → orthopaedic infection unit. Do NOT delay antibiotics waiting for aspirate result if patient septic.",
    citation: "eTG Antibiotic · ARA septic arthritis",
    mark_sheet_domain: "safety_net",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-006",
    specialty: "rheumatology",
    subtopic: "Ankylosing spondylitis",
    front_md:
      "Inflammatory back pain (<45 yr, morning stiffness >30 min, improves with exercise, alternating buttock pain) + sacroiliitis on MRI + {{c1::HLA-B27 positive}} → axial spondyloarthritis / AS. First-line is {{c2::NSAID + structured exercise}}; biologic (TNFα or IL-17 inhibitor) if persistent disease activity.",
    back_md:
      "Late X-ray finding = 'bamboo spine' from syndesmophyte fusion. Screen for extra-articular: anterior uveitis (urgent ophthalmology), psoriasis, IBD. Counsel re: osteoporosis fracture risk (rigid spine), cardiovascular disease elevation. Smoking cessation strongly indicated.",
    citation: "ARA · ASAS · eTG Rheumatology",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-007",
    specialty: "rheumatology",
    subtopic: "SLE",
    front_md:
      "Systemic lupus erythematosus screening starts with {{c1::ANA (high sensitivity, low specificity)}}; specific antibodies include anti-dsDNA and anti-Sm. Baseline organ workup mandatory — {{c2::urine ACR + microscopy to detect lupus nephritis}}.",
    back_md:
      "Hydroxychloroquine is the backbone of all SLE management (reduces flares, improves survival) — ophthalmology baseline + annual screening for retinal toxicity from 5 years. Methotrexate, mycophenolate, belimumab, rituximab for organ involvement. Avoid sulfonamides + sun exposure (flare triggers).",
    citation: "EULAR/ACR 2019 SLE · ARA",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-008",
    specialty: "rheumatology",
    subtopic: "Polymyalgia rheumatica",
    front_md:
      "PMR in a patient >50 with bilateral shoulder + pelvic-girdle pain and stiffness >45 min, ESR/CRP raised, responds dramatically to {{c1::prednisolone 15 mg daily}} within 48–72 h. Failure to respond should prompt reconsideration of {{c2::diagnosis (e.g. RA, myositis, malignancy)}}.",
    back_md:
      "Slow taper over 12–24 months; PPI + calcium + vitamin D + bone protection if expected duration >3 months. Up to 20% develop concurrent giant-cell arteritis — counsel re: headache, jaw claudication, visual symptoms requiring same-day review.",
    citation: "BSR/ARA PMR guideline · eTG Rheumatology",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-009",
    specialty: "rheumatology",
    subtopic: "Giant cell arteritis",
    front_md:
      "Suspected GCA (new headache, jaw claudication, scalp tenderness, visual disturbance, ESR/CRP raised in patient >50) requires {{c1::immediate prednisolone 40–60 mg PO (or 1 g methylprednisolone IV if visual loss)}} — do NOT wait for {{c2::temporal artery biopsy}}.",
    back_md:
      "Biopsy remains positive up to 2 weeks post-steroid commencement. Refer same-day ophthalmology if any visual symptom. Adjunct tocilizumab (IL-6) is PBS Authority steroid-sparing. Risk of aortitis — image with PET-CT or MR angiogram if persistent CRP elevation.",
    citation: "EULAR GCA · ARA · eTG Rheumatology",
    mark_sheet_domain: "safety_net",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-010",
    specialty: "rheumatology",
    subtopic: "Reactive arthritis",
    front_md:
      "Reactive arthritis follows {{c1::Chlamydia trachomatis genitourinary or post-dysenteric (Salmonella, Shigella, Campylobacter, Yersinia) infection}} 1–4 weeks earlier. Classic triad — {{c2::arthritis + urethritis + conjunctivitis}} — plus enthesitis, keratoderma blennorrhagicum.",
    back_md:
      "Treat the underlying infection (azithromycin / doxycycline for chlamydia) and symptomatic arthritis with NSAID. Most resolve within 12 months. HLA-B27 positive in ~50%. Screen for STIs and counsel partner notification.",
    citation: "ARA · eTG Sexually transmitted",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-011",
    specialty: "rheumatology",
    subtopic: "ANCA vasculitis",
    front_md:
      "ANCA-associated vasculitides — {{c1::granulomatosis with polyangiitis (c-ANCA/PR3), microscopic polyangiitis (p-ANCA/MPO), eosinophilic granulomatosis (Churg-Strauss)}} — present with multisystem disease including ENT, pulmonary haemorrhage and {{c2::rapidly progressive glomerulonephritis}}.",
    back_md:
      "Urgent referral — induction with high-dose corticosteroid + cyclophosphamide or rituximab; maintenance with rituximab or azathioprine. Plasma exchange in severe pulmonary-renal syndrome. Anti-GBM (Goodpasture) and PAN are distinct from ANCA-associated.",
    citation: "EULAR vasculitis · ARA",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-012",
    specialty: "rheumatology",
    subtopic: "Soft tissue rheumatism",
    front_md:
      "Common soft-tissue diagnoses for AMC: rotator cuff impingement (painful arc 60–120°), {{c1::adhesive capsulitis (frozen shoulder)}} with global passive ROM loss, lateral epicondylitis (tennis elbow), and {{c2::plantar fasciitis}} with first-step morning heel pain.",
    back_md:
      "Conservative care = relative rest + analgesia + targeted physiotherapy ± image-guided corticosteroid injection. Frozen shoulder progresses through freezing, frozen, thawing phases over 18–24 months. Repeated steroid injections risk tendon rupture — limit to 3 per site per year.",
    citation: "RACGP MSK · Murtagh 8th",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-013",
    specialty: "rheumatology",
    subtopic: "Fibromyalgia",
    front_md:
      "Fibromyalgia diagnostic criteria require widespread pain ≥{{c1::3 months}} plus fatigue, unrefreshing sleep and cognitive symptoms. Cornerstone treatment is {{c2::graded exercise, sleep hygiene and CBT}}; adjuncts amitriptyline, duloxetine or pregabalin.",
    back_md:
      "Avoid opioids (no efficacy, dependence risk). Screen for and treat co-existent depression, anxiety, OSA. Validate the patient's experience — diagnosis is positive, not exclusionary. Chronic Disease Management plan + allied health.",
    citation: "ARA · eTG Pain · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-014",
    specialty: "rheumatology",
    subtopic: "Osteoarthritis",
    front_md:
      "Knee OA first-line management is {{c1::weight loss + structured exercise (land or aquatic)}} plus paracetamol; topical or short-course oral NSAID for flares. Intra-articular corticosteroid offers short-term relief; refer for {{c2::total knee replacement}} when pain + functional impairment refractory to conservative care.",
    back_md:
      "Glucosamine, chondroitin, intra-articular hyaluronic acid not recommended (no consistent benefit). Avoid long-term NSAID in elderly / CV / CKD; consider topical NSAID + paracetamol. CDM + allied health (physio, exercise physiologist, dietitian) on GPMP.",
    citation: "RACGP knee OA guideline · ARA",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-015",
    specialty: "rheumatology",
    subtopic: "Drug-induced lupus",
    front_md:
      "Classic drug-induced lupus culprits are {{c1::hydralazine, procainamide, isoniazid, minocycline, anti-TNFα biologics}}. Serology shows ANA + {{c2::anti-histone antibody}} positive, with anti-dsDNA usually negative.",
    back_md:
      "Symptoms (arthralgia, serositis, rash) typically resolve within weeks of stopping the offending agent; renal and CNS involvement rare. Document the drug as an allergy/adverse reaction in My Health Record.",
    citation: "ARA · eTG Rheumatology",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-rheum-016",
    specialty: "rheumatology",
    subtopic: "Osteoporosis",
    front_md:
      "Osteoporosis is diagnosed on DEXA T-score ≤{{c1::-2.5}} at lumbar spine, hip or femoral neck (or on a minimal-trauma fracture). First-line pharmacotherapy is {{c2::oral bisphosphonate (alendronate 70 mg weekly or risedronate 35 mg weekly)}}; denosumab 60 mg SC q6-monthly for intolerance/CKD.",
    back_md:
      "PBS Authority covers bisphosphonates / denosumab for T≤-2.5, minimal-trauma fracture, or long-term steroid ≥7.5 mg pred for ≥3 months. Optimise calcium 1300 mg/day + vitamin D ≥50 nmol/L. FRAX 10-year risk guides treatment in osteopenia. Teriparatide PBS Authority for severe / refractory disease. Counsel re: dental check before bisphosphonate (ONJ risk).",
    citation: "ANZBMS · RACGP osteoporosis · PBS Authority",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
];
