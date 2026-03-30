import Link from "next/link";
import GlobalSearch from "@/components/GlobalSearch";
import SearchTrigger from "@/components/SearchTrigger";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/dashboard/cat1", label: "AMC CAT 1", icon: "🧠" },
  { href: "/dashboard/cat2", label: "AMC CAT 2", icon: "🩺" },
  { href: "/dashboard/library", label: "Library", icon: "📚" },
  { href: "/dashboard/cases", label: "Cases", icon: "🏥" },
  { href: "/dashboard/reference", label: "Reference", icon: "📖" },
];

const jobNavItems = [
  { href: "/dashboard/jobs", label: "Jobs Hub", icon: "💼" },
  { href: "/dashboard/jobs/rmo", label: "RMO Pools", icon: "🗺️" },
  { href: "/dashboard/jobs/gp", label: "GP Pathway", icon: "🩺" },
  { href: "/dashboard/jobs/action-plan", label: "Action Plan", icon: "✅" },
  { href: "/dashboard/jobs/tracker", label: "App Tracker", icon: "📋" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 py-6 px-4">
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h1 className="text-xl font-bold text-brand-700">Mostly Medicine</h1>
            <p className="text-xs text-gray-400 mt-1">AMC Exam Prep</p>
          </div>
          <SearchTrigger />
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition text-sm font-medium"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="pt-3 pb-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Australian Jobs</p>
          </div>
          {jobNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition text-sm font-medium"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8">{children}</main>

      <GlobalSearch />
    </div>
  );
}
