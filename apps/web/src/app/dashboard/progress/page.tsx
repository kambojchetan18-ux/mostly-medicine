"use client";

import { useEffect, useState } from "react";

interface TopicStat {
  topic: string;
  attempted: number;
  correct: number;
  accuracy: number;
  lastAttempted: string;
}

interface ProgressData {
  topics: TopicStat[];
  weakTopics: { topic: string; accuracy: number; attempted: number }[];
  streak: { current: number; longest: number; lastStudy: string | null };
  dueCount: number;
  totalAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cat1/progress")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.totalAttempted === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No progress yet</h2>
        <p className="text-gray-500 text-sm mb-6">Complete a CAT 1 quiz to start tracking your progress and weak areas.</p>
        <a
          href="/dashboard/cat1"
          className="inline-block bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition text-sm"
        >
          Start Practising →
        </a>
      </div>
    );
  }

  const accuracyColor = (pct: number) =>
    pct >= 75 ? "text-green-600" : pct >= 55 ? "text-yellow-600" : "text-red-600";

  const barColor = (pct: number) =>
    pct >= 75 ? "bg-green-500" : pct >= 55 ? "bg-yellow-400" : "bg-red-400";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">My Progress</h2>
        <p className="text-gray-500 text-sm">Track your CAT 1 performance and spaced repetition schedule.</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-brand-600 mb-1">{data.totalAttempted}</p>
          <p className="text-xs text-gray-500">Questions Attempted</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <p className={`text-3xl font-bold mb-1 ${accuracyColor(data.overallAccuracy)}`}>
            {data.overallAccuracy}%
          </p>
          <p className="text-xs text-gray-500">Overall Accuracy</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-500 mb-1">🔥 {data.streak.current}</p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-600 mb-1">{data.dueCount}</p>
          <p className="text-xs text-gray-500">Cards Due Today</p>
        </div>
      </div>

      {/* Due cards CTA */}
      {data.dueCount > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-brand-800 text-sm">
              🧠 {data.dueCount} question{data.dueCount > 1 ? "s" : ""} due for review
            </p>
            <p className="text-xs text-brand-600 mt-0.5">Spaced repetition keeps your memory sharp</p>
          </div>
          <a
            href="/dashboard/cat1"
            className="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-700 transition whitespace-nowrap"
          >
            Review Now →
          </a>
        </div>
      )}

      {/* Weak areas */}
      {data.weakTopics.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
          <p className="font-semibold text-red-800 text-sm mb-3">⚠️ Weak Areas — Focus Here</p>
          <div className="space-y-3">
            {data.weakTopics.map((t) => (
              <div key={t.topic} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{t.topic}</span>
                    <span className="text-red-600 font-semibold">{t.accuracy}%</span>
                  </div>
                  <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-1.5 bg-red-400 rounded-full" style={{ width: `${t.accuracy}%` }} />
                  </div>
                </div>
                <a
                  href="/dashboard/cat1"
                  className="text-xs text-red-700 font-semibold border border-red-300 px-3 py-1 rounded-lg hover:bg-red-100 transition whitespace-nowrap"
                >
                  Practise
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All topics */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">All Topics</p>
        </div>
        <div className="divide-y divide-gray-50">
          {data.topics.map((t) => (
            <div key={t.topic} className="px-5 py-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-800">{t.topic}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{t.correct}/{t.attempted} correct</span>
                  <span className={`text-sm font-bold ${accuracyColor(t.accuracy)}`}>{t.accuracy}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all ${barColor(t.accuracy)}`}
                  style={{ width: `${t.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Longest streak: {data.streak.longest} days &nbsp;·&nbsp; Last study: {data.streak.lastStudy ?? "never"}
        </p>
      </div>
    </div>
  );
}
