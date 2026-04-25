-- Mostly Medicine — Stripe billing columns + webhook audit log.

alter table public.user_profiles
  add column if not exists stripe_customer_id text unique,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text,
  add column if not exists subscription_period_end timestamptz;

create index if not exists user_profiles_stripe_customer_idx
  on public.user_profiles (stripe_customer_id);

create table if not exists public.billing_events (
  id text primary key,
  type text not null,
  user_id uuid references auth.users(id) on delete set null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

alter table public.billing_events enable row level security;
-- service-role only; no public policies
