"use client";

import Link from "next/link";

type Case = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  estimated_minutes: number;
  amc_exam_type: string;
};

type Progress = {
  current_step: number;
  completed: boolean;
};

const CATEGORIES = [
  {
    id: "Hospital & Emergency",
    label: "Hospital & Emergency",
    icon: "🏥",
    description: "Acute presentations, ED management, inpatient care",
  },
  {
    id: "Ethics & Communication",
    label: "Ethics & Communication",
    icon: "🤝",
    description: "Consent, capacity, breaking bad news, difficult conversations",
  },
  {
    id: "Procedural & Clinical Skills",
    label: "Procedural & Clinical Skills",
    icon: "🩺",
    description: "ECG interpretation, clinical reasoning, procedural knowledge",
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

export default function CasesClient({
  cases,
  progressMap,
  isAuthenticated,
}: {
  cases: Case[];
  progressMap: Record<string, Progress>;
  isAuthenticated: boolean;
}) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Case-Based Learning</h1>
        <p className="text-sm text-gray-500 mt-1">
          Practice clinical reasoning with step-by-step AMC-style cases
        </p>
      </div>

      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-brand-50 border border-brand-200 rounded-xl text-sm text-brand-700">
          <Link href="/auth/login" className="font-medium underline">Log in</Link> to track your progress across cases.
        </div>
      )}

      <div className="space-y-10">
        {CATEGORIES.map((cat) => {
          const categoryCases = cases.filter((c) => c.category === cat.id);
          return (
            <section key={cat.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{cat.label}</h2>
                  <p className="text-xs text-gray-500">{cat.description}</p>
                </div>
              </div>

              {categoryCases.length === 0 ? (
                <p className="text-sm text-gray-400 pl-10">No cases yet — coming soon.</p>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {categoryCases.map((c) => {
                    const progress = progressMap[c.id];
                    const isCompleted = progress?.completed;
                    const isInProgress = progress && !progress.completed;

                    return (
                      <div
                        key={c.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug flex-1">
                            {c.title}
                          </h3>
                          {isCompleted && (
                            <span className="text-green-500 text-lg shrink-0" title="Completed">✓</span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {c.difficulty && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[c.difficulty] ?? ""}`}>
                              {c.difficulty}
                            </span>
                          )}
                          {c.amc_exam_type && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-medium">
                              {c.amc_exam_type}
                            </span>
                          )}
                          {c.estimated_minutes && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              ~{c.estimated_minutes} min
                            </span>
                          )}
                        </div>

                        {isInProgress && (
                          <p className="text-xs text-brand-600 font-medium">
                            In progress — step {progress.current_step}
                          </p>
                        )}

                        <Link
                          href={`/dashboard/cases/${c.id}`}
                          className="mt-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
                        >
                          {isCompleted ? "Review Case" : isInProgress ? "Continue" : "Start Case"}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
