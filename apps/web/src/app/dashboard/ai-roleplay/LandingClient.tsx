"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import FunLoading from "@/components/FunLoading";
import RoleplayModeTabs from "@/components/RoleplayModeTabs";
import { features } from "@/config/features";

interface LimitInfo {
  plan: "free" | "pro" | "enterprise";
  dailyLimit: number | null;
  used: number;
}

export interface BlueprintRow {
  id: string;
  slug: string;
  family_name: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  presentation_cluster: string[];
  candidate_tasks: string[];
}

export interface RecentAttempt {
  id: string;
  caseId: string;
  status: string;
  globalScore: number | null;
  createdAt: string;
  candidateTask: string;
  setting: string;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  hard: "bg-rose-100 text-rose-700 border-rose-200",
};

const CATEGORY_ICONS: Record<string, string> = {
  "Endocrine & Metabolic": "🧪",
  "Infectious Diseases": "🦠",
  "Respiratory & Sleep": "🌬️",
  "Hematology & Oncology": "🩸",
  "General Medicine Symptoms": "🩺",
  "Emergency Presentations": "🚑",
  "Travel & Sexual Health": "✈️",
  "Renal & Urinary": "💧",
};

export default function LandingClient({
  blueprints,
  recent,
  isAuthenticated,
}: {
  blueprints: BlueprintRow[];
  recent: RecentAttempt[];
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(null);
  const [diffFilter, setDiffFilter] = useState<"all" | "easy" | "medium" | "hard">("all");

  // If the user was redirected here from /play with ?gate=daily_limit, surface
  // the upgrade banner so they understand why they were sent back.
  useEffect(() => {
    const gate = searchParams?.get("gate");
    if (gate === "daily_limit") {
      setLimitInfo({ plan: "free", dailyLimit: null, used: 0 });
    } else if (gate === "plan_locked") {
      setError("Your plan does not include AMC Clinical AI RolePlay. Upgrade to continue.");
    }
  }, [searchParams]);

  const filteredByDifficulty = useMemo(
    () => (diffFilter === "all" ? blueprints : blueprints.filter((b) => b.difficulty === diffFilter)),
    [blueprints, diffFilter]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, BlueprintRow[]>();
    for (const bp of filteredByDifficulty) {
      const list = map.get(bp.category) ?? [];
      list.push(bp);
      map.set(bp.category, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredByDifficulty]);

  async function generate(payload: Record<string, unknown>) {
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
          plan: json.plan ?? "free",
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

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Clinical RolePlay</h1>
        <p className="mt-2 text-sm text-gray-600">
          Please <Link href="/auth/login" className="text-saffron-700 underline">log in</Link> to start a roleplay session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Mode switcher — Handbook vs Beyond Handbook */}
      <RoleplayModeTabs active="beyond" />

      {/* Hero */}
      <section className="rounded-3xl border-2 border-saffron-400 bg-gradient-to-br from-saffron-50 via-cream-50 to-cream-50 p-6 sm:p-8 shadow-[0_24px_48px_-24px_rgba(232,146,22,0.4)]">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
          Clinical RolePlay
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-900/75 sm:text-base">
          Beyond Handbook — unlimited AI-generated cases. Original AMC-style practice cases inspired by broader
          clinical patterns. 2 minutes reading, 8 minutes interaction, structured feedback.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => generate({ random: true })}
            className="inline-flex items-center gap-2 rounded-full bg-saffron-500 px-6 py-3 text-sm font-bold text-ink-950 shadow-[0_8px_24px_-8px_rgba(232,146,22,0.5)] transition-all hover:-translate-y-0.5 hover:bg-saffron-400 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {pending ? (
              <FunLoading
                pool={[
                  "🎲 Spinning up a fresh case…",
                  "🩺 Picking a tricky one for you…",
                  "📋 Drafting a stem…",
                  "🧠 Loading the patient's mind…",
                ]}
              />
            ) : (
              "🎲 Random Case"
            )}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">⚠️ {error}</p>}
      </section>

      {/* Daily-limit upgrade banner — shown when /generate or /play returned a
          429. Hidden during beta because no free/paid split exists. */}
      {limitInfo && features.paidTiersEnabled && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
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
                Pro members get unlimited Solo RolePlay sessions, spaced-repetition for weak areas, and priority support.
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700"
            >
              Upgrade to Pro — A$29/mo →
            </Link>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500">Difficulty:</span>
        {(["all", "easy", "medium", "hard"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDiffFilter(d)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
              diffFilter === d
                ? "border-saffron-500 bg-saffron-500 text-ink-950"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {d}
          </button>
        ))}
      </section>

      {/* Recent attempts */}
      {recent.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900">Recent attempts</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/ai-roleplay/${r.caseId}`}
                className="rounded-xl border border-gray-200 bg-white p-3 text-sm shadow-sm hover:border-saffron-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{r.candidateTask}</span>
                  {r.globalScore !== null && (
                    <span className="rounded-full bg-saffron-100 px-2 py-0.5 text-xs font-semibold text-saffron-700">
                      {r.globalScore}/10
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">{r.setting}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">{r.status}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category grid */}
      {grouped.length === 0 ? (
        <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-600">
            No blueprints yet. Run <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs">acrp-ingest</code> and{" "}
            <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs">acrp-blueprints</code> to populate cases.
          </p>
        </section>
      ) : (
        grouped.map(([category, list]) => (
          <section key={category}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">{CATEGORY_ICONS[category] ?? "📋"}</span>
              <h2 className="text-base font-semibold text-gray-900">{category}</h2>
              <span className="text-xs text-gray-400">({list.length})</span>
              <button
                type="button"
                onClick={() => generate({ category })}
                disabled={pending}
                className="ml-auto text-xs font-medium text-saffron-700 hover:text-saffron-800 disabled:opacity-60"
              >
                Random in this category →
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((bp) => (
                <button
                  key={bp.id}
                  type="button"
                  disabled={pending}
                  onClick={() => generate({ blueprintId: bp.id })}
                  className="group rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-saffron-300 hover:shadow disabled:cursor-wait disabled:opacity-60"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-saffron-700">
                      {bp.family_name}
                    </h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        DIFFICULTY_STYLES[bp.difficulty] ?? ""
                      }`}
                    >
                      {bp.difficulty}
                    </span>
                  </div>
                  {bp.presentation_cluster.length > 0 && (
                    <p className="mt-2 line-clamp-2 text-xs text-gray-600">
                      {bp.presentation_cluster.slice(0, 4).join(" · ")}
                    </p>
                  )}
                  {bp.candidate_tasks.length > 0 && (
                    <p className="mt-2 text-[11px] uppercase tracking-wide text-gray-400">
                      {bp.candidate_tasks[0]}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
