"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SessionFeedback } from "@/lib/ai-roleplay/types";

interface Props {
  sessionId: string;
  caseId: string;
  blueprintId: string | null;
  patientName: string;
  candidateTask: string;
  setting: string;
  presentingComplaint: string;
  initialFeedback: SessionFeedback | null;
  initialStatus: string;
}

function ScorePill({ label, score }: { label: string; score: number }) {
  const tone =
    score >= 8 ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : score >= 6 ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-rose-100 text-rose-700 border-rose-200";
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
      <span className={`rounded-full border px-3 py-1 text-sm font-bold tabular-nums ${tone}`}>
        {score}/10
      </span>
    </div>
  );
}

export default function ResultsClient({
  sessionId,
  caseId,
  blueprintId,
  patientName,
  candidateTask,
  setting,
  presentingComplaint,
  initialFeedback,
  initialStatus,
}: Props) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<SessionFeedback | null>(initialFeedback);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [pending, startTransition] = useTransition();

  // Auto-trigger feedback generation if not yet present.
  useEffect(() => {
    if (feedback || generating) return;
    let cancelled = false;
    setGenerating(true);
    (async () => {
      try {
        const res = await fetch(`/api/ai-roleplay/session/${sessionId}/feedback`, { method: "POST" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Could not generate feedback");
        if (!cancelled) setFeedback(json.feedback as SessionFeedback);
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

  async function regenerate(payload: Record<string, unknown>) {
    setError(null);
    try {
      const res = await fetch("/api/ai-roleplay/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not generate case");
      startTransition(() => router.push(`/dashboard/ai-roleplay/${json.caseId}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate case");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/ai-roleplay" className="text-xs text-gray-500 hover:text-gray-700">
          ← All cases
        </Link>
        <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
          {feedback ? "completed" : initialStatus}
        </span>
      </div>

      {/* Case header */}
      <header className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Station</p>
        <h1 className="mt-1 text-lg font-semibold text-gray-900">
          {candidateTask}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {patientName} · {setting}
        </p>
        {presentingComplaint && (
          <p className="mt-2 text-xs text-gray-500">"{presentingComplaint}"</p>
        )}
      </header>

      {/* Loading / error */}
      {!feedback && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          {error ? (
            <p className="text-sm text-rose-600">⚠️ {error}</p>
          ) : (
            <>
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
              <p className="mt-4 text-sm text-gray-600">Marking your session…</p>
              <p className="mt-1 text-xs text-gray-400">
                Comparing your transcript against the case rubric
              </p>
            </>
          )}
        </div>
      )}

      {feedback && (
        <>
          {/* Scores */}
          <section className="grid gap-3 sm:grid-cols-3">
            <ScorePill label="Global" score={feedback.globalScore} />
            <ScorePill label="Communication" score={feedback.communicationScore} />
            <ScorePill label="Reasoning" score={feedback.reasoningScore} />
          </section>

          {/* Strengths */}
          {feedback.strengths.length > 0 && (
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h2 className="text-sm font-semibold text-emerald-900">✅ Strengths</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-emerald-900">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Missed questions */}
          {feedback.missedQuestions.length > 0 && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="text-sm font-semibold text-amber-900">❓ Questions you missed</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-amber-900">
                {feedback.missedQuestions.map((q, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Missed red flags */}
          {feedback.missedRedFlags.length > 0 && (
            <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <h2 className="text-sm font-semibold text-rose-900">🚩 Red flags missed</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-rose-900">
                {feedback.missedRedFlags.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Suggested phrasing */}
          {feedback.suggestedPhrasing.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">💬 Suggested phrasing</h2>
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

          {/* Differential review + retry */}
          {feedback.differentialReview && (
            <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <h2 className="text-sm font-semibold text-brand-900">🧠 Differential review</h2>
              <p className="mt-2 text-sm text-brand-900">{feedback.differentialReview}</p>
            </section>
          )}

          {feedback.retrySuggestion && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">🎯 For your next attempt</h2>
              <p className="mt-2 text-sm text-gray-700">{feedback.retrySuggestion}</p>
            </section>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {blueprintId && (
              <button
                type="button"
                disabled={pending}
                onClick={() => regenerate({ blueprintId })}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-700 disabled:opacity-60"
              >
                🔁 Retry similar case
              </button>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={() => regenerate({ random: true })}
              className="rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-60"
            >
              🎲 New random case
            </button>
            <Link
              href={`/dashboard/ai-roleplay/${caseId}/play`}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View transcript
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
