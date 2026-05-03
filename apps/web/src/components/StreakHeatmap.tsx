"use client";

import { useEffect, useState } from "react";

/**
 * StreakHeatmap — GitHub-contribution-style 7×12 grid of MCQ activity for
 * the last 84 days. Fetches /api/streaks/heatmap on mount.
 *
 * Visualising the streak is the daily-return dopamine loop from the
 * growth blueprint (slide 8). Component is intentionally additive — it
 * does not gate any other dashboard rendering and degrades quietly to a
 * skeleton on fetch failure.
 */

type Day = { date: string; count: number };

const ROWS = 7;
const COLS = 12;
const TOTAL = ROWS * COLS; // 84

function intensity(count: number): string {
  if (count <= 0) return "bg-slate-100";
  if (count <= 2) return "bg-emerald-200";
  if (count <= 5) return "bg-emerald-400";
  if (count <= 10) return "bg-emerald-600";
  return "bg-emerald-800";
}

const LEGEND_STEPS = [
  "bg-slate-100",
  "bg-emerald-200",
  "bg-emerald-400",
  "bg-emerald-600",
  "bg-emerald-800",
];

const DAY_LABELS = ["Mon", "Wed", "Fri"]; // sparse labels — Mon/Wed/Fri rows

export default function StreakHeatmap() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/streaks/heatmap")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((j: { days: Day[] }) => {
        if (cancelled) return;
        setDays(j.days);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Skeleton: empty grid while loading, or on error.
  const grid: Day[] =
    days ??
    Array.from({ length: TOTAL }).map(() => ({ date: "", count: 0 }));

  const totalAttempts = days?.reduce((sum, d) => sum + d.count, 0) ?? 0;
  const activeDays = days?.filter((d) => d.count > 0).length ?? 0;
  const isEmpty = days !== null && totalAttempts === 0;

  // Layout the grid column-by-column so visual reading order is
  // weeks-ascending left → right, days-of-week top → bottom.
  // The data array is oldest-first, length 84 = 12 weeks × 7 days.
  const columns: Day[][] = [];
  for (let c = 0; c < COLS; c++) {
    const col: Day[] = [];
    for (let r = 0; r < ROWS; r++) {
      col.push(grid[c * ROWS + r] ?? { date: "", count: 0 });
    }
    columns.push(col);
  }

  return (
    <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 p-5 sm:p-6 shadow-card">
      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 mb-1">
            Streak Heatmap
          </p>
          <h3 className="font-display text-lg font-bold text-gray-900 leading-tight">
            Last 12 weeks
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {error
              ? "Could not load activity — try refreshing."
              : isEmpty
              ? "Start your streak today — answer your first MCQ."
              : days === null
              ? "Loading your activity…"
              : `${activeDays} active ${activeDays === 1 ? "day" : "days"} · ${totalAttempts} MCQ${totalAttempts === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Day-of-week labels — sparse, aligned with rows 1/3/5 (Mon/Wed/Fri) */}
        <div
          className="hidden sm:flex flex-col text-[9px] text-slate-400 font-semibold pt-0.5"
          style={{ gap: "3px" }}
          aria-hidden
        >
          {Array.from({ length: ROWS }).map((_, r) => (
            <div
              key={r}
              className="h-3 leading-3 flex items-center"
              style={{ height: "12px" }}
            >
              {r === 0
                ? DAY_LABELS[0]
                : r === 2
                ? DAY_LABELS[1]
                : r === 4
                ? DAY_LABELS[2]
                : ""}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] overflow-x-auto">
          {columns.map((col, c) => (
            <div key={c} className="flex flex-col gap-[3px]">
              {col.map((day, r) => {
                const cls = intensity(day.count);
                const label = day.date
                  ? `${day.date} · ${day.count} MCQ${day.count === 1 ? "" : "s"}`
                  : "";
                return (
                  <div
                    key={`${c}-${r}`}
                    title={label}
                    className={`w-3 h-3 rounded-sm ${cls} ${
                      day.count > 0
                        ? "ring-1 ring-inset ring-black/5"
                        : ""
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-[10px] font-semibold text-slate-400">
        <span>Less</span>
        <div className="flex gap-[3px]">
          {LEGEND_STEPS.map((cls) => (
            <div
              key={cls}
              className={`w-3 h-3 rounded-sm ${cls} ring-1 ring-inset ring-black/5`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </section>
  );
}
