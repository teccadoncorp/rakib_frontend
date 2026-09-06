import type { Metadata } from "next";
import { SITE } from "./site";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sruniquecreation.in").replace(
  /\/$/,
  ""
);

export const DEFAULT_KEYWORDS = [
  "Digital Service Jaynagar",
  "AEPS Jaynagar",
  "GST registration South 24 Parganas",
  "PAN card apply Jaynagar",
  "income tax filing Bakultala",
  "PVC card printing Jaynagar",
  "MSME registration West Bengal",
  "trade licence Jaynagar",
  "mobile recharge Jaynagar",
  "GST return filing",
].join(", ");

export const DEFAULT_DESCRIPTION =
  "Digital Service in Jaynagar (Bakultala), South 24 Parganas — AEPS, mobile recharge, PAN, GST registration and returns, income tax, MSME, trade licence, and HD PVC card printing.";

type PageMetaInput = {
  title: string;
  description?: string;
  path: string;
  keywords?: string;
  absolute?: boolean;
  index?: boolean;
  image?: string;
  type?: "website" | "article";
};

export function canonical(path: string) {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  keywords = DEFAULT_KEYWORDS,
  absolute = false,
  index = true,
  image = "/assets/images/logo.png",
  type = "website",
}: PageMetaInput): Metadata {
  const url = canonical(path);
  return {
    title: absolute ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    openGraph: {
      title,
      description,
      url,
      siteName: `${SITE.name} · ${SITE.tagline}`,
      locale: "en_IN",
      type,
      images: [{ url: image, alt: `${SITE.name} — ${SITE.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function privateMeta(title: string): Metadata {
  return pageMeta({
    title,
    description: `${title} on Digital Service. This page is for signed-in customers and staff.`,
    path: "/",
    index: false,
  });
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#business`,
    name: SITE.name,
    alternateName: SITE.tagline,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    telephone: SITE.phoneIntl,
    email: SITE.email,
    image: canonical("/assets/images/logo.png"),
    logo: canonical("/assets/images/logo.png"),
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "UPI, Cash",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jibon Mondal Hat, Jaynagar (Bakultala)",
      addressLocality: "Jaynagar",
      addressRegion: "West Bengal",
      postalCode: "743337",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 22.186638,
      longitude: 88.423912,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    areaServed: [
      { "@type": "Place", name: "Jaynagar, South 24 Parganas" },
      { "@type": "Place", name: "Bakultala" },
      { "@type": "AdministrativeArea", name: "West Bengal" },
    ],
    sameAs: [`https://wa.me/${SITE.whatsapp}`],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE.name,
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}/#business` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/track?ref={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  price: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: canonical(input.path),
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "Place", name: "Jaynagar, South 24 Parganas" },
    offers: input.price
      ? {
          "@type": "Offer",
          priceCurrency: "INR",
          price: input.price,
          availability: "https://schema.org/InStock",
          url: canonical(input.path),
        }
      : {
          "@type": "Offer",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: canonical(input.path),
        },
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  path: string;
  price: number;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: canonical(input.image || "/assets/images/pvc_card_showcase.jpg"),
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: input.price,
      availability: "https://schema.org/InStock",
      url: canonical(input.path),
      seller: { "@id": `${SITE_URL}/#business` },
    },
  };
}
