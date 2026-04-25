// AI Clinical RolePlay Cases — runtime roleplay engine
// Server-side only. Streams patient/examiner replies during the 8-min station.

import Anthropic from "@anthropic-ai/sdk";
import { ROLEPLAY_SYSTEM_HEADER } from "./prompts";
import type { CaseVariant } from "./types";

const MODEL = "claude-sonnet-4-6";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) _client = new Anthropic();
  return _client;
}

export interface RoleplayTurn {
  role: "user" | "assistant";
  content: string;
}

export interface RoleplayInput {
  caseVariant: CaseVariant;
  history: RoleplayTurn[];
  newUserMessage: string;
}

export async function nextRoleplayReply({
  caseVariant,
  history,
  newUserMessage,
}: RoleplayInput): Promise<string> {
  // System has TWO cacheable blocks:
  //   1) The static roleplay header — globally shared across all sessions.
  //   2) The CaseVariant payload — shared across turns of THIS session.
  // Both use ephemeral cache_control so a long station gets near-zero cost
  // beyond the user/assistant turns themselves.
  const systemBlocks = [
    {
      type: "text",
      text: ROLEPLAY_SYSTEM_HEADER,
      cache_control: { type: "ephemeral" },
    },
    {
      type: "text",
      text: `CASE_VARIANT (your character + the truth of this case):\n${JSON.stringify(caseVariant, null, 2)}`,
      cache_control: { type: "ephemeral" },
    },
  ] as unknown as Anthropic.TextBlockParam[];

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: newUserMessage },
  ];

  // Anthropic requires the message list to start with a user turn.
  const firstUserIdx = messages.findIndex((m) => m.role === "user");
  const apiMessages = firstUserIdx >= 0 ? messages.slice(firstUserIdx) : messages;

  const response = await client().messages.create({
    model: MODEL,
    max_tokens: 800,
    temperature: 0.7,
    system: systemBlocks,
    messages: apiMessages,
  });

  const block = response.content[0];
  if (!block || block.type !== "text") {
    throw new Error("Unexpected response type from roleplay model");
  }
  return block.text;
}
