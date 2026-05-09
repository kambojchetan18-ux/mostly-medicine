"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export interface UserCardData {
  name: string;
  email: string;
  avatar_url: string | null;
  plan: string;
  role: string;
  current_streak: number;
  founder_rank: number | null;
  pro_until: string | null;
}

// Server-side render (layout passes data as props) — no client-side fetch
// dance, no race condition, no skeleton state where the Sign Out button
// could disappear if cookies fail to round-trip to the client.
export default function SidebarUserCard({ user }: { user: UserCardData | null }) {
  const [loggingOut, setLoggingOut] = useState(false);

  // Two-step belt-and-suspenders sign out:
  //   1. Server-side: POST /api/auth/logout → calls supabase.auth.signOut()
  //      with the SSR cookie helper, which writes Set-Cookie deletion
  //      headers in the response → browser drops the auth cookies.
  //   2. Client-side: also call supabase.auth.signOut() to nuke any
  //      in-memory session state in the browser SDK.
  // Then HARD RELOAD via window.location — not router.push — so the next
  // request actually re-reads cookies from disk instead of soft-navigating
  // with cached React state. router.push was leaving a window where users
  // appeared logged-out in the UI but cookies hadn't fully cleared, so
  // clicking sidebar nav links got dashboard access without re-login.
  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore — fall through to client signOut + hard redirect */
    }
    try {
      await createClient().auth.signOut();
    } catch {
      /* ignore */
    }
    window.location.href = "/auth/login";
  }

  // Defensive fallback: if for any reason user data is missing, still render
  // a working Sign Out button so the user is never locked into a dashboard
  // they can't escape from.
  if (!user) {
    return (
      <div className="mt-4 pt-4 border-t border-slate-800/50">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition text-xs font-medium disabled:opacity-50"
        >
          <span>→</span>
          {loggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    );
  }

  const initials = (user.name || "?").split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  // Founder promo: free users inside the 30-day founder window are surfaced
  // as Pro because that's the access they have. Once they upgrade via Stripe,
  // plan === 'pro' takes over.
  const founderActive =
    user.founder_rank != null &&
    user.pro_until != null &&
    Date.parse(user.pro_until) > Date.now();
  const effectivePlan =
    user.plan === "pro" || user.plan === "enterprise"
      ? user.plan
      : founderActive
        ? "pro"
        : user.plan;

  const planBadge = effectivePlan === "pro" ? "⭐ Pro" : effectivePlan === "enterprise" ? "🏢 Enterprise" : "Free";
  const planColor = effectivePlan === "pro" ? "text-amber-400" : effectivePlan === "enterprise" ? "text-violet-400" : "text-slate-500";

  // Pin locale to en-AU. Without an explicit locale, Safari and iOS use the
  // user's OS locale (could be ar/he/ja) so the rendered date varies between
  // server-render and client-hydrate → React hydration mismatch warning. The
  // app is targeted at AMC candidates in Australia anyway.
  const founderProUntil = founderActive && user.pro_until
    ? new Date(user.pro_until).toLocaleDateString("en-AU", { month: "short", day: "numeric" })
    : null;

  const streakLabel =
    user.current_streak > 0
      ? `🔥 ${user.current_streak}-day streak`
      : "Start a streak today";

  return (
    <div className="mt-4 pt-4 border-t border-slate-800/50 space-y-1.5">
      {/* Streak pill */}
      <div
        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium ${
          user.current_streak > 0
            ? "text-orange-300 bg-orange-500/10"
            : "text-slate-500 bg-white/5"
        }`}
        title="Daily activity streak"
      >
        {streakLabel}
      </div>

      {/* Founder badge — first 100 launch-day signups get Pro free for 30 days */}
      {founderActive && user.founder_rank != null && (
        <Link
          href="/dashboard/billing"
          className="block px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-pink-500/15 border border-amber-400/30 hover:from-amber-500/25 hover:to-pink-500/25 transition"
          title={`Founder #${user.founder_rank} — Pro free until ${founderProUntil}`}
        >
          <p className="text-[10px] font-bold tracking-wide text-amber-300">
            ✨ FOUNDER #{user.founder_rank}
          </p>
          <p className="text-[10px] text-amber-200/80 truncate">
            Pro free until {founderProUntil}
          </p>
        </Link>
      )}

      {/* User card */}
      <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 transition group">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-300 truncate group-hover:text-white transition">{user.name}</p>
          <p className={`text-[10px] font-medium ${planColor}`}>{planBadge}{user.role === "admin" ? " · Admin" : ""}</p>
        </div>
      </Link>

      {/* Admin link */}
      {user.role === "admin" && (
        <Link
          href="/dashboard/admin"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-amber-300 hover:bg-white/5 transition text-xs font-medium"
        >
          <span>⚙️</span> Admin Panel
        </Link>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-white/5 transition text-xs font-medium disabled:opacity-50"
      >
        <span>→</span>
        {loggingOut ? "Signing out…" : "Sign Out"}
      </button>
    </div>
  );
}
