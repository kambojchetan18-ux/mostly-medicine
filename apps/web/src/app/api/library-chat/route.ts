import { NextRequest, NextResponse } from "next/server";
import { runChat } from "@mostly-medicine/ai";
import {
  LIBRARY_CHAT_SYSTEM_PROMPT,
  LIBRARY_CHAT_SYSTEM_PROMPT_WITH_TOPIC,
} from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

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

  // Per-user rolling-window throttle. Stops scripts hitting our LLMs on
  // our dime. 30 calls / 60s easily covers a chatty student typing fast.
  const rl = await aiRateLimit(clientKey(req, "library-chat", user.id), { max: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  const { messages, topicTitle, topicContent } = await req.json();

  if (!Array.isArray(messages) || messages.length > 100) {
    return NextResponse.json({ error: "messages must be an array of at most 100 items" }, { status: 400 });
  }
  for (const m of messages) {
    if (typeof m.content === "string" && m.content.length > 10_000) {
      return NextResponse.json({ error: "Individual message too long" }, { status: 400 });
    }
  }

  const systemPrompt =
    topicTitle && topicContent
      ? LIBRARY_CHAT_SYSTEM_PROMPT_WITH_TOPIC(topicTitle, topicContent)
      : LIBRARY_CHAT_SYSTEM_PROMPT;

  // Streaming choice: the original Anthropic implementation streamed token
  // deltas. Now that this route can route through DeepSeek (no SSE parser
  // here), we run runChat() in non-streaming mode and emit the full reply
  // as a single chunk into the existing ReadableStream the client already
  // reads. The client UX is identical — a slightly longer time-to-first-
  // token in exchange for ~80% cost cut and a free Anthropic fallback.
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await runChat({
          useCase: "general_chat",
          system: systemPrompt,
          messages: (messages as { role: string; content: string }[]).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          maxTokens: 1024,
          cacheSystem: true,
        });
        controller.enqueue(new TextEncoder().encode(result.text));
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
