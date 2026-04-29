import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { allQuestions } from "@mostly-medicine/content";
import { createClient } from "@/lib/supabase/server";
import { enforceDailyLimit } from "@/lib/permissions";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

const MODEL = "claude-haiku-4-5-20251001";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) _client = new Anthropic();
  return _client;
}

const SMART_EXPLAIN_SYSTEM_PROMPT = `You are an Australian medical exam tutor for IMGs preparing for the AMC MCQ exam.

Your job: when a student gets an MCQ wrong, write a short, personalised explanation that helps them remember the right answer next time.

Your explanation MUST do all of these in 3-4 sentences (NO markdown lists, NO bullet points, NO headings):
1. Identify what is right about the correct answer (the mechanism, guideline, or clinical rule that makes it correct).
2. Identify why the student's chosen answer is wrong, specifically — what trap did they fall into?
3. Give one memorable mnemonic, rule of thumb, or clinical pearl they can use on exam day.

Style rules (strict):
- Australian medical context only: cite RACGP, eTG (Therapeutic Guidelines), AMH, NHFA, RANZCOG, etc. — not US sources.
- Use Australian drug names: paracetamol (NOT acetaminophen), adrenaline (NOT epinephrine), salbutamol (NOT albuterol), frusemide (NOT furosemide).
- Exam-prep tone: direct, calm, encouraging. Address the student in second person.
- Plain prose only. Do NOT use markdown lists, bullets, headings, or asterisks.
- 3-4 sentences MAX. Be tight.`;

interface RequestBody {
  questionId?: unknown;
  userAnswerIndex?: unknown;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as RequestBody;
  const questionId = typeof body.questionId === "string" ? body.questionId : null;
  const userAnswerIndex = typeof body.userAnswerIndex === "number" ? body.userAnswerIndex : null;

  if (!questionId || userAnswerIndex === null) {
    return NextResponse.json({ error: "Missing questionId or userAnswerIndex" }, { status: 400 });
  }

  // Cache check FIRST — cached replies cost nothing, so let them through
  // regardless of daily-limit state (user already paid for the original).
  const { data: cached } = await supabase
    .from("cat1_explanations")
    .select("explanation")
    .eq("user_id", user.id)
    .eq("question_id", questionId)
    .maybeSingle();

  if (cached?.explanation) {
    return NextResponse.json({ explanation: cached.explanation, cached: true });
  }

  // Cache miss — apply per-user rolling-window throttle before any paid
  // call. Defense in depth on top of the daily counter below.
  const rl = await aiRateLimit(clientKey(req, "smart-explain", user.id), { max: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  // Cache miss — gate by plan + daily quota before paying for a fresh
  // Anthropic call. Shares the mcq counter so a free user can't bypass
  // their attempt cap by calling smart-explain directly.
  const limit = await enforceDailyLimit(supabase, "mcq");
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "daily_limit_reached", plan: limit.plan, dailyLimit: limit.dailyLimit, used: limit.used },
      { status: 429 }
    );
  }

  // Look up the question in the @mostly-medicine/content bundle.
  const question = allQuestions.find((q) => q.id === questionId);
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const userAnswerOption = question.options[userAnswerIndex];
  const correctOption = question.options.find((o) => o.label === question.correctAnswer);
  if (!correctOption) {
    return NextResponse.json({ error: "Question data invalid" }, { status: 500 });
  }

  const optionLines = question.options
    .map((o, i) => `${o.label}. ${o.text}${i === userAnswerIndex ? "  <-- student picked this" : ""}${o.label === question.correctAnswer ? "  <-- CORRECT" : ""}`)
    .join("\n");

  const userMessage = `TOPIC: ${question.topic} — ${question.subtopic}

QUESTION:
${question.stem}

OPTIONS:
${optionLines}

CORRECT ANSWER: ${question.correctAnswer}. ${correctOption.text}
STUDENT'S ANSWER: ${userAnswerOption ? `${userAnswerOption.label}. ${userAnswerOption.text}` : "(no answer recorded)"}

EXISTING SHORT EXPLANATION (for your reference, do not copy verbatim):
${question.explanation}

Write the personalised 3-4 sentence explanation now.`;

  // cache_control is supported at runtime in @anthropic-ai/sdk@0.32.x but the
  // published types lack it — cast to TextBlockParam[] to satisfy TS.
  const systemBlocks = [
    {
      type: "text",
      text: SMART_EXPLAIN_SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    },
  ] as unknown as Anthropic.TextBlockParam[];

  const response = await client().messages.create({
    model: MODEL,
    max_tokens: 400,
    system: systemBlocks,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = response.content[0];
  if (!block || block.type !== "text") {
    return NextResponse.json({ error: "Unexpected response from AI" }, { status: 502 });
  }
  const explanation = block.text.trim();

  // Best-effort cache write — ignore conflicts (race with another tab).
  // The unique index is (user_id, question_id), so upsert lets the first
  // writer win without throwing on a concurrent second tab.
  await supabase
    .from("cat1_explanations")
    .upsert(
      {
        user_id: user.id,
        question_id: questionId,
        user_answer_index: userAnswerIndex,
        explanation,
        model: MODEL,
      },
      { onConflict: "user_id,question_id", ignoreDuplicates: true }
    );

  return NextResponse.json({ explanation, cached: false });
}
