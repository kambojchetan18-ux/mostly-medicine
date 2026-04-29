import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  const { stem, options, correctAnswer, selectedAnswer, topic, subtopic, explanation } = await req.json();

  const optionLines = options
    .map((o: { label: string; text: string }) => `${o.label}. ${o.text}`)
    .join("\n");

  const prompt = `You are an expert AMC (Australian Medical Council) exam tutor. A medical student just answered this MCQ.

QUESTION:
${stem}

OPTIONS:
${optionLines}

CORRECT ANSWER: ${correctAnswer}
STUDENT SELECTED: ${selectedAnswer}
TOPIC: ${topic} — ${subtopic}
BRIEF EXPLANATION ALREADY SHOWN: ${explanation}

Write a DETAILED teaching explanation with these exact sections:

## Why ${correctAnswer} is Correct
Explain the mechanism, guideline basis, and clinical reasoning in 3–5 sentences.

## Why Each Other Option is Wrong
Go through every incorrect option briefly and explain the specific reason it is wrong (1–2 sentences each).

## Clinical Pearl
One memorable take-away point for the exam.

## Key Reference
Cite the specific Australian guideline, AMC Handbook chapter, or Therapeutic Guideline that governs this clinical decision. Be specific (e.g. "Therapeutic Guidelines: Cardiovascular, v7 — Atrial Fibrillation" or "NHFA/CSANZ Heart Failure Guidelines 2018, Section 4.3").

Keep the total response under 350 words. Use plain language suitable for an AMC candidate.`;

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system: [{ type: "text" as const, text: "You are an expert AMC exam tutor providing detailed explanations for MCQ questions.", cache_control: { type: "ephemeral" as const } }],
    messages: [{ role: "user", content: prompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text;
  return NextResponse.json({ explanation: text });
}
