import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { enforceDailyLimit } from "@/lib/permissions";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

const MODEL = "claude-haiku-4-5-20251001";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) _client = new Anthropic();
  return _client;
}

// Cacheable static system prompt — every detailed explanation reuses this
// header so we get a >90% input-token discount after the first call.
const EXPLAIN_SYSTEM_PROMPT = `You are an expert AMC (Australian Medical Council) exam tutor for International Medical Graduates preparing for the AMC MCQ exam.

When a medical student gets an MCQ wrong, you write a DETAILED teaching explanation with these exact sections (use markdown ## headings):

## Why <CORRECT_ANSWER> is Correct
Explain the mechanism, guideline basis, and clinical reasoning in 3–5 sentences.

## Why Each Other Option is Wrong
Go through every incorrect option briefly and explain the specific reason it is wrong (1–2 sentences each).

## Clinical Pearl
One memorable take-away point for the exam.

## Key Reference
Cite the specific Australian guideline, AMC Handbook chapter, or Therapeutic Guideline that governs this clinical decision. Be specific (e.g. "Therapeutic Guidelines: Cardiovascular, v7 — Atrial Fibrillation" or "NHFA/CSANZ Heart Failure Guidelines 2018, Section 4.3").

Style rules (strict):
- Australian medical context only — cite RACGP, eTG (Therapeutic Guidelines), AMH, NHFA, RANZCOG.
- Australian drug names: paracetamol (NOT acetaminophen), adrenaline (NOT epinephrine), salbutamol (NOT albuterol), frusemide (NOT furosemide).
- Total response UNDER 350 words.
- Plain, exam-prep language.`;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Defense-in-depth: per-user rolling-window throttle so a single tab
  // can't burn the Anthropic budget faster than a human reads.
  const rl = await aiRateLimit(clientKey(req, "cat1-explain", user.id), { max: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  // Gate by plan + daily quota — share the mcq counter so a free user can't
  // spam this endpoint to bypass their MCQ daily cap.
  const limit = await enforceDailyLimit(supabase, "mcq");
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "daily_limit_reached", plan: limit.plan, dailyLimit: limit.dailyLimit, used: limit.used },
      { status: 429 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  const { stem, options, correctAnswer, selectedAnswer, topic, subtopic, explanation } = await req.json();

  const optionLines = (options as { label: string; text: string }[])
    .map((o) => `${o.label}. ${o.text}`)
    .join("\n");

  const userMessage = `QUESTION:
${stem}

OPTIONS:
${optionLines}

CORRECT ANSWER: ${correctAnswer}
STUDENT SELECTED: ${selectedAnswer}
TOPIC: ${topic} — ${subtopic}
BRIEF EXPLANATION ALREADY SHOWN: ${explanation}

Write the DETAILED explanation now using the structure from your system instructions. Replace <CORRECT_ANSWER> in the heading with: ${correctAnswer}.`;

  // cache_control supported at runtime but absent from published SDK types —
  // cast to TextBlockParam[] (per CLAUDE.md / SDK 0.32.x note).
  const systemBlocks = [
    {
      type: "text",
      text: EXPLAIN_SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    },
  ] as unknown as Anthropic.TextBlockParam[];

  const message = await client().messages.create({
    model: MODEL,
    max_tokens: 600,
    system: systemBlocks,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = message.content[0];
  if (!block || block.type !== "text") {
    return NextResponse.json({ error: "Unexpected response from AI" }, { status: 502 });
  }
  return NextResponse.json({ explanation: block.text });
}
