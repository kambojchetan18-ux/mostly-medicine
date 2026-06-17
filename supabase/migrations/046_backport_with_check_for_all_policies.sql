-- Backport WITH CHECK clauses to early FOR ALL RLS policies.
--
-- Migrations 001, 004, and 005 created FOR ALL policies with only a USING
-- clause.  In Postgres, when a FOR ALL policy omits WITH CHECK the USING
-- expression is implicitly applied to writes — but only for the row as it
-- exists *before* the write.  It does NOT validate the *new* row values.
-- This means an INSERT or UPDATE could set user_id / id to a different
-- user's UUID, bypassing ownership checks on the written row.
--
-- Adding an explicit WITH CHECK (identical to the USING clause) ensures
-- the ownership predicate is enforced on the *result* of every INSERT and
-- UPDATE, closing that gap.
--
-- Affected policies (all FOR ALL, no WITH CHECK):
--   001  roleplay_sessions  "Users can manage their own sessions"
--   004  img_profiles        "Users can manage their own IMG profile"
--   005  sr_cards            "Users manage their own sr_cards"
--   005  topic_progress      "Users manage their own topic_progress"
--   005  study_streaks       "Users manage their own streaks"

-- ── roleplay_sessions ────────────────────────────────────────────────────
drop policy if exists "Users can manage their own sessions"
  on public.roleplay_sessions;

create policy "Users can manage their own sessions"
  on public.roleplay_sessions for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── img_profiles ─────────────────────────────────────────────────────────
drop policy if exists "Users can manage their own IMG profile"
  on public.img_profiles;

create policy "Users can manage their own IMG profile"
  on public.img_profiles for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- ── sr_cards ─────────────────────────────────────────────────────────────
drop policy if exists "Users manage their own sr_cards"
  on public.sr_cards;

create policy "Users manage their own sr_cards"
  on public.sr_cards for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── topic_progress ───────────────────────────────────────────────────────
drop policy if exists "Users manage their own topic_progress"
  on public.topic_progress;

create policy "Users manage their own topic_progress"
  on public.topic_progress for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── study_streaks ────────────────────────────────────────────────────────
drop policy if exists "Users manage their own streaks"
  on public.study_streaks;

create policy "Users manage their own streaks"
  on public.study_streaks for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
