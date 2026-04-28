import { allQuestions } from "@mostly-medicine/content";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Runs only on the server — keeps allQuestions out of the client bundle entirely
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { topic, count = 20 } = await req.json();
  const safeCount = Math.min(Math.max(1, Number(count) || 20), 100);

  const filtered = topic
    ? allQuestions.filter((q) => q.topic === topic)
    : allQuestions;
  const pool = [...filtered].sort(() => Math.random() - 0.5).slice(0, safeCount);

  return NextResponse.json({ questions: pool });
}

// Also expose topic metadata (names + counts) — tiny payload, no questions
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const topicMap: Record<string, number> = {};
  for (const q of allQuestions) {
    topicMap[q.topic] = (topicMap[q.topic] ?? 0) + 1;
  }
  const topics = Object.entries(topicMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({ topics }, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
