import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import {
  LIBRARY_CHAT_SYSTEM_PROMPT,
  LIBRARY_CHAT_SYSTEM_PROMPT_WITH_TOPIC,
} from "@/lib/prompts";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "AI service not configured." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, topicTitle, topicContent } = await req.json();

  const systemPrompt =
    topicTitle && topicContent
      ? LIBRARY_CHAT_SYSTEM_PROMPT_WITH_TOPIC(topicTitle, topicContent)
      : LIBRARY_CHAT_SYSTEM_PROMPT;

  const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
