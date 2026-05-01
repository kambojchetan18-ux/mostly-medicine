"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SearchTrigger from "@/components/SearchTrigger";
import MobileNavDrawer from "@/components/MobileNavDrawer";
import type { UserCardData } from "@/components/SidebarUserCard";

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

// Mobile-only top bar with iOS-style auto-hide:
//   - scroll down past ~64px → bar slides up out of view
//   - scroll up by any amount → bar slides back down
//   - always visible at the very top
// Frees up screen real estate while reading long action plans / library
// pages, instead of a fixed band always taking ~3rem.
export default function MobileTopBar({ navItems, jobNavItems, user }: Props) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Always show near top so the user can grab it back instantly.
      if (y < 64) {
        setHidden(false);
      } else if (y > lastY.current + 4) {
        setHidden(true);
      } else if (y < lastY.current - 4) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed top-0 inset-x-0 z-50 transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-950/85 backdrop-blur-xl shadow-lg shadow-black/30"
        style={{ paddingTop: "calc(0.5rem + env(safe-area-inset-top))" }}
      >
        <MobileNavDrawer navItems={navItems} jobNavItems={jobNavItems} user={user} />
        <Link
          href="/dashboard"
          className="font-display font-bold text-base hover:opacity-80 transition-opacity truncate"
          aria-label="Mostly Medicine — home"
        >
          <span className="gradient-text">Mostly</span>
          <span className="text-white"> Medicine</span>
        </Link>
        <div className="text-slate-300 flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/5">
          <SearchTrigger />
        </div>
      </div>
      {/* Subtle brand hairline so the bar feels intentional, not a flat slab */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
    </div>
  );
}
