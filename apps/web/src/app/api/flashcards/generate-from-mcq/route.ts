import Anthropic from "@anthropic-ai/sdk";
import type { TextBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { allQuestions } from "@mostly-medicine/content";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

// Convert one (or up to 5) AMC-tagged MCQ(s) from the existing 4,400+
// corpus into 1–3 cloze flashcard drafts each. Mirrors the auth /
// rate-limit / plan-gate pattern of /api/flashcards/generate but skips
// the "paste notes" leg — the MCQ stem + options + explanation are the
// input.
//
// Returned drafts are NOT persisted. The client decides which to keep
// and POSTs the kept ones to /api/flashcards/save with source: 'ai_mcq'.
//
// Cost: Sonnet 4.6 with cache_control on the system prompt → only the
// per-MCQ user payload varies, so steady-state cost is a few cents per
// click. Matches project_anthropic_sdk_cache_control workaround.

const MODEL = "claude-sonnet-4-6";
const MAX_BATCH = 5;
const MAX_CARDS_PER_MCQ = 3;

const SYSTEM_PROMPT = `You are a senior AMC clinical examiner converting AMC-tagged multiple-choice questions into spaced-repetition flashcards for International Medical Graduates preparing for the AMC (Australian Medical Council) exam.

Input: ONE MCQ with stem, options, correctAnswer, explanation, topic and subtopic.
Output: 1 to ${MAX_CARDS_PER_MCQ} cloze flashcards that lock in the high-yield clinical learning point from that MCQ.

Rules:
- Cloze syntax is Anki-compatible: {{c1::hidden text}}. One concept per card. At most TWO clozes per card; one is preferred.
- The hidden text should be the high-yield clinical answer (dose, drug class, score threshold, key investigation, classic phrase, AMC mark-sheet domain term).
- front_md must contain at least one {{c1::...}} cloze.
- back_md = 1-3 sentence explanation grounded in Australian guidelines (RACGP / NHFA / TG / eTG / Murtagh / AMC Handbook / PBS / TGA / AHPRA / NHMRC). NEVER cite US-only guidelines (UpToDate / AHA) without an AU equivalent first. If the source MCQ already cites a guideline, prefer that one.
- Tag mark_sheet_domain with the closest AMC OSCE mark-sheet domain: history | ddx | mgmt | safety_net | communication | investigations | knowledge. For pure-fact MCQs default to "knowledge".
- Tag amc_part: default to "part_1" for knowledge MCQs; use "part_2_clinical" only if the card tests OSCE-style communication / triage / management; "both" if genuinely both.
- Skip filler. If the MCQ only supports one strong card, return ONE card — do not pad to three.
- Do NOT invent guideline numbers, drug doses, or epidemiology that aren't supported by the MCQ or standard AU practice. If unsure, omit the card.

Output STRICTLY valid JSON. No prose, no markdown fences, no leading text:

{
  "cards": [
    {
      "subtopic": "short topic label (default to the MCQ's subtopic)",
      "front_md": "stem with at least one {{c1::...}} cloze",
      "back_md": "1-3 sentence AU-cited explanation",
      "citation": "short citation, e.g. 'Murtagh 8th · TG Antibiotic'",
      "mark_sheet_domain": "one of the seven tags",
      "amc_part": "part_1 | part_2_clinical | both"
    }
  ]
}`;

interface RawCard {
  subtopic?: string;
  front_md?: string;
  back_md?: string;
  citation?: string;
  mark_sheet_domain?: string;
  amc_part?: string;
}

interface DraftCard {
  tempId: string;
  subtopic: string;
  front_md: string;
  back_md: string;
  citation: string;
  mark_sheet_domain: string;
  amc_part: string;
}

interface PerMcqResult {
  sourceQuestionId: string;
  cards: DraftCard[];
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens: number;
    cache_creation_input_tokens: number;
  };
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 8 generations / minute / user — slightly higher than the notes
  // generator because a single MCQ call is cheaper (smaller user
  // payload, smaller max_tokens) and the UX is "click button on each
  // wrong question", which can rip through 5-10 in quick succession.
  const rl = await aiRateLimit(
    clientKey(req, "flashcards-generate-mcq", user.id),
    { max: 8, windowMs: 60_000 }
  );
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  // Plan gate: Free = 5 MCQ→cards generations per UTC day. Pro /
  // Enterprise / admin = unlimited. Counts user_flashcards rows the
  // user has SAVED today with source = 'ai_mcq' — same 1:1 mapping the
  // /api/flashcards/generate route uses for source = 'ai_notes'.
  const FREE_DAILY_GEN_CAP = 5;
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("plan, role")
    .eq("id", user.id)
    .maybeSingle();
  const isUnlimited =
    profile?.role === "admin" ||
    profile?.plan === "pro" ||
    profile?.plan === "enterprise";
  if (!isUnlimited) {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const { count: usedToday } = await supabase
      .from("user_flashcards")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("source", "ai_mcq")
      .gte("created_at", startOfDay.toISOString());
    if ((usedToday ?? 0) >= FREE_DAILY_GEN_CAP) {
      return NextResponse.json(
        {
          error: "daily_limit_reached",
          plan: "free",
          dailyLimit: FREE_DAILY_GEN_CAP,
          used: usedToday ?? 0,
          upgrade: `Free plan: ${FREE_DAILY_GEN_CAP} AI MCQ→flashcards per day. Upgrade to Pro for unlimited generations + Anki import + new specialty decks.`,
        },
        { status: 429 }
      );
    }
  }

  const body = await req.json().catch(() => null);
  const rawIds: unknown = body?.questionIds ?? (body?.questionId ? [body.questionId] : null);

  if (!Array.isArray(rawIds) || rawIds.length === 0) {
    return NextResponse.json(
      { error: "Provide a questionId or non-empty questionIds array (max 5)." },
      { status: 400 }
    );
  }
  if (rawIds.length > MAX_BATCH) {
    return NextResponse.json(
      { error: `Batch size capped at ${MAX_BATCH} questions.` },
      { status: 400 }
    );
  }
  const questionIds = rawIds.filter((id): id is string => typeof id === "string" && id.length > 0);
  if (questionIds.length === 0) {
    return NextResponse.json(
      { error: "questionIds must be non-empty strings." },
      { status: 400 }
    );
  }

  // Look up each in the registry — 404 if any are unknown so the
  // client knows immediately rather than getting an empty result.
  const questions = questionIds.map((id) => ({
    id,
    q: allQuestions.find((x) => x.id === id),
  }));
  const missing = questions.filter((x) => !x.q).map((x) => x.id);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "question_not_found", missing },
      { status: 404 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service not configured (ANTHROPIC_API_KEY missing)." },
      { status: 503 }
    );
  }

  const client = new Anthropic();

  // cache_control on the system block — the prompt is identical every
  // call so the cached read cost dominates. Cast via unknown because
  // the 0.32.x TS surface doesn't expose cache_control on
  // TextBlockParam even though the runtime supports it
  // (project_anthropic_sdk_cache_control).
  const system = [
    { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
  ] as unknown as TextBlockParam[];

  // Run sequentially — even batch=5 is only ~10s end-to-end and we
  // don't want to burst the per-account TPM ceiling.
  const results: PerMcqResult[] = [];
  for (const { q } of questions) {
    if (!q) continue; // already 404'd above, but TS narrowing

    const userPayload = JSON.stringify({
      stem: q.stem,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      topic: q.topic,
      subtopic: q.subtopic,
    });

    let res: Awaited<ReturnType<typeof client.messages.create>>;
    try {
      res = await client.messages.create({
        model: MODEL,
        max_tokens: 1200,
        system,
        messages: [{ role: "user", content: userPayload }],
      });
    } catch (err) {
      console.error("[flashcards/generate-from-mcq] anthropic call failed", err);
      return NextResponse.json(
        { error: "AI generation upstream error. Please try again." },
        { status: 502 }
      );
    }

    const text = res.content
      .filter((b) => b.type === "text")
      .map((b) => ("text" in b ? b.text : ""))
      .join("");

    // Defensive: model is told to return strict JSON but may still wrap
    // in ``` fences occasionally.
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("[flashcards/generate-from-mcq] non-JSON for", q.id, text.slice(0, 200));
      results.push({
        sourceQuestionId: q.id,
        cards: [],
        usage: {
          input_tokens: res.usage.input_tokens,
          output_tokens: res.usage.output_tokens,
          cache_read_input_tokens: (res.usage as unknown as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0,
          cache_creation_input_tokens: (res.usage as unknown as { cache_creation_input_tokens?: number }).cache_creation_input_tokens ?? 0,
        },
      });
      continue;
    }

    let parsed: { cards?: RawCard[] };
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      console.warn("[flashcards/generate-from-mcq] malformed JSON for", q.id);
      results.push({
        sourceQuestionId: q.id,
        cards: [],
        usage: {
          input_tokens: res.usage.input_tokens,
          output_tokens: res.usage.output_tokens,
          cache_read_input_tokens: (res.usage as unknown as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0,
          cache_creation_input_tokens: (res.usage as unknown as { cache_creation_input_tokens?: number }).cache_creation_input_tokens ?? 0,
        },
      });
      continue;
    }

    const rawCards = Array.isArray(parsed.cards) ? parsed.cards : [];
    const cards: DraftCard[] = rawCards
      .filter(
        (c) =>
          typeof c?.front_md === "string" &&
          c.front_md.includes("{{c") &&
          c.front_md.length >= 10
      )
      .slice(0, MAX_CARDS_PER_MCQ)
      .map((c, i) => ({
        tempId: `${q.id}-draft-${i + 1}`,
        subtopic: typeof c.subtopic === "string" && c.subtopic.trim() ? c.subtopic : (q.subtopic ?? q.topic),
        front_md: c.front_md as string,
        back_md: typeof c.back_md === "string" ? c.back_md : "",
        citation: typeof c.citation === "string" ? c.citation : "",
        mark_sheet_domain: typeof c.mark_sheet_domain === "string" ? c.mark_sheet_domain : "knowledge",
        amc_part: typeof c.amc_part === "string" ? c.amc_part : "part_1",
      }));

    results.push({
      sourceQuestionId: q.id,
      cards,
      usage: {
        input_tokens: res.usage.input_tokens,
        output_tokens: res.usage.output_tokens,
        cache_read_input_tokens: (res.usage as unknown as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0,
        cache_creation_input_tokens: (res.usage as unknown as { cache_creation_input_tokens?: number }).cache_creation_input_tokens ?? 0,
      },
    });
  }

  // Single-question shape (what the per-MCQ button needs) vs batch
  // shape (what the optional "do all wrong ones" caller would need).
  // We return both so the client can pick whichever it cares about.
  if (results.length === 1) {
    const only = results[0];
    if (only.cards.length === 0) {
      return NextResponse.json(
        { error: "AI couldn't extract any cloze-style cards from this MCQ. Try a different question." },
        { status: 422 }
      );
    }
    return NextResponse.json({
      sourceQuestionId: only.sourceQuestionId,
      cards: only.cards,
      usage: only.usage,
    });
  }

  return NextResponse.json({ results });
}
