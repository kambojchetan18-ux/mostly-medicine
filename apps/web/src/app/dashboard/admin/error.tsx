"use client";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-lg mx-auto py-16 text-center">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Error</h2>
      <p className="text-gray-500 text-sm mb-6">
        {error.message || "Something went wrong loading the admin panel."}
      </p>
      <div className="flex gap-2 justify-center">
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
