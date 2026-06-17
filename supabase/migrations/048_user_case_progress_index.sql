-- Add index on user_case_progress.user_id for query performance.
-- The unique constraint on (user_id, case_id) helps point lookups but
-- queries filtering by user_id alone benefit from a dedicated index.

create index if not exists user_case_progress_user_id_idx
  on public.user_case_progress (user_id);
