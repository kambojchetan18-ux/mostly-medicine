"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SessionFeedback } from "@/lib/ai-roleplay/types";
import FunLoading from "@/components/FunLoading";
import RoleplayDiagnosticRadar from "@/components/RoleplayDiagnosticRadar";
import { createClient } from "@/lib/supabase/client";

interface TranscriptItem {
  id: string;
  role: "user" | "assistant";
  content: string;
}

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
  transcript: TranscriptItem[];
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
  transcript,
}: Props) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<SessionFeedback | null>(initialFeedback);
  const [error, setError] = useState<string | null>(null);
  const [limitInfo, setLimitInfo] = useState<{ dailyLimit: number | null; used: number } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [pending, startTransition] = useTransition();
  const [showTranscript, setShowTranscript] = useState(false);
  // "free" by default — only show CTA after we confirm user is on free tier.
  // Pro/Enterprise (or active Founder) hides the CTA entirely.
  const [planTier, setPlanTier] = useState<"free" | "paid" | "loading">("loading");

  // Detect subscription tier client-side. Pulls from user_profiles which the
  // billing page also reads — same logic for "founder" promo (free user with
  // active pro_until counts as paid).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("plan, pro_until, founder_rank")
          .eq("id", user.id)
          .single();
        if (cancelled || !profile) return;
        const founderActive =
          profile.founder_rank != null &&
          profile.pro_until != null &&
          Date.parse(profile.pro_until as string) > Date.now();
        const isPaid =
          profile.plan === "pro" ||
          profile.plan === "enterprise" ||
          founderActive;
        setPlanTier(isPaid ? "paid" : "free");
      } catch {
        // Fail closed → assume free so the CTA still appears (better for funnel).
        if (!cancelled) setPlanTier("free");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Single-fire guard. Mirrors LiveResultsClient: keeping `generating` out of
  // the dep array prevents setGenerating(true) from triggering its own
  // cleanup which would cancel the in-flight feedback fetch.
  const hasFetchedRef = useRef(false);

  // Auto-trigger feedback generation if not yet present.
  useEffect(() => {
    if (feedback || hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    let cancelled = false;
    setGenerating(true);
    (async () => {
      try {
        const res = await fetch(`/api/ai-roleplay/session/${sessionId}/feedback`, { method: "POST" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Could not generate feedback");
        if (!cancelled) setFeedback(json.feedback as SessionFeedback);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not generate feedback");
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

  async function regenerate(payload: Record<string, unknown>) {
    setError(null);
    setLimitInfo(null);
    try {
      const res = await fetch("/api/ai-roleplay/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.status === 429 && json?.error === "daily_limit_reached") {
        setLimitInfo({
          dailyLimit: json.dailyLimit ?? null,
          used: json.used ?? 0,
        });
        return;
      }
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
              <div className="mt-4 flex justify-center">
                <FunLoading
                  pool={[
                    "📝 Marking your session…",
                    "🎓 Channeling AMC examiner…",
                    "🧐 Cross-checking against the rubric…",
                  ]}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Comparing your transcript against the case rubric
              </p>
            </>
          )}
        </div>
      )}

      {feedback && (
        <>
          {/* AI Diagnostic Report — radar visualisation + Pro CTA. This is the
              "Aha Moment" surface: the user sees their performance shape at a
              glance, and (if free) gets the upgrade pitch right at peak insight. */}
          {(() => {
            const radarScores: Record<string, number> = {
              Communication: Math.max(0, Math.min(100, feedback.communicationScore * 10)),
              Reasoning: Math.max(0, Math.min(100, feedback.reasoningScore * 10)),
              Global: Math.max(0, Math.min(100, feedback.globalScore * 10)),
            };
            const entries = Object.entries(radarScores);
            const lowest = entries.reduce(
              (acc, cur) => (cur[1] < acc[1] ? cur : acc),
              entries[0]
            );
            const lowestAxis = lowest[0];
            const lowestScore = Math.round(lowest[1]);
            return (
              <section className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5 shadow-sm md:p-6">
                <header className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                    AI Diagnostic Report
                  </p>
                  <h2 className="mt-0.5 text-lg font-semibold text-gray-900">
                    Your performance shape
                  </h2>
                </header>
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex w-full justify-center md:w-auto md:flex-shrink-0">
                    <RoleplayDiagnosticRadar scores={radarScores} />
                  </div>
                  <div className="w-full md:flex-1 md:pl-2">
                    {planTier === "paid" ? (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <p className="text-sm font-semibold text-emerald-900">
                          ✓ Pro member — your weak areas are queued for practice
                        </p>
                        <p className="mt-1.5 text-xs text-emerald-800">
                          Spaced-repetition cards for <strong>{lowestAxis}</strong> ({lowestScore}%) will surface in your next session.
                        </p>
                      </div>
                    ) : planTier === "free" ? (
                      <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Unlock spaced repetition
                        </h3>
                        <p className="mt-1.5 text-xs text-gray-600">
                          Your weakest axis is <strong>{lowestAxis}</strong> at {lowestScore}%.
                          Pro members get a personalised practice queue that targets exactly this.
                        </p>
                        <Link
                          href="/dashboard/billing"
                          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-brand-700"
                        >
                          Upgrade to Pro — A$19/mo →
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            );
          })()}

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
            <button
              type="button"
              onClick={() => setShowTranscript((s) => !s)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {showTranscript ? "Hide transcript" : `View transcript (${transcript.length} turns)`}
            </button>
          </div>

          {/* Daily-limit upgrade banner — only shows after a 429 from
              /api/ai-roleplay/generate (i.e. user clicked "Retry similar"
              or "New random" but already used today's quota). Without this
              the buttons silently fail because the existing error block
              upstream only renders before feedback loads. */}
          {limitInfo && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    You've used your free Solo RolePlay for today
                    {limitInfo.dailyLimit != null && limitInfo.dailyLimit > 0
                      ? ` (${Math.min(limitInfo.used, limitInfo.dailyLimit)} / ${limitInfo.dailyLimit})`
                      : ""}
                    .
                  </p>
                  <p className="mt-1 text-xs text-amber-800">
                    Upgrade to Pro for unlimited Solo RolePlay sessions and spaced-repetition for your weak areas.
                  </p>
                </div>
                <Link
                  href="/dashboard/billing"
                  className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700"
                >
                  Upgrade to Pro — A$19/mo →
                </Link>
              </div>
            </section>
          )}

          {/* Generic error banner for any non-429 failure (e.g. AI service
              down, network error). Without this any error from regenerate()
              after feedback has loaded is invisible — the upstream loading/
              error block only renders before feedback exists. */}
          {error && !limitInfo && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              ⚠️ {error}
            </p>
          )}

          {showTranscript && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">📜 Session transcript</h2>
              {transcript.length === 0 ? (
                <p className="mt-3 text-xs text-gray-500">No messages were recorded for this session.</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {transcript.map((m) => (
                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-1.5 text-xs ${
                          m.role === "user"
                            ? "rounded-br-sm bg-brand-600 text-white"
                            : "rounded-bl-sm border border-gray-200 bg-gray-50 text-gray-800"
                        }`}
                      >
                        <span className="block text-[9px] uppercase tracking-wide opacity-60">
                          {m.role === "user" ? "Doctor" : patientName}
                        </span>
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
