"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

// ── AI MCQ → flashcards draft shape (returned by
// /api/flashcards/generate-from-mcq, persisted via /api/flashcards/save).
// Kept inline because no other component needs it.
interface McqDraftCard {
  tempId: string;
  subtopic: string;
  front_md: string;
  back_md: string;
  citation: string;
  mark_sheet_domain: string;
  amc_part: string;
  keep: boolean;
}

interface McqFlashcardState {
  // "idle" → button rendered. "loading" → spinner. "drafts" → panel
  // with toggles + save. "saving" → save in flight. "saved" → "Saved N
  // cards" pill. "error" → inline error + retry.
  status: "idle" | "loading" | "drafts" | "saving" | "saved" | "error";
  drafts: McqDraftCard[];
  savedCount: number;
  errorMsg: string | null;
}

export interface AttemptRow {
  id: string;
  question_id: string;
  is_correct: boolean;
  attempted_at: string;
  selected_label?: string | null;
}

export interface LearningPoint {
  questionId: string;
  isCorrect: boolean;
  points: string[];
}

// Per-question review row — populated server-side from allQuestions so the
// results page can show the full stem + correct answer + explanation
// (especially needed for Mock Exam, which suppresses correctness in-flow).
export interface ReviewQuestion {
  id: string;
  topic: string;
  subtopic: string;
  difficulty: "easy" | "medium" | "hard";
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  selectedLabel: string | null;
  isCorrect: boolean | null;
}

export interface ResultsPayload {
  session: {
    id: string;
    topic: string | null;
    startedAt: string;
    endedAt: string | null;
    durationSeconds: number;
    questionsAnswered: number;
    targetCount: number;
    scorePct: number;
    correctCount: number;
    percentile: number | null;
    isMock: boolean;
  };
  attempts: AttemptRow[];
  learningPoints: LearningPoint[];
  review: ReviewQuestion[];
  user: {
    fullName: string | null;
    email: string;
    founderRank: number | null;
    currentStreak: number;
  };
}

function fmtMMSS(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function fmtPerQ(totalSeconds: number, n: number): string {
  if (!n) return "—";
  const per = totalSeconds / n;
  if (per >= 60) return fmtMMSS(per);
  return `${per.toFixed(1)}s`;
}

function ordinal(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:  return `${n}st`;
    case 2:  return `${n}nd`;
    case 3:  return `${n}rd`;
    default: return `${n}th`;
  }
}

function scoreTone(pct: number) {
  if (pct >= 75) {
    return {
      ring:  "stroke-emerald-500",
      text:  "text-emerald-600",
      chip:  "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Strong recall",
    };
  }
  if (pct >= 55) {
    return {
      ring:  "stroke-amber-500",
      text:  "text-amber-600",
      chip:  "bg-amber-50 text-amber-700 border-amber-200",
      label: "Solid foundation",
    };
  }
  return {
    ring:  "stroke-rose-500",
    text:  "text-rose-600",
    chip:  "bg-rose-50 text-rose-700 border-rose-200",
    label: "Topic to revisit",
  };
}

function ScoreCircle({ pct }: { pct: number }) {
  const tone = scoreTone(pct);
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
        <circle
          cx="60" cy="60" r={r}
          className="fill-none stroke-gray-100" strokeWidth="10"
        />
        <circle
          cx="60" cy="60" r={r}
          className={`fill-none ${tone.ring} transition-[stroke-dasharray] duration-700`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className={`text-3xl font-bold tabular-nums ${tone.text}`}>
          {Math.round(pct)}
        </p>
        <p className="-mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          %
        </p>
      </div>
    </div>
  );
}

function PercentileBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="mt-3">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-all duration-700"
          style={{ width: `${clamped}%` }}
        />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet-600 shadow"
          style={{ left: `${clamped}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-gray-400 tabular-nums">
        <span>0</span><span>50</span><span>100</span>
      </div>
    </div>
  );
}

function StatCard({
  label, children, gradient = false,
}: {
  label: string;
  children: React.ReactNode;
  gradient?: boolean;
}) {
  const wrap = gradient
    ? "rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-4 shadow-sm"
    : "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm";
  return (
    <div className={wrap}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export default function ResultsClient({ data }: { data: ResultsPayload }) {
  const { session, attempts, learningPoints, user } = data;

  // Build a stable order matching the question grid: prefer the canonical
  // attempts order (chronological), then map learning points by id so even
  // an out-of-order learning_points payload renders correctly.
  const orderedQuestions = useMemo(() => {
    const lpByQ = new Map<string, LearningPoint>();
    for (const lp of learningPoints) lpByQ.set(lp.questionId, lp);
    return attempts.map((a, i) => ({
      index:     i + 1,
      questionId: a.question_id,
      isCorrect: a.is_correct,
      points:    lpByQ.get(a.question_id)?.points ?? [],
    }));
  }, [attempts, learningPoints]);

  const tone        = scoreTone(session.scorePct);
  const wrong       = Math.max(0, session.questionsAnswered - session.correctCount);
  const percentile  = session.percentile;
  const lpRefs      = useRef<Record<string, HTMLDivElement | null>>({});
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  // Per-question flashcard generation state. Keyed by questionId so
  // multiple panels can be open simultaneously (a user reviewing 10
  // wrong answers can fan out 10 drafts).
  const [fcState, setFcState] = useState<Record<string, McqFlashcardState>>({});
  function patchFc(qid: string, patch: Partial<McqFlashcardState>) {
    setFcState((prev) => {
      const base: McqFlashcardState = prev[qid] ?? {
        status: "idle",
        drafts: [],
        savedCount: 0,
        errorMsg: null,
      };
      return { ...prev, [qid]: { ...base, ...patch } };
    });
  }

  async function generateFlashcards(qid: string) {
    patchFc(qid, { status: "loading", errorMsg: null });
    try {
      const r = await fetch("/api/flashcards/generate-from-mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: qid }),
      });
      const json = await r.json().catch(() => null);
      if (!r.ok) {
        const msg =
          (json && typeof json === "object" && "error" in json && typeof json.error === "string"
            ? json.error === "daily_limit_reached"
              ? `Free plan: ${json.dailyLimit ?? 5} AI MCQ→cards / day used. Upgrade for unlimited.`
              : json.error === "rate_limited"
                ? "Slow down — try again in a few seconds."
                : json.error
            : null) ?? "Could not generate flashcards. Try again.";
        patchFc(qid, { status: "error", errorMsg: msg });
        return;
      }
      const rawCards: unknown = json?.cards;
      if (!Array.isArray(rawCards) || rawCards.length === 0) {
        patchFc(qid, { status: "error", errorMsg: "AI returned no cards. Try again." });
        return;
      }
      const drafts: McqDraftCard[] = rawCards.map((c) => {
        const obj = c as Partial<McqDraftCard>;
        return {
          tempId: typeof obj.tempId === "string" ? obj.tempId : `${qid}-d-${Math.random().toString(36).slice(2, 7)}`,
          subtopic: typeof obj.subtopic === "string" ? obj.subtopic : "",
          front_md: typeof obj.front_md === "string" ? obj.front_md : "",
          back_md: typeof obj.back_md === "string" ? obj.back_md : "",
          citation: typeof obj.citation === "string" ? obj.citation : "",
          mark_sheet_domain: typeof obj.mark_sheet_domain === "string" ? obj.mark_sheet_domain : "",
          amc_part: typeof obj.amc_part === "string" ? obj.amc_part : "part_1",
          keep: true,
        };
      });
      patchFc(qid, { status: "drafts", drafts, errorMsg: null });
    } catch (err) {
      console.error("[results] generate flashcards failed", err);
      patchFc(qid, { status: "error", errorMsg: "Network error. Try again." });
    }
  }

  function toggleDraft(qid: string, tempId: string) {
    setFcState((prev) => {
      const cur = prev[qid];
      if (!cur) return prev;
      return {
        ...prev,
        [qid]: {
          ...cur,
          drafts: cur.drafts.map((d) =>
            d.tempId === tempId ? { ...d, keep: !d.keep } : d
          ),
        },
      };
    });
  }

  async function saveFlashcards(qid: string, subtopicLabel: string) {
    const cur = fcState[qid];
    if (!cur) return;
    const kept = cur.drafts.filter((d) => d.keep);
    if (kept.length === 0) {
      patchFc(qid, { errorMsg: "Tick at least one card to save." });
      return;
    }
    patchFc(qid, { status: "saving", errorMsg: null });
    try {
      const r = await fetch("/api/flashcards/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "ai_mcq",
          deckName: `MCQ: ${subtopicLabel}`,
          cards: kept.map((d) => ({
            subtopic: d.subtopic,
            front_md: d.front_md,
            back_md: d.back_md,
            citation: d.citation,
            mark_sheet_domain: d.mark_sheet_domain,
            amc_part: d.amc_part,
          })),
        }),
      });
      const json = await r.json().catch(() => null);
      if (!r.ok) {
        const msg =
          (json && typeof json === "object" && "error" in json && typeof json.error === "string"
            ? json.error
            : null) ?? "Save failed. Try again.";
        patchFc(qid, { status: "drafts", errorMsg: msg });
        return;
      }
      patchFc(qid, {
        status: "saved",
        savedCount: typeof json?.saved === "number" ? json.saved : kept.length,
        errorMsg: null,
      });
    } catch (err) {
      console.error("[results] save flashcards failed", err);
      patchFc(qid, { status: "drafts", errorMsg: "Network error. Try again." });
    }
  }

  const startedAtLabel = useMemo(() => {
    try {
      return new Date(session.startedAt).toLocaleString("en-AU", {
        weekday: "short",
        day:     "numeric",
        month:   "short",
        hour:    "numeric",
        minute:  "2-digit",
      });
    } catch {
      return session.startedAt;
    }
  }, [session.startedAt]);

  const sessionTitle = `${session.topic ?? "Mixed AMC MCQs"} · Recall Session`;

  function scrollToQuestion(qid: string) {
    const el = lpRefs.current[qid];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleShare() {
    const topicBit = session.topic ?? "Mixed AMC";
    const pctBit   = `${Math.round(session.scorePct)}%`;
    const percBit  = percentile != null
      ? ` · ${ordinal(Math.round(percentile))} percentile`
      : "";
    const text = `Just scored ${pctBit} on the ${topicBit} AMC Recall${percBit} · @mostlymedicine_au`;
    try {
      // Prefer native share sheet on mobile; fall back to clipboard.
      const nav = typeof navigator !== "undefined" ? navigator : null;
      if (nav && typeof nav.share === "function") {
        await nav.share({ title: "My AMC Recall result", text });
        setShareMsg("Shared!");
      } else if (nav && nav.clipboard) {
        await nav.clipboard.writeText(text);
        setShareMsg("Copied to clipboard");
      } else {
        setShareMsg("Share unavailable");
      }
    } catch {
      setShareMsg("Share cancelled");
    }
    setTimeout(() => setShareMsg(null), 2400);
  }

  const percentileSentence = percentile == null
    ? "Percentile lands once more candidates finish this topic."
    : percentile >= 75
      ? `Top ${Math.max(1, 100 - Math.round(percentile))}% — strong work, keep this rhythm.`
      : percentile >= 50
        ? `Better than ${Math.round(percentile)}% of candidates — solid mid-pack pace.`
        : `Better than ${Math.round(percentile)}% of candidates — room to climb on the next run.`;

  const displayName =
    user.fullName?.trim() || user.email.split("@")[0] || "Doctor";

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">

      {/* ── Brand gradient header ─────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-saffron-500 via-violet-600 to-pink-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-pink-300/20 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              AMC-aligned recall · Session results
            </p>
            <h1 className="mt-1 break-words font-display text-2xl font-bold leading-tight sm:text-3xl">
              {sessionTitle}
            </h1>
            <p className="mt-1 text-sm text-white/80">{startedAtLabel}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
                {displayName}
              </span>
              {user.founderRank != null && (
                <span className="rounded-full bg-pink-100 px-2.5 py-1 text-xs font-bold text-pink-700">
                  ✨ FOUNDER #{user.founderRank}
                </span>
              )}
              {user.currentStreak >= 3 && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                  🔥 {user.currentStreak}-day streak
                </span>
              )}
              <span className={`rounded-full border px-2.5 py-1 text-xs font-bold bg-white ${tone.chip}`}>
                {tone.label}
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/cat1"
            className="shrink-0 rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm hover:bg-white"
          >
            ↻ Repeat session
          </Link>
        </div>
      </header>

      {/* ── Hero stats row ────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        <StatCard label="Score" gradient>
          <div className="flex items-center gap-3">
            <ScoreCircle pct={session.scorePct} />
            <div>
              <p className="text-xs font-semibold text-gray-700">
                {session.correctCount} / {session.questionsAnswered}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">correct</p>
            </div>
          </div>
        </StatCard>

        <StatCard label="Time elapsed">
          <p className="text-2xl font-bold tabular-nums text-gray-900">
            {fmtMMSS(session.durationSeconds)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            mm:ss across {session.questionsAnswered} q&apos;s
          </p>
        </StatCard>

        <StatCard label="Avg per question">
          <p className="text-2xl font-bold tabular-nums text-gray-900">
            {fmtPerQ(session.durationSeconds, session.questionsAnswered)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            AMC pace target ≈ 1:30 / q
          </p>
        </StatCard>

        <StatCard label="Percentile" gradient>
          {percentile == null ? (
            <>
              <p className="text-2xl font-bold tabular-nums text-gray-900">—</p>
              <p className="mt-0.5 text-xs text-gray-500">
                {percentileSentence}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold tabular-nums text-gray-900">
                {ordinal(Math.round(percentile))}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {percentileSentence}
              </p>
              <PercentileBar pct={percentile} />
            </>
          )}
        </StatCard>
      </section>

      {/* ── Question grid ─────────────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Question map</h2>
          <p className="text-xs text-gray-500">
            Tap any tile to jump to its learning points.
          </p>
        </div>
        <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-10 md:grid-cols-12">
          {orderedQuestions.map((q) => {
            const cls = q.isCorrect
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
            return (
              <button
                key={`${q.questionId}-${q.index}`}
                onClick={() => scrollToQuestion(q.questionId)}
                className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-xs font-semibold transition ${cls}`}
                title={`Q${q.index} · ${q.questionId} · ${q.isCorrect ? "correct" : "revisit"}`}
              >
                <span className="tabular-nums">{q.index}</span>
                <span aria-hidden className="text-[11px] leading-none">
                  {q.isCorrect ? "✓" : "×"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Performance summary ───────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-bold text-gray-900">Performance summary</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
              Correct
            </p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums text-emerald-900">
              {session.correctCount}
            </p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-700">
              To revisit
            </p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums text-rose-900">
              {wrong}
            </p>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700">
              Answered
            </p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums text-violet-900">
              {session.questionsAnswered}
              <span className="text-sm font-medium text-violet-600">
                {" "}/ {session.targetCount}
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-pink-200 bg-pink-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-pink-700">
              Examiner verdict
            </p>
            <p className="mt-0.5 text-sm font-semibold text-pink-900">
              {tone.label}
            </p>
          </div>
        </div>
      </section>

      {/* ── Learning points ──────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-bold text-gray-900">
            Learning points · examiner-style notes
          </h2>
          <p className="text-xs text-gray-500">{orderedQuestions.length} questions</p>
        </div>

        {orderedQuestions.map((q) => (
          <div
            key={`lp-${q.questionId}-${q.index}`}
            ref={(el) => { lpRefs.current[q.questionId] = el; }}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-2.5 py-1 text-xs font-bold text-white tabular-nums">
                  Q{q.index}
                </span>
                <span className="text-[11px] font-mono text-gray-400">
                  {q.questionId}
                </span>
              </div>
              {q.isCorrect ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  ✓ Correct
                </span>
              ) : (
                <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
                  Topic to revisit
                </span>
              )}
            </div>

            {q.points.length === 0 ? (
              <p className="mt-3 text-xs italic text-gray-400">
                No examiner notes captured for this question yet — review the
                stem in the question bank.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {q.points.map((p, i) => (
                  <li
                    key={i}
                    className="flex gap-2 rounded-xl bg-violet-50/50 px-3 py-2 text-sm text-gray-800"
                  >
                    <span aria-hidden className="shrink-0 leading-relaxed">💡</span>
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {orderedQuestions.length === 0 && (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
            No attempts recorded for this session.
          </p>
        )}
      </section>

      {/* ── Per-question review (full stem + correct answer + explanation) ─
          Especially important for Mock Exam: answers are suppressed during
          the paper and revealed only here at the end. */}
      {data.review && data.review.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-sm font-bold text-gray-900">
              Full answers &amp; explanations
              {data.session.isMock && (
                <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-700">
                  Mock paper
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500">{data.review.length} questions</p>
          </div>

          {wrong > 0 && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900 flex items-center gap-2">
              <span className="text-lg" aria-hidden>✨</span>
              <span>
                <strong>Turn wrong answers into flashcards.</strong> Each of the {wrong} wrong question
                {wrong === 1 ? "" : "s"} below is already expanded — scroll down and tap{" "}
                <span className="rounded border border-violet-300 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-violet-700">
                  ✨ Make flashcards
                </span>{" "}
                to add 1-3 AU-cited cloze cards to your spaced-rep library.
              </span>
            </div>
          )}

          {data.review.map((q, idx) => {
            const correct = q.isCorrect === true;
            const wrong = q.isCorrect === false;
            return (
              <details
                key={`rev-${q.id}-${idx}`}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                // Auto-expand wrong answers so the "✨ Make flashcards"
                // button is visible without an extra click — wrong is
                // exactly where users want it most. Mock-exam reviews
                // still expand everything (existing behaviour).
                open={data.session.isMock || wrong}
              >
                <summary className="cursor-pointer list-none px-4 py-3 sm:px-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-2.5 py-1 text-xs font-bold text-white tabular-nums shrink-0">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {q.subtopic}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      q.difficulty === "easy" ? "bg-emerald-100 text-emerald-700"
                      : q.difficulty === "medium" ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  {correct ? (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 shrink-0">
                      ✓ {q.selectedLabel ?? "—"}
                    </span>
                  ) : wrong ? (
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 shrink-0">
                      ✗ {q.selectedLabel ?? "—"} (ans: {q.correctAnswer})
                    </span>
                  ) : (
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-semibold text-gray-500 shrink-0">
                      Skipped
                    </span>
                  )}
                </summary>
                <div className="border-t border-gray-100 px-4 py-3 sm:px-5 sm:py-4 space-y-3">
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{q.stem}</p>
                  <div className="space-y-1.5">
                    {q.options.map((o) => {
                      const isCorrectOpt = o.label === q.correctAnswer;
                      const isPicked = q.selectedLabel === o.label;
                      const cls = isCorrectOpt
                        ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                        : isPicked
                        ? "border-rose-400 bg-rose-50 text-rose-900"
                        : "border-gray-200 bg-white text-gray-700";
                      return (
                        <div
                          key={o.label}
                          className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${cls}`}
                        >
                          <span className="font-bold shrink-0">{o.label}.</span>
                          <span className="flex-1">{o.text}</span>
                          {isCorrectOpt && (
                            <span className="text-emerald-600 font-bold">✓</span>
                          )}
                          {isPicked && !isCorrectOpt && (
                            <span className="text-rose-600 font-bold">✗</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-xl bg-violet-50/60 px-3 py-2.5 text-xs text-gray-700 leading-relaxed">
                    <p className="font-semibold text-violet-800 mb-1">Explanation</p>
                    {q.explanation}
                  </div>

                  {/* AI: Make flashcards from this MCQ ------------------ */}
                  {(() => {
                    const fc = fcState[q.id];
                    const status = fc?.status ?? "idle";
                    const subtopicLabel = q.subtopic || q.topic || "MCQ";

                    if (status === "saved") {
                      return (
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                          <span aria-hidden>✓</span>
                          <span>
                            Saved {fc?.savedCount ?? 0} card
                            {(fc?.savedCount ?? 0) === 1 ? "" : "s"} to your library
                          </span>
                          <Link
                            href="/dashboard/flashcards"
                            className="ml-auto rounded-md border border-emerald-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
                          >
                            Open library →
                          </Link>
                        </div>
                      );
                    }

                    if (status === "idle" || status === "error") {
                      return (
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => generateFlashcards(q.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
                          >
                            <span aria-hidden>✨</span>
                            Make flashcards
                          </button>
                          {status === "error" && fc?.errorMsg && (
                            <span className="text-xs text-rose-600">{fc.errorMsg}</span>
                          )}
                        </div>
                      );
                    }

                    if (status === "loading") {
                      return (
                        <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                          <span
                            aria-hidden
                            className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-violet-300 border-t-violet-700"
                          />
                          Drafting flashcards…
                        </div>
                      );
                    }

                    // status === "drafts" | "saving" — show the panel
                    const drafts = fc?.drafts ?? [];
                    const keptCount = drafts.filter((d) => d.keep).length;
                    const saving = status === "saving";

                    return (
                      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-xs font-semibold text-gray-900">
                            <span aria-hidden>✨</span> {drafts.length} draft flashcard
                            {drafts.length === 1 ? "" : "s"}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {keptCount} keeping
                            </span>
                            <button
                              type="button"
                              onClick={() => saveFlashcards(q.id, subtopicLabel)}
                              disabled={saving || keptCount === 0}
                              className="rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:shadow"
                            >
                              {saving ? "Saving…" : `Save ${keptCount} to library`}
                            </button>
                          </div>
                        </div>

                        <ul className="mt-3 space-y-2">
                          {drafts.map((d) => (
                            <li
                              key={d.tempId}
                              className={`rounded-xl border px-3 py-2 transition ${
                                d.keep
                                  ? "border-violet-200 bg-violet-50/40"
                                  : "border-gray-200 bg-gray-50 opacity-60"
                              }`}
                            >
                              <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={d.keep}
                                  onChange={() => toggleDraft(q.id, d.tempId)}
                                  className="mt-1 h-3.5 w-3.5 accent-violet-600"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-gray-900 whitespace-pre-wrap">
                                    {d.front_md}
                                  </p>
                                  {d.back_md && (
                                    <p className="mt-1 text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                                      {d.back_md}
                                    </p>
                                  )}
                                  <div className="mt-1.5 flex flex-wrap gap-1">
                                    {d.subtopic && (
                                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                                        {d.subtopic}
                                      </span>
                                    )}
                                    {d.mark_sheet_domain && (
                                      <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-medium text-pink-700">
                                        {d.mark_sheet_domain}
                                      </span>
                                    )}
                                    {d.amc_part && (
                                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                        {d.amc_part}
                                      </span>
                                    )}
                                    {d.citation && (
                                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                                        {d.citation}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </label>
                            </li>
                          ))}
                        </ul>

                        {fc?.errorMsg && (
                          <p className="mt-2 text-xs text-rose-600">{fc.errorMsg}</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </details>
            );
          })}
        </section>
      )}

      {/* ── Footer CTAs ──────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href="/dashboard/cat1"
          className="flex items-center justify-center rounded-xl bg-gradient-to-r from-saffron-500 via-violet-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
        >
          New recall session
        </Link>
        <Link
          href="/dashboard/progress"
          className="flex items-center justify-center rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
        >
          View all progress
        </Link>
        <button
          onClick={handleShare}
          className="flex items-center justify-center rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-semibold text-pink-700 shadow-sm transition hover:bg-pink-50"
        >
          {shareMsg ?? "Share result"}
        </button>
      </section>

      <p className="pb-4 text-center text-xs text-gray-400">
        Mostly Medicine · AMC-aligned recall · keep showing up.
      </p>
    </div>
  );
}
