import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteChrome } from "@/components/SiteChrome";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, SITE_URL, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0d6efd",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Digital Banking & Online Services | Digital Service - Your Digital Partner",
    template: "%s | Digital Service - Your Digital Partner",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "business",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: "/assets/images/logo.png",
    apple: "/assets/images/logo.png",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: `${SITE.name} · ${SITE.tagline}`,
    title: "Digital Banking & Online Services | Digital Service",
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Service — Jaynagar",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: {
    "geo.region": "IN-WB",
    "geo.placename": "Jaynagar, South 24 Parganas",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
        <SiteChrome footer={<SiteFooter />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
