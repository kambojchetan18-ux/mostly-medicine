-- Restrict leaderboard view to authenticated users only.
-- Previously granted to anon, exposing user_id and plan to unauthenticated visitors.
REVOKE SELECT ON public.leaderboard_weekly FROM anon;
