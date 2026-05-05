import { ImageResponse } from "next/og";

// Dynamic 512×512 PNG version of the Mostly Medicine mark, served at
// /icon-512.png. Used in Schema.org Organization logo (which prefers raster)
// and as the OG/Twitter card image. SVG version at /icon (Next.js icon
// convention from app/icon.svg).
export const runtime = "edge";

export async function GET(): Promise<Response> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070714",
        }}
      >
        <svg width="420" height="420" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="45%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path
            d="M76 416 V96 L256 320 L436 96 V416"
            fill="none"
            stroke="url(#mark)"
            strokeWidth="72"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
