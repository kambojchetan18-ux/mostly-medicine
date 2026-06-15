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
 *
 * Palette: matches the v3 homepage (ink-950 base + cream-50 text + saffron
 * accents). Other public pillar pages still use this footer; their dark
 * footer continues to feel cohesive even if their hero is light.
 */
type QuickLink = {
  href: string;
  label: string;
};

type Social = {
  href: string;
  label: string;
  icon: JSX.Element;
};

// Brand social accounts. Each opens in a new tab; rel keeps referrer/security
// hygiene for external links. Icons are inline single-path SVGs (no extra deps).
const socials: Social[] = [
  {
    href: "https://www.instagram.com/mostlymedicine",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.24-2.19.41-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.17.42-.36 1.04-.41 2.19-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.41 2.19.21.55.47.94.88 1.35.41.41.8.67 1.35.88.42.17 1.04.36 2.19.41 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.19-.41.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.17-.42.36-1.04.41-2.19.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.41-2.19a3.64 3.64 0 0 0-.88-1.35 3.64 3.64 0 0 0-1.35-.88c-.42-.17-1.04-.36-2.19-.41-1.24-.06-1.61-.07-4.76-.07Zm0 2.76a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Zm0 1.62a3.68 3.68 0 1 0 0 7.36 3.68 3.68 0 0 0 0-7.36Zm5.48-2.9a1.24 1.24 0 1 1 0 2.48 1.24 1.24 0 0 1 0-2.48Z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/mostlymedicine/",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
      </svg>
    ),
  },
  {
    href: "https://youtube.com/@mostlymedicine-w3s",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.09 0 12 0 12s0 3.91.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.91 24 12 24 12s0-3.91-.5-5.8ZM9.6 15.6V8.4l6.27 3.6L9.6 15.6Z" />
      </svg>
    ),
  },
];

const quickLinks: QuickLink[] = [
  { href: "/amc-cat2",                  label: "AMC Clinical · AI RolePlay" },
  { href: "/amc-mcq",                   label: "AMC MCQ"                 },
  { href: "/ask-ai",                    label: "Ask AI (Free)"           },
  { href: "/dashboard/flashcards",      label: "Flashcards"              },
  { href: "/amc",                       label: "AMC Exam Guide"          },
  { href: "/amc-fee-calculator",        label: "AMC Fee Calculator"      },
  { href: "/amc-eligibility-checker",   label: "AMC Eligibility Checker" },
  { href: "/osce-guide",                label: "OSCE Prep Guide"         },
  { href: "/blog",                      label: "Blog"                    },
  // Public pricing page — always linked (no auth, no flag gate). Checkout
  // itself stays on /dashboard/billing, which keeps its own beta gating.
  { href: "/pricing",                   label: "Pricing & Plans"         },
  { href: "/contact",                   label: "Contact Us"              },
  { href: "/privacy",                   label: "Privacy Policy"          },
  { href: "/terms",                     label: "Terms & Conditions"      },
  { href: "/auth/login",                label: "Sign in"                 },
  { href: "/auth/signup",               label: "Sign up free"            },
];

export default function SiteFooter(): JSX.Element {
  return (
    <footer className="relative z-10 bg-ink-950 text-cream-50/80">
      {/* Top hairline — saffron gradient, matches v3 brand palette */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-saffron-500/40 to-transparent" />

      <div className="mx-auto max-w-[1280px] px-6 py-10 sm:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {/* Column 1 — Brand block */}
          <div>
            <Link
              href="/"
              className="font-display inline-block text-[1.25rem] font-bold tracking-tight"
            >
              <span className="text-saffron-400">Mostly</span>
              <span className="text-cream-50"> Medicine</span>
            </Link>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-saffron-400/90">
              AMC Prep Platform
            </p>
            <p className="mt-5 text-sm leading-relaxed text-cream-50/65">
              AMC exam preparation built for International Medical Graduates
              pursuing Australian medical registration. Free to start,
              AI-powered, handbook-aligned.
            </p>

            {/* Social — follow the brand across platforms */}
            <div className="mt-6">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-saffron-400/90">
                Follow Us
              </h3>
              <div className="mt-3 flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Mostly Medicine on ${social.label}`}
                    title={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-50/15 text-cream-50/70 transition-colors hover:border-saffron-400/50 hover:bg-saffron-400/10 hover:text-saffron-400"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 — Quick links */}
          <div>
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-saffron-400/90">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-50/65 transition-colors hover:text-cream-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-saffron-400/90">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-cream-50/65">
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-cream-50/40">
                  Email
                </span>
                <a
                  href="mailto:info@mostlymedicine.com"
                  className="mt-1 inline-block transition-colors hover:text-cream-50"
                >
                  info@mostlymedicine.com
                </a>
              </li>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-cream-50/40">
                  Website
                </span>
                <span className="mt-1 inline-block text-cream-50/80">
                  mostlymedicine.com
                </span>
              </li>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-cream-50/40">
                  Location
                </span>
                <span className="mt-1 inline-block text-cream-50/80">
                  Sydney, Australia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 flex flex-col items-start gap-4 border-t border-cream-50/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cream-50/40">
            &copy; 2026 Mostly Medicine. Built for IMGs. Powered by Claude AI.
          </p>
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Mostly Medicine on ${social.label}`}
                title={social.label}
                className="text-cream-50/40 transition-colors hover:text-saffron-400"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
