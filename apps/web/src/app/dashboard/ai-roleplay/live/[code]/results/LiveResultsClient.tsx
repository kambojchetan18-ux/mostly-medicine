"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { SessionFeedback } from "@/lib/ai-roleplay/types";
import FunLoading from "@/components/FunLoading";

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
  // generating is for UI only, never in the effect's dep array — see below.
  const [, setGenerating] = useState(false);
  // Single-fire guard: prevents the fetch from running twice in dev StrictMode
  // and across re-renders. Critical because we deliberately drop `generating`
  // from the dep array (its inclusion was causing the cleanup of the FIRST
  // effect run to flip `cancelled = true` immediately after `setGenerating`
  // toggled, which silently dropped the feedback that came back).
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (feedback || hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    let cancelled = false;
    setGenerating(true);
    (async () => {
      try {
        const res = await fetch(`/api/ai-roleplay/live/${sessionId}/feedback`, { method: "POST" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Could not generate feedback");
        if (!cancelled) setFeedback(json.feedback);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not generate feedback");
          // Allow a manual retry if the user refreshes/clicks again later.
          hasFetchedRef.current = false;
        }
      } finally {
        if (!cancelled) setGenerating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, feedback]);

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

      <header className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <h1 className="text-base font-semibold text-brand-900">Live session feedback</h1>
        <p className="mt-1 text-xs text-brand-700">
          Doctor performance against the AMC rubric, plus an adherence score for the peer playing the patient. Code: <span className="font-mono">{inviteCode}</span>
        </p>
      </header>

      {!feedback ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          {error ? (
            <p className="text-sm text-rose-600">⚠️ {error}</p>
          ) : (
            <>
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
              <div className="mt-4 flex justify-center">
                <FunLoading
                  pool={[
                    "📝 Marking the session…",
                    "🎓 Channeling AMC examiner…",
                  ]}
                />
              </div>
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
            <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <h2 className="text-sm font-semibold text-brand-900">🧠 Differential review</h2>
              <p className="mt-2 text-sm text-brand-900">{feedback.differentialReview}</p>
            </section>
          )}

          {feedback.retrySuggestion && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">🎯 Next time</h2>
              <p className="mt-2 text-sm text-gray-700">{feedback.retrySuggestion}</p>
            </section>
          )}

          {feedback.patientFeedback && (() => {
            const pf = feedback.patientFeedback;
            const tone =
              pf.adherenceScore >= 7 ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : pf.adherenceScore >= 4 ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-rose-200 bg-rose-50 text-rose-900";
            const pillTone =
              pf.adherenceScore >= 7 ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : pf.adherenceScore >= 4 ? "bg-amber-100 text-amber-700 border-amber-200"
              : "bg-rose-100 text-rose-700 border-rose-200";
            return (
              <section className={`rounded-2xl border p-5 ${tone}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">🎭 Your partner&apos;s performance (as patient)</h2>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold tabular-nums ${pillTone}`}>
                    {pf.adherenceScore}/10 adherence
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed">{pf.overallNote}</p>
                <ul className="mt-3 space-y-1 text-xs">
                  <li>
                    <span className="font-semibold">Stayed in character:</span> {pf.stayedInCharacter ? "Yes" : "No — broke character at points"}
                  </li>
                  <li>
                    <span className="font-semibold">Matched emotional tone:</span> {pf.ignoredEmotionalTone ? "No — felt flat / off-tone" : "Yes"}
                  </li>
                </ul>
                {pf.leakedInformation.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold">Information revealed unprompted (adherence violations)</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      {pf.leakedInformation.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {pf.brokeRules.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold">Patient-rule breaks</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      {pf.brokeRules.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            );
          })()}

          <div className="flex gap-3 pt-2">
            <Link
              href="/dashboard/ai-roleplay/live"
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-700"
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
