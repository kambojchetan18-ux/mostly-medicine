-- Performance indexes for foreign key lookups and admin dashboard sorting.

-- Attempts table: FK on question_id is frequently joined/filtered.
create index if not exists attempts_question_id_idx
  on public.attempts (question_id);

-- Security alerts: admin dashboard sorts by created_at desc.
create index if not exists security_alerts_created_at_idx
  on public.security_alerts (created_at desc);

-- ══════════════════════════════════════════════════════════════════════
-- Admin audit log — tracks sensitive admin operations for accountability.
-- ══════════════════════════════════════════════════════════════════════
create table if not exists public.admin_audit_log (
  id          uuid primary key default gen_random_uuid(),
  admin_id    uuid not null references auth.users(id) on delete set null,
  action      text not null,
  target_id   uuid,
  details     jsonb default '{}'::jsonb,
  ip_address  text,
  created_at  timestamptz not null default now()
);

create index admin_audit_log_admin_id_idx on public.admin_audit_log (admin_id);
create index admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);

-- RLS: only admins can read audit logs, nobody can modify via client.
alter table public.admin_audit_log enable row level security;

create policy "admins_read_audit_log"
  on public.admin_audit_log for select
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
        and user_profiles.role = 'admin'
    )
  );

-- No insert/update/delete policies — writes go through service_role only.
revoke insert, update, delete on public.admin_audit_log from authenticated;
revoke all on public.admin_audit_log from anon;
grant select on public.admin_audit_log to authenticated;
grant all on public.admin_audit_log to service_role;
