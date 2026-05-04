import { NextRequest, NextResponse } from "next/server";
import { runChat } from "@mostly-medicine/ai";
import { createClient } from "@/lib/supabase/server";

const MENTOR_SYSTEM_PROMPT = `You are a warm, encouraging AMC exam mentor speaking to an IMG (international medical graduate) preparing for Australian medical registration. Keep the message under 25 words. Tone: empathetic, never patronising, never preachy. Address them as 'doctor'. End with a forward-looking nudge, not a platitude.`;

type Trigger = "mcq_streak_broken" | "mcq_two_wrong" | "roleplay_complete";

interface MentorContext {
  wrongCount?: number;
  topic?: string;
  score?: number;
}

interface RequestBody {
  trigger?: unknown;
  context?: unknown;
}

const VALID_TRIGGERS: Trigger[] = [
  "mcq_streak_broken",
  "mcq_two_wrong",
  "roleplay_complete",
];

// In-memory rate limit: 1 mentor message per user per 5 minutes.
// Resets on cold start by design — acceptable for an anti-churn nudge.
const RATE_WINDOW_MS = 5 * 60 * 1000;
const lastMessageAt = new Map<string, number>();

function buildUserPrompt(trigger: Trigger, context: MentorContext): string {
  switch (trigger) {
    case "mcq_two_wrong":
      return `The doctor just got ${context.wrongCount ?? 2} MCQs wrong in a row${context.topic ? ` on ${context.topic}` : ""}. Write a single short sentence that normalises the slip and points them to the next attempt.`;
    case "mcq_streak_broken":
      return `The doctor's daily study streak just broke${context.topic ? ` (was practising ${context.topic})` : ""}. Write a single short sentence that does NOT shame them and reframes today as a clean restart.`;
    case "roleplay_complete":
      return `The doctor just finished an AMC clinical roleplay station${typeof context.score === "number" ? ` and scored ${context.score}` : ""}${context.topic ? ` on ${context.topic}` : ""}. Write a single short sentence celebrating the rep and pointing to one concrete next move.`;
    default:
      return `Write one short encouraging line for an AMC exam candidate.`;
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as RequestBody;
  const trigger = VALID_TRIGGERS.includes(body.trigger as Trigger)
    ? (body.trigger as Trigger)
    : null;
  if (!trigger) {
    return NextResponse.json({ error: "Invalid trigger" }, { status: 400 });
  }

  const rawContext =
    body.context && typeof body.context === "object" ? body.context : {};
  const ctx: MentorContext = {
    wrongCount:
      typeof (rawContext as MentorContext).wrongCount === "number"
        ? (rawContext as MentorContext).wrongCount
        : undefined,
    topic:
      typeof (rawContext as MentorContext).topic === "string"
        ? (rawContext as MentorContext).topic
        : undefined,
    score:
      typeof (rawContext as MentorContext).score === "number"
        ? (rawContext as MentorContext).score
        : undefined,
  };

  // 1 message per user per 5 min. We key on user id; cold start resets it
  // — acceptable for an anti-churn nudge that should never spam.
  const now = Date.now();
  const last = lastMessageAt.get(user.id) ?? 0;
  if (now - last < RATE_WINDOW_MS) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((RATE_WINDOW_MS - (now - last)) / 1000)),
        },
      }
    );
  }

  try {
    const result = await runChat({
      useCase: "mentor_short",
      system: MENTOR_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(trigger, ctx) }],
      maxTokens: 120,
      cacheSystem: true,
    });

    const message = result.text.trim().replace(/^["']|["']$/g, "");
    if (!message) {
      return NextResponse.json(
        { error: "Unexpected response from AI" },
        { status: 502 }
      );
    }

    // Only mark rate window after a successful generation, so a 5xx doesn't
    // block the next attempt.
    lastMessageAt.set(user.id, now);

    return NextResponse.json({ message });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[mentor message error]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
