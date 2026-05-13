-- Explicit deny-all policies for tables that have RLS enabled but no user-facing
-- policies. These tables are accessed exclusively via service_role, but without
-- explicit policies an RLS bypass or misconfiguration could expose data.
-- With these policies in place, authenticated/anonymous users get zero rows
-- even if RLS enforcement is somehow weakened.

-- acrp_sources (AI roleplay source metadata)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'acrp_sources' AND policyname = 'deny_all_acrp_sources'
  ) THEN
    CREATE POLICY deny_all_acrp_sources ON acrp_sources FOR ALL USING (false);
  END IF;
END $$;

-- billing_events (Stripe webhook payloads)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'billing_events' AND policyname = 'deny_all_billing_events'
  ) THEN
    CREATE POLICY deny_all_billing_events ON billing_events FOR ALL USING (false);
  END IF;
END $$;

-- email_unsub_tokens
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'email_unsub_tokens' AND policyname = 'deny_all_email_unsub_tokens'
  ) THEN
    CREATE POLICY deny_all_email_unsub_tokens ON email_unsub_tokens FOR ALL USING (false);
  END IF;
END $$;

-- social_posts (admin-only content scheduling)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'social_posts' AND policyname = 'deny_all_social_posts'
  ) THEN
    CREATE POLICY deny_all_social_posts ON social_posts FOR ALL USING (false);
  END IF;
END $$;

-- pwa_installs (analytics)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'pwa_installs' AND policyname = 'deny_all_pwa_installs'
  ) THEN
    CREATE POLICY deny_all_pwa_installs ON pwa_installs FOR ALL USING (false);
  END IF;
END $$;
