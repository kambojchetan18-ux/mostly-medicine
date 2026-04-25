-- 014: Module usage tracking (daily limits) + admin audit log

-- ═══════════════════════════════════════════════════════════════════
-- module_usage: tracks per-user, per-module usage for daily limits
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.module_usage (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  module    text not null,
  used_at   timestamptz not null default now()
);

create index if not exists idx_module_usage_user_module_date
  on public.module_usage (user_id, module, used_at);

alter table public.module_usage enable row level security;

-- Only accessible via service_role key (server-side enforcement)
-- No RLS policies = no client access

-- ═══════════════════════════════════════════════════════════════════
-- admin_audit_log: tracks admin actions for accountability
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.admin_audit_log (
  id          uuid primary key default gen_random_uuid(),
  admin_id    uuid not null references auth.users(id) on delete set null,
  action      text not null,
  target_type text,
  target_id   text,
  details     jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_admin_audit_log_admin_id
  on public.admin_audit_log (admin_id);
create index if not exists idx_admin_audit_log_created_at
  on public.admin_audit_log (created_at);

alter table public.admin_audit_log enable row level security;

create policy "Admins can view audit logs"
  on public.admin_audit_log for select
  using (exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.role = 'admin'));
