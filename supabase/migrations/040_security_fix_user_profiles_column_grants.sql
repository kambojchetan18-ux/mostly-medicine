-- CRITICAL: previously any authenticated user could mutate ANY column on
-- their own user_profiles row via a direct Supabase query, including role,
-- plan, pro_until, founder_rank and stripe_*. The UPDATE policy only
-- restricted WHICH row (auth.uid() = id) — not which columns. Lock it down
-- via column-level GRANTs.

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
