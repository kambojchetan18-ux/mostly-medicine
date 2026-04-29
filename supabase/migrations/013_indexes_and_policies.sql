-- Performance indexes for frequently queried tables

CREATE INDEX IF NOT EXISTS attempts_user_id_idx
  ON public.attempts (user_id, attempted_at DESC);

CREATE INDEX IF NOT EXISTS sr_cards_user_due_idx
  ON public.sr_cards (user_id, due)
  WHERE state IN (1, 2, 3);

CREATE INDEX IF NOT EXISTS roleplay_sessions_user_id_idx
  ON public.roleplay_sessions (user_id, started_at DESC);

-- Allow users to insert their own user_profiles row (trigger uses SECURITY DEFINER
-- but client-side code may also attempt direct inserts).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_profiles'
      AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
      ON public.user_profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END
$$;

-- Add CHECK constraint on questions.difficulty to enforce lowercase values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'questions_difficulty_check'
  ) THEN
    ALTER TABLE public.questions
      ADD CONSTRAINT questions_difficulty_check
      CHECK (difficulty IN ('easy', 'medium', 'hard'));
  END IF;
END
$$;
