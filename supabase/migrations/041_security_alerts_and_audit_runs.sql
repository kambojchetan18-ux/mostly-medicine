-- Tables backing the daily security audit cron (/api/cron/security-audit).
-- security_alerts collects findings; security_audit_runs is the run log so
-- we can see when the cron last fired + how many findings it produced.

create table if not exists public.security_alerts (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null,             -- e.g. 'priv_escalation', 'plan_drift', 'bulk_attempts', 'new_admin'
  severity     text not null default 'high', -- 'low' | 'medium' | 'high' | 'critical'
  fingerprint  text not null,             -- stable hash of identifying payload (used to dedupe)
  subject_type text,                       -- 'user' | 'session' | 'global'
  subject_id   text,                       -- e.g. user_id
  payload      jsonb not null default '{}',
  status       text not null default 'open', -- 'open' | 'acknowledged' | 'resolved'
  created_at   timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at  timestamptz,
  notes        text
);

-- One row per (kind, fingerprint) until resolved — prevents re-paging the
-- admin every day for the same finding.
create unique index if not exists security_alerts_open_unique_idx
  on public.security_alerts (kind, fingerprint)
  where status <> 'resolved';

create index if not exists security_alerts_status_created_idx
  on public.security_alerts (status, created_at desc);

create table if not exists public.security_audit_runs (
  id          uuid primary key default gen_random_uuid(),
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  findings    integer not null default 0,
  alerts_new  integer not null default 0,
  error       text
);

alter table public.security_alerts enable row level security;
alter table public.security_audit_runs enable row level security;

-- Admins only; no anon/authenticated select. Cron writes via service-role
-- which bypasses RLS.
drop policy if exists security_alerts_admin_read on public.security_alerts;
create policy security_alerts_admin_read on public.security_alerts
  for select using (is_user_admin());

drop policy if exists security_alerts_admin_write on public.security_alerts;
create policy security_alerts_admin_write on public.security_alerts
  for all using (is_user_admin()) with check (is_user_admin());

drop policy if exists security_audit_runs_admin_read on public.security_audit_runs;
create policy security_audit_runs_admin_read on public.security_audit_runs
  for select using (is_user_admin());
