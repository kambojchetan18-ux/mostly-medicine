import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@mostly-medicine/ui",
    "@mostly-medicine/ai",
    "@mostly-medicine/content",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Use the SDK-free mobile entry point for browser bundles —
      // the full index.ts pulls in @anthropic-ai/sdk (Node.js only)
      config.resolve.alias["@mostly-medicine/ai"] = path.resolve(
        __dirname,
        "../../packages/ai/src/mobile.ts"
      );
    }
    return config;
  },
  async redirects() {
    // Canonicalise to www subdomain so Supabase auth cookies live on a
    // single origin. Otherwise navigating between www. and the bare domain
    // drops the session and forces re-login.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "mostlymedicine.com" }],
        destination: "https://www.mostlymedicine.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    // Baseline security headers applied to every response. A strict CSP is
    // intentionally NOT shipped right before launch — Tailwind's hashing,
    // Next.js inline runtime, and Stripe Elements all need careful nonce
    // wiring that's risky to land overnight. The headers below are zero-risk
    // and still close real attack surface (clickjacking, MIME sniffing,
    // referrer leakage, downgrade, sensitive browser APIs).
    return [
      {
        source: "/:path*",
        headers: [
          // Block iframe embedding from any other origin → defeats
          // clickjacking attacks against /dashboard/billing + /auth/* forms.
          { key: "X-Frame-Options", value: "DENY" },
          // Stop browsers guessing MIME types — old XSS vector.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak the full URL (?next=... / ?token=...) to outbound
          // links. Origin-only on cross-origin nav.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Force HTTPS for 2 years incl. subdomains. Vercel already
          // 301s→https; HSTS hardens against downgrade attacks.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Lock sensitive browser APIs to same-origin only. Microphone is
          // allowed (Cat2 + ACRP record audio); camera also self-only for
          // Peer Live RolePlay (WebRTC). Disable everything else (FLoC,
          // payment APIs we don't ship yet, USB, etc).
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(self), geolocation=(), payment=(self), usb=(), interest-cohort=()",
          },
          // Defense-in-depth XSS hint for legacy Safari. Modern browsers
          // ignore it safely; setting "0" disables the buggy auditor.
          { key: "X-XSS-Protection", value: "0" },
          // CSP — uses unsafe-inline/unsafe-eval because Next.js inline
          // runtime and Tailwind need them. A nonce-based approach would
          // require custom middleware which is more invasive.
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.anthropic.com; frame-src https://js.stripe.com; object-src 'none'; base-uri 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
