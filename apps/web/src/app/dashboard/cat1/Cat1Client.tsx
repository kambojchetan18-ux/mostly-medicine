"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { MCQuestion } from "@mostly-medicine/content";
import FunLoading from "@/components/FunLoading";
import MentorMessage from "@/components/MentorMessage";
import QuizNavigator from "./QuizNavigator";
import QuizMeta from "./QuizMeta";
import InlineNotepad from "./InlineNotepad";

// Static topic list — avoids importing the 5 MB allQuestions bundle on the client.
// Question counts are fetched from the server API on menu load.
const TOPIC_NAMES = [
  "Cardiovascular", "Emergency Medicine", "Endocrinology", "Gastroenterology",
  "Infectious Disease", "Neurology", "Obstetrics & Gynaecology", "Paediatrics",
  "Pharmacology", "Psychiatry", "Renal", "Respiratory", "Rheumatology", "Surgery",
];

const TOPIC_REFERENCES: Record<string, { source: string; detail: string }> = {
  "Cardiovascular":   { source: "NHFA/CSANZ Heart Failure Guidelines 2018; Cardiac Society AF Guidelines 2023", detail: "Therapeutic Guidelines: Cardiovascular, v7" },
  "Respiratory":      { source: "Australian Asthma Handbook 2022 (NAC); COPD-X Plan 2023", detail: "Therapeutic Guidelines: Respiratory, v5" },
  "Gastroenterology": { source: "GESA Clinical Guidelines; Gastroenterological Society of Australia", detail: "Therapeutic Guidelines: Gastrointestinal, v6" },
  "Neurology":        { source: "Stroke Foundation Clinical Guidelines 2023; Epilepsy Society of Australia", detail: "Therapeutic Guidelines: Neurology, v4" },
  "Endocrinology":    { source: "ADEA/ADS Type 2 Diabetes Guidelines 2023; Australian Thyroid Guidelines", detail: "Therapeutic Guidelines: Endocrinology, v5" },
  "Psychiatry":       { source: "RANZCP Clinical Practice Guidelines; Australian Mental Health Standards", detail: "Therapeutic Guidelines: Psychotropic, v8" },
  "Paediatrics":      { source: "NCIRS Immunisation Schedule 2024; Paediatric Emergency Guidelines (RCH)", detail: "Therapeutic Guidelines: Antibiotic — Paediatric, v16" },
  "Obstetrics & Gynaecology": { source: "RANZCOG Clinical Guidelines; Australian Antenatal Care Guidelines", detail: "Therapeutic Guidelines: Obstetrics, v2" },
  "Emergency Medicine": { source: "ACEM Clinical Guidelines; Advanced Life Support (ARC) 2021", detail: "Therapeutic Guidelines: Emergency, v2" },
  "Renal":            { source: "KHA-CARI Guidelines; Australian CKD Guidelines 2023", detail: "Therapeutic Guidelines: Renal, v1" },
  "Rheumatology":     { source: "APLAR/Australian Rheumatology Association Guidelines", detail: "Therapeutic Guidelines: Rheumatology, v2" },
  "Infectious Disease": { source: "ASHM HIV Guidelines; Australasian Society for Infectious Diseases", detail: "Therapeutic Guidelines: Antibiotic, v16" },
  "Surgery":          { source: "RACS Surgical Guidelines; Australian Colorectal Surgical Standards", detail: "AMC MCQ Handbook — Surgical Topics" },
  "Pharmacology":     { source: "Australian Medicines Handbook (AMH) 2024", detail: "Therapeutic Guidelines: relevant specialty, current edition" },
};

function getReference(topic: string) {
  return TOPIC_REFERENCES[topic] ?? { source: "AMC MCQ Handbook (current edition)", detail: "AMC Clinical Assessment" };
}

type Mode = "menu" | "reading" | "loading" | "quiz" | "result";

const READING_SECONDS = 120; // 2 minutes

