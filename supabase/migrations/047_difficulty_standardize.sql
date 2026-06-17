-- Standardise difficulty values to lowercase across all tables.
-- Content package uses lowercase ('easy','medium','hard'); align DB to match.

-- Update existing data in library_topics and cases
update public.library_topics set difficulty = lower(difficulty) where difficulty != lower(difficulty);
update public.cases set difficulty = lower(difficulty) where difficulty != lower(difficulty);

-- Drop old CHECK constraints and recreate with lowercase values
alter table public.library_topics drop constraint if exists library_topics_difficulty_check;
alter table public.library_topics
  add constraint library_topics_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));

alter table public.cases drop constraint if exists cases_difficulty_check;
alter table public.cases
  add constraint cases_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));

-- Add difficulty constraint to questions table (was missing entirely)
alter table public.questions
  add constraint questions_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));

alter table public.questions
  alter column difficulty set not null;
