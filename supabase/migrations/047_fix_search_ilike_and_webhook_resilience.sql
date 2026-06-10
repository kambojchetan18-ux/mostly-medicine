-- Fix ILIKE SQL injection in search_content() and add webhook processing resilience.

-- 1. Fix ILIKE concatenation in search_content() — escape special LIKE chars
-- The old code used '%' || search_query || '%' which lets a user inject
-- LIKE wildcards (%, _) or backslash sequences. Use the built-in ESCAPE
-- clause and pre-escape the input.
create or replace function public.search_content(search_query text, searching_user_id uuid default null)
returns table(
  id uuid,
  title text,
  type text,
  snippet text,
  url text,
  system_tag text,
  difficulty text
) as $$
declare
  safe_query text;
begin
  -- Escape LIKE special characters so user input is treated literally
  safe_query := '%' || replace(replace(replace(search_query, '\', '\\'), '%', '\%'), '_', '\_') || '%';

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
        un.filename ilike safe_query escape '\' or
        un.ai_summary ilike safe_query escape '\' or
        un.extracted_text ilike safe_query escape '\'
      )

  limit 25;
end;
$$ language plpgsql stable security invoker
   set search_path = public, pg_temp;

-- 2. Add processed_at to billing_events for crash-resilient webhook processing.
-- If the server crashes between claiming the event and completing the handler,
-- processed_at stays NULL. A future retry or cron can re-process these.
alter table public.billing_events
  add column if not exists processed_at timestamptz;
