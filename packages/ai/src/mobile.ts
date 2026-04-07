// Mobile-safe entry point — excludes @anthropic-ai/sdk (Node.js only)
// API calls to Claude must go through the Next.js backend API routes
export { scenarios, getScenario } from "./scenarios";
export type { Scenario } from "./scenarios";
