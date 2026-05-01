import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// iPhone notch / Android punch-hole safe-areas — viewport-fit=cover lets us
// paint right up to the edges and use env(safe-area-inset-*) for any sticky
// chrome (mobile top-bar, mobile drawer). initialScale=1 + maximumScale=5
// keeps pinch-zoom available (a11y) but stops iOS from auto-zooming text
// inputs <16px.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

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

const SITE_URL = "https://mostlymedicine.com";
const TITLE = "Mostly Medicine — AMC Exam Preparation for IMGs";
const DESCRIPTION =
  "AI-powered AMC MCQ and AMC Handbook AI RolePlay (Clinical) exam preparation for International Medical Graduates. 3,000+ MCQs, 151+ clinical roleplays, examiner-grade feedback. Aligned with the AMC Handbook 2026. Free to start.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s | Mostly Medicine",
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: "Mostly Medicine",
  keywords: [
    "AMC exam",
    "AMC MCQ",
    "AMC Handbook AI RolePlay",
    "AMC Clinical exam",
    "MCAT clinical",
    "IMG Australia",
    "International Medical Graduate",
    "AHPRA registration",
    "Australian Medical Council",
    "AMC Handbook 2026",
    "AMC preparation",
    "AMC practice questions",
    "AMC roleplay",
    "AMC OSCE",
    "Murtagh General Practice",
    "RACGP Red Book",
    "RMO pool Australia",
    "GP pathway Australia",
  ],
  authors: [{ name: "Mostly Medicine" }],
  creator: "Mostly Medicine",
  publisher: "Mostly Medicine",
  category: "education",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Mostly Medicine",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@mostlymedicine",
  },
  alternates: {
    canonical: SITE_URL,
  },
  // Web App Manifest — defined in `app/manifest.ts`. Lets iOS Safari / Android
  // Chrome offer "Add to Home Screen" with a proper standalone shell.
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Mostly Medicine",
    statusBarStyle: "black-translucent",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: "Mostly Medicine",
  url: SITE_URL,
  description: DESCRIPTION,
  logo: `${SITE_URL}/icon.png`,
  sameAs: [] as string[],
  knowsAbout: [
    "Australian Medical Council exam",
    "AMC MCQ",
    "AMC Handbook AI RolePlay Clinical exam",
    "MCAT clinical assessment",
    "International Medical Graduate pathway",
    "AHPRA registration",
    "Australian medical education",
  ],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "International Medical Graduate",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Mostly Medicine",
  description: DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-AU",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/dashboard/cat1?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// E-E-A-T signal — names a real founder behind the platform so AI engines
// have a Person entity to attribute. Wife's involvement (Dr Amandeep, AMC
// pass-graduate) is a real authority signal worth surfacing.
const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#founder`,
  name: "Chetan Kamboj",
  jobTitle: "Founder, Mostly Medicine",
  url: SITE_URL,
  worksFor: { "@id": `${SITE_URL}/#organization` },
  description:
    "Engineer-turned-founder of Mostly Medicine, an AMC exam preparation platform built for International Medical Graduates after his wife (an AMC pass-graduate IMG) identified gaps in existing prep tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Standard Web App capable — Chrome warns when only the
            apple-mobile-web-app-capable meta is present (Next 14's
            appleWebApp emits that one but not its Android sibling). */}
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
