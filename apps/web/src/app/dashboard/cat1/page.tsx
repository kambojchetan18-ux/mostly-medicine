"use client";

import { useState, useMemo } from "react";
import { seedQuestions } from "@mostly-medicine/content";
import type { MCQuestion } from "@mostly-medicine/content";

const topics = [...new Set(seedQuestions.map((q) => q.topic))];

type Mode = "menu" | "quiz" | "result";

export default function CAT1Page() {
  const [mode, setMode] = useState<Mode>("menu");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MCQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<{ id: string; correct: boolean }[]>([]);

  function startQuiz(topic: string | null) {
    const pool = topic
      ? seedQuestions.filter((q) => q.topic === topic)
      : [...seedQuestions].sort(() => Math.random() - 0.5).slice(0, 20);
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

  function handleNext() {
    if (!selected) return;
    const q = questions[current];
    setAnswers((prev) => [...prev, { id: q.id, correct: selected === q.correctAnswer }]);
    if (current + 1 >= questions.length) {
      setMode("result");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
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

  const topicCounts = useMemo(() =>
    Object.fromEntries(topics.map((t) => [t, seedQuestions.filter((q) => q.topic === t).length])),
    []
  );

  if (mode === "menu") {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">AMC CAT 1 — MCQ Practice</h2>
        <p className="text-gray-500 text-sm mb-6">
          Select a topic or start a quick quiz. Questions follow AMC exam blueprint.
        </p>

        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => startQuiz(null)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
          >
            Quick Quiz (20 random questions)
          </button>
          <button
            onClick={() => startQuiz(null)}
            className="border border-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            All Questions ({seedQuestions.length} total)
          </button>
        </div>

        <h3 className="font-semibold text-gray-700 mb-3">Practice by Topic</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => startQuiz(topic)}
              className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-brand-400 hover:bg-brand-50 transition"
            >
              <p className="font-medium text-gray-800 text-sm">{topic}</p>
              <p className="text-xs text-gray-400 mt-1">{topicCounts[topic]} questions</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === "result") {
    const score = answers.filter((a) => a.correct).length;
    const pct = Math.round((score / answers.length) * 100);
    return (
      <div className="max-w-xl mx-auto text-center py-10">
        <div className="text-5xl mb-4">{pct >= 70 ? "🎉" : "📖"}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Quiz Complete</h2>
        <p className="text-gray-500 mb-6">{selectedTopic ?? "Mixed topics"}</p>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
          <p className="text-5xl font-bold text-brand-600 mb-1">{score}/{answers.length}</p>
          <p className="text-gray-500">{pct}% correct</p>
          <p className="text-sm mt-3 text-gray-400">
            {pct >= 80 ? "Excellent! Keep it up." : pct >= 60 ? "Good effort. Review the topics you missed." : "Keep practising — review the explanations carefully."}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => startQuiz(selectedTopic)}
            className="bg-brand-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-brand-700 transition"
          >
            Retry
          </button>
          <button
            onClick={reset}
            className="border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const isCorrect = selected === q.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          Question {current + 1} of {questions.length}
          {selectedTopic && <span className="ml-2 text-brand-600">· {selectedTopic}</span>}
        </p>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">
          Exit Quiz
        </button>
      </div>
      <div className="h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="h-2 bg-brand-500 rounded-full transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
        <div className="flex gap-2 mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            q.difficulty === "easy" ? "bg-green-100 text-green-700"
            : q.difficulty === "medium" ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
          }`}>
            {q.difficulty}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{q.subtopic}</span>
        </div>
        <p className="text-gray-800 text-sm leading-relaxed">{q.stem}</p>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {q.options.map((opt) => {
          let style = "bg-white border border-gray-200 text-gray-800 hover:border-brand-400 hover:bg-brand-50";
          if (revealed) {
            if (opt.label === q.correctAnswer) style = "bg-green-50 border-green-500 text-green-800";
            else if (opt.label === selected) style = "bg-red-50 border-red-400 text-red-800";
            else style = "bg-white border border-gray-200 text-gray-400";
          } else if (opt.label === selected) {
            style = "bg-brand-50 border-brand-500 text-brand-800";
          }
          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label)}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm transition border ${style}`}
            >
              <span className="font-semibold mr-2">{opt.label}.</span>
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className={`rounded-xl p-4 mb-4 text-sm ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <p className="font-semibold mb-1">{isCorrect ? "✓ Correct!" : `✗ Incorrect — Answer: ${q.correctAnswer}`}</p>
          <p className="text-gray-700">{q.explanation}</p>
          <p className="text-xs text-gray-400 mt-2">Reference: {q.reference}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={!selected}
            className="flex-1 bg-brand-600 text-white font-semibold py-2 rounded-xl hover:bg-brand-700 transition disabled:opacity-40"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 bg-brand-600 text-white font-semibold py-2 rounded-xl hover:bg-brand-700 transition"
          >
            {current + 1 >= questions.length ? "See Results" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
