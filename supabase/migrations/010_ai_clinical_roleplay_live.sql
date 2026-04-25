-- Mostly Medicine — AI Clinical RolePlay (Live, paid module)
-- Adds module permissions and live two-user session tables.

-- ============================================================
-- Permission seeds for new modules
-- acrp_solo : single-user voice roleplay (paid)
-- acrp_live : two-user video roleplay (premium, charged separately)
-- ============================================================
insert into public.module_permissions (plan, module, enabled, daily_limit) values
  ('free',       'acrp_solo', false, null),
  ('free',       'acrp_live', false, null),
  ('pro',        'acrp_solo', true,  10),
  ('pro',        'acrp_live', false, null),
  ('enterprise', 'acrp_solo', true,  null),
  ('enterprise', 'acrp_live', true,  null)
on conflict (plan, module) do update set
  enabled = excluded.enabled,
  daily_limit = excluded.daily_limit,
  updated_at = now();

-- ============================================================
-- acrp_live_sessions: a paired two-user roleplay session
-- ============================================================
create table if not exists public.acrp_live_sessions (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique,
  host_user_id uuid not null references auth.users(id) on delete cascade,
  guest_user_id uuid references auth.users(id) on delete set null,
  case_id uuid not null references public.acrp_cases(id) on delete cascade,
  host_role text not null check (host_role in ('doctor', 'patient')),
  status text not null default 'waiting' check (status in ('waiting', 'reading', 'roleplay', 'completed', 'abandoned')),
  patient_brief jsonb,
  reading_started_at timestamptz,
  roleplay_started_at timestamptz,
  ended_at timestamptz,
  global_score int,
  communication_score int,
  reasoning_score int,
  feedback jsonb,
  patient_portrayal_feedback jsonb,
  created_at timestamptz not null default now()
);

create index if not exists acrp_live_sessions_invite_idx on public.acrp_live_sessions (invite_code);
create index if not exists acrp_live_sessions_host_idx on public.acrp_live_sessions (host_user_id, created_at desc);
create index if not exists acrp_live_sessions_guest_idx on public.acrp_live_sessions (guest_user_id, created_at desc);

alter table public.acrp_live_sessions enable row level security;

create policy "Participants can read their live session"
  on public.acrp_live_sessions for select
  using (auth.uid() = host_user_id or auth.uid() = guest_user_id);

create policy "Host inserts session"
  on public.acrp_live_sessions for insert
  with check (auth.uid() = host_user_id);

create policy "Participants update their session"
  on public.acrp_live_sessions for update
  using (auth.uid() = host_user_id or auth.uid() = guest_user_id);

-- ============================================================
-- acrp_live_messages: per-turn transcript (from browser STT)
-- ============================================================
create table if not exists public.acrp_live_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.acrp_live_sessions(id) on delete cascade,
  sender_role text not null check (sender_role in ('doctor', 'patient')),
  sender_user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists acrp_live_messages_session_idx on public.acrp_live_messages (session_id, created_at);

alter table public.acrp_live_messages enable row level security;

create policy "Participants can read messages"
  on public.acrp_live_messages for select
  using (exists (
    select 1 from public.acrp_live_sessions s
    where s.id = session_id
      and (s.host_user_id = auth.uid() or s.guest_user_id = auth.uid())
  ));

create policy "Participants can insert their messages"
  on public.acrp_live_messages for insert
  with check (
    auth.uid() = sender_user_id
    and exists (
      select 1 from public.acrp_live_sessions s
      where s.id = session_id
        and (s.host_user_id = auth.uid() or s.guest_user_id = auth.uid())
    )
  );

-- Realtime is enabled per-table in Supabase via the publication.
-- Enable replication so clients can subscribe to live sessions+messages.
alter publication supabase_realtime add table public.acrp_live_sessions;
alter publication supabase_realtime add table public.acrp_live_messages;
