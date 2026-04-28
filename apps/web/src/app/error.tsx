"use client";

// Root error boundary — overrides the auto-generated /500 page that was
// breaking the production build with a useContext-null error during
// prerender. Pure client component, no hooks/context, so build succeeds.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        We hit an unexpected error. Try again, or head back to the dashboard.
      </p>
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700"
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
