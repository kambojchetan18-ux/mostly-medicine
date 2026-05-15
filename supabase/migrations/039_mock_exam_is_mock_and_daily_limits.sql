-- Tracks which mcq_sessions rows were started as a Mock Exam paper, so the
-- session/start handler can enforce a per-UTC-day cap based on the
-- module_permissions.mock_exam.daily_limit row for the user's plan.
alter table public.mcq_sessions
  add column if not exists is_mock boolean not null default false;

create index if not exists mcq_sessions_user_mock_created_idx
  on public.mcq_sessions (user_id, created_at desc)
  where is_mock = true;

-- Plan defaults for the new mock_exam module — Free + Pro = 1 paper/day,
-- Enterprise stays unlimited. Idempotent UPDATE so re-running is safe.
update public.module_permissions
   set daily_limit = 1, enabled = true, updated_at = now()
 where module = 'mock_exam' and plan in ('free', 'pro');

update public.module_permissions
   set daily_limit = null, enabled = true, updated_at = now()
 where module = 'mock_exam' and plan = 'enterprise';
