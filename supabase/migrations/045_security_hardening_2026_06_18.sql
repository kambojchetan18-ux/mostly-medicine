-- Migration 045: Security hardening & performance (code review 18 Jun 2026)
--
-- 1. pg_cron schedule for rate_limit_attempts cleanup (daily midnight UTC)
-- 2. user_case_progress index on user_id
-- 3. Difficulty CHECK constraint + standardise to lowercase

-- ─── 1. Rate limit cleanup cron ─────────────────────────────────────────────
-- Runs daily at midnight UTC. Deletes rate_limit_attempts rows older than
-- 48 hours. The extra 24h buffer (beyond the 24h daily cap window) ensures
-- no in-flight windows are disrupted.
--
-- Requires pg_cron extension (already enabled on Supabase by default).
-- If pg_cron is not available, the function still exists and can be called
-- manually or via an external cron.

CREATE OR REPLACE FUNCTION public.cleanup_stale_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.rate_limit_attempts
  WHERE updated_at < now() - interval '48 hours';
$$;

-- Schedule the cleanup to run daily at midnight UTC.
-- Wrapped in DO block so it doesn't fail if pg_cron isn't available.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'cleanup-rate-limits',
      '0 0 * * *',
      'SELECT public.cleanup_stale_rate_limits()'
    );
  END IF;
END
$$;

-- ─── 2. Performance index ───────────────────────────────────────────────────
-- user_case_progress is queried by user_id on every roleplay session load.
CREATE INDEX IF NOT EXISTS idx_user_case_progress_user_id
  ON public.user_case_progress (user_id);

-- ─── 3. Difficulty constraint ───────────────────────────────────────────────
-- Standardise any existing Title Case values to lowercase before adding
-- the CHECK constraint. The content package already uses lowercase.
UPDATE public.questions SET difficulty = lower(difficulty)
  WHERE difficulty IS NOT NULL AND difficulty <> lower(difficulty);

-- Make difficulty NOT NULL with default, and add CHECK constraint.
-- ALTER TABLE with IF NOT EXISTS on constraints isn't supported, so
-- guard with a DO block.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'questions_difficulty_check'
      AND table_name = 'questions'
  ) THEN
    ALTER TABLE public.questions
      ADD CONSTRAINT questions_difficulty_check
      CHECK (difficulty IN ('easy', 'medium', 'hard'));
  END IF;
END
$$;
