-- Track Stripe cancel_at_period_end so the billing UI can warn the user
-- that their plan is winding down even though it's still active. Stripe
-- keeps charging access until period_end on a "cancel at end" subscription;
-- before this column we had no way to surface that.

alter table public.user_profiles
  add column if not exists subscription_cancel_at_period_end boolean not null default false;
