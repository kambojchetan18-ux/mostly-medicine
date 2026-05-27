"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 border border-teal-500/30">
        <svg
          className="h-8 w-8 text-teal-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-slate-100 mb-2">
        Something went wrong
      </h2>

      {/* Message */}
      <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
        An unexpected error occurred while loading this page. Please try again,
        or contact support at{" "}
        <a
          href="mailto:support@mostlymedicine.com"
          className="text-teal-400 hover:text-teal-300 underline underline-offset-2"
        >
          support@mostlymedicine.com
        </a>{" "}
        if the issue persists.
      </p>

      {/* Try Again button */}
      <button
        onClick={reset}
        className="rounded-xl bg-gradient-to-r from-teal-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition-all duration-200 hover:from-teal-400 hover:to-purple-400 hover:shadow-teal-500/30 active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}
