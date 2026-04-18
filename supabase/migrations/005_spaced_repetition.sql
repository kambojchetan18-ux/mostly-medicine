-- Spaced repetition state per user per question (FSRS algorithm)
create table public.sr_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_id text references public.questions(id) not null,

  -- FSRS state fields
  stability float not null default 0,
  difficulty float not null default 0,
  elapsed_days integer not null default 0,
  scheduled_days integer not null default 0,
  reps integer not null default 0,
  lapses integer not null default 0,
  state integer not null default 0,   -- 0=New, 1=Learning, 2=Review, 3=Relearning
  due timestamptz not null default now(),
  last_review timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id, question_id)
);

alter table public.sr_cards enable row level security;
create policy "Users manage their own sr_cards"
  on public.sr_cards for all using (auth.uid() = user_id);

-- Topic progress summary (materialised per session)
create table public.topic_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  topic text not null,
  total_attempted integer not null default 0,
  total_correct integer not null default 0,
  last_attempted_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, topic)
);

alter table public.topic_progress enable row level security;
create policy "Users manage their own topic_progress"
  on public.topic_progress for all using (auth.uid() = user_id);

-- Streak tracking
create table public.study_streaks (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_study_date date,
  updated_at timestamptz default now()
);

alter table public.study_streaks enable row level security;
create policy "Users manage their own streaks"
  on public.study_streaks for all using (auth.uid() = user_id);
