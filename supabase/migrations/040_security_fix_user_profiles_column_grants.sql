-- CRITICAL: previously any authenticated user could mutate ANY column on
-- their own user_profiles row via a direct Supabase query, including role,
-- plan, pro_until, founder_rank and stripe_*. The UPDATE policy only
-- restricted WHICH row (auth.uid() = id) — not which columns. Lock it down
-- via column-level GRANTs.

-- 0) is_user_admin(): admin-check helper used by the policy below (and in 041).
--    It was originally created out-of-band directly on the remote DB and never
--    lived in a migration, so a fresh `supabase db reset` failed here with
--    "function is_user_admin() does not exist". Defining it at the top of its
--    first user closes that drift. SECURITY DEFINER so it bypasses RLS and does
--    NOT recurse when called from inside a user_profiles policy. Mirrors the
--    exact definition already live on the remote project.
create or replace function public.is_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.user_profiles where id = auth.uid()),
    false
  );
$$;

-- 1) Revoke the broad table-level UPDATE from anon + authenticated.
revoke update on public.user_profiles from anon;
revoke update on public.user_profiles from authenticated;

-- 2) Re-grant UPDATE only on truly user-editable columns. Service role
--    (webhooks, admin RPCs, cron) keeps unrestricted access via its
--    default postgres-equivalent membership; admin user-management UI
--    routes will be migrated to call those paths with the service-role
--    client in a paired code change.
grant update (
  full_name,
  avatar_url,
  email_marketing_opt_in,
  updated_at
) on public.user_profiles to authenticated;

-- 3) Tighten the policy: add `with check` so the row's id column can't
--    be mutated to forge identity. (The previous policy had USING but no
--    WITH CHECK, meaning UPDATE could re-target the row to a different
--    user id.)
drop policy if exists user_profiles_update_own_or_admin on public.user_profiles;
create policy user_profiles_update_own_or_admin
  on public.user_profiles for update
  using  ((auth.uid() = id) OR is_user_admin())
  with check ((auth.uid() = id) OR is_user_admin());
