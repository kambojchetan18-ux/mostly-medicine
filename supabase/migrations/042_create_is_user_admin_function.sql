-- Create the is_user_admin() helper used by RLS policies in migrations 040/041.
-- Runs as SECURITY DEFINER so RLS on user_profiles does not block the check.
create or replace function public.is_user_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  )
$$;
