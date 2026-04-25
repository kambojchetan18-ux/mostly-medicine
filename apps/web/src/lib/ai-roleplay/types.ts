// AI Clinical RolePlay Cases — shared TypeScript types
// Mirrors the columns in supabase/migrations/009_ai_clinical_roleplay.sql

export type Difficulty = "easy" | "medium" | "hard";

export type AcrpCategory =
  | "Endocrine & Metabolic"
  | "Infectious Diseases"
  | "Respiratory & Sleep"
  | "Hematology & Oncology"
  | "General Medicine Symptoms"
  | "Emergency Presentations"
  | "Travel & Sexual Health"
  | "Renal & Urinary";

export const ACRP_CATEGORIES: AcrpCategory[] = [
  "Endocrine & Metabolic",
  "Infectious Diseases",
  "Respiratory & Sleep",
  "Hematology & Oncology",
  "General Medicine Symptoms",
  "Emergency Presentations",
  "Travel & Sexual Health",
  "Renal & Urinary",
];

// ─── Source (acrp_sources) ─────────────────────────────────────
export interface AcrpSource {
  id: string;
  filename: string;
  title: string;
  topic: string | null;
  category: string | null;
  complaintCluster: string[];
  diagnosisFamily: string[];
  clues: string[];
  redFlags: string[];
  managementThemes: string[];
  notes: string | null;
  ingestedAt: string;
}

// What the ingestion prompt extracts from one PDF.
// Stored as the structured columns above (not as raw PDF text).
export interface SourceMetadataExtraction {
  title: string;
  topic: string;
  category: AcrpCategory;
  complaintCluster: string[];
  diagnosisFamily: string[];
  clues: string[];
  redFlags: string[];
  managementThemes: string[];
  notes?: string;
}

// ─── Blueprint (acrp_blueprints) ───────────────────────────────
export interface BlueprintDiagnosis {
  name: string;
  prevalence: "common" | "uncommon" | "rare";
  mustNotMiss?: boolean;
}

export interface ClinicalBlueprint {
  slug: string;
  familyName: string;
  category: AcrpCategory;
  difficulty: Difficulty;
  presentationCluster: string[];
  hiddenDiagnoses: BlueprintDiagnosis[];
  distractorDiagnoses: BlueprintDiagnosis[];
  redFlags: string[];
  candidateTasks: string[];
  settingOptions: string[];
  ageBands: string[];
  sourceIds: string[];
}

// ─── Case variant (acrp_cases) ─────────────────────────────────
export interface StationStem {
  presentingComplaint: string;
  setting: string;
  candidateTask: string;
  visiblePatientContext: string;
}

export interface PatientProfile {
  name: string;
  ageBand: string;
  gender: string;
  occupation?: string;
  emotionalTone: string;
  personalityNotes: string;
  speechStyle: string;
}

export interface ClueItem {
  trigger: string; // What question reveals it ("if asked about diet…")
  reveal: string; // What the patient says
  significance: "key" | "supporting" | "distractor";
}

export interface CaseVariant {
  seed: string;
  difficulty: Difficulty;
  stationStem: StationStem;
  patientProfile: PatientProfile;
  hiddenDiagnosis: string;
  cluePool: ClueItem[];
  redFlags: string[];
  candidateTask: string;
  setting: string;
  emotionalTone: string;
}

// ─── Session + Feedback ────────────────────────────────────────
export type SessionStatus = "reading" | "roleplay" | "completed" | "abandoned";

export interface AcrpSession {
  id: string;
  userId: string;
  caseId: string;
  status: SessionStatus;
  readingStartedAt: string;
  roleplayStartedAt: string | null;
  endedAt: string | null;
  globalScore: number | null;
  communicationScore: number | null;
  reasoningScore: number | null;
  feedback: SessionFeedback | null;
  createdAt: string;
}

export interface SessionFeedback {
  globalScore: number; // 0-10
  communicationScore: number; // 0-10
  reasoningScore: number; // 0-10
  strengths: string[];
  missedQuestions: string[];
  missedRedFlags: string[];
  suggestedPhrasing: Array<{ original: string; better: string; reason: string }>;
  differentialReview: string;
  retrySuggestion: string;
}

export interface AcrpMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}
