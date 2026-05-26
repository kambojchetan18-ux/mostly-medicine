"use client";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-700"
        >
          Try again
        </button>
        <a
          href="/dashboard"
          className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
