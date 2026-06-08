"use client";

import { useEffect, useState } from "react";

interface DayBucket {
  date: string;
  count: number;
}
interface Stats {
  dueCount: number;
  totalCards: number;
  matureCards: number;
  currentStreak: number;
  longestStreak: number;
  studiedToday: boolean;
  reviewsByDay: DayBucket[];
}

// GitHub-style intensity scale tuned for medical SRS volumes — a Free
// user maxes out at 5 reviews / day, so the mid-bucket sits at 3+; the
// dark bucket only lights up for Pro users doing a real session.
function colorForCount(count: number): string {
  if (count === 0) return "bg-gray-100";
  if (count <= 2) return "bg-emerald-200";
  if (count <= 5) return "bg-emerald-300";
  if (count <= 12) return "bg-emerald-500";
  return "bg-emerald-700";
}

// Group the linear 90-day bucket list into weeks (columns). We anchor
// the right-most column to today and let the left-most column carry the
// partial week at the start of the window.
function chunkIntoWeeks(days: DayBucket[]): DayBucket[][] {
  if (days.length === 0) return [];
  const weeks: DayBucket[][] = [];
  const todayDow = new Date(days[days.length - 1].date + "T00:00:00Z").getUTCDay();
  // We'll right-pad the last week so today sits in its true day-of-week
  // row. Leading padding goes on the first week, with placeholder cells.
  const lastWeekLen = todayDow + 1; // 0 (Sun) → 1, 6 (Sat) → 7
  const fullStart = days.length - lastWeekLen;
  if (fullStart > 0) {
    // Pad the first column with up to 6 leading invisible cells so the
    // grid aligns to weekdays.
    const firstChunk = days.slice(0, fullStart % 7 || 7);
    weeks.push(firstChunk);
    let i = firstChunk.length;
    while (i < fullStart) {
      weeks.push(days.slice(i, i + 7));
      i += 7;
    }
  }
  weeks.push(days.slice(Math.max(0, fullStart)));
  return weeks;
}

export default function StatsHeader() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/flashcards/stats")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.error) {
          setError(d.error);
        } else {
          setStats(d);
        }
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "stats failed"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mb-6 h-24 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
    );
  }
  if (error || !stats) {
    return null; // Fail soft — stats are decorative; the deck list still works.
  }

  const weeks = chunkIntoWeeks(stats.reviewsByDay);
  const totalReviews90 = stats.reviewsByDay.reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Due today</p>
          <p className="mt-0.5 text-3xl font-bold text-gray-900 tabular-nums">{stats.dueCount}</p>
        </div>
        <div className="h-10 w-px bg-gray-200" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Streak</p>
          <p className="mt-0.5 text-3xl font-bold text-gray-900 tabular-nums">
            {stats.currentStreak}
            <span className="ml-1 text-sm font-normal text-gray-500">days</span>
          </p>
          {stats.longestStreak > stats.currentStreak && (
            <p className="text-[10px] text-gray-400">Longest: {stats.longestStreak} days</p>
          )}
        </div>
        <div className="h-10 w-px bg-gray-200" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Library</p>
          <p className="mt-0.5 text-sm text-gray-700 tabular-nums">
            <strong className="text-base text-gray-900">{stats.totalCards}</strong> seen ·{" "}
            <strong className="text-base text-gray-900">{stats.matureCards}</strong> mature
          </p>
        </div>
        <div className="ml-auto hidden sm:block">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Last 90 days · {totalReviews90} reviews
          </p>
          <div className="flex gap-0.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`h-2.5 w-2.5 rounded-sm ${colorForCount(day.count)}`}
                    title={`${day.date} · ${day.count} review${day.count === 1 ? "" : "s"}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {!stats.studiedToday && stats.totalCards > 0 && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          🔥 You haven&rsquo;t reviewed today — keep the streak alive by knocking out a few cards.
        </p>
      )}
    </div>
  );
}
