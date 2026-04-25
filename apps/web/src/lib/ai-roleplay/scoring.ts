// AI Clinical RolePlay Cases — feedback scoring engine
// Server-side only. Marks the candidate against the AMC rubric.

import Anthropic from "@anthropic-ai/sdk";
import { FEEDBACK_SCHEMA } from "./schemas";
import { FEEDBACK_SYSTEM_PROMPT } from "./prompts";
import type { CaseVariant, SessionFeedback } from "./types";

const MODEL = "claude-sonnet-4-6";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) _client = new Anthropic();
  return _client;
}

export interface ScoringInput {
  caseVariant: CaseVariant;
  transcript: Array<{ role: "user" | "assistant"; content: string }>;
}

export async function scoreSession({ caseVariant, transcript }: ScoringInput): Promise<SessionFeedback> {
  const transcriptText = transcript
    .map((m, i) => `[${i + 1}] ${m.role === "user" ? "Doctor" : "Patient"}: ${m.content}`)
    .join("\n\n");

  const userMessage = `CASE PAYLOAD (truth of the station):
${JSON.stringify(
  {
    candidateTask: caseVariant.candidateTask,
    setting: caseVariant.setting,
    hiddenDiagnosis: caseVariant.hiddenDiagnosis,
    cluePool: caseVariant.cluePool,
    redFlags: caseVariant.redFlags,
    emotionalTone: caseVariant.emotionalTone,
  },
  null,
  2
)}

TRANSCRIPT:
${transcriptText || "(no exchanges took place)"}

Mark this candidate using the save_feedback tool. Be specific and fair.`;

  const systemBlocks = [
    {
      type: "text",
      text: FEEDBACK_SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    },
  ] as unknown as Anthropic.TextBlockParam[];

  const response = await client().messages.create({
    model: MODEL,
    max_tokens: 3000,
    temperature: 0.2,
    system: systemBlocks,
    tools: [
      {
        name: "save_feedback",
        description: "Save the structured examiner feedback for this session.",
        input_schema: FEEDBACK_SCHEMA as unknown as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: "tool", name: "save_feedback" },
    messages: [{ role: "user", content: userMessage }],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Scoring: no tool_use block in Claude response");
  }
  return toolUse.input as SessionFeedback;
}
