"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import type {Flashcard} from "@mostly-medicine/content";

interface Props {
  cards: Flashcard[];
  deckName: string;
}

type Rating = "again" | "hard" | "good" | "easy";

const RATING_LABELS: Record<Rating, string> = {
  again: "Again",
  hard: "Hard",
  good: "Good",
  easy: "Easy",
};

const RATING_COLORS: Record<Rating, string> = {
  again: "bg-rose-500/15 text-rose-200 hover:bg-rose-500/25 border-rose-400/30",
  hard: "bg-amber-500/15 text-amber-200 hover:bg-amber-500/25 border-amber-400/30",
  good: "bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25 border-emerald-400/30",
  easy: "bg-sky-500/15 text-sky-200 hover:bg-sky-500/25 border-sky-400/30",
};

const renderCloze = (front: string, revealed: boolean) => {
  const parts: React.ReactNode[] = [];
  const regex = /\{\{c(\d+)::([^}]+)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(front)) !== null) {
    if (match.index > lastIndex) {
      parts.push(front.slice(lastIndex, match.index));
    }
    const text = match[2];
    if (revealed) {
      parts.push(
        <span
          key={`c-${key++}`}
          className="rounded bg-emerald-400/20 px-1.5 py-0.5 font-semibold text-emerald-200"
        >
          {text}
        </span>
      );
    } else {
      parts.push(
        <span
          key={`c-${key++}`}
          className="rounded bg-white/5 px-3 py-0.5 text-transparent shadow-inner"
          style={{
            background:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 6px, transparent 6px 12px)",
          }}
        >
          […]
        </span>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < front.length) parts.push(front.slice(lastIndex));
  return parts;
};

export function FlashcardSession({cards, deckName}: Props) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ratingsByIndex, setRatingsByIndex] = useState<Record<number, Rating>>({});

  const card = cards[index];
  const isLast = index === cards.length - 1;
  const ratedCount = Object.keys(ratingsByIndex).length;
  const progress = Math.round((ratedCount / cards.length) * 100);

  const ratingCounts = useMemo(() => {
    const c: Record<Rating, number> = {again: 0, hard: 0, good: 0, easy: 0};
    Object.values(ratingsByIndex).forEach((r) => c[r]++);
    return c;
  }, [ratingsByIndex]);

  const handleRate = (rating: Rating) => {
    setRatingsByIndex((prev) => ({...prev, [index]: rating}));
    // Fire-and-forget persistence. The UI flow doesn't wait on the
    // network — a slow Supabase write must never block the next card.
    // Failures are silent for now; we'll surface them when the queue
    // UI is wired (Phase 2 of the FSRS rollout).
    if (card?.id) {
      void fetch("/api/flashcards/review", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({cardId: card.id, rating}),
      }).catch(() => {});
    }
    if (!isLast) {
      setIndex(index + 1);
      setRevealed(false);
    }
  };

  // Keyboard shortcuts: Space reveals the answer; 1/2/3/4 rate
  // Again/Hard/Good/Easy once revealed. Mirrors the Anki default bindings
  // so AnKing-trained users feel at home.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ignore when the user is typing in an input/textarea
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " " && !revealed) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (!revealed) return;
      const map: Record<string, Rating> = {"1": "again", "2": "hard", "3": "good", "4": "easy"};
      const r = map[e.key];
      if (r) {
        e.preventDefault();
        handleRate(r);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // handleRate intentionally not in deps — it closes over `index` which
    // changes every card but the listener body always reads current state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, index, isLast, card?.id]);

  if (!card) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center text-white/70">
        No cards in this deck yet.
      </div>
    );
  }

  const sessionComplete = ratedCount === cards.length && isLast && ratingsByIndex[index];

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between text-sm">
        <Link href="/dashboard/flashcards" className="text-white/60 hover:text-white">
          ← All decks
        </Link>
        <span className="text-white/50">
          {deckName} · {index + 1}/{cards.length}
        </span>
      </header>

      {/* progress bar */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full bg-emerald-400 transition-all"
          style={{width: `${progress}%`}}
        />
      </div>

      {sessionComplete ? (
        <SessionSummary
          deckName={deckName}
          total={cards.length}
          counts={ratingCounts}
          onRestart={() => {
            setIndex(0);
            setRevealed(false);
            setRatingsByIndex({});
          }}
        />
      ) : (
        <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
            <span>{card.subtopic}</span>
            {card.mark_sheet_domain && (
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px]">
                {card.mark_sheet_domain}
              </span>
            )}
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px]">
              {card.amc_part === "part_2_clinical"
                ? "AMC Part 2"
                : card.amc_part === "part_1"
                  ? "AMC Part 1"
                  : "AMC Part 1 + 2"}
            </span>
          </div>
          <p className="text-lg leading-relaxed text-white">
            {renderCloze(card.front_md, revealed)}
          </p>

          {revealed && (
            <>
              <hr className="my-5 border-white/10" />
              <p className="text-base leading-relaxed text-white/80">{card.back_md}</p>
              {card.citation && (
                <p className="mt-3 text-xs text-white/40">📖 {card.citation}</p>
              )}
            </>
          )}

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="mt-6 w-full rounded-xl bg-white px-5 py-3 text-base font-bold text-slate-900 transition hover:bg-white/90"
            >
              Show answer · Space
            </button>
          ) : (
            <div className="mt-6 grid grid-cols-4 gap-2">
              {(["again", "hard", "good", "easy"] as Rating[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRate(r)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${RATING_COLORS[r]}`}
                >
                  {RATING_LABELS[r]}
                </button>
              ))}
            </div>
          )}
        </article>
      )}

      <p className="mt-6 text-center text-xs text-white/30">
        v1 will save your reviews and bring cards back with FSRS. For now this is a quick
        review carousel.
      </p>
    </div>
  );
}

function SessionSummary({
  deckName,
  total,
  counts,
  onRestart,
}: {
  deckName: string;
  total: number;
  counts: Record<Rating, number>;
  onRestart: () => void;
}) {
  return (
    <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/[0.06] p-7 text-center shadow-2xl">
      <h2 className="text-2xl font-extrabold text-white">Deck complete</h2>
      <p className="mt-1 text-sm text-white/70">
        {total} {deckName.toLowerCase()} cards reviewed.
      </p>
      <div className="mt-6 grid grid-cols-4 gap-3 text-sm">
        {(["again", "hard", "good", "easy"] as Rating[]).map((r) => (
          <div key={r} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="text-xs uppercase tracking-wider text-white/50">
              {RATING_LABELS[r]}
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{counts[r]}</div>
          </div>
        ))}
      </div>
      <button
        onClick={onRestart}
        className="mt-8 rounded-xl bg-white px-6 py-3 text-base font-bold text-slate-900 transition hover:bg-white/90"
      >
        Restart deck
      </button>
    </div>
  );
}
