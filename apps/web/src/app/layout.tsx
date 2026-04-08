import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mostly Medicine",
  description: "AMC Exam Preparation for International Medical Graduates",
  metadataBase: new URL("https://mostlymedicine.com"),
  openGraph: {
    title: "Mostly Medicine",
    description: "AMC Exam Preparation for International Medical Graduates",
    url: "https://mostlymedicine.com",
    siteName: "Mostly Medicine",
    type: "website",
  },
  alternates: {
    canonical: "https://mostlymedicine.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
