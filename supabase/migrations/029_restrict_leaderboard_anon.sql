-- Revoke anonymous access to leaderboard — only authenticated users should
-- see other users' names and XP. Previously granted to anon in migration 014.
REVOKE SELECT ON public.leaderboard_weekly FROM anon;
