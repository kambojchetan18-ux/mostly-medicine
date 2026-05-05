import type { MetadataRoute } from "next";

// Web App Manifest for "Add to Home Screen" on iOS Safari + Android Chrome.
// Icons reference the /icon.svg (Next.js auto-served from app/icon.svg) and
// the /icon-512.png ImageResponse-rendered PNG, both established with the
// brand mark — emerald → violet → pink gradient "M" on dark canvas.
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
    background_color: "#070714",
    theme_color: "#7c3aed",
    lang: "en-AU",
    categories: ["education", "medical", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
