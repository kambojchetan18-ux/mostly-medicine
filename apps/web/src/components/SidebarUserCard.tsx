"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface UserInfo {
  name: string;
  email: string;
  avatar_url: string | null;
  plan: string;
  role: string;
  current_streak: number;
  founder_rank: number | null;
  pro_until: string | null;
}

export default function SidebarUserCard() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) return;
      // Fetch from user_profiles for name/plan/role/streak
      supabase
        .from("user_profiles")
        .select("full_name, email, avatar_url, plan, role, current_streak, founder_rank, pro_until")
        .eq("id", u.id)
        .single()
        .then(({ data }) => {
          setUser({
            name: data?.full_name ?? u.email?.split("@")[0] ?? "User",
            email: data?.email ?? u.email ?? "",
            avatar_url: data?.avatar_url ?? null,
            plan: data?.plan ?? "free",
            role: data?.role ?? "user",
            current_streak: data?.current_streak ?? 0,
            founder_rank: data?.founder_rank ?? null,
            pro_until: data?.pro_until ?? null,
          });
        });
    });
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  }

  if (!user) {
    return (
      <div className="mt-4 pt-4 border-t border-slate-800/50">
        <div className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />
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

  const planBadge = effectivePlan === "pro" ? "⭐ Pro" : effectivePlan === "enterprise" ? "🏢 Enterprise" : "Free";
  const planColor = effectivePlan === "pro" ? "text-amber-400" : effectivePlan === "enterprise" ? "text-violet-400" : "text-slate-500";

  const founderProUntil = founderActive && user.pro_until
    ? new Date(user.pro_until).toLocaleDateString(undefined, { month: "short", day: "numeric" })
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
