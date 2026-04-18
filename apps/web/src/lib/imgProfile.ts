export type AMCStatus   = "passed" | "scheduled" | "not_done";
export type AHPRAStatus = "registered" | "pending" | "not_started";
export type VisaType    = "482" | "485" | "189" | "190" | "491" | "pr" | "citizen" | "other" | "unknown";
export type EnglishTest = "oet" | "ielts" | "exempt" | "not_done";
export type DoctorType  = "rmo" | "gp" | "specialist" | "non_doctor" | null;
export type Pathway     = "ready" | "need_ahpra" | "need_cat2" | "need_cat1" | "need_english" | "specialist" | "non_doctor" | "unknown";

export interface IMGProfile {
  id:                       string;
  name:                     string | null;
  degree_country:           string | null;
  graduation_year:          number | null;
  years_experience:         number | null;
  specialties:              string[];
  amc_cat1:                 AMCStatus;
  amc_cat2:                 AMCStatus;
  ahpra_status:             AHPRAStatus;
  visa_type:                VisaType;
  english_test:             EnglishTest;
  certifications:           string[];
  location_preference:      string[];
  cv_text:                  string | null;
  doctor_type:              DoctorType;
  specialist_qualification: string | null;
  updated_at:               string;
}

interface ReadinessItem {
  label:   string;
  cleared: boolean;
  weight:  number;
  blocker: boolean;
}

export function computeReadiness(p: IMGProfile): {
  score:   number;
  items:   ReadinessItem[];
  pathway: Pathway;
  blockers: string[];
} {
  const items: ReadinessItem[] = [
    {
      label:   "English Proficiency (OET/IELTS)",
      cleared: p.english_test === "oet" || p.english_test === "ielts" || p.english_test === "exempt",
      weight:  15,
      blocker: true,
    },
    {
      label:   "AMC CAT 1 (MCQ)",
      cleared: p.amc_cat1 === "passed",
      weight:  15,
      blocker: true,
    },
    {
      label:   "AMC CAT 2 (Clinical)",
      cleared: p.amc_cat2 === "passed",
      weight:  20,
      blocker: true,
    },
    {
      label:   "AHPRA Registration",
      cleared: p.ahpra_status === "registered",
      weight:  30,
      blocker: true,
    },
    {
      label:   "Australian Work Visa",
      cleared: ["482","485","189","190","491","pr","citizen"].includes(p.visa_type),
      weight:  15,
      blocker: false,
    },
    {
      label:   "Clinical Certifications (ALS/PALS)",
      cleared: p.certifications.some(c => /als|pals|atls|bls/i.test(c)),
      weight:  5,
      blocker: false,
    },
  ];

  const total   = items.reduce((s, i) => s + i.weight, 0);
  const cleared = items.filter(i => i.cleared).reduce((s, i) => s + i.weight, 0);
  const score   = Math.round((cleared / total) * 100);
  const blockers = items.filter(i => i.blocker && !i.cleared).map(i => i.label);

  let pathway: Pathway = "unknown";
  if (p.doctor_type === "non_doctor")                      pathway = "non_doctor";
  else if (p.doctor_type === "specialist")                 pathway = "specialist";
  else if (p.english_test === "not_done")                  pathway = "need_english";
  else if (p.amc_cat1 !== "passed")                        pathway = "need_cat1";
  else if (p.amc_cat2 !== "passed")                        pathway = "need_cat2";
  else if (p.ahpra_status !== "registered")                pathway = "need_ahpra";
  else                                                     pathway = "ready";

  return { score, items, pathway, blockers };
}

export const PATHWAY_LABELS: Record<Pathway, { label: string; color: string; next: string }> = {
  non_doctor: {
    label: "Not a Medical Doctor",
    color: "text-red-700 bg-red-50 border-red-200",
    next:  "These job pools are for IMGs with MBBS or equivalent. Your CV doesn't show a medical degree — please re-upload or correct your profile.",
  },
  specialist: {
    label: "Specialist Pathway",
    color: "text-purple-700 bg-purple-50 border-purple-200",
    next:  "Your qualifications indicate a specialist pathway. See the Specialist Pathway guide for AMC specialist assessment, college recognition, and AHPRA specialist registration.",
  },
  need_english: {
    label: "Step 1 — English Proficiency",
    color: "text-red-700 bg-red-50 border-red-200",
    next:  "Sit OET (recommended) or IELTS Academic. OET is medical-specific and preferred by AHPRA.",
  },
  need_cat1: {
    label: "Step 2 — AMC CAT 1 (MCQ)",
    color: "text-orange-700 bg-orange-50 border-orange-200",
    next:  "Register at amc.org.au. Computer-based, 150 MCQs over 3.5 hours. Mostly Medicine CAT 1 practice helps here.",
  },
  need_cat2: {
    label: "Step 3 — AMC CAT 2 (Clinical)",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    next:  "OSCE-style exam, 16 stations × 8 min. Practice here with AI roleplays based on the official AMC handbook.",
  },
  need_ahpra: {
    label: "Step 4 — AHPRA Registration",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    next:  "Apply at ahpra.gov.au with your AMC certificate, ID, and references. Processing takes 4–12 weeks.",
  },
  ready: {
    label: "Ready to Apply",
    color: "text-green-700 bg-green-50 border-green-200",
    next:  "You meet the core requirements. Apply to RMO pools now or explore GP DWS positions for faster hire.",
  },
  unknown: {
    label: "Upload your CV to see your pathway",
    color: "text-gray-700 bg-gray-50 border-gray-200",
    next:  "We'll analyse your CV and tell you exactly where you stand and what to do next.",
  },
};
