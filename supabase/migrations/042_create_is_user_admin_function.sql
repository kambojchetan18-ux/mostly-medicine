-- Create the is_user_admin() helper referenced by RLS policies in
-- migrations 040 and 041. Without this function, those policies
-- would fail with "function is_user_admin() does not exist".
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
