-- Tracks PWA install events + standalone-mode heartbeats for analytics.
-- Two event types:
--   'installed'  → fired when browser dispatches `appinstalled` (Android,
--                  desktop Chrome/Edge — fires synchronously on install)
--   'heartbeat'  → fired once per device per day when the app is launched
--                  in standalone mode (display-mode: standalone OR
--                  navigator.standalone). Catches iOS Safari users who
--                  add to home screen via Share menu without firing
--                  `appinstalled`.
--
-- Rough estimate of total installs = COUNT(DISTINCT session_id) on either
-- event_type. Heartbeat dedup is per-day per-session via the unique index.
create table if not exists public.pwa_installs (
  id              uuid primary key default gen_random_uuid(),
  session_id      text not null,
  user_id         uuid references auth.users(id) on delete set null,
  event_type      text not null check (event_type in ('installed', 'heartbeat')),
  platform_hint   text,
  user_agent      text,
  created_at      timestamptz not null default now(),
  -- For heartbeats we only want one row per session per day; we encode the
  -- date here so the unique constraint dedups same-day pings.
  event_date      date not null default (now() at time zone 'utc')::date
);

create unique index if not exists pwa_installs_dedup_idx
  on public.pwa_installs (session_id, event_type, event_date);

create index if not exists pwa_installs_created_at_idx
  on public.pwa_installs (created_at desc);

alter table public.pwa_installs enable row level security;

-- All inserts go through service role from /api/track/pwa-install.
-- No end-user policies needed; the route is auth-bypassed (anon installs
-- still count) and validates payload server-side before insert.
