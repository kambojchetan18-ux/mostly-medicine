"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { features } from "@/config/features";

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
      <div className="mt-4 pt-4 border-t border-cream-50/10">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-cream-50/60 hover:text-red-400 hover:bg-cream-50/5 transition text-xs font-medium disabled:opacity-50"
        >
          <span>→</span>
          {loggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    );
  }

  const initials = user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

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

  // Beta mode swaps the per-tier badge for a single neutral "Beta" pill so
  // the sidebar never advertises a paid tier to a user who can't buy one.
  const planBadge = features.betaMode
    ? "🚀 Beta"
    : effectivePlan === "pro"
      ? "⭐ Pro"
      : effectivePlan === "enterprise"
        ? "🏢 Enterprise"
        : "Free";
  const planColor = features.betaMode
    ? "text-saffron-400"
    : effectivePlan === "pro"
      ? "text-saffron-400"
      : effectivePlan === "enterprise"
        ? "text-saffron-300"
        : "text-cream-50/50";

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
    <div className="mt-4 pt-4 border-t border-cream-50/10 space-y-1.5">
      {/* Streak pill */}
      <div
        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium ${
          user.current_streak > 0
            ? "text-saffron-300 bg-saffron-500/10"
            : "text-cream-50/40 bg-cream-50/5"
        }`}
        title="Daily activity streak"
      >
        {streakLabel}
      </div>

      {/* Founder badge — first 100 launch-day signups get Pro free for 30 days.
          Hidden during beta because no one is on a paid plan anyway. */}
      {features.paidTiersEnabled && founderActive && user.founder_rank != null && (
        <Link
          href="/dashboard/billing"
          className="block px-3 py-1.5 rounded-lg bg-gradient-to-r from-saffron-500/15 to-saffron-400/10 border border-saffron-400/30 hover:from-saffron-500/25 hover:to-saffron-400/20 transition"
          title={`Founder #${user.founder_rank} — Pro free until ${founderProUntil}`}
        >
          <p className="text-[10px] font-bold tracking-wide text-saffron-300">
            ✨ FOUNDER #{user.founder_rank}
          </p>
          <p className="text-[10px] text-saffron-200/80 truncate">
            Pro free until {founderProUntil}
          </p>
        </Link>
      )}

      {/* User card */}
      <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-cream-50/5 transition group">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-ink-950 text-xs font-bold">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-cream-50/80 truncate group-hover:text-cream-50 transition">{user.name}</p>
          <p className={`text-[10px] font-medium ${planColor}`}>{planBadge}{user.role === "admin" ? " · Admin" : ""}</p>
        </div>
      </Link>

      {/* Admin link */}
      {user.role === "admin" && (
        <Link
          href="/dashboard/admin"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-cream-50/60 hover:text-saffron-300 hover:bg-cream-50/5 transition text-xs font-medium"
        >
          <span>⚙️</span> Admin Panel
        </Link>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-cream-50/45 hover:text-red-400 hover:bg-cream-50/5 transition text-xs font-medium disabled:opacity-50"
      >
        <span>→</span>
        {loggingOut ? "Signing out…" : "Sign Out"}
      </button>
    </div>
  );
}
