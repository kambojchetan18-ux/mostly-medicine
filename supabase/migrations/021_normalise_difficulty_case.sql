-- Normalise difficulty columns to lowercase ('easy', 'medium', 'hard').
-- Old migrations (002, 003) used Title Case; newer code and ACRP tables
-- already use lowercase. This aligns everything.

-- 1. Update existing data to lowercase
update library_topics set difficulty = lower(difficulty) where difficulty is not null;
update cases set difficulty = lower(difficulty) where difficulty is not null;

-- 2. Drop old Title Case CHECK constraints and replace with lowercase.
-- ALTER TABLE ... DROP CONSTRAINT requires the constraint name. Since
-- migrations 002 used inline CHECK (no named constraint), Postgres
-- auto-names them. We use a safe approach: drop-and-recreate via ALTER.
alter table library_topics drop constraint if exists library_topics_difficulty_check;
alter table library_topics add constraint library_topics_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));

alter table cases drop constraint if exists cases_difficulty_check;
alter table cases add constraint cases_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));
