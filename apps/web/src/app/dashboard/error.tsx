"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="text-5xl">⚠️</div>
      <h2 className="mt-4 text-xl font-bold text-slate-100">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        An error occurred while loading this page. Your data is safe — try
        refreshing or navigate to another section.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700"
        >
          Try again
        </button>
        <a
          href="/dashboard"
          className="rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
