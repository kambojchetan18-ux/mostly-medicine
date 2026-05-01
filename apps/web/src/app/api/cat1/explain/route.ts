import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

let _client: Anthropic | null = null;
function client() {
  if (!_client) _client = new Anthropic();
  return _client;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const stem = typeof body.stem === "string" ? body.stem.slice(0, 2000) : "";
  const options = Array.isArray(body.options) ? body.options.slice(0, 10) : [];
  const correctAnswer = typeof body.correctAnswer === "string" ? body.correctAnswer.slice(0, 10) : "";
  const selectedAnswer = typeof body.selectedAnswer === "string" ? body.selectedAnswer.slice(0, 10) : "";
  const topic = typeof body.topic === "string" ? body.topic.slice(0, 100) : "";
  const subtopic = typeof body.subtopic === "string" ? body.subtopic.slice(0, 100) : "";
  const explanation = typeof body.explanation === "string" ? body.explanation.slice(0, 1000) : "";

  if (!stem) return NextResponse.json({ error: "stem required" }, { status: 400 });

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

  const message = await client().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text;
  return NextResponse.json({ explanation: text });
}
