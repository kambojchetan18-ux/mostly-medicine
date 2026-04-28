import Link from "next/link";

// Static 404 — pure JSX, no hooks/context, so it can be prerendered without
// pulling in client components that broke the auto-generated /404.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-sm text-gray-600">This page doesn&apos;t exist.</p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
