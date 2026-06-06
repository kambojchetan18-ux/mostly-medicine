import type {Flashcard} from "./flashcards";

// Hand-derived seed cards from questions-cardiovascular.ts.
// Run scripts/seed-flashcards-cardiology.ts to replace with AI-generated bulk (target ~100).
export const cardiologyFlashcards: Flashcard[] = [
  {
    id: "cv-fc-001",
    specialty: "cardiology",
    subtopic: "Atrial Fibrillation",
    front_md:
      "CHA₂DS₂-VASc score of {{c1::1 in a male AF patient}} is a 'grey zone' — Australian guidelines recommend {{c2::shared decision-making}} for anticoagulation.",
    back_md:
      "Score 1 in a male is borderline. Females with score 1 → no therapy. Score ≥2 in males → anticoagulate. Always document the discussion.",
    citation: "RACGP AFib guideline · NHFA 2024",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    source_question_id: "cv-001",
    ai_generated: false,
  },
  {
    id: "cv-fc-002",
    specialty: "cardiology",
    subtopic: "Atrial Fibrillation",
    front_md:
      "For non-valvular AF with CHA₂DS₂-VASc ≥2, the preferred anticoagulants are {{c1::DOACs (dabigatran, rivaroxaban, apixaban, edoxaban)}} over warfarin.",
    back_md:
      "DOACs offer equivalent or superior efficacy, less intracranial bleeding, and no INR monitoring. Warfarin retained for valvular AF + mechanical valves.",
    citation: "NHFA 2024 · TGA approvals",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    source_question_id: "cv-002",
    ai_generated: false,
  },
  {
    id: "cv-fc-003",
    specialty: "cardiology",
    subtopic: "Atrial Fibrillation",
    front_md:
      "Haemodynamically stable new-onset AF with unknown duration → initial priority is {{c1::rate control}} (target HR <{{c2::110}} at rest).",
    back_md:
      "IV metoprolol or diltiazem first-line. If duration unknown >48h → anticoagulate 3-4 weeks before elective cardioversion (or TOE-guided). Immediate cardioversion only for haemodynamic compromise.",
    citation: "NHFA acute AF management",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    source_question_id: "cv-003",
    ai_generated: false,
  },
  {
    id: "cv-fc-004",
    specialty: "cardiology",
    subtopic: "Heart Failure",
    front_md:
      "In symptomatic HFrEF on ACEi + beta-blocker + spironolactone, the next-strongest mortality-reducing medication is {{c1::sacubitril-valsartan (ARNI)}}, replacing the ACEi.",
    back_md:
      "PARADIGM-HF: ARNI reduced CV mortality by 20% vs enalapril. Wash-out ACEi 36h before switching to avoid angioedema risk. SGLT2i also now standard alongside.",
    citation: "PARADIGM-HF · NHFA 2025 HF update",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    source_question_id: "cv-004",
    ai_generated: false,
  },
  {
    id: "cv-fc-005",
    specialty: "cardiology",
    subtopic: "Heart Failure",
    front_md:
      "Per the 2025 AU heart failure guideline, {{c1::SGLT2 inhibitors (empagliflozin or dapagliflozin)}} are now {{c2::first-line, not add-on}} in HFrEF.",
    back_md:
      "Started alongside ACEi + beta-blocker from day one — no longer wait for residual symptoms. Class effect demonstrated in EMPEROR-Reduced and DAPA-HF.",
    citation: "NHFA 2025 HF guideline update",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "cv-fc-006",
    specialty: "cardiology",
    subtopic: "Heart Failure",
    front_md:
      "Every new HFrEF diagnosis should trigger {{c1::iron studies}}. If ferritin <{{c2::100}} → IV ferric carboxymaltose.",
    back_md:
      "Iron deficiency in HF is now a treat-on-diagnosis indication. Improves NYHA class, 6MWD, and quality-of-life scores. Examiner marker of guideline currency.",
    citation: "NHFA 2025 HF guideline",
    mark_sheet_domain: "investigations",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "cv-fc-007",
    specialty: "cardiology",
    subtopic: "ACS",
    front_md:
      "AMC chest-pain station: examiners score for {{c1::patient-led history opening}} — use 'Can you tell me what's been happening in your own words?' before SOCRATES.",
    back_md:
      "Two silent marks before clinical history starts: named introduction + open-ended invitation. Closed Q-style USMLE-trained candidates lose these by default.",
    citation: "AMC handbook · examiner mark sheet",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "cv-fc-008",
    specialty: "cardiology",
    subtopic: "ACS",
    front_md:
      "AMC clinical: top-3 differentials for crushing central chest pain you should verbalise out loud are {{c1::ACS, PE, aortic dissection}}.",
    back_md:
      "Silent reasoning earns zero marks. Lower-likelihood but mention pneumothorax, oesophageal spasm, MSK if time. Commit to one only AFTER differentials stated.",
    citation: "AMC clinical scoring rubric",
    mark_sheet_domain: "ddx",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "cv-fc-009",
    specialty: "cardiology",
    subtopic: "Hypertension",
    front_md:
      "First-line antihypertensive for a 58-year-old with stage 2 HTN + T2DM is {{c1::ACE inhibitor + thiazide diuretic}}.",
    back_md:
      "ACEi (renal protection in T2DM) + thiazide (BP synergy). Avoid beta-blockers as first-line — no longer recommended in uncomplicated HTN per NHFA 2024.",
    citation: "NHFA HTN guideline 2024 · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "cv-fc-010",
    specialty: "cardiology",
    subtopic: "Safety net",
    front_md:
      "AMC clinical safety-net script for chest pain: 'If pain worsens, becomes crushing, radiates to {{c1::jaw or arm}}, or you become breathless — call {{c2::000}} immediately.'",
    back_md:
      "Specific symptoms + specific number + specific advice = full safety-net marks. Generic 'come back if worse' loses the mark.",
    citation: "AMC clinical examiner notes",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
