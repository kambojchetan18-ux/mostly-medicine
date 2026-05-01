"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-card p-8 text-center">
        <span className="text-4xl block mb-4">🔧</span>
        <h2 className="font-display font-bold text-xl text-gray-900 mb-2">
          Something went wrong in the admin panel
        </h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          An unexpected error occurred while loading admin tools. You can try
          again or return to the dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto text-sm font-semibold text-slate-500 hover:text-slate-700 px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
