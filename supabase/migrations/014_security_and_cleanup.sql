-- 014_security_and_cleanup.sql
-- Fixes: search_content SECURITY DEFINER, difficulty enum standardisation, billing_events retention

-- ─── 1. Fix search_content: validate searching_user_id matches auth.uid() ──────
-- The function uses SECURITY DEFINER to bypass RLS on library_topics/cases (public
-- content), but the user_notes branch was vulnerable to IDOR — any authenticated
-- user could pass another user's ID to read their notes.
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
  if searching_user_id is not null and searching_user_id != auth.uid() then
    raise exception 'searching_user_id must match the authenticated user';
  end if;

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

-- ─── 2. Standardise difficulty to lowercase ───────────────────────────────────
-- library_topics and cases tables use Title Case ('Easy','Medium','Hard');
-- acrp_* tables and all application code use lowercase ('easy','medium','hard').
-- Align everything to lowercase.

update library_topics set difficulty = lower(difficulty)
where difficulty in ('Easy', 'Medium', 'Hard');

update cases set difficulty = lower(difficulty)
where difficulty in ('Easy', 'Medium', 'Hard');

alter table library_topics drop constraint if exists library_topics_difficulty_check;
alter table library_topics add constraint library_topics_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));

alter table cases drop constraint if exists cases_difficulty_check;
alter table cases add constraint cases_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard'));

-- ─── 3. Billing events retention ──────────────────────────────────────────────
-- Function to clean up billing_events older than 90 days.
-- Schedule via Supabase dashboard: Database → Extensions → pg_cron
-- Then: select cron.schedule('billing-cleanup', '0 3 * * 0', 'select cleanup_billing_events()');
create or replace function cleanup_billing_events() returns void as $$
begin
  delete from billing_events where created_at < now() - interval '90 days';
end;
$$ language plpgsql security definer;
