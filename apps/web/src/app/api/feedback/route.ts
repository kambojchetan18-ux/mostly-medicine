import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { notifyAdminOfTicket } from "@/lib/notify";

export const dynamic = "force-dynamic";

// Cheap + fast classifier-and-responder. Single Claude call returns category +
// confidence + answer. We use Haiku 4.5 — at ~500 in / 300 out tokens this is
// roughly $0.0005 per ticket so even 10k tickets/mo costs $5.
const MODEL = "claude-haiku-4-5-20251001";

let _client: Anthropic | null = null;
function client() {
  if (!_client) _client = new Anthropic();
  return _client;
}

const SYSTEM_PROMPT = `You are the auto-help assistant for Mostly Medicine, an AMC exam-prep platform for International Medical Graduates preparing for the AMC Part 1 (MCQ) and Part 2 (Clinical) exams in Australia.

PRODUCT FACTS (use these to answer FAQ-style questions):
- Pricing: Free plan (limited MCQs), Pro A$19/mo or A$190/yr (everything in Free + AMC Handbook AI RolePlay + AMC Clinical AI RolePlay solo voice mode + examiner-style feedback), Enterprise A$49/mo or A$490/yr (everything in Pro + AMC Peer RolePlay live video with a partner).
- First 100 signups got Founder access — Pro free for 30 days. The cap is now full; new signups land on Free.
- Payments processed by Stripe in AUD. Cancel anytime via the Billing Portal at /dashboard/billing → "Open Billing Portal".
- Modules: AMC MCQ (3,000+ questions, spaced repetition), AMC Handbook AI RolePlay (handbook-aligned scenarios), AMC Clinical AI RolePlay (synthesised cases, voice mode), AMC Peer RolePlay (live 2-player video), Library (clinical references), Australian Jobs (RMO pools, GP pathway, action plans, app tracker).
- Tech: Web app at mostlymedicine.com, native mobile apps for Android (Play Store coming) and iOS. Voice uses Whisper + WebSpeech hybrid for cross-device support.
- Founder: Chetan Kamboj. Support email: support@mostlymedicine.com.

YOUR JOB:
1. Read the user's subject + body.
2. Pick exactly ONE category: faq | bug | feature | billing | account | other.
3. Pick ONE confidence: high | medium | low.
   - high: standard FAQ that you can answer fully from the facts above.
   - medium: you can give partial guidance but it might need follow-up.
   - low: this needs the human admin (account/billing change, refund, technical bug needing investigation, anything you're unsure about).
4. Write a friendly, concise answer (2-6 sentences max). Use plain English. Address the user directly. If confidence is low, acknowledge the issue and tell them an admin will follow up within 24 hours.
5. Never invent features that aren't listed above. If asked about something not in the list, say it's not available yet and offer to log it as a feature request.
6. Be honest about limitations. If you're an AI auto-responder, you don't have the user's account internals; for account/billing specifics tell them to check /dashboard/billing or escalate.

OUTPUT FORMAT — strict JSON only, no prose around it:
{"category": "...", "confidence": "...", "answer": "..."}`;

interface SubmitBody {
  subject?: string;
  body?: string;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: SubmitBody;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const subject = payload.subject?.trim() ?? "";
  const body = payload.body?.trim() ?? "";
  if (subject.length < 3 || subject.length > 200)
    return NextResponse.json({ error: "Subject 3-200 chars" }, { status: 400 });
  if (body.length < 5 || body.length > 4000)
    return NextResponse.json({ error: "Body 5-4000 chars" }, { status: 400 });

  // Insert open ticket first so we have a row even if Claude call fails.
  const { data: ticket, error: insertErr } = await supabase
    .from("feedback_tickets")
    .insert({
      user_id: user.id,
      subject,
      body,
      status: "open",
    })
    .select()
    .single();
  if (insertErr || !ticket) {
    return NextResponse.json({ error: insertErr?.message ?? "Insert failed" }, { status: 500 });
  }

  // Best-effort auto-response. If anything throws, the ticket stays "open"
  // and admin can still see + answer it manually.
  let category: string | null = null;
  let confidence: string | null = null;
  let answer: string | null = null;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await client().messages.create({
        model: MODEL,
        max_tokens: 500,
        temperature: 0.3,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ] as unknown as Anthropic.TextBlockParam[],
        messages: [
          {
            role: "user",
            content: `Subject: ${subject}\n\nBody: ${body}\n\nUser email: ${user.email ?? "(unknown)"}`,
          },
        ],
      });
      const text = response.content
        .filter((b) => b.type === "text")
        .map((b) => (b as Anthropic.TextBlock).text)
        .join("");
      const parsed = parseJsonish(text);
      if (parsed) {
        category = String(parsed.category ?? "").toLowerCase();
        confidence = String(parsed.confidence ?? "").toLowerCase();
        answer = String(parsed.answer ?? "").trim();
      }
    } catch (err) {
      console.error("[feedback] claude call failed", err);
    }
  }

  // Tech-routing rule:
  //   - Always escalate bug/account/billing categories — these need a human.
  //   - Escalate anything where Claude's confidence is low.
  //   - FAQ/feature/other with high/medium confidence stays as ai_answered.
  const techCategories = new Set(["bug", "account", "billing"]);
  const needsHuman =
    !answer ||
    confidence === "low" ||
    (category != null && techCategories.has(category));
  const status = needsHuman ? "escalated" : "ai_answered";

  await supabase
    .from("feedback_tickets")
    .update({
      category,
      ai_response: answer,
      ai_confidence: confidence,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticket.id);

  // Fire-and-forget tech-routed notification (Slack + email per env vars).
  // Skipped for plain FAQ-answered tickets — those don't need to wake Chetan.
  if (needsHuman) {
    void notifyAdminOfTicket({
      ticketId: ticket.id,
      subject,
      body,
      category,
      confidence,
      aiResponse: answer,
      userEmail: user.email ?? "(unknown)",
    });
  }

  return NextResponse.json({
    ok: true,
    ticketId: ticket.id,
    status,
    category,
    confidence,
    answer,
  });
}

// Lenient JSON extraction — Claude sometimes wraps the JSON in fences or
// adds a single trailing newline.
function parseJsonish(text: string): Record<string, unknown> | null {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}
