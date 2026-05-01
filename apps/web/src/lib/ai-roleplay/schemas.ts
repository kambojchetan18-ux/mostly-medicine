// AI Clinical RolePlay Cases — JSON Schemas for Anthropic tool-use
// These schemas constrain Claude's structured output during ingestion,
// blueprint synthesis, case generation, and feedback scoring.
//
// Used as the `input_schema` of an Anthropic tool, then forced via
// `tool_choice: { type: "tool", name: "..." }` so the model is required
// to emit a single JSON payload matching the schema.

import { ACRP_CATEGORIES } from "./types";

const difficultyEnum = { type: "string" as const, enum: ["easy", "medium", "hard"] };

export const SOURCE_METADATA_SCHEMA = {
  type: "object" as const,
  properties: {
    title: { type: "string", description: "Short title of the case/topic" },
    topic: { type: "string", description: "Primary clinical topic, 2-5 words" },
    category: { type: "string", enum: ACRP_CATEGORIES },
    complaintCluster: {
      type: "array",
      items: { type: "string" },
      description: "Presenting complaints / symptom keywords",
    },
    diagnosisFamily: {
      type: "array",
      items: { type: "string" },
      description: "Diagnoses considered in this case (final + differentials)",
    },
    clues: {
      type: "array",
      items: { type: "string" },
      description: "History/exam clues that point toward the diagnosis",
    },
    redFlags: {
      type: "array",
      items: { type: "string" },
      description: "Critical red flags that must not be missed",
    },
    managementThemes: {
      type: "array",
      items: { type: "string" },
      description: "Treatment / disposition themes",
    },
    notes: { type: "string", description: "Optional editorial notes (max 200 chars)" },
  },
  required: [
    "title",
    "topic",
    "category",
    "complaintCluster",
    "diagnosisFamily",
    "clues",
    "redFlags",
    "managementThemes",
  ],
  additionalProperties: false,
};

const diagnosisItem = {
  type: "object" as const,
  properties: {
    name: { type: "string" },
    prevalence: { type: "string", enum: ["common", "uncommon", "rare"] },
    mustNotMiss: { type: "boolean" },
  },
  required: ["name", "prevalence"],
  additionalProperties: false,
};

export const BLUEPRINT_SCHEMA = {
  type: "object" as const,
  properties: {
    slug: { type: "string", description: "kebab-case unique slug" },
    familyName: { type: "string" },
    category: { type: "string", enum: ACRP_CATEGORIES },
    difficulty: difficultyEnum,
    presentationCluster: { type: "array", items: { type: "string" } },
    hiddenDiagnoses: { type: "array", items: diagnosisItem, minItems: 2 },
    distractorDiagnoses: { type: "array", items: diagnosisItem },
    redFlags: { type: "array", items: { type: "string" } },
    candidateTasks: { type: "array", items: { type: "string" } },
    settingOptions: {
      type: "array",
      items: { type: "string" },
      description: "e.g. 'GP clinic', 'Emergency department', 'After-hours home visit'",
    },
    ageBands: {
      type: "array",
      items: { type: "string" },
      description: "e.g. '20-30', '50-65'",
    },
  },
  required: [
    "slug",
    "familyName",
    "category",
    "difficulty",
    "presentationCluster",
    "hiddenDiagnoses",
    "distractorDiagnoses",
    "redFlags",
    "candidateTasks",
    "settingOptions",
    "ageBands",
  ],
  additionalProperties: false,
};

const clueItem = {
  type: "object" as const,
  properties: {
    trigger: { type: "string", description: "What question/action reveals this clue" },
    reveal: { type: "string", description: "What the patient says or what is found" },
    significance: { type: "string", enum: ["key", "supporting", "distractor"] },
  },
  required: ["trigger", "reveal", "significance"],
  additionalProperties: false,
};

