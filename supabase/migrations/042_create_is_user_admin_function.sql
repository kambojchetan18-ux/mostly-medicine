-- Migrations 040 and 041 reference is_user_admin() in RLS policies but the
-- function was never created. Without it, every policy evaluation throws
-- "function is_user_admin() does not exist" and blocks admin operations on
-- user_profiles, security_alerts, and security_audit_runs.

create or replace function public.is_user_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

revoke all on function public.is_user_admin() from public;
grant execute on function public.is_user_admin() to authenticated, service_role;
