-- 025_normalize_difficulty.sql — Normalize difficulty values to lowercase
-- CLAUDE.md specifies lowercase: 'easy' | 'medium' | 'hard'
-- library_topics and cases had Title Case constraints ('Easy', 'Medium', 'Hard')

-- 1. Update existing data to lowercase
update public.library_topics set difficulty = lower(difficulty) where difficulty is not null;

-- 2. Drop old constraint and add new one
alter table public.library_topics drop constraint if exists library_topics_difficulty_check;
alter table public.library_topics add constraint library_topics_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));

-- 3. Same for cases table (if it still exists)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'cases') then
    update public.cases set difficulty = lower(difficulty) where difficulty is not null;
    execute 'alter table public.cases drop constraint if exists cases_difficulty_check';
    execute 'alter table public.cases add constraint cases_difficulty_check check (difficulty in (''easy'', ''medium'', ''hard''))';
  end if;
end;
$$;
