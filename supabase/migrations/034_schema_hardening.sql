-- 1. Add expires_at column to email_unsub_tokens (tokens should expire)
ALTER TABLE email_unsub_tokens
  ADD COLUMN IF NOT EXISTS expires_at timestamptz DEFAULT (now() + interval '7 days');

-- 2. Add unique constraint on user_profiles.email to prevent duplicate accounts
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_email_unique'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_email_unique UNIQUE (email);
  END IF;
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'Duplicate emails exist — clean up before applying unique constraint';
END $$;

-- 3. Composite index on acrp_sessions(user_id, case_id) for performance
CREATE INDEX IF NOT EXISTS idx_acrp_sessions_user_case
  ON acrp_sessions (user_id, case_id);

-- 4. Prevent deletion of all admin users (defense-in-depth trigger)
CREATE OR REPLACE FUNCTION prevent_last_admin_delete()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF OLD.role = 'admin' THEN
    IF (SELECT count(*) FROM user_profiles WHERE role = 'admin' AND id != OLD.id) = 0 THEN
      RAISE EXCEPTION 'Cannot delete the last admin user';
    END IF;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_last_admin_delete ON user_profiles;
CREATE TRIGGER trg_prevent_last_admin_delete
  BEFORE DELETE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_last_admin_delete();

-- Also prevent role demotion of the last admin
CREATE OR REPLACE FUNCTION prevent_last_admin_demotion()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF OLD.role = 'admin' AND (NEW.role IS NULL OR NEW.role != 'admin') THEN
    IF (SELECT count(*) FROM user_profiles WHERE role = 'admin' AND id != OLD.id) = 0 THEN
      RAISE EXCEPTION 'Cannot demote the last admin user';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_last_admin_demotion ON user_profiles;
CREATE TRIGGER trg_prevent_last_admin_demotion
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_last_admin_demotion();
