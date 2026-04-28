import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        accent: {
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)",         "Inter",         "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "system-ui", "sans-serif"],
      },
      animation: {
        float:        "float 7s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        shimmer:      "shimmer 2.5s linear infinite",
        "slide-up":   "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
        "spin-slow":  "spin 10s linear infinite",
        "fade-in":    "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(20,184,166,0.25)" },
          "50%":      { boxShadow: "0 0 50px rgba(20,184,166,0.6), 0 0 90px rgba(6,182,212,0.2)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        "glow-teal":   "0 0 40px rgba(20,184,166,0.35)",
        "glow-cyan":   "0 0 40px rgba(6,182,212,0.35)",
        "glow-violet": "0 0 40px rgba(20,184,166,0.35)",
        "glow-pink":   "0 0 40px rgba(6,182,212,0.35)",
        "card":        "0 4px 24px -4px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.05)",
        "card-hover":  "0 16px 48px -8px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
