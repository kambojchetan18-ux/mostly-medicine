-- Admin audit log: immutable record of admin actions (user deletes, password
-- resets, etc.).  Inserts happen server-side via service-role key so no INSERT
-- policy is needed.  Only admins may read the log.

create table if not exists public.admin_audit_log (
  id              uuid           primary key default gen_random_uuid(),
  admin_user_id   uuid           not null references auth.users(id),
  action          text           not null,
  target_user_id  uuid           references auth.users(id),
  metadata        jsonb          not null default '{}',
  created_at      timestamptz    not null default now()
);

-- RLS
alter table public.admin_audit_log enable row level security;

create policy "admins_select_audit_log"
  on public.admin_audit_log
  for select
  using (is_user_admin());

-- Index for "show me my recent actions" queries
create index idx_admin_audit_log_admin_created
  on public.admin_audit_log (admin_user_id, created_at desc);
