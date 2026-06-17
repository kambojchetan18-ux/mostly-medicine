import Anthropic from "@anthropic-ai/sdk";
import type { TextBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

// Convert pasted notes (lecture summary, AMC handbook chapter, exam
// blueprint, copy-pasted RACGP guideline) into 5–15 AMC-style cloze
// flashcards. Returns DRAFT cards — the client decides what to keep /
// edit before persisting via /api/flashcards/save.
//
// Cost: Sonnet 4.6 with cache_control on the system prompt — the system
// block is cached so steady-state cost per call ≈ a few cents (only the
// user notes vary). Matches project_gp_job_applier_default_model
// convention (Sonnet 4.6 default).
//
// Per-user throttle: 6 generations per minute is comfortable interactive
// pacing and well below where Anthropic's per-account TPM limit bites.

const MODEL = "claude-sonnet-4-6";
const MAX_NOTES_CHARS = 12_000;
const MAX_CARDS = 15;

const SYSTEM_PROMPT = `You are a senior AMC clinical examiner converting study notes into spaced-repetition flashcards for International Medical Graduates preparing for the AMC (Australian Medical Council) exam.

Rules:
- Read the user's notes and emit between 5 and ${MAX_CARDS} cloze flashcards.
- Cloze syntax is Anki-compatible: {{c1::hidden text}}. One concept per card. At most TWO clozes per card; one is preferred.
- The hidden text should be the high-yield clinical answer (dose, drug class, score threshold, AMC mark-sheet domain term, key investigation, classic phrase).
- back_md = 1-3 sentence explanation grounded in Australian guidelines (RACGP / NHFA / TG / eTG / Murtagh / AMC Handbook / PBS / TGA / AHPRA). NEVER cite US-only guidelines (UpToDate, AHA) without an AU equivalent first. If the notes lack a citation, add the most likely AU source.
- Tag mark_sheet_domain with the closest AMC OSCE mark-sheet domain when relevant: history | ddx | mgmt | safety_net | communication | investigations | knowledge.
- Tag amc_part: "part_1" (knowledge MCQ-style fact), "part_2_clinical" (OSCE-relevant communication / triage / management), or "both".
- Skip filler. If the notes are sparse, prefer FEWER higher-quality cards over padding.
- Do NOT invent guideline numbers, drug doses, or epidemiology that aren't supported by the notes or standard AU practice. If unsure, omit the card.

Output STRICTLY valid JSON. No prose, no markdown fences, no leading text:

{
  "deck_name": "concise 3-6 word title summarising the notes",
  "cards": [
    {
      "subtopic": "short topic label",
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

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 6 generations / minute / user. The model itself caps at ~30s per call
  // so this prevents an enthusiastic user from racing themselves into our
  // Anthropic budget.
  const rl = await aiRateLimit(
    clientKey(req, "flashcards-generate", user.id),
    { max: 6, windowMs: 60_000 }
  );
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  // Plan gate: Free = 3 AI generations per UTC day. Pro / Enterprise /
  // admin = unlimited. Counts rows in user_flashcards with source =
  // 'ai_notes' inserted by this user since UTC midnight — Each /save
  // call inserts the kept drafts, so this maps 1:1 to "successful
  // generations the user actually persisted today".
  const FREE_DAILY_GEN_CAP = 3;
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
      .eq("source", "ai_notes")
      .gte("created_at", startOfDay.toISOString());
    if ((usedToday ?? 0) >= FREE_DAILY_GEN_CAP) {
      return NextResponse.json(
        {
          error: "daily_limit_reached",
          plan: "free",
          dailyLimit: FREE_DAILY_GEN_CAP,
          used: usedToday ?? 0,
          upgrade: "Free plan: 3 AI generations per day. Upgrade to Pro for unlimited generations + Anki import + new specialty decks.",
        },
        { status: 429 }
      );
    }
  }

  const body = await req.json().catch(() => null);
  const notes: unknown = body?.notes;
  const explicitDeckName: unknown = body?.deckName;

  if (typeof notes !== "string" || notes.trim().length < 40) {
    return NextResponse.json(
      { error: "Paste at least 40 characters of notes to generate flashcards." },
      { status: 400 }
    );
  }
  if (notes.length > MAX_NOTES_CHARS) {
    return NextResponse.json(
      { error: `Notes too long (max ${MAX_NOTES_CHARS} chars). Split into chunks and run twice.` },
      { status: 400 }
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
  // call so the cached read cost dominates. Cast via unknown because the
  // 0.32.x TS surface doesn't expose cache_control on TextBlockParam
  // even though the runtime supports it (project_anthropic_sdk_cache_control).
  const system = [
    { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
  ] as unknown as TextBlockParam[];

  const userPayload =
    typeof explicitDeckName === "string" && explicitDeckName.trim()
      ? `Suggested deck name: ${explicitDeckName.trim()}\n\nNOTES:\n${notes.trim()}`
      : `NOTES:\n${notes.trim()}`;

  let res: Awaited<ReturnType<typeof client.messages.create>>;
  try {
    res = await client.messages.create({
      model: MODEL,
      max_tokens: 3000,
      system,
      messages: [{ role: "user", content: userPayload }],
    });
  } catch (err) {
    console.error("[flashcards/generate] anthropic call failed", err);
    return NextResponse.json(
      { error: "AI generation upstream error. Please try again." },
      { status: 502 }
    );
  }

  const textBlock = res.content.find((b) => b.type === "text") as
    | { type: "text"; text: string }
    | undefined;
  const text = textBlock?.text ?? "";

  // The model is instructed to return strict JSON, but defensive parsing
  // in case it wraps the payload in ``` blocks anyway.
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json(
      { error: "AI returned a non-JSON response. Try again." },
      { status: 502 }
    );
  }

  let parsed: { deck_name?: string; cards?: RawCard[] };
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json(
      { error: "AI returned malformed JSON. Try again." },
      { status: 502 }
    );
  }

  const deckName =
    (typeof parsed.deck_name === "string" && parsed.deck_name.trim()) ||
    (typeof explicitDeckName === "string" && explicitDeckName.trim()) ||
    "Generated deck";

  const rawCards = Array.isArray(parsed.cards) ? parsed.cards : [];
  const cards = rawCards
    .filter(
      (c) =>
        typeof c?.front_md === "string" &&
        c.front_md.includes("{{c") &&
        c.front_md.length >= 10
    )
    .slice(0, MAX_CARDS)
    .map((c, i) => ({
      tempId: `draft-${i + 1}`,
      subtopic: typeof c.subtopic === "string" ? c.subtopic : "",
      front_md: c.front_md as string,
      back_md: typeof c.back_md === "string" ? c.back_md : "",
      citation: typeof c.citation === "string" ? c.citation : "",
      mark_sheet_domain: typeof c.mark_sheet_domain === "string" ? c.mark_sheet_domain : "",
      amc_part: typeof c.amc_part === "string" ? c.amc_part : "both",
    }));

  if (cards.length === 0) {
    return NextResponse.json(
      { error: "AI couldn't extract any cloze-style cards from those notes. Try adding clearer key facts." },
      { status: 422 }
    );
  }

  return NextResponse.json({
    deckName,
    cards,
    usage: {
      input_tokens: res.usage.input_tokens,
      output_tokens: res.usage.output_tokens,
      cache_read_input_tokens: (res.usage as unknown as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0,
      cache_creation_input_tokens: (res.usage as unknown as { cache_creation_input_tokens?: number }).cache_creation_input_tokens ?? 0,
    },
  });
}
