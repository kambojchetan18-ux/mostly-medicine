-- 1. billing_events: track whether the webhook handler finished processing.
--    Closes the crash-between-claim-and-sync gap in the idempotency logic.
alter table public.billing_events
  add column if not exists processed_at timestamptz;

-- 2. email_unsub_tokens: add expiration so leaked tokens can't be used forever.
alter table public.email_unsub_tokens
  add column if not exists expires_at timestamptz not null default (now() + interval '30 days');

-- 3. Fix difficulty CHECK constraints in library_topics and cases.
--    Original migration 002 used title-case ('Easy', 'Medium', 'Hard') but
--    all application code uses lowercase ('easy', 'medium', 'hard').
--    First update any existing rows, then swap the constraint.
update public.library_topics set difficulty = lower(difficulty)
  where difficulty is not null and difficulty <> lower(difficulty);

alter table public.library_topics drop constraint if exists library_topics_difficulty_check;
alter table public.library_topics
  add constraint library_topics_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));

update public.cases set difficulty = lower(difficulty)
  where difficulty is not null and difficulty <> lower(difficulty);

alter table public.cases drop constraint if exists cases_difficulty_check;
alter table public.cases
  add constraint cases_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));
