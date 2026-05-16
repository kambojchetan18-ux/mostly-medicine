-- Audit log for admin actions (user delete, role change, password set/reset)
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_id uuid,
  target_email text,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

create policy "Admins can read audit log"
  on public.audit_log for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create index audit_log_actor_idx on public.audit_log (actor_id);
create index audit_log_action_idx on public.audit_log (action);
create index audit_log_created_idx on public.audit_log (created_at);
