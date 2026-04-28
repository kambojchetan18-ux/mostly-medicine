import Link from "next/link";
import GlobalSearch from "@/components/GlobalSearch";
import SearchTrigger from "@/components/SearchTrigger";
import SidebarUserCard from "@/components/SidebarUserCard";

const navItems = [
  { href: "/dashboard",           label: "Home",      icon: "🏠", hover: "hover:text-violet-300"  },
  { href: "/dashboard/cat1",      label: "AMC CAT 1", icon: "🧠", hover: "hover:text-indigo-300" },
  { href: "/dashboard/progress",  label: "My Progress", icon: "📊", hover: "hover:text-blue-300"  },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "🏆", hover: "hover:text-amber-300" },
  { href: "/dashboard/cat2",      label: "AMC CAT 2", icon: "🩺", hover: "hover:text-pink-300"   },
  { href: "/dashboard/ai-roleplay", label: "AI RolePlay", icon: "🎙️", hover: "hover:text-fuchsia-300" },
  { href: "/dashboard/ai-roleplay/live", label: "Live (2-player)", icon: "🎥", hover: "hover:text-pink-300" },
  { href: "/dashboard/recalls",   label: "Recalls",   icon: "📝", hover: "hover:text-orange-300" },
  { href: "/dashboard/library",   label: "Library",   icon: "📚", hover: "hover:text-amber-300"  },
  { href: "/dashboard/cases",     label: "Cases",     icon: "🏥", hover: "hover:text-cyan-300"   },
  { href: "/dashboard/reference", label: "Reference", icon: "📖", hover: "hover:text-emerald-300"},
];

const jobNavItems = [
  { href: "/dashboard/jobs",             label: "Jobs Hub",    icon: "💼", hover: "hover:text-lime-300"   },
  { href: "/dashboard/jobs/rmo",         label: "RMO Pools",   icon: "🗺️", hover: "hover:text-sky-300"    },
  { href: "/dashboard/jobs/gp",          label: "GP Pathway",  icon: "🩺", hover: "hover:text-teal-300"   },
  { href: "/dashboard/jobs/action-plan", label: "Action Plan", icon: "✅", hover: "hover:text-green-300"  },
  { href: "/dashboard/jobs/tracker",     label: "App Tracker", icon: "📋", hover: "hover:text-orange-300" },
  { href: "/dashboard/profile",          label: "My Profile",  icon: "👤", hover: "hover:text-rose-300"   },
  { href: "/dashboard/billing",          label: "Billing",     icon: "💳", hover: "hover:text-yellow-300" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── Dark Sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/70 py-5 px-3 sticky top-0 h-screen overflow-y-auto shrink-0">

        {/* Logo */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
              <h1 className="font-display font-bold text-[1.1rem] leading-tight tracking-tight">
                <span className="gradient-text">Mostly</span>
                <span className="text-white"> Medicine</span>
              </h1>
            </Link>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
              <p className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase">AMC Prep 2026</p>
            </div>
          </div>
          <div className="text-slate-500 hover:text-slate-300 transition">
            <SearchTrigger />
          </div>
        </div>

        {/* Study nav */}
        <nav className="flex-1 space-y-0.5">
          <p className="px-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2">Study</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 ${item.hover} hover:bg-white/5 transition-all duration-150 text-sm font-medium group`}
            >
              <span className="text-[15px] group-hover:scale-110 transition-transform duration-150 shrink-0">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}

          {/* Jobs section */}
          <div className="pt-5 pb-1.5">
            <p className="px-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">🇦🇺 Australian Jobs</p>
          </div>
          {jobNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 ${item.hover} hover:bg-white/5 transition-all duration-150 text-sm font-medium group`}
            >
              <span className="text-[15px] group-hover:scale-110 transition-transform duration-150 shrink-0">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User card + logout */}
        <SidebarUserCard />

        {/* Bottom card */}
        <div className="mt-3 border-t border-slate-800/50 pt-3">
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-violet-950/80 via-purple-950/60 to-pink-950/40 border border-violet-800/25">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
            <p className="text-[11px] font-bold text-violet-300 mb-1 relative">🎯 Handbook-Aligned</p>
            <p className="text-[10px] text-slate-500 relative leading-relaxed">
              Official AMC MCAT scenarios · AI examiner feedback · Evidence-based
            </p>
          </div>
          <p className="text-center text-[9px] text-slate-800 mt-3 tracking-widest font-bold">
            MOSTLY MEDICINE · v2.0
          </p>
        </div>
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-3 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/70">
        <Link href="/" className="font-display font-bold text-base hover:opacity-80 transition-opacity">
          <span className="gradient-text">Mostly</span>
          <span className="text-white"> Medicine</span>
        </Link>
        <div className="text-slate-400">
          <SearchTrigger />
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 p-4 pt-20 md:p-8 md:pt-8">
        {children}
      </main>

      <GlobalSearch />
    </div>
  );
}
