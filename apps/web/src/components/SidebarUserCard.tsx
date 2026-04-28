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
        .select("full_name, email, avatar_url, plan, role, current_streak")
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
  const planBadge = user.plan === "pro" ? "⭐ Pro" : user.plan === "enterprise" ? "🏢 Enterprise" : "Free";
  const planColor = user.plan === "pro" ? "text-amber-400" : user.plan === "enterprise" ? "text-violet-400" : "text-slate-500";

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
