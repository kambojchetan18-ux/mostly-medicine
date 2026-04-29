export { createClinicalRoleplay } from "./roleplay";
export { scenarios, getScenario } from "./scenarios";
export type { Scenario } from "./scenarios";
// Lightweight metadata used by client bundles (see mobile.ts). Server-side
// callers should keep using `scenarios` for full data — `scenariosMeta`
// drops the heavy fields (history, exam findings, performance guidelines).
export { scenariosMeta } from "./scenarios-meta";
export type { ScenarioMeta } from "./scenarios-meta";
