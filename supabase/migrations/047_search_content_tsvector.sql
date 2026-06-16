-- Add tsvector column + GIN index to user_notes and refactor
-- search_content() to use full-text search instead of ILIKE for notes.
-- ILIKE on extracted_text does sequential scans — tsvector is O(log n).

alter table public.user_notes
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(filename, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(ai_summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(extracted_text, '')), 'C')
  ) stored;

create index if not exists user_notes_search_idx
  on public.user_notes using gin(search_vector);

create or replace function public.search_content(
  search_query text,
  searching_user_id uuid default null
)
returns table(
  id uuid,
  title text,
  type text,
  snippet text,
  url text,
  system_tag text,
  difficulty text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  tsq tsquery := plainto_tsquery('english', search_query);
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
    where lt.search_vector @@ tsq

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
    where c.search_vector @@ tsq

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
      un.search_vector @@ tsq

  limit 25;
end;
$$;
