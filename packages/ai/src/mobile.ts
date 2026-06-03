// Mobile-safe entry point — excludes @anthropic-ai/sdk (Node.js only)
// AND excludes the heavy verbatim handbook content from `scenarios.ts`.
// Browser/mobile clients only need the lightweight metadata for browsing
// and the reading-time briefing — full simulation runs server-side via the
// /api/ai/roleplay route, which imports the full data through index.ts.
//
// Importing the full scenarios.ts (~720 kB minified) into a `"use client"`
// page balloons the page chunk past 700 kB and craters First Load JS for
// the AMC Handbook RolePlay route. Keep this file metadata-only.
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

// Re-export the heavy `Scenario` type so existing imports compile, but
// drop the `scenarios` runtime export from this entry point. Anything
// that still needs the full data must import from "@mostly-medicine/ai"
// directly (server-only) — the next.config webpack alias swaps in this
// file for the browser bundle.
export type { Scenario } from "./scenarios";
