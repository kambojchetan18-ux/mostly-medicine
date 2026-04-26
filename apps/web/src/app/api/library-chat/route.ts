import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  LIBRARY_CHAT_SYSTEM_PROMPT,
  LIBRARY_CHAT_SYSTEM_PROMPT_WITH_TOPIC,
} from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";
import { checkEndpointRate } from "@/lib/rate-limit";
import { MODELS } from "@/lib/models";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "AI service not configured." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rl = await checkEndpointRate(user.id, "library-chat", 60_000, 15);
  if (!rl.allowed) {
    return new Response(JSON.stringify({ error: "Too many requests." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) },
    });
  }

  const { messages, topicTitle, topicContent } = await req.json();

  const systemPrompt =
    topicTitle && topicContent
      ? LIBRARY_CHAT_SYSTEM_PROMPT_WITH_TOPIC(topicTitle, topicContent)
      : LIBRARY_CHAT_SYSTEM_PROMPT;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: MODELS.FAST,
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          stream: true,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(new TextEncoder().encode(`Error: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
