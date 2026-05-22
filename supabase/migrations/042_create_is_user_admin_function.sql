-- Migration 042: Create the is_user_admin() function referenced by RLS policies
-- in migrations 040 and 041. Without this function, those policies fail at runtime.

CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

COMMENT ON FUNCTION public.is_user_admin() IS
  'Returns true if the calling user has the admin role. Used by RLS policies.';
