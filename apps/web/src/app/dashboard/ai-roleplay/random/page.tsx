"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Server-side redirect would also work, but the generate route is a POST
// behind the user's session — running it client-side keeps cookies attached
// and surfaces errors inline rather than via a generic Next error page.

export default function RandomCasePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ai-roleplay/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ random: true }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Could not generate a case");
        if (!cancelled) router.replace(`/dashboard/ai-roleplay/${json.caseId}`);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not generate a case");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      {error ? (
        <>
          <p className="text-sm text-rose-600">⚠️ {error}</p>
          <Link
            href="/dashboard/ai-roleplay"
            className="mt-4 inline-block text-sm text-brand-600 underline"
          >
            Back to AI Clinical RolePlay
          </Link>
        </>
      ) : (
        <>
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          <p className="mt-4 text-sm text-gray-600">Generating a fresh case…</p>
        </>
      )}
    </div>
  );
}
