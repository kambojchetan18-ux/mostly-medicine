-- Backfill: define is_user_admin() referenced in migrations 040 and 041.
-- Without this, a fresh `supabase db push` fails on those migrations because
-- the function does not exist. SECURITY DEFINER so RLS policies can call it
-- regardless of the invoking role.

create or replace function public.is_user_admin()
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  return exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;
