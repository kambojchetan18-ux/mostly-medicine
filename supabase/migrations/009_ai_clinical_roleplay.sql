-- Mostly Medicine — AI Clinical RolePlay Cases
-- Source-inspired, AI-generated AMC-style clinical roleplay cases.
-- Source PDFs are reference material only; never exposed to learners.

-- ============================================================
-- acrp_sources: extracted metadata from uploaded source PDFs
-- (PDF text/wording is NOT stored — only structured tags)
-- ============================================================
create table if not exists public.acrp_sources (
  id uuid primary key default gen_random_uuid(),
  filename text not null unique,
  title text not null,
  topic text,
  category text,
  complaint_cluster text[] default '{}',
  diagnosis_family text[] default '{}',
  clues text[] default '{}',
  red_flags text[] default '{}',
  management_themes text[] default '{}',
  notes text,
  ingested_at timestamptz not null default now()
);

create index if not exists acrp_sources_category_idx on public.acrp_sources (category);
create index if not exists acrp_sources_topic_idx on public.acrp_sources (topic);

alter table public.acrp_sources enable row level security;
-- service_role only — no public policies (sources are internal reference)

-- ============================================================
-- acrp_blueprints: presentation-family blueprints synthesised
-- from multiple sources. These are the seeds for case generation.
-- ============================================================
create table if not exists public.acrp_blueprints (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  family_name text not null,
  category text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  presentation_cluster text[] not null default '{}',
  hidden_diagnoses jsonb not null default '[]',
  distractor_diagnoses jsonb not null default '[]',
  red_flags text[] default '{}',
  candidate_tasks text[] default '{}',
  setting_options text[] default '{}',
  age_bands text[] default '{}',
  source_ids uuid[] default '{}',
  blueprint jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists acrp_blueprints_category_idx on public.acrp_blueprints (category);
create index if not exists acrp_blueprints_difficulty_idx on public.acrp_blueprints (difficulty);

alter table public.acrp_blueprints enable row level security;

create policy "Blueprints readable by authenticated users"
  on public.acrp_blueprints for select
  using (auth.uid() is not null);

-- ============================================================
-- acrp_cases: generated case variants (cached for retry/replay)
-- One blueprint -> many cases (different seeds, demographics, wording).
-- ============================================================
create table if not exists public.acrp_cases (
  id uuid primary key default gen_random_uuid(),
  blueprint_id uuid not null references public.acrp_blueprints(id) on delete cascade,
  seed text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  station_stem jsonb not null,
  patient_profile jsonb not null,
  hidden_diagnosis text not null,
  clue_pool jsonb not null default '[]',
  red_flags text[] default '{}',
  candidate_task text not null,
  setting text not null,
  emotional_tone text,
  created_at timestamptz not null default now(),
  unique (blueprint_id, seed)
);

create index if not exists acrp_cases_blueprint_idx on public.acrp_cases (blueprint_id);

alter table public.acrp_cases enable row level security;

create policy "Cases readable by authenticated users"
  on public.acrp_cases for select
  using (auth.uid() is not null);

-- ============================================================
-- acrp_sessions: per-user attempt at a case
-- ============================================================
create table if not exists public.acrp_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid not null references public.acrp_cases(id) on delete cascade,
  status text not null default 'reading' check (status in ('reading', 'roleplay', 'completed', 'abandoned')),
  reading_started_at timestamptz not null default now(),
  roleplay_started_at timestamptz,
  ended_at timestamptz,
  global_score int,
  communication_score int,
  reasoning_score int,
  feedback jsonb,
  created_at timestamptz not null default now()
);

create index if not exists acrp_sessions_user_idx on public.acrp_sessions (user_id, created_at desc);
create index if not exists acrp_sessions_case_idx on public.acrp_sessions (case_id);

alter table public.acrp_sessions enable row level security;

create policy "Users read own sessions"
  on public.acrp_sessions for select
  using (auth.uid() = user_id);

create policy "Users insert own sessions"
  on public.acrp_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users update own sessions"
  on public.acrp_sessions for update
  using (auth.uid() = user_id);

-- ============================================================
-- acrp_messages: transcript per session
-- ============================================================
create table if not exists public.acrp_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.acrp_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists acrp_messages_session_idx on public.acrp_messages (session_id, created_at);

alter table public.acrp_messages enable row level security;

create policy "Users read own session messages"
  on public.acrp_messages for select
  using (exists (
    select 1 from public.acrp_sessions s
    where s.id = session_id and s.user_id = auth.uid()
  ));

create policy "Users insert own session messages"
  on public.acrp_messages for insert
  with check (exists (
    select 1 from public.acrp_sessions s
    where s.id = session_id and s.user_id = auth.uid()
  ));
