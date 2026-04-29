-- 020_perf_indexes.sql
-- Backend perf audit (pre-launch): add covering indexes to the hottest
-- per-user query paths. None of these change behaviour — pure planner help.
--
-- Audited routes:
--   /api/cat1/attempt        -> attempts.insert + sr_cards.select(user_id, q_id)
--                                + topic_progress.upsert + study_streaks.select
--   /api/cat1/progress       -> topic_progress.select(user_id),
--                                sr_cards.select(user_id, due <= now),
--                                attempts.select(user_id)
--   permissions.enforceDailyLimit("mcq") -> attempts WHERE user_id=$1
--                                AND attempted_at >= today_utc COUNT(*)
--
-- All four base tables already have RLS rows scoped by user_id, but no
-- supporting btree index on user_id alone (or on (user_id, timestamp)).
-- At a few thousand rows per user × thousands of users, every "is the
-- user over their daily MCQ cap?" check becomes a full scan filtered by
-- RLS. These indexes turn that into an index range scan.

-- ─── attempts: hot read path is "today's attempts for this user" ─────────
-- Used by enforceDailyLimit (mcq) on every /api/cat1/attempt and
-- /api/cat1/explain and /api/cat1/smart-explain (cache-miss path).
create index if not exists attempts_user_attempted_at_idx
  on public.attempts (user_id, attempted_at desc);

-- ─── sr_cards: "what's due now for this user?" ────────────────────────────
-- Used by /api/cat1/progress and the spaced-repetition scheduler.
-- The (user_id, question_id) UNIQUE constraint covers point lookups but
-- not "due <= now" range scans.
create index if not exists sr_cards_user_due_idx
  on public.sr_cards (user_id, due);

-- ─── topic_progress: ordered list of a user's topics ─────────────────────
-- /api/cat1/progress sorts by total_attempted; the (user_id, topic) UNIQUE
-- index covers filtering but not the secondary order. A plain user_id idx
-- is enough — Postgres can in-memory sort the typically <30 rows per user.
-- We add it explicitly so RLS-filtered scans don't fall back to seq scan
-- on the full table.
create index if not exists topic_progress_user_idx
  on public.topic_progress (user_id);

-- ─── acrp_sessions: per-user "today's roleplay sessions" count ───────────
-- enforceDailyLimit("acrp_solo") uses (user_id, created_at). The
-- existing acrp_sessions_user_idx is on (user_id, created_at desc) — already
-- covers this query. Listed here for documentation only; no change needed.

-- ─── acrp_live_sessions: per-user "today's live sessions" count ──────────
-- enforceDailyLimit("acrp_live") uses (host_user_id, created_at). Existing
-- acrp_live_sessions_host_idx is on (host_user_id, created_at desc) — already
-- covers this. No change.

-- ─── xp_events.created_at filter for leaderboard_weekly ──────────────────
-- View aggregates last-7-days events. xp_events_created_idx already exists
-- on (created_at desc). No change.
