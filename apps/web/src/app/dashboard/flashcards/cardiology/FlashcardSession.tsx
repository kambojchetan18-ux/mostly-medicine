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
  again: "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-300",
  hard: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-300",
  good: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-300",
  easy: "bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-300",
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
          className="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-800"
        >
          {text}
        </span>
      );
    } else {
      // Unrevealed cloze. The original dark-theme palette used white
      // hatching which became invisible after we moved the card surface
      // to white — now uses a slate fill, dark hatch pattern, and a
      // ring so the blank reads as a concrete "fill this in" affordance
      // rather than an empty box.
      parts.push(
        <span
          key={`c-${key++}`}
          className="mx-0.5 inline-block min-w-[4ch] rounded px-3 py-0.5 align-middle font-mono text-sm font-semibold text-slate-500 ring-1 ring-slate-300"
          style={{
            background:
              "repeating-linear-gradient(135deg, rgba(15,23,42,0.12) 0 6px, rgba(15,23,42,0.04) 6px 12px)",
          }}
        >
          [&hellip;]
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
  // When the review API returns 429 daily_limit_reached, freeze the
  // session UI and surface an upgrade prompt. The rating the user just
  // pressed gets rolled back so the progress count reflects what was
  // actually persisted.
  const [limitInfo, setLimitInfo] = useState<{ dailyLimit: number; used: number; upgrade: string } | null>(null);

  const card = cards[index];
  const isLast = index === cards.length - 1;
  const ratedCount = Object.keys(ratingsByIndex).length;
  const progress = Math.round((ratedCount / cards.length) * 100);

  const ratingCounts = useMemo(() => {
    const c: Record<Rating, number> = {again: 0, hard: 0, good: 0, easy: 0};
    Object.values(ratingsByIndex).forEach((r) => c[r]++);
    return c;
  }, [ratingsByIndex]);

  const handleRate = async (rating: Rating) => {
    if (limitInfo) return; // hard-block once the cap is hit
    // Optimistically advance — we'll roll back on a 429.
    setRatingsByIndex((prev) => ({...prev, [index]: rating}));
    const advancedFromIndex = index;
    if (!isLast) {
      setIndex(index + 1);
      setRevealed(false);
    }
    if (!card?.id) return;
    try {
      const res = await fetch("/api/flashcards/review", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({cardId: card.id, rating}),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => ({} as Record<string, unknown>));
        if (data.error === "daily_limit_reached") {
          // Roll back the optimistic rate + advance so the user sees the
          // card they were on (not the next one) when the gate appears.
          setRatingsByIndex((prev) => {
            const next = {...prev};
            delete next[advancedFromIndex];
            return next;
          });
          setIndex(advancedFromIndex);
          setRevealed(true);
          setLimitInfo({
            dailyLimit: Number((data.dailyLimit as number | undefined) ?? 5),
            used: Number((data.used as number | undefined) ?? 5),
            upgrade:
              typeof data.upgrade === "string"
                ? data.upgrade
                : "Upgrade to Pro for unlimited flashcard reviews.",
          });
        }
      }
    } catch {
      // Network errors stay silent — the optimistic advance already
      // happened and the FSRS state will catch up on the next attempt.
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
      <div className="mx-auto max-w-2xl px-6 py-20 text-center text-gray-600">
        No cards in this deck yet.
      </div>
    );
  }

  const sessionComplete = ratedCount === cards.length && isLast && ratingsByIndex[index];

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between text-sm">
        <Link href="/dashboard/flashcards" className="text-gray-600 hover:text-gray-900">
          ← All decks
        </Link>
        <span className="text-gray-500">
          {deckName} · {index + 1}/{cards.length}
        </span>
      </header>

      {/* progress bar */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-emerald-400 transition-all"
          style={{width: `${progress}%`}}
        />
      </div>

      {limitInfo && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-amber-900">
            <span className="text-lg">⏳</span>
            <h3 className="text-base font-bold">Daily review limit reached</h3>
          </div>
          <p className="mt-1.5 text-sm text-amber-900/80">
            You&rsquo;ve reviewed <strong>{limitInfo.used}</strong> of your{" "}
            <strong>{limitInfo.dailyLimit} free flashcards</strong> today. The counter resets at
            midnight UTC.
          </p>
          <p className="mt-2 text-sm text-amber-900/70">{limitInfo.upgrade}</p>
          <Link
            href="/dashboard/billing"
            className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Upgrade to Pro →
          </Link>
        </div>
      )}

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
        <article className="rounded-3xl border border-gray-200 bg-white p-7 shadow-2xl">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
            <span>{card.subtopic}</span>
            {card.mark_sheet_domain && (
              <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px]">
                {card.mark_sheet_domain}
              </span>
            )}
            <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px]">
              {card.amc_part === "part_2_clinical"
                ? "AMC Part 2"
                : card.amc_part === "part_1"
                  ? "AMC Part 1"
                  : "AMC Part 1 + 2"}
            </span>
          </div>
          <p className="text-lg leading-relaxed text-gray-900">
            {renderCloze(card.front_md, revealed)}
          </p>

          {revealed && (
            <>
              <hr className="my-5 border-gray-200" />
              <p className="text-base leading-relaxed text-gray-700">{card.back_md}</p>
              {card.citation && (
                <p className="mt-3 text-xs text-gray-500">📖 {card.citation}</p>
              )}
            </>
          )}

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 text-base font-bold text-white transition hover:bg-slate-800"
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

      <p className="mt-6 text-center text-xs text-gray-400">
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
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-center shadow-2xl">
      <h2 className="text-2xl font-extrabold text-gray-900">Deck complete</h2>
      <p className="mt-1 text-sm text-gray-600">
        {total} {deckName.toLowerCase()} cards reviewed.
      </p>
      <div className="mt-6 grid grid-cols-4 gap-3 text-sm">
        {(["again", "hard", "good", "easy"] as Rating[]).map((r) => (
          <div key={r} className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="text-xs uppercase tracking-wider text-gray-500">
              {RATING_LABELS[r]}
            </div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{counts[r]}</div>
          </div>
        ))}
      </div>
      <button
        onClick={onRestart}
        className="mt-8 rounded-xl bg-slate-900 px-6 py-3 text-base font-bold text-white transition hover:bg-slate-800"
      >
        Restart deck
      </button>
    </div>
  );
}