interface SaveAttemptResult {
  ok: boolean;
  limitReached?: { dailyLimit: number; used: number; plan: string };
}

async function saveAttempt(
  questionId: string,
  correct: boolean,
  topic: string,
  sessionId: string | null,
): Promise<SaveAttemptResult> {
  try {
    const res = await fetch("/api/cat1/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, correct, topic, sessionId }),
    });
    // 429 from enforceDailyLimit — surface to UI so we can show an upgrade
    // modal instead of silently dropping the answer.
    if (res.status === 429) {
      const json = await res.json().catch(() => ({}));
      return {
        ok: false,
        limitReached: {
          dailyLimit: json.dailyLimit ?? 20,
          used: json.used ?? json.dailyLimit ?? 20,
          plan: json.plan ?? "free",
        },
      };
    }
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

interface Cat1ClientProps {
  plan?: "free" | "pro" | "enterprise";
}

export default function Cat1Client({ plan = "free" }: Cat1ClientProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPro = plan === "pro" || plan === "enterprise";
  const [mode, setMode] = useState<Mode>("menu");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MCQuestion[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [endingSession, setEndingSession] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  // selected stored alongside id/correct so the Previous button can restore
  // the picked option when the user revisits an already-answered question.
  const [answers, setAnswers] = useState<{ id: string; correct: boolean; topic: string; selected: string }[]>([]);
  const [detailedExplanation, setDetailedExplanation] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [smartExplanation, setSmartExplanation] = useState<string | null>(null);
  const [smartLoading, setSmartLoading] = useState(false);
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});
  const [limitReached, setLimitReached] = useState<{ dailyLimit: number; used: number; plan: string } | null>(null);

  // In-flow AI mentor nudge — fires when the user gets 2 wrong in a row.
  // We bump a key each time the trigger fires so React remounts the banner
  // (and re-fetches a fresh message) instead of reusing a stale instance.
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [mentorKey, setMentorKey] = useState(0);
  const [mentorContext, setMentorContext] = useState<{ wrongCount: number; topic?: string } | null>(null);

  // Pending request that travels through reading → loading → quiz
  const [pendingTopic, setPendingTopic] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(20);
  const [readingSecondsLeft, setReadingSecondsLeft] = useState(READING_SECONDS);
  // How many questions in this topic the user already attempted before the
  // resume — used to display absolute progress ("Question 9 of 135") instead
  // of the misleading within-pool count ("Question 1 of 130").
  const [resumedAlreadyDone, setResumedAlreadyDone] = useState(0);
  // Guards Check-Answer / Next-Question against double-clicks that were
  // producing duplicate attempt rows in the DB (1 click → 2 inserts).
  const [submitting, setSubmitting] = useState(false);

  // Fetch topic counts once on menu mount — tiny payload from server
  useEffect(() => {
    fetch("/api/cat1/questions")
      .then((r) => r.json())
      .then((d) => {
        if (d.topics) {
          const map: Record<string, number> = {};
          for (const t of d.topics) map[t.name] = t.count;
          setTopicCounts(map);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-start a topic when arriving from /dashboard/progress (or any deep
  // link) with ?topic=<name>. Pro users always request the full pool; the
  // questions API caps server-side at the topic's actual count so we don't
  // need topicCounts to be loaded first.
  useEffect(() => {
    const t = searchParams?.get("topic");
    if (!t) return;
    if (mode !== "menu") return;
    const count = isPro ? 2000 : 20;
    startQuiz(t, count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isPro, mode]);

  // Step 1: menu → reading. Sets up the pending request and starts the 2-min timer.
  function startQuiz(topic: string | null, count = 20) {
    setPendingTopic(topic);
    setPendingCount(count);
    setReadingSecondsLeft(READING_SECONDS);
    setMode("reading");
  }

  // Step 2: reading → loading → quiz. Probes for an active session for this
  // topic first; if one exists, RESUMES it (filters already-answered question
  // ids out of the new pool and reuses the existing mcq_session row). Otherwise
  // creates a fresh mcq_session via /session/start.
  const runQuiz = useCallback(async (topic: string | null, count: number) => {
    setMode("loading");
    try {
      const resumeRes = await fetch("/api/cat1/session/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, desiredTargetCount: count }),
      });
      const resumeData = (await resumeRes.json().catch(() => ({}))) as {
        active?: boolean;
        sessionId?: string;
        targetCount?: number;
        attemptedIds?: string[];
      };
      const reusing = !!(resumeData.active && resumeData.sessionId);
      const skipIds = new Set<string>(resumeData.attemptedIds ?? []);
      // Always honour the count the user just clicked. Older active sessions
      // were created with target_count=20 before Pro got the full-topic pool
      // option, so without this a Pro user clicking "Practice all 472" would
      // silently be capped at the legacy 20.
      const targetCount = Math.max(count, resumeData.targetCount ?? 0);

      // Always fetch a generous pool from the questions API so the post-skip
      // filter still leaves enough to fill the requested target.
      const poolReq = Math.min(2000, Math.max(targetCount, count) + skipIds.size);
      const qRes = await fetch("/api/cat1/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count: poolReq }),
      });
      const data = (await qRes.json().catch(() => ({}))) as { questions?: MCQuestion[] };
      const remaining = (data.questions ?? []).filter((q) => !skipIds.has(q.id));

      let sessionIdToUse = reusing ? resumeData.sessionId! : null;
      // If nothing left to resume from, transparently create a fresh session.
      if (!remaining.length || !reusing) {
        const sRes = await fetch("/api/cat1/session/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, targetCount }),
        });
        const sData = (await sRes.json().catch(() => ({}))) as { sessionId?: string };
        sessionIdToUse = typeof sData.sessionId === "string" ? sData.sessionId : null;
      }

      setQuestions(remaining.slice(0, targetCount));
      setSessionId(sessionIdToUse);
      setSelectedTopic(topic);
      setCurrent(0);
      setSelected(null);
      setRevealed(false);
      setAnswers([]);
      setDetailedExplanation(null);
      setConsecutiveWrong(0);
      setMentorContext(null);
      setResumedAlreadyDone(reusing && remaining.length ? skipIds.size : 0);
      setMode("quiz");
    } catch {
      setMode("menu");
    }
  }, []);

  // Reading-screen countdown — auto-redirects to loading when it hits 0.
  useEffect(() => {
    if (mode !== "reading") return;
    if (readingSecondsLeft <= 0) {
      runQuiz(pendingTopic, pendingCount);
      return;
    }
    const t = setTimeout(() => setReadingSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [mode, readingSecondsLeft, pendingTopic, pendingCount, runQuiz]);

  function handleSelect(label: string) {
    if (revealed) return;
    setSelected(label);
  }

  function handleReveal() {
    if (!selected) return;
    setRevealed(true);
    const q = questions[current];
    const wasCorrect = selected === q.correctAnswer;
    if (wasCorrect) {
      // Reset the streak the moment they're back on track.
      setConsecutiveWrong(0);
    } else {
      const next = consecutiveWrong + 1;
      setConsecutiveWrong(next);
      // 2-in-a-row threshold per the in-flow mentor spec. Re-fires on every
      // additional wrong so the rate-limited API + per-mount fetch guard
      // (in MentorMessage) shape the actual cadence — server side caps it
      // at 1 message per 5 min per user, so the banner just won't render
      // again until the window opens.
      if (next >= 2) {
        setMentorContext({ wrongCount: next, topic: q.topic });
        setMentorKey((k) => k + 1);
      }
    }
  }

  const handleNext = useCallback(async () => {
    if (!selected) return;
    if (submitting) return; // double-click guard — prevents duplicate inserts
    setSubmitting(true);
    const q = questions[current];
    const correct = selected === q.correctAnswer;
    // If we are revisiting a question the user already answered (Previous →
    // Next round-trip), the attempt is already in the DB. Skip the save and
    // just advance — never insert a duplicate row.
    const alreadyAnswered = answers[current] !== undefined;

    const result = alreadyAnswered
      ? { ok: true as const }
      : await saveAttempt(q.id, correct, q.topic, sessionId);
    if (result.limitReached) {
      // Free user hit their daily quota. Show the upgrade modal — don't
      // advance to the next question; the user is gated until tomorrow OR
      // they upgrade to Pro.
      setLimitReached(result.limitReached);
      return;
    }

    const newAnswers = alreadyAnswered
      ? answers
      : [...answers, { id: q.id, correct, topic: q.topic, selected }];
    if (!alreadyAnswered) setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      // Finalise the session server-side (scores, percentile, AI learning
      // points), then jump to the rich results page. Falls back to the
      // legacy in-page result view if anything goes wrong.
      if (sessionId) {
        setEndingSession(true);
        try {
          const res = await fetch(`/api/cat1/session/${sessionId}/end`, { method: "POST" });
          if (res.ok) {
            router.push(`/dashboard/cat1/results/${sessionId}`);
            return;
          }
        } catch {
          /* fall through to legacy result */
        } finally {
          setEndingSession(false);
        }
      }
      setMode("result");
    } else {
      // Advancing — if the next question was previously answered (user came
      // back via Previous), pre-load their answer so the UI shows the picked
      // option + revealed explanation rather than a fresh empty state.
      const nextIdx = current + 1;
      const prior = answers[nextIdx];
      setCurrent(nextIdx);
      if (prior) {
        setSelected(prior.selected);
        setRevealed(true);
      } else {
        setSelected(null);
        setRevealed(false);
      }
      setDetailedExplanation(null);
      setSmartExplanation(null);
    }
    setSubmitting(false);
  }, [selected, questions, current, answers, sessionId, router, submitting]);

  // ← Previous: restores the prior question's picked option + revealed state
  // so the user can review their answer / explanation. Does not touch the DB.
  const handlePrev = useCallback(() => {
    if (current === 0) return;
    const prevIdx = current - 1;
    const prior = answers[prevIdx];
    setCurrent(prevIdx);
    if (prior) {
      setSelected(prior.selected);
      setRevealed(true);
    } else {
      setSelected(null);
      setRevealed(false);
    }
    setDetailedExplanation(null);
    setSmartExplanation(null);
  }, [current, answers]);

  // Jump to an arbitrary question via the QuizNavigator grid. Bounds-checked,
  // restores the picked-answer + revealed state if the destination has one.
  const handleJumpTo = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= questions.length || idx === current) return;
      const target = answers[idx];
      setCurrent(idx);
      if (target) {
        setSelected(target.selected);
        setRevealed(true);
      } else {
        setSelected(null);
        setRevealed(false);
      }
      setDetailedExplanation(null);
      setSmartExplanation(null);
    },
    [current, questions.length, answers],
  );

  async function fetchDetailedExplanation() {
    if (!selected) return;
    const q = questions[current];
    setDetailLoading(true);
    const res = await fetch("/api/cat1/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stem: q.stem,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedAnswer: selected,
        topic: q.topic,
        subtopic: q.subtopic,
        explanation: q.explanation,
      }),
    });
    const data = await res.json();
    setDetailedExplanation(data.explanation ?? "Could not load explanation.");
    setDetailLoading(false);
  }

  async function fetchSmartExplanation() {
    if (!selected) return;
    const q = questions[current];
    const userAnswerIndex = q.options.findIndex((o) => o.label === selected);
    if (userAnswerIndex < 0) return;
    setSmartLoading(true);
    try {
      const res = await fetch("/api/cat1/smart-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, userAnswerIndex }),
      });
      const data = await res.json();
      setSmartExplanation(data.explanation ?? "Could not load smart explanation.");
    } catch {
      setSmartExplanation("Could not load smart explanation.");
    } finally {
      setSmartLoading(false);
    }
  }

  function reset() {
    setMode("menu");
    setSelectedTopic(null);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
  }

  // ── READING (2-min intro screen) ────────────────────────────────────────────
  if (mode === "reading") {
    const mm = Math.floor(readingSecondsLeft / 60).toString().padStart(2, "0");
    const ss = (readingSecondsLeft % 60).toString().padStart(2, "0");
    const pct = (readingSecondsLeft / READING_SECONDS) * 100;

    const topicLabel = pendingTopic ?? "Mixed";
    const isMockExam = !pendingTopic && pendingCount === 50;

    let scenarioBody: string;
    if (pendingTopic) {
      scenarioBody = `You are about to attempt ${pendingCount} AMC-style MCQs in ${pendingTopic}. The questions test core clinical knowledge across this specialty as expected of a junior doctor in Australia. References include eTG / RACGP / AMC Handbook 2026.`;
    } else if (isMockExam) {
      scenarioBody = `You are about to attempt ${pendingCount} mixed AMC-style MCQs across all 14 clinical specialties. The questions test core clinical knowledge expected of a junior doctor in Australia. References include eTG / RACGP / AMC Handbook 2026.\n\nThis 50-question Mock Exam mirrors the breadth and pacing of AMC CAT 1.`;
    } else {
      scenarioBody = `You are about to attempt ${pendingCount} mixed AMC-style MCQs across all 14 clinical specialties. The questions test core clinical knowledge expected of a junior doctor in Australia. References include eTG / RACGP / AMC Handbook 2026.`;
    }

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMode("menu")}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
            {pendingCount} questions · {topicLabel}
          </span>
        </div>

        {/* Timer card */}
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Reading time</p>
              <p className="mt-0.5 text-3xl font-bold tabular-nums text-brand-900">
                {mm}:{ss}
              </p>
            </div>
            <button
              type="button"
              onClick={() => runQuiz(pendingTopic, pendingCount)}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-700"
            >
              Start MCQ Quiz →
            </button>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100">
            <div
              className="h-full bg-brand-600 transition-[width] duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Scenario card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Scenario</p>
          <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-gray-900">
            {scenarioBody}
          </p>

          <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Your task</p>
            <p className="mt-1 text-sm font-medium text-amber-900">
              Read each stem carefully, eliminate distractors, choose the best single answer. Aim for 70%+ accuracy and use the explanation after each question to consolidate weak areas.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          When the timer ends you will move to the quiz automatically. You can also start early.
        </p>
      </div>
    );
  }

  // ── LOADING ─────────────────────────────────────────────────────────────────
  if (mode === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading questions…</p>
      </div>
    );
  }

  // ── MENU ────────────────────────────────────────────────────────────────────
  if (mode === "menu") {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">AMC MCQ — Practice</h2>
        <p className="text-gray-500 text-sm mb-6">
          4,400+ questions across 14 topics. Your progress is saved and spaced repetition adapts to your weak areas.
        </p>

        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => startQuiz(null, 20)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition"
          >
            ⚡ Quick Quiz (20 random)
          </button>
          <button
            onClick={() => startQuiz(null, 50)}
            className="border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Mock Exam (50 questions)
          </button>
          {isPro && (
            <button
              onClick={() => startQuiz(null, 100)}
              className="border border-amber-400 bg-amber-50 text-amber-800 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-amber-100 transition"
            >
              ⭐ Pro: Continuous (100)
            </button>
          )}
          <a
            href="/dashboard/progress"
            className="border border-brand-300 text-brand-700 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-brand-50 transition"
          >
            📊 My Progress
          </a>
        </div>

        <h3 className="font-semibold text-gray-700 mb-3">
          Practice by Topic
          {isPro && (
            <span className="ml-2 text-xs font-normal text-amber-700">
              ⭐ Pro: tap a topic to practice the entire pool
            </span>
          )}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOPIC_NAMES.map((topic) => {
            const total = topicCounts[topic] ?? 0;
            // Pro/Enterprise users always request the full pool (server caps
            // at the topic's actual count). Sending the hard cap 2000 avoids
            // a race where topicCounts hasn't loaded yet at click time and
            // the user falls back to a 20-question session.
            const sessionCount = isPro ? 2000 : 20;
            return (
              <button
                key={topic}
                onClick={() => startQuiz(topic, sessionCount)}
                className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-brand-400 hover:bg-brand-50 transition group"
              >
                <p className="font-medium text-gray-800 text-sm group-hover:text-brand-700">{topic}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {total
                    ? isPro
                      ? `Practice all ${total} →`
                      : `${total} questions`
                    : isPro
                      ? "Practice all →"
                      : "Practice →"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── RESULT ──────────────────────────────────────────────────────────────────
  if (mode === "result") {
    const score = answers.filter((a) => a.correct).length;
    const pct = Math.round((score / answers.length) * 100);

    const byTopic: Record<string, { correct: number; total: number }> = {};
    for (const a of answers) {
      if (!byTopic[a.topic]) byTopic[a.topic] = { correct: 0, total: 0 };
      byTopic[a.topic].total++;
      if (a.correct) byTopic[a.topic].correct++;
    }
    const topicResults = Object.entries(byTopic)
      .map(([t, v]) => ({ topic: t, pct: Math.round((v.correct / v.total) * 100), ...v }))
      .sort((a, b) => a.pct - b.pct);

    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{pct >= 80 ? "🎉" : pct >= 60 ? "📖" : "💪"}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Quiz Complete</h2>
          <p className="text-gray-500 text-sm">{selectedTopic ?? "Mixed topics"}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 text-center">
          <p className="text-5xl font-bold text-brand-600 mb-1">{score}/{answers.length}</p>
          <p className="text-gray-500 text-sm">{pct}% correct</p>
          <p className="text-xs mt-2 text-gray-400">
            {pct >= 80 ? "Excellent! Keep going." : pct >= 60 ? "Good effort. Review the topics below." : "Keep practising — focus on weak areas."}
          </p>
        </div>

        {topicResults.length > 1 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
            <p className="font-semibold text-gray-700 text-sm mb-3">Topic Breakdown</p>
            <div className="space-y-2.5">
              {topicResults.map((t) => (
                <div key={t.topic}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{t.topic}</span>
                    <span className={t.pct < 60 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                      {t.correct}/{t.total} ({t.pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${t.pct >= 70 ? "bg-green-500" : t.pct >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                      style={{ width: `${t.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => startQuiz(selectedTopic)}
            className="flex-1 bg-brand-600 text-white font-semibold py-2.5 rounded-xl hover:bg-brand-700 transition text-sm"
          >
            Retry
          </button>
          <button
            onClick={reset}
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            Back to Topics
          </button>
          <a
            href="/dashboard/progress"
            className="flex-1 border border-brand-300 text-brand-700 font-semibold py-2.5 rounded-xl hover:bg-brand-50 transition text-sm text-center"
          >
            View Progress
          </a>
        </div>
      </div>
    );
  }

  // ── QUIZ ────────────────────────────────────────────────────────────────────
  const q = questions[current];
  const isCorrect = selected === q.correctAnswer;

  return (
    <>
    {mentorContext && (
      <MentorMessage
        key={`mentor-${mentorKey}`}
        trigger="mcq_two_wrong"
        context={mentorContext}
        onDismiss={() => setMentorContext(null)}
        floating
      />
    )}
    {limitReached && !isPro && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="max-w-md w-full rounded-3xl bg-white shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-brand-600 via-violet-600 to-pink-500 px-6 pt-7 pb-5 text-white">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">Daily limit reached</p>
            <h2 className="mt-1 text-2xl font-bold leading-tight">
              You smashed your {limitReached.dailyLimit} free MCQs today 🎯
            </h2>
            <p className="mt-2 text-sm text-white/90 leading-relaxed">
              That&apos;s solid focus. Keep the momentum — Pro unlocks unlimited MCQs, AI examiner explanations, and Clinical RolePlay so today&apos;s streak doesn&apos;t cool off.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-gray-800">⭐ Pro</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">A$19<span className="text-sm font-normal text-gray-500">/mo</span></p>
            </div>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li className="flex gap-2"><span className="text-amber-500">✓</span><span>Unlimited AMC MCQs</span></li>
              <li className="flex gap-2"><span className="text-amber-500">✓</span><span>AMC Handbook AI RolePlay</span></li>
              <li className="flex gap-2"><span className="text-amber-500">✓</span><span>AMC Clinical AI RolePlay (voice mode)</span></li>
              <li className="flex gap-2"><span className="text-amber-500">✓</span><span>Examiner-style feedback every session</span></li>
            </ul>
            <Link
              href="/dashboard/billing"
              className="block w-full text-center rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white shadow hover:bg-amber-600 transition"
            >
              Upgrade to Pro — keep going →
            </Link>
            <button
              onClick={() => { setLimitReached(null); reset(); }}
              className="block w-full text-center text-xs text-gray-500 hover:text-gray-700"
            >
              I&apos;ll come back tomorrow
            </button>
          </div>
        </div>
      </div>
    )}
    <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] gap-4 max-w-7xl mx-auto lg:px-2">
      <div className="hidden lg:block">
        <QuizNavigator
          total={questions.length}
          current={current}
          answers={answers}
          resumedAlreadyDone={resumedAlreadyDone}
          onJump={handleJumpTo}
        />
      </div>
    <div className="min-w-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">
          Question {current + 1 + resumedAlreadyDone} of {questions.length + resumedAlreadyDone}
          {selectedTopic && <span className="ml-2 text-brand-600 font-medium">· {selectedTopic}</span>}
          {resumedAlreadyDone > 0 && (
            <span className="ml-2 text-amber-600 font-medium text-xs">
              · resumed ({resumedAlreadyDone} already done)
            </span>
          )}
        </p>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">
          Exit
        </button>
      </div>

      {/* Mobile-only compact navigator strip — horizontal scroll of question
          status pills. Hidden on lg+ because the QuizNavigator sidebar covers it. */}
      <div className="lg:hidden mb-3 -mx-2 px-2 overflow-x-auto">
        <div className="flex gap-1.5 w-max">
          {questions.map((_, idx) => {
            const a = answers[idx];
            const isCur = idx === current;
            const cls = isCur
              ? "bg-brand-600 text-white"
              : !a
                ? "bg-white border border-gray-200 text-gray-700"
                : a.correct
                  ? "bg-emerald-100 border border-emerald-300 text-emerald-700"
                  : "bg-rose-100 border border-rose-300 text-rose-700";
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleJumpTo(idx)}
                className={`h-8 min-w-8 px-2 rounded-md text-xs font-semibold transition shrink-0 ${cls}`}
                aria-label={`Question ${idx + 1 + resumedAlreadyDone}`}
              >
                {idx + 1 + resumedAlreadyDone}
                {a && (a.correct ? " ✓" : " ✗")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
        <div
          className="h-1.5 bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${(current / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-sm">
        <div className="flex gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            q.difficulty === "easy" ? "bg-green-100 text-green-700"
            : q.difficulty === "medium" ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
          }`}>
            {q.difficulty}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{q.subtopic}</span>
        </div>
        <p className="text-gray-800 text-sm leading-relaxed font-medium">{q.stem}</p>
      </div>

      <div className="space-y-2 mb-4">
        {q.options.map((opt) => {
          let style = "bg-white border border-gray-200 text-gray-700 hover:border-brand-400 hover:bg-brand-50";
          if (revealed) {
            if (opt.label === q.correctAnswer) style = "bg-green-50 border-green-500 text-green-800";
            else if (opt.label === selected) style = "bg-red-50 border-red-400 text-red-800";
            else style = "bg-white border border-gray-100 text-gray-300";
          } else if (opt.label === selected) {
            style = "bg-brand-50 border-brand-500 text-brand-800";
          }
          const isYourPick = opt.label === selected;
          const isCorrectOpt = opt.label === q.correctAnswer;
          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label)}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm transition border flex items-center gap-2 ${style}`}
            >
              <span className="font-bold">{opt.label}.</span>
              <span className="flex-1">{opt.text}</span>
              {revealed && isYourPick && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  isCorrectOpt ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                }`}>
                  Your Answer
                </span>
              )}
              {revealed && isCorrectOpt && (
                <span className="text-emerald-600 text-base font-bold">✓</span>
              )}
              {revealed && isYourPick && !isCorrectOpt && (
                <span className="text-rose-600 text-base font-bold">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {revealed && (() => {
        const ref = getReference(q.topic);
        return (
          <div className={`rounded-xl p-4 mb-4 text-sm ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <p className="font-semibold mb-2">{isCorrect ? "✓ Correct!" : `✗ Correct answer: ${q.correctAnswer}`}</p>
            <p className="text-gray-700 leading-relaxed">{q.explanation}</p>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reference</p>
              <p className="text-xs text-gray-600 font-medium">{ref.detail}</p>
              <p className="text-xs text-gray-400">{ref.source}</p>
            </div>

            {!isCorrect && !smartExplanation && (
              <button
                onClick={fetchSmartExplanation}
                disabled={smartLoading}
                className="mt-3 mr-3 text-xs font-semibold text-brand-600 hover:text-brand-800 underline disabled:opacity-50"
              >
                {smartLoading ? "Thinking…" : "🤔 Why was I wrong?"}
              </button>
            )}

            {!detailedExplanation && (
              <button
                onClick={fetchDetailedExplanation}
                disabled={detailLoading}
                className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-800 underline disabled:opacity-50"
              >
                {detailLoading ? "Loading detailed explanation…" : "🔍 Explain in detail (why each option is right/wrong)"}
              </button>
            )}

            {smartLoading && !smartExplanation && (
              <div className="mt-3 bg-white border border-brand-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-2">Smart Explanation</p>
                <div className="space-y-2 animate-pulse">
                  <div className="h-2.5 bg-gray-200 rounded w-11/12" />
                  <div className="h-2.5 bg-gray-200 rounded w-10/12" />
                  <div className="h-2.5 bg-gray-200 rounded w-9/12" />
                  <div className="h-2.5 bg-gray-200 rounded w-7/12" />
                </div>
                <FunLoading
                  pool={[
                    "🤔 Working out why you got tripped…",
                    "📚 Looking it up in eTG…",
                    "🩺 Deconstructing the trap…",
                  ]}
                  className="mt-2 text-xs text-gray-500"
                />
              </div>
            )}

            {smartExplanation && (
              <div className="mt-3 bg-white border border-brand-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-2">Smart Explanation</p>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{smartExplanation}</p>
              </div>
            )}

            {detailedExplanation && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Detailed Explanation</p>
                <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{detailedExplanation}</div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Mobile-only inline notepad — desktop already has it inside QuizMeta. */}
      <div className="lg:hidden">
        <InlineNotepad questionId={q.id} />
      </div>

      <div className="flex gap-3">
        {current > 0 && (
          <button
            onClick={handlePrev}
            className="border border-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-xl hover:bg-gray-50 transition text-sm whitespace-nowrap"
          >
            ← Previous
          </button>
        )}
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={!selected}
            className="flex-1 bg-brand-600 text-white font-semibold py-2.5 rounded-xl hover:bg-brand-700 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 bg-brand-600 text-white font-semibold py-2.5 rounded-xl hover:bg-brand-700 transition text-sm"
          >
            {current + 1 >= questions.length ? "See Results →" : "Next →"}
          </button>
        )}
      </div>
    </div>
      <div className="hidden lg:block">
        <QuizMeta questionId={q.id} current={current} />
      </div>
    </div>
    </>
  );
}
