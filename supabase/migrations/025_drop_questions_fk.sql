-- attempts.question_id and sr_cards.question_id were FKs to public.questions,
-- but questions live in packages/content (TS files) — never populated in DB.
-- Every MCQ attempt + SR card insert was silently rejected by the FK and
-- swallowed inside Promise.all in /api/cat1/attempt. This is why analytics
-- showed 0 MCQs across all users despite 49 mcq_xp_events firing.

alter table public.attempts
  drop constraint if exists attempts_question_id_fkey;

alter table public.sr_cards
  drop constraint if exists sr_cards_question_id_fkey;
