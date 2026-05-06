-- Implements recurring action items from code reviews:
-- 1. Normalise difficulty enum to lowercase in older tables
-- 2. Add unique constraint on stripe_subscription_id
-- 3. Create admin_audit_log table for admin action tracking

------------------------------------------------------------------------
-- 1. Normalise difficulty check constraints to lowercase
------------------------------------------------------------------------

-- library_topics: change 'Easy'/'Medium'/'Hard' → 'easy'/'medium'/'hard'
alter table public.library_topics drop constraint if exists library_topics_difficulty_check;
update public.library_topics set difficulty = lower(difficulty) where difficulty <> lower(difficulty);
alter table public.library_topics add constraint library_topics_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));

-- cases: same normalisation
alter table public.cases drop constraint if exists cases_difficulty_check;
update public.cases set difficulty = lower(difficulty) where difficulty <> lower(difficulty);
alter table public.cases add constraint cases_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));

------------------------------------------------------------------------
-- 2. Unique constraint on stripe_subscription_id (WHERE NOT NULL)
--    Prevents duplicate subscription assignment across users.
------------------------------------------------------------------------
create unique index if not exists idx_user_profiles_stripe_subscription_id
  on public.user_profiles (stripe_subscription_id)
  where stripe_subscription_id is not null;

------------------------------------------------------------------------
-- 3. Admin audit log table
------------------------------------------------------------------------
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id),
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

alter table public.admin_audit_log enable row level security;

create policy "Only admins can read audit log"
  on public.admin_audit_log for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create index idx_admin_audit_log_created_at on public.admin_audit_log (created_at desc);
create index idx_admin_audit_log_admin_user on public.admin_audit_log (admin_user_id);

grant select on public.admin_audit_log to authenticated;
grant insert on public.admin_audit_log to authenticated;
