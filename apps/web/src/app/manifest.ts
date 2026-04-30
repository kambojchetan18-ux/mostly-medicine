import type { MetadataRoute } from "next";

// Minimal Web App Manifest so iOS Safari + Android Chrome offer
// "Add to Home Screen" with a proper standalone shell. No icons referenced
// here yet — Next.js 14 auto-generates a 512x512 PNG from
// `app/icon.tsx`/`app/apple-icon.tsx` if/when those get added. Until then
// the OS falls back to a screenshot of the current page, which is fine for
// launch.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mostly Medicine — AMC Exam Preparation for IMGs",
    short_name: "Mostly Medicine",
    description:
      "AI-powered AMC MCQ and AMC Handbook AI RolePlay (Clinical) exam preparation for International Medical Graduates.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f172a",
    theme_color: "#14b8a6",
    lang: "en-AU",
    categories: ["education", "medical", "productivity"],
  };
}
