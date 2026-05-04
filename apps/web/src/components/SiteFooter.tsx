import Link from "next/link";

/**
 * SiteFooter — global brand footer rendered on the homepage and every public
 * pillar / marketing page. Intentionally NOT used inside /dashboard/* (the
 * dashboard already has a sidebar layout that supplies its own chrome).
 *
 * Three columns on md+, stacked on mobile:
 *   1. Brand block — wordmark, tagline
 *   2. Quick links — top public routes (incl. Privacy and Contact Us)
 *   3. Contact — email, website, location
 *
 * Pure server component. No auth, no DB, no client JS.
 */
type QuickLink = {
  href: string;
  label: string;
};

const quickLinks: QuickLink[] = [
  { href: "/amc",                       label: "AMC Exam Guide"          },
  { href: "/amc-fee-calculator",        label: "AMC Fee Calculator"      },
  { href: "/amc-eligibility-checker",   label: "AMC Eligibility Checker" },
  { href: "/osce-guide",                label: "OSCE Prep Guide"         },
  { href: "/ask-ai",                    label: "Ask AI (Free)"           },
  { href: "/dashboard/billing",         label: "Pricing & Plans"         },
  { href: "/contact",                   label: "Contact Us"              },
  { href: "/privacy",                   label: "Privacy Policy"          },
  { href: "/terms",                     label: "Terms & Conditions"      },
  { href: "/auth/login",                label: "Sign in"                 },
  { href: "/auth/signup",               label: "Sign up free"            },
];

export default function SiteFooter(): JSX.Element {
  return (
    <footer className="relative z-10 mt-24 bg-[#070714] text-slate-300">
      {/* Top hairline — emerald gradient, matches brand palette */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="mx-auto max-w-[1280px] px-6 py-10 sm:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {/* Column 1 — Brand block */}
          <div>
            <Link
              href="/"
              className="font-display inline-block text-[1.25rem] font-bold tracking-tight"
            >
              <span className="gradient-text">Mostly</span>
              <span className="text-white"> Medicine</span>
            </Link>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              AMC Prep Platform
            </p>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              AMC exam preparation built for International Medical Graduates
              pursuing Australian medical registration. Free to start,
              AI-powered, handbook-aligned.
            </p>
          </div>

          {/* Column 2 — Quick links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li>
                <span className="block text-xs uppercase tracking-wider text-slate-600">
                  Email
                </span>
                <a
                  href="mailto:info@mostlymedicine.com"
                  className="mt-1 inline-block transition-colors hover:text-white"
                >
                  info@mostlymedicine.com
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-slate-600">
                  Website
                </span>
                <span className="mt-1 inline-block text-slate-300">
                  mostlymedicine.com
                </span>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-slate-600">
                  Location
                </span>
                <span className="mt-1 inline-block text-slate-300">
                  Sydney, Australia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 border-t border-slate-900/80 pt-6">
          <p className="text-xs text-slate-600">
            &copy; 2026 Mostly Medicine. Built for IMGs. Powered by Claude AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
