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

// A doctor turn count below this is treated as "session too short to score"
// — common after the live mode debouncing/hallucination filter changes when a
// peer ends the call within a few seconds of the roleplay starting.
const MIN_DOCTOR_TURNS_FOR_SCORING = 2;

// Stub feedback returned when there is no real transcript to score. The UI
// renders this exactly the same as a real result, just with zero scores and
// a single "session was too short" note in strengths — far better than a
// blank page, a 500, or the client getting stuck on the loading spinner.
function emptyTranscriptFeedback(): SessionFeedback {
  return {
    globalScore: 0,
    communicationScore: 0,
    reasoningScore: 0,
    strengths: ["Session was too short for full scoring — try a fresh 8-minute roleplay."],
    missedQuestions: [],
    missedRedFlags: [],
    suggestedPhrasing: [],
    differentialReview:
      "No meaningful exchange was captured before the session ended. This usually means the call was ended within a few seconds of starting, the microphone was off, or speech recognition did not pick up any audio.",
    retrySuggestion:
      "Start a new live session and ensure your mic is on (you should see the 🎤 chip turn green during roleplay).",
  };
}

export async function scoreSession({ caseVariant, transcript }: ScoringInput): Promise<SessionFeedback> {
  // Short-circuit empty / near-empty transcripts before burning a Claude call
  // and before risking a "no tool_use block" throw that would surface as 500
  // in the live feedback flow.
  const doctorTurns = transcript.filter(
    (m) => m.role === "user" && m.content.trim().length > 0
  ).length;
  if (doctorTurns < MIN_DOCTOR_TURNS_FOR_SCORING) {
    return emptyTranscriptFeedback();
  }

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
