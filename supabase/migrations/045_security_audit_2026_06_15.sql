-- Security & performance fixes from 2026-06-15 code review

-- 1. Missing FK index for attempts.question_id (query performance)
CREATE INDEX IF NOT EXISTS attempts_question_id_idx
  ON public.attempts (question_id);

-- 2. security_alerts created_at index for admin dashboard sorting
CREATE INDEX IF NOT EXISTS security_alerts_created_at_idx
  ON public.security_alerts (created_at DESC);

-- 3. Admin audit log table — tracks privileged operations
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action     text NOT NULL,
  target_id  uuid,
  details    jsonb DEFAULT '{}',
  ip         text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
  ON public.admin_audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service-role inserts (from API routes), no authenticated INSERT needed.

CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx
  ON public.admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS admin_audit_log_admin_id_idx
  ON public.admin_audit_log (admin_id);

-- 4. Scheduled cleanup of stale rate_limit_attempts rows.
-- Runs via pg_cron or manual CALL; deletes rows older than 24h.
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM public.rate_limit_attempts
  WHERE updated_at < now() - interval '24 hours';
END;
$$;

-- 5. CHECK constraints on questions table for data integrity
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'questions_difficulty_check'
  ) THEN
    ALTER TABLE public.questions
      ADD CONSTRAINT questions_difficulty_check
      CHECK (difficulty IN ('easy', 'medium', 'hard'));
  END IF;
EXCEPTION WHEN undefined_table THEN
  -- questions table may not exist if content is TS-only
  NULL;
END $$;
