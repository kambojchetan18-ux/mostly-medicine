import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  LIBRARY_CHAT_SYSTEM_PROMPT,
  LIBRARY_CHAT_SYSTEM_PROMPT_WITH_TOPIC,
} from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

export const maxDuration = 30;

const MODEL = "claude-haiku-4-5-20251001";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

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

  // Per-user rolling-window throttle. Stops scripts hitting Anthropic on
  // our dime. 30 calls / 60s easily covers a chatty student typing fast.
  const rl = await aiRateLimit(clientKey(req, "library-chat", user.id), { max: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  const { messages, topicTitle, topicContent } = await req.json();

  if (!Array.isArray(messages) || messages.length > 50) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }
  const validRoles = new Set(["user", "assistant"]);
  const sanitized = messages
    .filter((m: any) => validRoles.has(m.role) && typeof m.content === "string")
    .map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 10000) }));

  const systemPrompt =
    topicTitle && topicContent
      ? LIBRARY_CHAT_SYSTEM_PROMPT_WITH_TOPIC(topicTitle, topicContent)
      : LIBRARY_CHAT_SYSTEM_PROMPT;

  // cache_control is a runtime feature in @anthropic-ai/sdk@0.32.x but
  // missing from the published types — cast to TextBlockParam[].
  // Caching the long static guideline preamble cuts input cost ~90% on
  // repeat turns of the same chat session.
  const systemBlocks = [
    {
      type: "text",
      text: systemPrompt,
      cache_control: { type: "ephemeral" },
    },
  ] as unknown as Anthropic.TextBlockParam[];

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client().messages.create({
          model: MODEL,
          max_tokens: 1024,
          system: systemBlocks,
          messages: sanitized,
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
