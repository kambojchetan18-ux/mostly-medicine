-- Add explicit WITH CHECK clauses to FOR ALL RLS policies that only had USING.
-- These were functionally correct (Postgres uses USING for both when WITH CHECK
-- is omitted on FOR ALL), but explicit is better for maintainability.

-- sr_cards (migration 005)
ALTER POLICY "Users manage their own sr_cards" ON public.sr_cards
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- topic_progress (migration 005)
ALTER POLICY "Users manage their own topic_progress" ON public.topic_progress
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- study_streaks (migration 005)
ALTER POLICY "Users manage their own streaks" ON public.study_streaks
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- img_profiles (migration 004)
ALTER POLICY "Users can manage their own IMG profile" ON public.img_profiles
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- roleplay_sessions (migration 001)
ALTER POLICY "Users can manage their own sessions" ON public.roleplay_sessions
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
