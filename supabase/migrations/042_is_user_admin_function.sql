-- Helper: returns TRUE when the calling user has role = 'admin' in user_profiles.
-- Usable in RLS policies to gate admin-only operations at the DB level.
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;
