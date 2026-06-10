import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import GlobalSearch from "@/components/GlobalSearch";
import SearchTrigger from "@/components/SearchTrigger";
import SidebarUserCard, { type UserCardData } from "@/components/SidebarUserCard";
import MobileTopBar from "@/components/MobileTopBar";
import InstallPwaBanner from "@/components/InstallPwaBanner";
import { features } from "@/config/features";

// Layouts are async server components — perfect place for a hard auth gate
// that protects every /dashboard/* route regardless of middleware behaviour.
// Middleware was bypassed in some prod requests (root /dashboard returning
// 200 unauthenticated), so this is the authoritative check. Defense in depth.
export const dynamic = "force-dynamic";

// Peer RolePlay surfaces only when its dedicated flag is on, OR when paid
// tiers are live (in which case Enterprise plan gating handles access). In
// beta the link is dropped entirely so users don't hit a "paused" notice
// from the sidebar.
const peerRolePlayVisible =
  features.peerRolePlayInBeta || features.paidTiersEnabled;

const navItems = [
  { href: "/dashboard",           label: "Home",      icon: "🏠" },
  { href: "/dashboard/cat2",      label: "Clinical RolePlay", icon: "🩺" },
  { href: "/dashboard/ask-ai",    label: "Ask AI",    icon: "✨" },
  { href: "/dashboard/cat1",      label: "MCQ Practice", icon: "🧠" },
  { href: "/dashboard/flashcards", label: "Flashcards", icon: "🗂️" },
  { href: "/dashboard/progress",  label: "My Progress", icon: "📊" },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/osce-guide",          label: "OSCE Prep Guide", icon: "📋" },
  ...(peerRolePlayVisible
    ? [{ href: "/dashboard/ai-roleplay/live", label: "Peer RolePlay (Live)", icon: "🎥" }]
    : []),
  { href: "/dashboard/library",   label: "Library",   icon: "📚" },
  { href: "/dashboard/reference", label: "Reference", icon: "📖" },
];

const jobNavItems = [
  { href: "/dashboard/jobs",             label: "Jobs Hub",    icon: "💼" },
  { href: "/dashboard/jobs/rmo",         label: "RMO Pools",   icon: "🗺️" },
  { href: "/dashboard/jobs/gp",          label: "GP Pathway",  icon: "🩺" },
  { href: "/dashboard/jobs/action-plan", label: "Action Plan", icon: "✅" },
  { href: "/dashboard/jobs/tracker",     label: "App Tracker", icon: "📋" },
  { href: "/dashboard/profile",          label: "My Profile",  icon: "👤" },
  // Billing tab is paid-tier only. During beta the page redirects to /dashboard,
  // so the nav entry is hidden to avoid a dead click.
  ...(features.paidTiersEnabled
    ? [{ href: "/dashboard/billing", label: "Billing", icon: "💳" }]
    : []),
  { href: "/dashboard/help",             label: "Help",        icon: "💬" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Preserve the intended URL so login can return the user there.
    const h = await headers();
    const path = h.get("x-pathname") ?? h.get("x-invoke-path") ?? "/dashboard";
    const search = h.get("x-invoke-query") ?? "";
    const next = encodeURIComponent(path + (search ? `?${search}` : ""));
    redirect(`/auth/login?next=${next}`);
  }
  if (!user.email_confirmed_at) {
    redirect("/auth/verify-email");
  }

  // Fetch the profile data the sidebar card needs ONCE on the server, so
  // the client doesn't have to re-do auth + a select that occasionally
  // races with cookie hydration and leaves the Sign Out button missing.
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, email, avatar_url, plan, role, current_streak, founder_rank, pro_until")
    .eq("id", user.id)
    .single();

  const userCard: UserCardData | null = {
    name: profile?.full_name ?? user.email?.split("@")[0] ?? "User",
    email: profile?.email ?? user.email ?? "",
    avatar_url: profile?.avatar_url ?? null,
    plan: profile?.plan ?? "free",
    role: profile?.role ?? "user",
    current_streak: profile?.current_streak ?? 0,
    founder_rank: profile?.founder_rank ?? null,
    pro_until: profile?.pro_until ?? null,
  };

  return (
    <div className="flex min-h-screen bg-cream-50">

      {/* ── Dark Sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-ink-950 border-r border-cream-50/10 py-5 px-3 sticky top-0 h-screen overflow-y-auto shrink-0">

        {/* Logo */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
              <h1 className="font-display font-bold text-[1.1rem] leading-tight tracking-tight">
                <span className="gradient-text">Mostly</span>
                <span className="text-cream-50"> Medicine</span>
              </h1>
            </Link>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-saffron-400 rounded-full animate-pulse shrink-0" />
              <p className="text-[9px] text-cream-50/55 font-semibold tracking-widest uppercase">AMC Prep 2026</p>
            </div>
          </div>
          <div className="text-cream-50/55 hover:text-cream-50 transition">
            <SearchTrigger />
          </div>
        </div>

        {/* Study nav */}
        <nav className="flex-1 space-y-0.5">
          <p className="px-2 text-[11px] font-bold text-cream-50/40 uppercase tracking-widest mb-2">Study</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream-50/70 hover:text-cream-50 hover:bg-cream-50/5 transition-all duration-150 text-sm font-medium group"
            >
              <span className="text-[15px] group-hover:scale-110 transition-transform duration-150 shrink-0">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}

          {/* Jobs section */}
          <div className="pt-5 pb-1.5">
            <p className="px-2 text-[11px] font-bold text-cream-50/40 uppercase tracking-widest">🇦🇺 Australian Jobs</p>
          </div>
          {jobNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream-50/70 hover:text-cream-50 hover:bg-cream-50/5 transition-all duration-150 text-sm font-medium group"
            >
              <span className="text-[15px] group-hover:scale-110 transition-transform duration-150 shrink-0">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User card + logout */}
        <SidebarUserCard user={userCard} />

        {/* Bottom card */}
        <div className="mt-3 border-t border-cream-50/10 pt-3">
          <div className="relative overflow-hidden rounded-2xl p-4 border border-cream-50/10 bg-cream-50/[0.04]">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-saffron-500/10 rounded-full blur-2xl pointer-events-none" />
            <p className="text-[11px] font-bold text-saffron-400 mb-1 relative">🎯 Handbook-Aligned</p>
            <p className="text-[10px] text-cream-50/55 relative leading-relaxed">
              Official AMC MCAT scenarios · AI examiner feedback · Evidence-based
            </p>
          </div>
          <p className="text-center text-[9px] text-cream-50/30 mt-3 tracking-widest font-bold">
            MOSTLY MEDICINE · v2.0
          </p>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────────────
          Auto-hides on scroll-down, slides back in on scroll-up. Hosts the
          hamburger trigger (drawer panel itself lives inside MobileNavDrawer).
          Polished with a thin brand-gradient hairline + button-affordance
          on the menu / search icons. */}
      <MobileTopBar navItems={navItems} jobNavItems={jobNavItems} user={userCard} />

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main
        className="flex-1 min-w-0 p-3 pt-[4.5rem] sm:p-4 sm:pt-20 md:p-8 md:pt-8"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        {/* PWA install banner — auto-shows on Android Chrome via
            beforeinstallprompt, plus a how-to sheet for iOS Safari.
            Hides itself if already installed or recently dismissed. */}
        <InstallPwaBanner />
        {children}
      </main>

      <GlobalSearch />
    </div>
  );
}
