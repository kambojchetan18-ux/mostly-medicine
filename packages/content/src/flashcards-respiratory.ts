import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 respiratory high-yield.
// Mirrors flashcards-cardiology.ts conventions — cloze ≤2, AU-cited, no fluff.
export const respiratoryFlashcards: Flashcard[] = [
  {
    id: "fc-resp-001",
    specialty: "respiratory",
    subtopic: "Asthma stepwise",
    front_md:
      "Per the Australian Asthma Handbook, an adult on PRN SABA alone with symptoms >2 days/week should be stepped up to {{c1::daily low-dose ICS-formoterol (AIR/MART)}} — SABA-only therapy is no longer recommended.",
    back_md:
      "NACA 2024 abolished SABA monotherapy for adults: even mild asthmatics get ICS at every reliever step. Budesonide-formoterol PRN (AIR) is preferred; if a maintenance plus reliever pattern is needed, the same inhaler is used for both (MART).",
    citation: "Australian Asthma Handbook v2.2 · NACA 2024",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-002",
    specialty: "respiratory",
    subtopic: "Spacer technique",
    front_md:
      "AMC clinical: when counselling a patient on pMDI + spacer, the examiner expects you to verbalise {{c1::single actuation followed by 4-5 tidal breaths (or one slow deep breath + 10s hold)}}.",
    back_md:
      "Multi-puff loading into the spacer halves lung deposition. Tidal breathing is preferred for children and the breathless. Wash the spacer in detergent, drip-dry — wiping creates static and traps drug.",
    citation: "Australian Asthma Handbook · NACA inhaler technique",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-resp-003",
    specialty: "respiratory",
    subtopic: "Acute asthma severity",
    front_md:
      "An adult presenting with PEF <{{c1::50}}% predicted, talking in words, RR ≥25 and HR ≥110 meets criteria for {{c2::severe acute asthma}} in the Australian Asthma Handbook.",
    back_md:
      "Life-threatening flags add: silent chest, cyanosis, exhaustion, SpO₂ <92% on air, PEF <33%. Salbutamol 12 puffs via spacer (or 5 mg neb), ipratropium 8 puffs, oral pred 37.5–50 mg, controlled O₂ to SpO₂ 93-95%, IV mag if not responding.",
    citation: "Australian Asthma Handbook · NACA acute care chart",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-resp-004",
    specialty: "respiratory",
    subtopic: "ICS-LABA selection",
    front_md:
      "For an adult requiring step-up to a maintenance ICS-LABA, the AU-preferred MART combinations are {{c1::budesonide-formoterol or beclometasone-formoterol}} (only formoterol-based inhalers are TGA-approved for MART).",
    back_md:
      "Salmeterol has too slow an onset to serve as reliever, so fluticasone-salmeterol can never be used in MART. Formoterol's <3 min onset is what allows the single-inhaler simplification.",
    citation: "Australian Asthma Handbook · TGA PI formoterol",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-005",
    specialty: "respiratory",
    subtopic: "COPD GOLD groups",
    front_md:
      "Under GOLD 2024, a COPD patient with ≥2 moderate exacerbations or ≥1 hospitalisation in the past year is automatically Group {{c1::E}} — irrespective of symptom score.",
    back_md:
      "GOLD replaced Groups C and D with a single high-risk Group E in 2023. Initial therapy for Group E = LABA + LAMA (add ICS only if blood eos ≥300 or ACO features). Group A = bronchodilator PRN; Group B = LABA + LAMA.",
    citation: "GOLD 2024 · Lung Foundation Australia COPD-X",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-006",
    specialty: "respiratory",
    subtopic: "COPD triple therapy",
    front_md:
      "A COPD patient on LABA + LAMA who continues to exacerbate with blood eosinophils {{c1::≥300 cells/µL}} should be escalated to {{c2::inhaled triple therapy (LABA + LAMA + ICS)}}.",
    back_md:
      "IMPACT and ETHOS trials drove the eosinophil-guided ICS rule. Below 100 eos, ICS gives little benefit and raises pneumonia risk. Single-inhaler triple (e.g. fluticasone-umeclidinium-vilanterol) improves adherence.",
    citation: "GOLD 2024 · COPD-X Plan v2.69",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-007",
    specialty: "respiratory",
    subtopic: "LTOT criteria",
    front_md:
      "Long-term home oxygen (LTOT) on the PBS for COPD requires resting PaO₂ ≤{{c1::55 mmHg}} (or ≤59 with cor pulmonale/polycythaemia) on optimal therapy, confirmed on {{c2::two ABGs ≥3 weeks apart while stable}}.",
    back_md:
      "Target ≥15 hours/day to deliver the NOTT/MRC mortality benefit. Smoking cessation is mandatory pre-prescription (fire risk + the trial benefit disappears in current smokers).",
    citation: "TSANZ LTOT position · PBS Authority criteria",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-008",
    specialty: "respiratory",
    subtopic: "PBS Authority inhalers",
    front_md:
      "Under the PBS, ICS-LABA combinations for COPD require an Authority script confirming {{c1::FEV1 <50% predicted and ≥2 exacerbations in 12 months}} — the same threshold does not apply to asthma scripts.",
    back_md:
      "Asthma PBS listings are unrestricted (Streamlined). COPD listings are Authority Required to enforce GOLD/COPD-X targeting and curb pneumonia risk in low-eosinophil patients. Always document spirometry in the notes — examiners check.",
    citation: "PBS Schedule · COPD-X Plan v2.69",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-009",
    specialty: "respiratory",
    subtopic: "CURB-65",
    front_md:
      "A 72-year-old with CAP, urea 8 mmol/L, RR 32, BP 88/55, confused → CURB-65 score {{c1::5}}, mandating {{c2::ICU assessment and IV antibiotics}}.",
    back_md:
      "1 point each for: Confusion (AMT ≤8), Urea >7, RR ≥30, SBP <90 or DBP ≤60, age ≥65. Score 0-1 = home, 2 = short stay, ≥3 = admit + consider ICU.",
    citation: "BTS CURB-65 · eTG Respiratory v2024",
    mark_sheet_domain: "investigations",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-resp-010",
    specialty: "respiratory",
    subtopic: "CAP empirical antibiotics",
    front_md:
      "Per eTG, empirical therapy for low-severity community-acquired pneumonia in an Australian outpatient is {{c1::amoxicillin 1 g oral 8-hourly for 5 days}}, with {{c2::doxycycline}} added if atypical cover is needed.",
    back_md:
      "Moderate-severity (CURB-65 2): benzylpenicillin IV + doxycycline. High-severity: ceftriaxone IV + azithromycin IV. Tropical northern Australia: add gentamicin to cover Burkholderia pseudomallei (melioidosis).",
    citation: "eTG Respiratory v2024 · TG Antibiotic",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-011",
    specialty: "respiratory",
    subtopic: "Atypical pneumonia",
    front_md:
      "A young adult with dry cough, headache, malaise, low-grade fever and patchy interstitial CXR — first-line empirical cover for {{c1::Mycoplasma pneumoniae}} is {{c2::doxycycline or azithromycin}}.",
    back_md:
      "Beta-lactams have no atypical cover. Mycoplasma can cause cold agglutinins (haemolysis), erythema multiforme, Guillain-Barré. Legionella adds hyponatraemia and confusion — notify the Public Health Unit if confirmed.",
    citation: "eTG Respiratory · Murtagh 8th ed",
    mark_sheet_domain: "ddx",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-resp-012",
    specialty: "respiratory",
    subtopic: "PE Wells score",
    front_md:
      "A modified Wells score >{{c1::4}} classifies PE as 'likely' and mandates proceeding directly to {{c2::CTPA}} (skipping the D-dimer).",
    back_md:
      "PE 'unlikely' (≤4) → age-adjusted D-dimer first; if negative PE is excluded. Wells 3 points each for clinical signs of DVT and 'PE most likely diagnosis'; 1.5 each for HR>100, immobilisation/surgery, prior VTE; 1 each for haemoptysis, malignancy.",
    citation: "ANZCOR · Therapeutic Guidelines Cardiovascular",
    mark_sheet_domain: "investigations",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-resp-013",
    specialty: "respiratory",
    subtopic: "PE imaging choice",
    front_md:
      "In a pregnant patient with suspected PE and a normal CXR, the preferred first-line imaging is {{c1::V/Q scan}} (lower maternal breast and foetal radiation than CTPA).",
    back_md:
      "Abnormal CXR → CTPA (V/Q likely non-diagnostic). Bilateral leg US can confirm a proximal DVT and obviate chest imaging entirely. Always document shared decision-making about radiation.",
    citation: "RANZCR · RANZCOG · Therapeutic Guidelines",
    mark_sheet_domain: "investigations",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-resp-014",
    specialty: "respiratory",
    subtopic: "PE anticoagulation",
    front_md:
      "First-line anticoagulation for haemodynamically stable PE in a non-pregnant adult without severe renal impairment is {{c1::apixaban 10 mg BD for 7 days then 5 mg BD}} — no parenteral lead-in required.",
    back_md:
      "Rivaroxaban (15 mg BD x 21 days then 20 mg daily) is an equivalent alternative. Warfarin (target INR 2-3) still preferred for antiphospholipid syndrome, mechanical valves and severe renal impairment (CrCl <30). Pregnancy = enoxaparin throughout.",
    citation: "TGA PI apixaban · TG Cardiovascular",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-015",
    specialty: "respiratory",
    subtopic: "Massive PE",
    front_md:
      "Massive (high-risk) PE — defined by sustained SBP <{{c1::90 mmHg}} or vasopressor need — warrants {{c2::systemic thrombolysis with alteplase}} unless contraindicated.",
    back_md:
      "Alteplase 100 mg IV over 2 hours. Contraindications: recent haemorrhagic stroke, active bleeding, recent major surgery. Catheter-directed thrombolysis or surgical embolectomy if systemic lysis contraindicated.",
    citation: "ESC 2019 PE · ANZCOR · TG Cardiovascular",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-016",
    specialty: "respiratory",
    subtopic: "Pneumothorax size",
    front_md:
      "A primary spontaneous pneumothorax is classified 'large' on CXR when the rim of air at the hilum is ≥{{c1::2 cm}} — small + asymptomatic patients can be {{c2::observed and discharged with 24-hour review}}.",
    back_md:
      "Large or symptomatic → needle aspiration first-line; if that fails or recurs, intercostal catheter. Secondary spontaneous pneumothorax (underlying lung disease) almost always needs admission ± chest drain even if small.",
    citation: "BTS Pleural · TSANZ position",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-resp-017",
    specialty: "respiratory",
    subtopic: "Tension pneumothorax",
    front_md:
      "Tension pneumothorax is a {{c1::clinical}} diagnosis — do not wait for CXR. Decompress immediately with {{c2::a wide-bore cannula in the 4th-5th intercostal space, mid-axillary line}}.",
    back_md:
      "ATLS shifted away from the 2nd ICS mid-clavicular site in adults — chest wall thickness too often exceeds the cannula length. Definitive management is an intercostal catheter. Signs: tracheal deviation away, absent breath sounds, hyper-resonance, distended neck veins, haemodynamic collapse.",
    citation: "ATLS 10th · ANZCOR · ANZICS",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-resp-018",
    specialty: "respiratory",
    subtopic: "TB screening for IMGs",
    front_md:
      "For an asymptomatic IMG starting AHPRA recency clinic placement, the preferred TB screening test is {{c1::IGRA (QuantiFERON-TB Gold)}} — unaffected by prior BCG vaccination.",
    back_md:
      "Mantoux (TST) ≥10 mm is positive in BCG-vaccinated; ≥15 mm if low-risk. IGRA preferred for IMGs from high-prevalence countries (India, Philippines, Pakistan) because BCG cross-reactivity invalidates Mantoux interpretation. Positive result → CXR ± sputum to exclude active TB before commencing isoniazid + B6 for latent TB.",
    citation: "RACGP Red Book · NTAC AU TB guidelines",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-019",
    specialty: "respiratory",
    subtopic: "TB latent therapy",
    front_md:
      "Standard treatment for latent TB in a non-pregnant adult per AU NTAC is {{c1::isoniazid 300 mg daily + pyridoxine 25 mg daily for 6-9 months}} — pyridoxine prevents {{c2::peripheral neuropathy}}.",
    back_md:
      "Rifampicin 4-month monotherapy is an alternative (better completion rates, fewer hepatotoxic events) but interacts with OCP and warfarin. Baseline LFTs mandatory. Report all active TB to the state Public Health Unit.",
    citation: "NTAC AU · Murtagh 8th ed",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-resp-020",
    specialty: "respiratory",
    subtopic: "Safety net asthma",
    front_md:
      "AMC clinical safety-net for asthma discharge: 'If your reliever isn't lasting {{c1::4 hours}}, you can't speak in full sentences, or your peak flow drops below {{c2::your personal best}} — use 4×4×4 with the spacer and call 000.'",
    back_md:
      "4 puffs salbutamol, 4 breaths each puff, wait 4 minutes — repeat up to 3 cycles while help comes. Every discharged asthmatic needs a written Asthma Action Plan in the notes; examiners look for the document name.",
    citation: "Australian Asthma Handbook · NACA",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
