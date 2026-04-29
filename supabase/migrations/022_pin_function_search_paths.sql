-- Pin search_path on SECURITY DEFINER and trigger functions so a malicious
-- user can't shadow built-in functions/operators in a custom schema and
-- hijack execution. Supabase advisor `function_search_path_mutable` flagged
-- these three. Setting `search_path = public, pg_temp` is the recommended
-- minimum.

alter function public.handle_new_user_profile() set search_path = public, pg_temp;
alter function public.search_content(text, uuid) set search_path = public, pg_temp;
alter function public.update_updated_at_column() set search_path = public, pg_temp;
