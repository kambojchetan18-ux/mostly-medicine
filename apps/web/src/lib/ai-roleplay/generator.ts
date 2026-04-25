// AI Clinical RolePlay Cases — runtime case generator
// Server-side only. Calls Anthropic with cache_control + forced tool-use.

import Anthropic from "@anthropic-ai/sdk";
import { CASE_VARIANT_SCHEMA } from "./schemas";
import { CASE_GENERATION_SYSTEM_PROMPT } from "./prompts";
import type { CaseVariant, ClinicalBlueprint, Difficulty } from "./types";

// Haiku 4.5 for fast Random Case generation. Tool-use schema gives us
// reliable structured output even from the smaller model. Sonnet 4.6 was
// 5-8x slower and the perceived UX cost was high.
const MODEL = "claude-haiku-4-5-20251001";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) _client = new Anthropic();
  return _client;
}

export interface GenerateCaseInput {
  blueprint: ClinicalBlueprint;
  difficulty: Difficulty;
  seed: string;
}

export async function generateCase({ blueprint, difficulty, seed }: GenerateCaseInput): Promise<CaseVariant> {
  const userMessage = `BLUEPRINT (do not echo back):
${JSON.stringify(blueprint, null, 2)}

Difficulty: ${difficulty}
Seed: ${seed}

Generate one fresh original case from this blueprint. Pick ONE hidden diagnosis from the blueprint's hiddenDiagnoses pool. Vary setting, demographics, wording, and clue arrangement. Echo the seed string back verbatim in your output.`;

  // cache_control is supported at runtime in @anthropic-ai/sdk@0.32.x but
  // not yet in the published types — cast the system block to allow it.
  // Caching the long static system prompt cuts cost ~90% on repeat calls.
  const systemBlocks = [
    {
      type: "text",
      text: CASE_GENERATION_SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    },
  ] as unknown as Anthropic.TextBlockParam[];

  const response = await client().messages.create({
    model: MODEL,
    max_tokens: 4000,
    temperature: 0.7,
    system: systemBlocks,
    tools: [
      {
        name: "save_case_variant",
        description: "Save the generated original case variant.",
        input_schema: CASE_VARIANT_SCHEMA as unknown as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: "tool", name: "save_case_variant" },
    messages: [{ role: "user", content: userMessage }],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Generator: no tool_use block in Claude response");
  }
  return toolUse.input as CaseVariant;
}

// Short, URL-safe random seed
export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
