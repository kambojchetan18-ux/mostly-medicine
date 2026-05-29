-- Restrict which user_profiles columns the authenticated role can SELECT.
-- RLS already limits rows to own-profile (+ admin), but column-level
-- GRANTs add defense-in-depth so billing internals are never exposed to
-- the client even if an RLS policy is accidentally loosened.

-- 1) Revoke broad table-level SELECT from authenticated + anon.
revoke select on public.user_profiles from anon;
revoke select on public.user_profiles from authenticated;

-- 2) Re-grant SELECT only on columns the client actually needs.
--    Billing/internal columns (stripe_customer_id, stripe_subscription_id,
--    subscription_status, subscription_period_end, subscription_cancel_at_period_end,
--    welcome_email_sent_at, brain_teaser_last_sent_at) stay server-only
--    via the service role.
grant select (
  id,
  email,
  full_name,
  avatar_url,
  plan,
  role,
  current_streak,
  longest_streak,
  last_active_date,
  total_xp,
  pro_until,
  founder_rank,
  email_marketing_opt_in,
  created_at,
  updated_at
) on public.user_profiles to authenticated;
