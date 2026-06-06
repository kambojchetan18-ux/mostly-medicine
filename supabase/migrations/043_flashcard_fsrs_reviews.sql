-- FSRS-5 persistence for flashcards.
--
-- Keep distinct from sr_cards (which gates MCQs) so the two content
-- domains can diverge — flashcards typically schedule more aggressively
-- than MCQs and we want to avoid co-mingled aggregates in the analytics
-- queries that already group on sr_cards.user_id.
--
-- One row per (user, card). On each review we upsert with the next FSRS
-- state. History lives in flashcard_review_logs (separate, append-only)
-- if/when we want a heatmap / review-events stream — not added yet to
-- keep this migration minimal.

create table if not exists public.flashcard_reviews (
  user_id          uuid        not null references auth.users(id) on delete cascade,
  card_id          text        not null,                       -- e.g. 'fc-cardio-001'
  stability        double precision,
  difficulty       double precision,
  elapsed_days     integer,
  scheduled_days   integer,
  reps             integer     default 0,
  lapses           integer     default 0,
  state            integer     default 0,                      -- 0 New, 1 Learning, 2 Review, 3 Relearning
  due              timestamptz,
  last_review      timestamptz,
  last_rating      integer,                                    -- 1 Again, 2 Hard, 3 Good, 4 Easy
  updated_at       timestamptz not null default now(),
  primary key (user_id, card_id)
);

create index if not exists flashcard_reviews_user_due_idx
  on public.flashcard_reviews (user_id, due);

alter table public.flashcard_reviews enable row level security;

drop policy if exists "users select own flashcard_reviews"  on public.flashcard_reviews;
drop policy if exists "users insert own flashcard_reviews"  on public.flashcard_reviews;
drop policy if exists "users update own flashcard_reviews"  on public.flashcard_reviews;

create policy "users select own flashcard_reviews"
  on public.flashcard_reviews for select
  using (auth.uid() = user_id);

create policy "users insert own flashcard_reviews"
  on public.flashcard_reviews for insert
  with check (auth.uid() = user_id);

create policy "users update own flashcard_reviews"
  on public.flashcard_reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
