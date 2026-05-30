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
    // Security headers applied to every response, including a Content-Security-
    // Policy that allowlists Next.js runtime needs (unsafe-inline/eval for
    // scripts, inline styles for Tailwind) plus Stripe, Supabase, Anthropic,
    // and Groq origins used by the app.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://*.stripe.com",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.anthropic.com https://api.groq.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          // CSP — primary XSS / injection mitigation.
          { key: "Content-Security-Policy", value: csp },
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
        ],
      },
    ];
  },
};

export default nextConfig;
