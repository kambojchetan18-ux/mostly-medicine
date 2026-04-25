"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SessionFeedback } from "@/lib/ai-roleplay/types";

function ScorePill({ label, score }: { label: string; score: number }) {
  const tone =
    score >= 8 ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : score >= 6 ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-rose-100 text-rose-700 border-rose-200";
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
      <span className={`rounded-full border px-3 py-1 text-sm font-bold tabular-nums ${tone}`}>{score}/10</span>
    </div>
  );
}

interface Props {
  sessionId: string;
  inviteCode: string;
  myRole: "doctor" | "patient";
  initialFeedback: SessionFeedback | null;
}

export default function LiveResultsClient({ sessionId, inviteCode, myRole, initialFeedback }: Props) {
  const [feedback, setFeedback] = useState<SessionFeedback | null>(initialFeedback);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (feedback || generating) return;
    let cancelled = false;
    setGenerating(true);
    (async () => {
      try {
        const res = await fetch(`/api/ai-roleplay/live/${sessionId}/feedback`, { method: "POST" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Could not generate feedback");
        if (!cancelled) setFeedback(json.feedback);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not generate feedback");
      } finally {
        if (!cancelled) setGenerating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, feedback, generating]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/ai-roleplay/live" className="text-xs text-gray-500 hover:text-gray-700">
          ← New live session
        </Link>
        <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
          You played: {myRole}
        </span>
      </div>

      <header className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
        <h1 className="text-base font-semibold text-violet-900">Live session feedback</h1>
        <p className="mt-1 text-xs text-violet-700">
          Scoring is based on the doctor's transcript against the case rubric. Code: <span className="font-mono">{inviteCode}</span>
        </p>
      </header>

      {!feedback ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          {error ? (
            <p className="text-sm text-rose-600">⚠️ {error}</p>
          ) : (
            <>
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
              <p className="mt-4 text-sm text-gray-600">Marking the session…</p>
            </>
          )}
        </div>
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-3">
            <ScorePill label="Global" score={feedback.globalScore} />
            <ScorePill label="Communication" score={feedback.communicationScore} />
            <ScorePill label="Reasoning" score={feedback.reasoningScore} />
          </section>

          {feedback.strengths.length > 0 && (
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h2 className="text-sm font-semibold text-emerald-900">✅ Strengths</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-emerald-900">
                {feedback.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </section>
          )}

          {feedback.missedQuestions.length > 0 && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="text-sm font-semibold text-amber-900">❓ Questions missed</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-amber-900">
                {feedback.missedQuestions.map((q, i) => (
                  <li key={i}>• {q}</li>
                ))}
              </ul>
            </section>
          )}

          {feedback.missedRedFlags.length > 0 && (
            <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <h2 className="text-sm font-semibold text-rose-900">🚩 Red flags missed</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-rose-900">
                {feedback.missedRedFlags.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </section>
          )}

          {feedback.suggestedPhrasing.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">💬 Better phrasing</h2>
              <div className="mt-3 space-y-3">
                {feedback.suggestedPhrasing.map((p, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 line-through">{p.original}</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">→ {p.better}</p>
                    <p className="mt-1 text-xs italic text-gray-500">{p.reason}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {feedback.differentialReview && (
            <section className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
              <h2 className="text-sm font-semibold text-violet-900">🧠 Differential review</h2>
              <p className="mt-2 text-sm text-violet-900">{feedback.differentialReview}</p>
            </section>
          )}

          {feedback.retrySuggestion && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">🎯 Next time</h2>
              <p className="mt-2 text-sm text-gray-700">{feedback.retrySuggestion}</p>
            </section>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href="/dashboard/ai-roleplay/live"
              className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700"
            >
              New live session
            </Link>
            <Link
              href="/dashboard/ai-roleplay"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Solo mode
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
