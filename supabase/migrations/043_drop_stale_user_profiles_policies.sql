-- Drop the original broad UPDATE policies from migration 007 that are
-- superseded by the column-level GRANTs and tighter policy in 040.
-- Multiple FOR UPDATE policies are OR'd in Postgres, so the old policy
-- would bypass the new one's restrictions.
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Revoke INSERT on user_profiles from authenticated users.
-- Row creation should only happen via the handle_new_user_profile() trigger.
REVOKE INSERT ON public.user_profiles FROM authenticated;
REVOKE INSERT ON public.user_profiles FROM anon;
