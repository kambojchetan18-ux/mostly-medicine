export { createClinicalRoleplay } from "./roleplay";
export { scenarios, getScenario } from "./scenarios";
export type { Scenario } from "./scenarios";
// Lightweight metadata used by client bundles (see mobile.ts). Server-side
// callers should keep using `scenarios` for full data — `scenariosMeta`
// drops the heavy fields (history, exam findings, performance guidelines).
// Scenarios with <UNKNOWN> placeholder fields are filtered out — they lack
// enough content for a usable roleplay session.
import { scenariosMeta as _rawMeta } from "./scenarios-meta";
export type { ScenarioMeta } from "./scenarios-meta";

const UNKNOWN = "<UNKNOWN>";
export const scenariosMeta = _rawMeta.filter(
  (s) =>
    s.openingStatement !== UNKNOWN &&
    s.patientProfile !== UNKNOWN &&
    s.chiefComplaint !== UNKNOWN &&
    s.candidateInfo !== UNKNOWN,
);
// LLM router — dispatches low-stakes calls to cheaper OpenAI-compatible
// providers (Groq + DeepSeek), falls back to Anthropic on missing key /
// API error. Server-only — uses Node fetch + Anthropic SDK.
export { runChat, pickModel } from "./router";
export type {
  LlmUseCase,
  Provider,
  ModelChoice,
  ChatMessage,
  RunChatInput,
  RunChatResult,
} from "./router";
