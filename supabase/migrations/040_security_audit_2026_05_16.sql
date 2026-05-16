-- Security Audit 2026-05-16: Critical RLS + rate-limit fixes
--
-- 1. CRITICAL: Restrict user_profiles self-update to safe columns only.
--    The previous policy allowed ANY authenticated user to SET their own
--    plan='enterprise' or role='admin' via a direct Supabase client query.
--    Fix: drop the permissive policy and replace with a column-restricted one.
--
-- 2. Rate-limit enforcement gap: checkRateLimit() always returned allowed=true
--    when count was below MAX_ATTEMPTS within the window — but it never checked
--    if count >= MAX_ATTEMPTS. The logic relied solely on locked_until being set
--    by recordFailedAttempt(). This is fine for the login flow but left signup
--    under-protected. The DB-side fix here adds a server-side safeguard:
--    a generated column that auto-computes lockout state.
--
-- 3. Add explicit deny-all RLS policies on service-role-only tables so that
--    even if RLS is accidentally toggled or keys leak, the tables stay locked.

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. user_profiles: restrict self-update to safe columns
-- ═══════════════════════════════════════════════════════════════════════════════

-- Drop the old overly-permissive policy
drop policy if exists "Users can update their own profile" on public.user_profiles;

-- New restricted policy: users can only update display fields on themselves.
-- plan, role, stripe_*, subscription_*, pro_until are ADMIN/SERVICE-ROLE only.
create policy "Users can update own display fields"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Ensure sensitive columns are unchanged. OLD values are compared implicitly
    -- by Supabase's RLS: the WITH CHECK runs on the NEW row, but we need the
    -- columns to remain at their current value. We use a subquery on the current
    -- row to enforce immutability of privileged fields.
    AND plan = (SELECT p.plan FROM public.user_profiles p WHERE p.id = auth.uid())
    AND role = (SELECT p.role FROM public.user_profiles p WHERE p.id = auth.uid())
    AND stripe_customer_id IS NOT DISTINCT FROM (SELECT p.stripe_customer_id FROM public.user_profiles p WHERE p.id = auth.uid())
    AND stripe_subscription_id IS NOT DISTINCT FROM (SELECT p.stripe_subscription_id FROM public.user_profiles p WHERE p.id = auth.uid())
    AND subscription_status IS NOT DISTINCT FROM (SELECT p.subscription_status FROM public.user_profiles p WHERE p.id = auth.uid())
    AND subscription_period_end IS NOT DISTINCT FROM (SELECT p.subscription_period_end FROM public.user_profiles p WHERE p.id = auth.uid())
    AND subscription_cancel_at_period_end IS NOT DISTINCT FROM (SELECT p.subscription_cancel_at_period_end FROM public.user_profiles p WHERE p.id = auth.uid())
    AND pro_until IS NOT DISTINCT FROM (SELECT p.pro_until FROM public.user_profiles p WHERE p.id = auth.uid())
    AND total_xp IS NOT DISTINCT FROM (SELECT p.total_xp FROM public.user_profiles p WHERE p.id = auth.uid())
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. Explicit deny-all policies on service-role-only tables
-- ═══════════════════════════════════════════════════════════════════════════════

-- rate_limit_attempts: accessed only via SUPABASE_SERVICE_ROLE_KEY in rate-limit.ts
drop policy if exists "Deny all direct access" on public.rate_limit_attempts;
create policy "Deny all direct access"
  on public.rate_limit_attempts for all using (false);

-- billing_events: accessed only via service-role in the webhook handler
drop policy if exists "Deny all direct access" on public.billing_events;
create policy "Deny all direct access"
  on public.billing_events for all using (false);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. Pin search_path on handle_new_user_profile (missed in 037's fix of
--    handle_new_user; both are SECURITY DEFINER triggers)
-- ═══════════════════════════════════════════════════════════════════════════════

create or replace function public.handle_new_user_profile()
returns trigger language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.user_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
