// AI Clinical RolePlay Cases — runtime roleplay engine
// Server-side only. Streams patient replies during the 8-min station.
//
// Latency-tuned for live UX:
//   - Haiku 4.5 model (5-8x faster than Sonnet for chat-like turns).
//   - max_tokens capped at 250 — real patients give short answers anyway.
//   - Two-tier prompt caching (header + case JSON) keeps repeat-turn cost low.
//   - streamRoleplayReply() yields tokens via async iterable for SSE delivery.

import Anthropic from "@anthropic-ai/sdk";
import { ROLEPLAY_SYSTEM_HEADER } from "./prompts";
import type { CaseVariant } from "./types";

// Haiku 4.5 — fast + cheap chat-tier model. Patient turns are short and
// emotional, not deep reasoning, so Haiku is the right tool.
const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 250;

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

function buildRequestParams({ caseVariant, history, newUserMessage }: RoleplayInput) {
  // System has TWO cacheable blocks:
  //   1) The static roleplay header — globally shared across all sessions.
  //   2) The CaseVariant payload — shared across turns of THIS session.
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

  return {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0.7,
    system: systemBlocks,
    messages: apiMessages,
  };
}

// Non-streaming entry point — kept for tests / non-streaming callers.
export async function nextRoleplayReply(input: RoleplayInput): Promise<string> {
  const response = await client().messages.create(buildRequestParams(input));
  const block = response.content[0];
  if (!block || block.type !== "text") throw new Error("Unexpected roleplay response type");
  return block.text;
}

// Streaming entry point — yields text deltas as they arrive from the model.
// Caller (the API route) is responsible for forwarding them as SSE.
export async function* streamRoleplayReply(input: RoleplayInput): AsyncGenerator<string, string, void> {
  const stream = client().messages.stream(buildRequestParams(input));
  let full = "";
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      full += event.delta.text;
      yield event.delta.text;
    }
  }
  return full;
}
