-- Smart Explanations: cached, personalised AI explanations for CAT 1 MCQs that
-- a user got wrong. We cache per (user, question) so we never pay Claude twice
-- for the same wrong answer.

create table public.cat1_explanations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  question_id text not null,
  user_answer_index integer not null,
  explanation text not null,
  model text not null,
  created_at timestamptz default now() not null
);

-- One cached explanation per user per question — stops duplicate spend if the
-- user retries the same MCQ and clicks "Why was I wrong?" again.
create unique index cat1_explanations_user_question_idx
  on public.cat1_explanations (user_id, question_id);

alter table public.cat1_explanations enable row level security;

create policy "Users can read their own cat1_explanations"
  on public.cat1_explanations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cat1_explanations"
  on public.cat1_explanations for insert
  with check (auth.uid() = user_id);
