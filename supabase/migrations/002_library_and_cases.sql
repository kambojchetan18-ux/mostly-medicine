-- Mostly Medicine — Phase 1: Library & Cases
-- Run via: supabase db push

-- ============================================================
-- LIBRARY TOPICS (public content)
-- ============================================================
create table if not exists library_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text not null,
  system text not null,
  summary text not null,
  content jsonb not null default '{}',
  amc_exam_type text[] default '{}',
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  created_at timestamptz default now()
);

alter table library_topics
  add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(summary, '') || ' ' ||
      coalesce(system, '') || ' ' ||
      coalesce(source, '')
    )
  ) stored;

create index if not exists library_topics_search_idx on library_topics using gin(search_vector);

alter table library_topics enable row level security;

create policy "Library topics are publicly readable"
  on library_topics for select
  using (true);

-- ============================================================
-- CASES (public content)
-- ============================================================
create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  estimated_minutes int,
  amc_exam_type text,
  steps jsonb not null default '[]',
  created_at timestamptz default now()
);

alter table cases
  add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(category, '')
    )
  ) stored;

create index if not exists cases_search_idx on cases using gin(search_vector);

alter table cases enable row level security;

create policy "Cases are publicly readable"
  on cases for select
  using (true);

-- ============================================================
-- USER CASE PROGRESS (private per user)
-- ============================================================
create table if not exists user_case_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  case_id uuid references cases(id) on delete cascade not null,
  current_step int default 1,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, case_id)
);

alter table user_case_progress enable row level security;

create policy "Users can read their own progress"
  on user_case_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on user_case_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on user_case_progress for update
  using (auth.uid() = user_id);

-- ============================================================
-- USER NOTES (private per user)
-- ============================================================
create table if not exists user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  filename text not null,
  file_url text,
  extracted_text text,
  ai_summary text,
  page_count int,
  file_size_bytes int,
  created_at timestamptz default now()
);

alter table user_notes enable row level security;

create policy "Users can read their own notes"
  on user_notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on user_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on user_notes for delete
  using (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET for user notes
-- ============================================================
insert into storage.buckets (id, name, public)
values ('user-notes', 'user-notes', false)
on conflict (id) do nothing;

create policy "Users can upload to their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'user-notes' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can read their own files"
  on storage.objects for select
  using (
    bucket_id = 'user-notes' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own files"
  on storage.objects for delete
  using (
    bucket_id = 'user-notes' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- GLOBAL SEARCH RPC FUNCTION
-- ============================================================
create or replace function search_content(search_query text, searching_user_id uuid default null)
returns table(
  id uuid,
  title text,
  type text,
  snippet text,
  url text,
  system_tag text,
  difficulty text
) as $$
begin
  return query
    select
      lt.id,
      lt.title,
      'library'::text as type,
      lt.summary as snippet,
      ('/dashboard/library/' || lt.id::text) as url,
      lt.system as system_tag,
      lt.difficulty
    from library_topics lt
    where lt.search_vector @@ plainto_tsquery('english', search_query)

    union all

    select
      c.id,
      c.title,
      'case'::text as type,
      c.category as snippet,
      ('/dashboard/cases/' || c.id::text) as url,
      c.category as system_tag,
      c.difficulty
    from cases c
    where c.search_vector @@ plainto_tsquery('english', search_query)

    union all

    select
      un.id,
      un.filename as title,
      'note'::text as type,
      coalesce(un.ai_summary, 'Personal note') as snippet,
      ('/dashboard/library/notes/' || un.id::text) as url,
      'My Notes'::text as system_tag,
      null::text as difficulty
    from user_notes un
    where
      searching_user_id is not null and
      un.user_id = searching_user_id and
      (
        un.filename ilike '%' || search_query || '%' or
        un.ai_summary ilike '%' || search_query || '%' or
        un.extracted_text ilike '%' || search_query || '%'
      )

  limit 25;
end;
$$ language plpgsql security definer;

-- ============================================================
-- UPDATED_AT TRIGGER for user_case_progress
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_user_case_progress_updated_at
  before update on user_case_progress
  for each row execute function update_updated_at_column();
