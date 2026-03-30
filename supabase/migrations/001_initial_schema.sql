-- Mostly Medicine — Initial Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
-- uuid-ossp not needed; using gen_random_uuid() (built-in since PG13)

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Questions
create table public.questions (
  id text primary key,
  topic text not null,
  subtopic text,
  stem text not null,
  options jsonb not null,      -- [{label, text}]
  correct_answer text not null,
  explanation text not null,
  reference text,               -- 'murtagh' | 'amc' | 'racgp-redbook' | 'other'
  difficulty text,              -- 'easy' | 'medium' | 'hard'
  created_at timestamptz default now()
);

alter table public.questions enable row level security;
create policy "Questions are publicly readable"
  on public.questions for select using (true);


-- User question attempts
create table public.attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_id text references public.questions(id) not null,
  selected_answer text not null,
  is_correct boolean not null,
  attempted_at timestamptz default now()
);

alter table public.attempts enable row level security;
create policy "Users can insert their own attempts"
  on public.attempts for insert with check (auth.uid() = user_id);
create policy "Users can view their own attempts"
  on public.attempts for select using (auth.uid() = user_id);


-- Clinical role-play sessions (CAT 2)
create table public.roleplay_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  scenario_id integer not null,
  messages jsonb not null default '[]',
  feedback text,
  score integer,
  completed boolean default false,
  started_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.roleplay_sessions enable row level security;
create policy "Users can manage their own sessions"
  on public.roleplay_sessions for all using (auth.uid() = user_id);
