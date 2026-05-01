"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SidebarUserCard, { type UserCardData } from "@/components/SidebarUserCard";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  hover: string;
}

interface Props {
  navItems: NavItem[];
  jobNavItems: NavItem[];
  user: UserCardData | null;
}

// Mobile-only nav drawer. The desktop sidebar is rendered in dashboard/layout
// directly (server component); on mobile we hide that and render this drawer
// instead, triggered by the hamburger button in the mobile top-bar.
//
// Why a client component: we need useState for open/closed and useEffect to
// auto-close when the route changes (so tapping a nav link doesn't leave the
// drawer hanging open over the new page).
export default function MobileNavDrawer({ navItems, jobNavItems, user }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close on navigation. usePathname changes the moment Next pushes the
  // new route — so the drawer slides shut while the destination renders.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open. Without this, mobile Safari
  // happily scrolls the page behind the overlay when the user drags inside
  // the drawer's empty area.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`md:hidden fixed top-0 left-0 z-[70] h-full w-[82vw] max-w-[320px] bg-slate-950 border-r border-slate-800/70 py-5 px-3 overflow-y-auto transition-transform duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ paddingTop: "calc(1.25rem + env(safe-area-inset-top))" }}
      >
        <div className="flex items-center justify-between mb-6 px-2">
          <Link href="/dashboard" className="hover:opacity-80 transition-opacity" onClick={() => setOpen(false)}>
            <h1 className="font-display font-bold text-[1.1rem] leading-tight tracking-tight">
              <span className="gradient-text">Mostly</span>
              <span className="text-white"> Medicine</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
              <p className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase">AMC Prep 2026</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="flex items-center justify-center w-11 h-11 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-0.5">
          <p className="px-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2">Study</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 ${item.hover} hover:bg-white/5 transition text-sm font-medium min-h-[44px]`}
            >
              <span className="text-[15px] shrink-0">{item.icon}</span>
              <span className="break-words">{item.label}</span>
            </Link>
          ))}

          <div className="pt-5 pb-1.5">
            <p className="px-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">🇦🇺 Australian Jobs</p>
          </div>
          {jobNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 ${item.hover} hover:bg-white/5 transition text-sm font-medium min-h-[44px]`}
            >
              <span className="text-[15px] shrink-0">{item.icon}</span>
              <span className="break-words">{item.label}</span>
            </Link>
          ))}
        </nav>

        <SidebarUserCard user={user} />
      </aside>
    </>
  );
}
