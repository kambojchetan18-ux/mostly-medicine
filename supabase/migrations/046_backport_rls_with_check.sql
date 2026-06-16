-- Backport WITH CHECK to early RLS policies that only had USING.
-- Without WITH CHECK, FOR ALL / FOR UPDATE policies default WITH CHECK
-- to the USING expression, which is correct for same-user checks —
-- but explicit is safer, prevents future confusion, and satisfies
-- Supabase's security advisor.

-- 001: profiles — UPDATE policy
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 004: img_profiles — ALL policy
drop policy if exists "Users can manage their own IMG profile" on public.img_profiles;
create policy "Users can manage their own IMG profile"
  on public.img_profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 005: sr_cards — ALL policy
drop policy if exists "Users manage their own sr_cards" on public.sr_cards;
create policy "Users manage their own sr_cards"
  on public.sr_cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 005: topic_progress — ALL policy
drop policy if exists "Users manage their own topic_progress" on public.topic_progress;
create policy "Users manage their own topic_progress"
  on public.topic_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 005: study_streaks — ALL policy
drop policy if exists "Users manage their own streaks" on public.study_streaks;
create policy "Users manage their own streaks"
  on public.study_streaks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
