import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createEmptyCard, fsrs, generatorParameters, Rating } from "ts-fsrs";

// FSRS-5 scheduler shared with the MCQ path. `enable_fuzz` randomises
// the next interval by a small amount so a deck of 200 cards reviewed
// together doesn't avalanche back on the same day next month — matches
// the Anki default and what apps/web/src/app/api/cat1/attempt/route.ts
// already uses for MCQs.
const f = fsrs(generatorParameters({ enable_fuzz: true }));

const RATING_MAP: Record<string, number> = {
  again: Rating.Again,
  hard:  Rating.Hard,
  good:  Rating.Good,
  easy:  Rating.Easy,
};

export async function POST(req: NextRequest) {
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

  const body = await req.json().catch(() => null);
  const cardId: unknown = body?.cardId;
  const ratingKey: unknown = body?.rating;

  if (typeof cardId !== "string" || cardId.length === 0 || cardId.length > 128) {
    return NextResponse.json({ error: "Invalid cardId" }, { status: 400 });
  }
  if (typeof ratingKey !== "string" || !(ratingKey in RATING_MAP)) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  // ts-fsrs's Grade type excludes Rating.Manual; our 4 rating keys all
  // map to real grades but the compiler can't infer that from the map,
  // so cast through the call's own parameter type.
  const rating = RATING_MAP[ratingKey] as Parameters<typeof f.next>[2];

  // Read existing FSRS state (if any). One row per (user, card).
  const { data: existing } = await supabase
    .from("flashcard_reviews")
    .select("*")
    .eq("user_id", user.id)
    .eq("card_id", cardId)
    .maybeSingle();

  // Reconstruct the ts-fsrs Card shape from the stored columns, or start
  // from createEmptyCard() if this is the first review. The library does
  // the actual interval math; we just persist state between calls.
  const card = existing
    ? {
        stability:      existing.stability,
        difficulty:     existing.difficulty,
        elapsed_days:   existing.elapsed_days,
        scheduled_days: existing.scheduled_days,
        reps:           existing.reps,
        lapses:         existing.lapses,
        state:          existing.state,
        due:            existing.due ? new Date(existing.due) : new Date(),
        last_review:    existing.last_review ? new Date(existing.last_review) : undefined,
      }
    : createEmptyCard();

  const result = f.next(card as Parameters<typeof f.next>[0], new Date(), rating);
  // (rating already narrowed via the cast above)
  const next = result.card;

  const upsertRes = await supabase
    .from("flashcard_reviews")
    .upsert(
      {
        user_id:        user.id,
        card_id:        cardId,
        stability:      next.stability,
        difficulty:     next.difficulty,
        elapsed_days:   next.elapsed_days,
        scheduled_days: next.scheduled_days,
        reps:           next.reps,
        lapses:         next.lapses,
        state:          next.state,
        due:            next.due.toISOString(),
        last_review:    new Date().toISOString(),
        last_rating:    rating,
        updated_at:     new Date().toISOString(),
      },
      { onConflict: "user_id,card_id" }
    );

  if (upsertRes.error) {
    console.error("[flashcards/review] upsert failed", upsertRes.error);
    return NextResponse.json({ error: "Persist failed" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    due:            next.due.toISOString(),
    scheduledDays:  next.scheduled_days,
    state:          next.state,
  });
}
