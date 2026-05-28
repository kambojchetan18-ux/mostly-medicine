-- Re-add FK constraints for user_id columns pointing at auth.users(id).
-- Migration 026 dropped the old FKs (which pointed at public.profiles).
-- These new constraints point directly at auth.users(id) ON DELETE CASCADE
-- so orphaned rows are cleaned up when an auth user is deleted.
--
-- Each block is wrapped in a DO $$ block that checks pg_constraint first
-- to make the migration safe to re-run.

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attempts_user_id_fkey'
  ) THEN
    ALTER TABLE public.attempts
      ADD CONSTRAINT attempts_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sr_cards_user_id_fkey'
  ) THEN
    ALTER TABLE public.sr_cards
      ADD CONSTRAINT sr_cards_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'topic_progress_user_id_fkey'
  ) THEN
    ALTER TABLE public.topic_progress
      ADD CONSTRAINT topic_progress_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'study_streaks_user_id_fkey'
  ) THEN
    ALTER TABLE public.study_streaks
      ADD CONSTRAINT study_streaks_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'roleplay_sessions_user_id_fkey'
  ) THEN
    ALTER TABLE public.roleplay_sessions
      ADD CONSTRAINT roleplay_sessions_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
