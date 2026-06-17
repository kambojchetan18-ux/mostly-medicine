-- Backport WITH CHECK to FOR ALL RLS policies from early migrations.
-- Without WITH CHECK, a user could UPDATE their user_id column to hijack
-- another user's data. WITH CHECK ensures the row still belongs to
-- the authenticated user after the update.

-- Migration 001: roleplay_sessions
drop policy if exists "Users can manage their own sessions" on public.roleplay_sessions;
create policy "Users can manage their own sessions"
  on public.roleplay_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Migration 004: img_profiles (keyed on id, not user_id)
drop policy if exists "Users can manage their own IMG profile" on public.img_profiles;
create policy "Users can manage their own IMG profile"
  on public.img_profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Migration 005: sr_cards
drop policy if exists "Users can manage their own SR cards" on public.sr_cards;
create policy "Users can manage their own SR cards"
  on public.sr_cards
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Migration 005: topic_progress
drop policy if exists "Users can manage their own topic progress" on public.topic_progress;
create policy "Users can manage their own topic progress"
  on public.topic_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Migration 005: study_streaks
drop policy if exists "Users can manage their own study streaks" on public.study_streaks;
create policy "Users can manage their own study streaks"
  on public.study_streaks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
