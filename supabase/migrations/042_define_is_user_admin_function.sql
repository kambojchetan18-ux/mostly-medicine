-- Migration 042: define the is_user_admin() helper referenced by
-- migrations 040 (user_profiles UPDATE policy) and 041 (security_alerts
-- + security_audit_runs RLS). Without this function those policies throw
-- "function is_user_admin() does not exist" at runtime.

create or replace function public.is_user_admin()
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  return exists (
    select 1
      from public.user_profiles
     where id = auth.uid()
       and role = 'admin'
  );
end;
$$;
