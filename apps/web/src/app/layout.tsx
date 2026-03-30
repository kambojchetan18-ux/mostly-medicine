import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
