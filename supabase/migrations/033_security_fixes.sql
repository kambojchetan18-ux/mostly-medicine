-- Security fix: add authorization check to award_xp() RPC.
-- Previously any authenticated user could award arbitrary XP to any other user.
CREATE OR REPLACE FUNCTION public.award_xp(p_user_id uuid, p_source text, p_points int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  -- 60-second idempotency window per (user, source)
  IF EXISTS (
    SELECT 1 FROM xp_ledger
    WHERE user_id = p_user_id
      AND source = p_source
      AND created_at > now() - interval '60 seconds'
  ) THEN
    RETURN;
  END IF;

  INSERT INTO xp_ledger (user_id, source, points)
  VALUES (p_user_id, p_source, p_points);

  INSERT INTO xp_totals (user_id, total_xp)
  VALUES (p_user_id, p_points)
  ON CONFLICT (user_id) DO UPDATE
  SET total_xp = xp_totals.total_xp + EXCLUDED.total_xp,
      updated_at = now();
END;
$$;

-- Security fix: prevent users from directly updating sensitive columns on
-- their own profile via the Supabase client. Only service_role (server-side
-- API routes and webhooks) should set plan, role, stripe_*, pro_until, etc.
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- service_role bypasses this check (used by billing webhook, admin routes)
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Reset security-sensitive columns to their old values for non-service callers
  NEW.plan := OLD.plan;
  NEW.role := OLD.role;
  NEW.stripe_customer_id := OLD.stripe_customer_id;
  NEW.stripe_subscription_id := OLD.stripe_subscription_id;
  NEW.subscription_status := OLD.subscription_status;
  NEW.subscription_period_end := OLD.subscription_period_end;
  NEW.subscription_cancel_at_period_end := OLD.subscription_cancel_at_period_end;
  NEW.pro_until := OLD.pro_until;
  NEW.founder_rank := OLD.founder_rank;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_columns_trigger ON public.user_profiles;
CREATE TRIGGER protect_profile_columns_trigger
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_columns();
