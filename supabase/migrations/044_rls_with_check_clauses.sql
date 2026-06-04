-- Add explicit WITH CHECK clauses to five FOR ALL RLS policies.
--
-- FOR ALL policies without WITH CHECK implicitly use the USING clause for
-- writes too, but an explicit WITH CHECK is defence-in-depth: it makes the
-- write guard self-documenting and protects against future USING changes
-- accidentally widening write access.
--
-- Strategy: DROP + re-CREATE each policy. Both are idempotent-safe via
-- "DROP POLICY IF EXISTS" and the CREATE will succeed because the old one
-- was just dropped.

-- ── 1. roleplay_sessions ────────────────────────────────────────────────
drop policy if exists "Users can manage their own sessions"
  on public.roleplay_sessions;

create policy "Users can manage their own sessions"
  on public.roleplay_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 2. img_profiles ─────────────────────────────────────────────────────
drop policy if exists "Users can manage their own IMG profile"
  on public.img_profiles;

-- Note: img_profiles uses `id` (PK = auth.users.id), not `user_id`.
create policy "Users can manage their own IMG profile"
  on public.img_profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── 3. sr_cards ─────────────────────────────────────────────────────────
drop policy if exists "Users manage their own sr_cards"
  on public.sr_cards;

create policy "Users manage their own sr_cards"
  on public.sr_cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 4. topic_progress ───────────────────────────────────────────────────
drop policy if exists "Users manage their own topic_progress"
  on public.topic_progress;

create policy "Users manage their own topic_progress"
  on public.topic_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 5. study_streaks ────────────────────────────────────────────────────
drop policy if exists "Users manage their own streaks"
  on public.study_streaks;

create policy "Users manage their own streaks"
  on public.study_streaks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
