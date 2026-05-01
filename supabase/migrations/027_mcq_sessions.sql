-- MCQ session tracking — groups N attempts into one timed session so we can
-- show emedici-style post-session results (score, percentile, per-question
-- review, AI learning points).
create table if not exists public.mcq_sessions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  topic             text,
  target_count      integer not null default 20,
  status            text not null default 'active',  -- active / completed / abandoned
  started_at        timestamptz not null default now(),
  ended_at          timestamptz,
  duration_seconds  integer,
  questions_answered integer not null default 0,
  score_pct         integer,        -- 0-100
  correct_count     integer,
  percentile        integer,        -- 0-100, computed at end
  learning_points   jsonb,          -- [{ questionId, isCorrect, points: [string] }]
  created_at        timestamptz not null default now()
);

create index if not exists mcq_sessions_user_started_idx
  on public.mcq_sessions (user_id, started_at desc);
create index if not exists mcq_sessions_score_idx
  on public.mcq_sessions (score_pct)
  where status = 'completed';

alter table public.mcq_sessions enable row level security;
drop policy if exists mcq_sessions_select_own on public.mcq_sessions;
create policy mcq_sessions_select_own
  on public.mcq_sessions for select
  using (user_id = auth.uid());
drop policy if exists mcq_sessions_modify_own on public.mcq_sessions;
create policy mcq_sessions_modify_own
  on public.mcq_sessions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

alter table public.attempts
  add column if not exists session_id uuid references public.mcq_sessions(id) on delete set null;
create index if not exists attempts_session_idx
  on public.attempts (session_id) where session_id is not null;
