"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Step = {
  step: number;
  type: string;
  title: string;
  content: string;
  model_answer?: string;
};

type CaseData = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  estimated_minutes: number;
  amc_exam_type: string;
  steps: Step[];
};

const STEP_TYPE_COLORS: Record<string, string> = {
  presentation: "bg-blue-100 text-blue-700",
  history: "bg-purple-100 text-purple-700",
  examination: "bg-indigo-100 text-indigo-700",
  investigations: "bg-yellow-100 text-yellow-700",
  management: "bg-orange-100 text-orange-700",
  debrief: "bg-green-100 text-green-700",
};

export default function CasePlayer({
  caseData,
  userId,
  initialStep,
  initialCompleted,
}: {
  caseData: CaseData;
  userId: string | null;
  initialStep: number;
  initialCompleted: boolean;
}) {
  const steps: Step[] = caseData.steps;
  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialCompleted ? steps.length - 1 : Math.min(initialStep - 1, steps.length - 1)
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [showModelAnswer, setShowModelAnswer] = useState(initialCompleted);
  const [completed, setCompleted] = useState(initialCompleted);
  const [saving, setSaving] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isManagementStep = currentStep?.type === "management";

  async function saveProgress(stepNumber: number, isCompleted: boolean) {
    if (!userId) return;
    const supabase = createClient();
    await supabase.from("user_case_progress").upsert(
      {
        user_id: userId,
        case_id: caseData.id,
        current_step: stepNumber,
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,case_id" }
    );
  }

  async function handleContinue() {
    if (isLastStep) return;
    setSaving(true);
    const nextIndex = currentStepIndex + 1;
    const nextStepNumber = nextIndex + 1;
    const isNowComplete = nextIndex === steps.length - 1;
    await saveProgress(nextStepNumber, isNowComplete);
    setCurrentStepIndex(nextIndex);
    setShowModelAnswer(false);
    setUserAnswer("");
    setSaving(false);
    if (isNowComplete) setCompleted(true);
  }

  async function handleSubmitAnswer() {
    setShowModelAnswer(true);
    setSaving(true);
    await saveProgress(currentStepIndex + 1, false);
    setSaving(false);
  }

  async function handleCompleteCase() {
    setSaving(true);
    await saveProgress(steps.length, true);
    setCompleted(true);
    setSaving(false);
  }

  if (completed && isLastStep) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Case Complete!</h1>
        <p className="text-gray-500 mb-2">{caseData.title}</p>
        <p className="text-sm text-gray-400 mb-8">
          {userId ? "Your progress has been saved." : "Log in to track your progress."}
        </p>

        {/* Show debrief */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-left mb-8">
          <h2 className="text-base font-semibold text-green-800 mb-3 flex items-center gap-2">
            <span>📋</span> {currentStep.title}
          </h2>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{currentStep.content}</p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard/cases"
            className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            ← All Cases
          </Link>
          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setCompleted(false);
              setShowModelAnswer(false);
              setUserAnswer("");
            }}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
          >
            Review from Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back + header */}
      <Link
        href="/dashboard/cases"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6 transition"
      >
        ← All Cases
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            caseData.difficulty === "Easy" ? "bg-green-100 text-green-700" :
            caseData.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          }`}>
            {caseData.difficulty}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 font-medium">
            {caseData.amc_exam_type}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            ~{caseData.estimated_minutes} min
          </span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{caseData.title}</h1>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <button
            key={s.step}
            onClick={() => i <= currentStepIndex && setCurrentStepIndex(i)}
            disabled={i > currentStepIndex}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition ${
              i === currentStepIndex
                ? "bg-brand-600 text-white"
                : i < currentStepIndex
                ? "bg-brand-100 text-brand-700 cursor-pointer hover:bg-brand-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {s.step}. {s.title}
          </button>
        ))}
      </div>

      {/* Current step card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STEP_TYPE_COLORS[currentStep.type] ?? "bg-gray-100 text-gray-600"}`}>
            {currentStep.type}
          </span>
          <h2 className="text-base font-semibold text-gray-900">{currentStep.title}</h2>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{currentStep.content}</p>
      </div>

      {/* Management step: free-text input */}
      {isManagementStep && !showModelAnswer && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Management Plan
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            rows={6}
            placeholder="Write your management plan here..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
          <button
            onClick={handleSubmitAnswer}
            disabled={!userAnswer.trim() || saving}
            className="mt-2 px-4 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition disabled:opacity-50"
          >
            Submit & See Model Answer
          </button>
        </div>
      )}

      {/* Model answer reveal */}
      {isManagementStep && showModelAnswer && currentStep.model_answer && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4">
          <h3 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-1">
            <span>✅</span> Model Answer
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {currentStep.model_answer}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentStepIndex((i) => Math.max(0, i - 1))}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-30"
        >
          ← Previous
        </button>

        {isLastStep ? (
          <button
            onClick={handleCompleteCase}
            disabled={saving || completed}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
          >
            {completed ? "Completed ✓" : saving ? "Saving..." : "Complete Case 🎉"}
          </button>
        ) : isManagementStep && !showModelAnswer ? null : (
          <button
            onClick={handleContinue}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Continue →"}
          </button>
        )}
      </div>
    </div>
  );
}
