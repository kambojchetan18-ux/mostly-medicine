import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Persist a batch of AI-generated (or hand-curated) flashcards into the
// user's personal library. Mirrors the shape /api/flashcards/generate
// returns, but with `source` defaulting to 'ai_notes' so the hub page
// can label these decks with their provenance.

interface SaveCard {
  subtopic?: string;
  front_md: string;
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

  const body = await req.json().catch(() => null);
  const cards: unknown = body?.cards;
  const deckName: unknown = body?.deckName;
  const source: unknown = body?.source;

  if (!Array.isArray(cards) || cards.length === 0 || cards.length > 50) {
    return NextResponse.json(
      { error: "cards must be a non-empty array of at most 50 items" },
      { status: 400 }
    );
  }

  const sourceTag =
    typeof source === "string" && ["ai_notes", "ai_mcq", "manual"].includes(source)
      ? source
      : "ai_notes";
  const sourceDeckName =
    typeof deckName === "string" && deckName.trim() ? deckName.trim().slice(0, 120) : null;

  const rows = (cards as SaveCard[])
    .filter((c) => typeof c?.front_md === "string" && c.front_md.length > 0)
    .map((c) => ({
      user_id: user.id,
      source: sourceTag,
      source_deck_name: sourceDeckName,
      front_md: c.front_md,
      back_md: typeof c.back_md === "string" ? c.back_md : null,
      cloze_text: c.front_md.includes("{{c") ? c.front_md : null,
      card_type: c.front_md.includes("{{c") ? "cloze" : "basic",
      tags: [
        c.subtopic,
        c.citation,
        c.mark_sheet_domain,
        c.amc_part,
      ].filter((t): t is string => typeof t === "string" && t.length > 0),
    }));

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No valid cards to save (each card needs a non-empty front_md)." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("user_flashcards")
    .insert(rows)
    .select("id");

  if (error) {
    console.error("[flashcards/save] insert failed", error);
    return NextResponse.json({ error: "Failed to save flashcards." }, { status: 500 });
  }

  return NextResponse.json({
    saved: data?.length ?? rows.length,
    deckName: sourceDeckName,
  });
}
