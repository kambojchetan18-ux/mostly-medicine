-- Admin audit log: records every admin action for accountability.
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid NOT NULL REFERENCES auth.users(id),
  action      text NOT NULL,
  target_type text,
  target_id   text,
  metadata    jsonb DEFAULT '{}'::jsonb,
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_log_admin_id   ON public.admin_audit_log (admin_id);
CREATE INDEX idx_admin_audit_log_action     ON public.admin_audit_log (action);
CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log (created_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read the audit log; inserts go through service role.
CREATE POLICY "admins_read_audit_log"
  ON public.admin_audit_log FOR SELECT
  USING (is_user_admin());
