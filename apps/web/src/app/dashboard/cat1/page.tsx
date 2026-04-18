"use client";

import { useState, useMemo, useCallback } from "react";
import { allQuestions } from "@mostly-medicine/content";
import type { MCQuestion } from "@mostly-medicine/content";

const topics = [...new Set(allQuestions.map((q) => q.topic))].sort();

type Mode = "menu" | "quiz" | "result";

async function saveAttempt(questionId: string, correct: boolean, topic: string) {
  try {
    await fetch("/api/cat1/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, correct, topic }),
    });
  } catch {
    // silently fail — offline or unauthenticated
  }
}

export default function CAT1Page() {
  const [mode, setMode] = useState<Mode>("menu");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MCQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<{ id: string; correct: boolean; topic: string }[]>([]);

  const topicCounts = useMemo(
    () => Object.fromEntries(topics.map((t) => [t, allQuestions.filter((q) => q.topic === t).length])),
    []
  );

  function startQuiz(topic: string | null, count = 20) {
    const pool = topic
      ? allQuestions.filter((q) => q.topic === topic)
      : [...allQuestions].sort(() => Math.random() - 0.5).slice(0, count);
    setQuestions(pool);
    setSelectedTopic(topic);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setMode("quiz");
  }

  function handleSelect(label: string) {
    if (revealed) return;
    setSelected(label);
  }

  function handleReveal() {
    if (!selected) return;
    setRevealed(true);
  }

  const handleNext = useCallback(async () => {
    if (!selected) return;
    const q = questions[current];
    const correct = selected === q.correctAnswer;

    // Save to DB + update SR card (fire-and-forget)
    saveAttempt(q.id, correct, q.topic);

    const newAnswers = [...answers, { id: q.id, correct, topic: q.topic }];
    setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      setMode("result");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  }, [selected, questions, current, answers]);

  function reset() {
    setMode("menu");
    setSelectedTopic(null);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
  }

  // ── MENU ────────────────────────────────────────────────────────────────────
  if (mode === "menu") {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">AMC CAT 1 — MCQ Practice</h2>
        <p className="text-gray-500 text-sm mb-6">
          3,000+ questions across 14 topics. Your progress is saved and spaced repetition adapts to your weak areas.
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
          <a
            href="/dashboard/progress"
            className="border border-brand-300 text-brand-700 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-brand-50 transition"
          >
            📊 My Progress
          </a>
        </div>

        <h3 className="font-semibold text-gray-700 mb-3">Practice by Topic</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => startQuiz(topic)}
              className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-brand-400 hover:bg-brand-50 transition group"
            >
              <p className="font-medium text-gray-800 text-sm group-hover:text-brand-700">{topic}</p>
              <p className="text-xs text-gray-400 mt-1">{topicCounts[topic]} questions</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── RESULT ──────────────────────────────────────────────────────────────────
  if (mode === "result") {
    const score = answers.filter((a) => a.correct).length;
    const pct = Math.round((score / answers.length) * 100);

    // Topic breakdown
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
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">
          Question {current + 1} of {questions.length}
          {selectedTopic && <span className="ml-2 text-brand-600 font-medium">· {selectedTopic}</span>}
        </p>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">
          Exit
        </button>
      </div>

      <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
        <div
          className="h-1.5 bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
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

      {/* Options */}
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
          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label)}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm transition border ${style}`}
            >
              <span className="font-bold mr-2">{opt.label}.</span>
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className={`rounded-xl p-4 mb-4 text-sm ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <p className="font-semibold mb-1">{isCorrect ? "✓ Correct!" : `✗ Answer: ${q.correctAnswer}`}</p>
          <p className="text-gray-700 leading-relaxed">{q.explanation}</p>
          <p className="text-xs text-gray-400 mt-2">📖 {q.reference}</p>
        </div>
      )}

      {/* Action button */}
      <div className="flex gap-3">
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
  );
}
