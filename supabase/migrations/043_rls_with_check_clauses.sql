-- Add WITH CHECK clauses to FOR ALL RLS policies.
-- Without WITH CHECK, a user could theoretically UPDATE the user_id / id
-- column on their own row (the USING clause only gates which rows are
-- visible, not what the new values can be).

-- img_profiles (004)
drop policy if exists "Users can manage their own IMG profile" on public.img_profiles;
create policy "Users can manage their own IMG profile"
  on public.img_profiles for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- sr_cards (005)
drop policy if exists "Users manage their own sr_cards" on public.sr_cards;
create policy "Users manage their own sr_cards"
  on public.sr_cards for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- topic_progress (005)
drop policy if exists "Users manage their own topic_progress" on public.topic_progress;
create policy "Users manage their own topic_progress"
  on public.topic_progress for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- study_streaks (005)
drop policy if exists "Users manage their own streaks" on public.study_streaks;
create policy "Users manage their own streaks"
  on public.study_streaks for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
