import { NextRequest, NextResponse } from "next/server";
import { runChat } from "@mostly-medicine/ai";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

// Public, no-signup taste of Ask AI. Mirrors the system prompt of the
// authed /api/library-chat route but is auth-bypassed and IP-rate-limited
// so curious visitors can ask 3 questions before hitting the signup wall.
// Once signed up they get the full chat at /dashboard/ask-ai with library
// context injection.
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are an AI assistant for Mostly Medicine, helping International Medical Graduates prepare for the AMC exams in Australia.

Answer clinical and AMC-prep questions concisely (≤180 words), grounded in:
- John Murtagh's General Practice
- RACGP Red Book
- AMC Handbook
- Therapeutic Guidelines (eTG)
- Australian Medicines Handbook

Tone: warm, mentor-like, clear. Use "doctor" when appropriate. If a question
is outside clinical/AMC scope, redirect kindly. Never give a personal
diagnosis — always frame as "in clinical practice you would..." or similar.

End every answer with a 1-line nudge to the relevant Mostly Medicine module
when natural (e.g., "→ Practise this in AMC MCQ" / "→ Try this in AMC
Handbook RolePlay" / "→ See the full reference"). Keep nudges optional, not
preachy.`;

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  // Per-IP rate limit. Free taste, so we cap aggressively to avoid abuse.
  const rl = await aiRateLimit(clientKey(req, "ask-ai-taste"), { max: 30, windowMs: 60 * 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterMs: rl.retryAfterMs },
      { status: 429 }
    );
  }

  let body: { messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-10);
  // Server-side hard cap on user turns to back the client-side limit.
  const userTurns = messages.filter((m) => m.role === "user").length;
  if (userTurns > 3) {
    return NextResponse.json(
      { error: "taste_limit_reached", limit: 3 },
      { status: 429 }
    );
  }

  try {
    const result = await runChat({
      useCase: "taste_chat",
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      maxTokens: 350,
      cacheSystem: true,
    });

    return NextResponse.json({ reply: result.text.trim(), remaining: Math.max(0, 3 - userTurns) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[ask-ai-taste]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
