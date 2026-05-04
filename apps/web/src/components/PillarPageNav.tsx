import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

/**
 * Shared top nav for public pillar / SEO pages.
 *
 * Logged-in users see a single "Back to dashboard" CTA — they don't need
 * login/signup buttons on a marketing surface. Logged-out users see the
 * standard "Log in" + "Get started" pair. Auth check failures fall back
 * to the logged-out view so a preview build with missing env vars still
 * renders cleanly.
 */
export default async function PillarPageNav() {
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Swallow auth errors — page must still render for anonymous visitors.
  }

  return (
    <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto">
      <Link href="/" className="font-display font-bold text-[1.15rem] tracking-tight">
        <span className="gradient-text">Mostly</span>
        <span className="text-white"> Medicine</span>
      </Link>
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            ← Back to dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="hidden sm:inline text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors font-medium"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            >
              Get started →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