export const CASE_VARIANT_SCHEMA = {
  type: "object" as const,
  properties: {
    seed: { type: "string", description: "Echo back the seed string provided" },
    difficulty: difficultyEnum,
    stationStem: {
      type: "object",
      properties: {
        presentingComplaint: { type: "string" },
        setting: { type: "string" },
        candidateTask: { type: "string" },
        visiblePatientContext: { type: "string" },
      },
      required: ["presentingComplaint", "setting", "candidateTask", "visiblePatientContext"],
      additionalProperties: false,
    },
    patientProfile: {
      type: "object",
      properties: {
        name: { type: "string" },
        ageBand: { type: "string" },
        gender: { type: "string" },
        occupation: { type: "string" },
        emotionalTone: { type: "string" },
        personalityNotes: { type: "string" },
        speechStyle: { type: "string" },
      },
      required: ["name", "ageBand", "gender", "emotionalTone", "personalityNotes", "speechStyle"],
      additionalProperties: false,
    },
    hiddenDiagnosis: { type: "string" },
    cluePool: { type: "array", items: clueItem, minItems: 6 },
    redFlags: { type: "array", items: { type: "string" } },
    candidateTask: { type: "string" },
    setting: { type: "string" },
    emotionalTone: { type: "string" },
  },
  required: [
    "seed",
    "difficulty",
    "stationStem",
    "patientProfile",
    "hiddenDiagnosis",
    "cluePool",
    "redFlags",
    "candidateTask",
    "setting",
    "emotionalTone",
  ],
  additionalProperties: false,
};

const PATIENT_FEEDBACK_PROPS = {
  adherenceScore: {
    type: "integer",
    minimum: 0,
    maximum: 10,
    description: "How closely the peer playing the patient followed their brief (0-10).",
  },
  stayedInCharacter: {
    type: "boolean",
    description: "True if the patient maintained the persona / emotional tone throughout.",
  },
  leakedInformation: {
    type: "array",
    items: { type: "string" },
    description: "Items from the brief's hidden truth or 'onlyWhenAsked' clues that the patient revealed unprompted.",
  },
  ignoredEmotionalTone: {
    type: "boolean",
    description: "True if the patient consistently failed to portray the emotionalTone / personality from the brief.",
  },
  brokeRules: {
    type: "array",
    items: { type: "string" },
    description: "Specific rules from the brief that the patient broke (e.g. 'named the diagnosis', 'lectured the doctor', 'invented info not in the brief').",
  },
  overallNote: {
    type: "string",
    description: "1-2 sentence summary of the patient's adherence to the brief.",
  },
} as const;

export const FEEDBACK_SCHEMA = {
  type: "object" as const,
  properties: {
    globalScore: { type: "integer", minimum: 0, maximum: 10 },
    communicationScore: { type: "integer", minimum: 0, maximum: 10 },
    reasoningScore: { type: "integer", minimum: 0, maximum: 10 },
    strengths: { type: "array", items: { type: "string" } },
    missedQuestions: { type: "array", items: { type: "string" } },
    missedRedFlags: { type: "array", items: { type: "string" } },
    suggestedPhrasing: {
      type: "array",
      items: {
        type: "object",
        properties: {
          original: { type: "string" },
          better: { type: "string" },
          reason: { type: "string" },
        },
        required: ["original", "better", "reason"],
        additionalProperties: false,
      },
    },
    differentialReview: { type: "string" },
    retrySuggestion: { type: "string" },
    patientFeedback: {
      type: "object",
      description:
        "Optional. Only populate when a patientBrief was supplied (Live Peer RolePlay). Score the peer playing the patient on how well they followed their brief.",
      properties: PATIENT_FEEDBACK_PROPS,
      required: [
        "adherenceScore",
        "stayedInCharacter",
        "leakedInformation",
        "ignoredEmotionalTone",
        "brokeRules",
        "overallNote",
      ],
      additionalProperties: false,
    },
  },
  required: [
    "globalScore",
    "communicationScore",
    "reasoningScore",
    "strengths",
    "missedQuestions",
    "missedRedFlags",
    "suggestedPhrasing",
    "differentialReview",
    "retrySuggestion",
  ],
  additionalProperties: false,
};
