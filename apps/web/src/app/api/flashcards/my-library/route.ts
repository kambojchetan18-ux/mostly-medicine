import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Returns the user's personal flashcard library grouped by deck.
// One row per (source, source_deck_name) with a count and the most
// recent add timestamp. The hub uses this to render "Your library"
// alongside the packaged decks; the per-deck route at
// /dashboard/flashcards/library/[deckName] fetches the actual cards.

interface DeckSummary {
  deckName: string;
  source: string; // 'ai_notes' | 'ai_mcq' | 'anki_apkg' | 'manual'
  count: number;
  lastAdded: string; // ISO timestamp
  slug: string;     // URL-safe identifier for the deck route
}

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: rows, error } = await supabase
    .from("user_flashcards")
    .select("source, source_deck_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[flashcards/my-library] select failed", error);
    return NextResponse.json({ error: "Library fetch failed" }, { status: 500 });
  }

  const byKey = new Map<string, DeckSummary>();
  for (const r of rows ?? []) {
    const deckName = r.source_deck_name ?? "Untitled deck";
    const source = r.source ?? "manual";
    const key = `${source}::${deckName}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      byKey.set(key, {
        deckName,
        source,
        count: 1,
        lastAdded: r.created_at,
        // Encode source+name into the slug so the route can decode back
        // without a separate lookup table. Using btoa keeps the URL
        // short and avoids URL-percent-encoding surprises on the wire.
        slug: Buffer.from(`${source}|${deckName}`, "utf-8").toString("base64url"),
      });
    }
  }

  const decks = Array.from(byKey.values()).sort(
    (a, b) => new Date(b.lastAdded).getTime() - new Date(a.lastAdded).getTime()
  );

  return NextResponse.json({ decks });
}
