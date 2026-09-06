import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Digital Banking & Online Services | Digital Service - Your Digital Partner",
    template: "%s | Digital Service - Your Digital Partner",
  },
  description:
    "Fast, reliable and convenient digital banking, tax, GST and business registration services from Jaynagar, South 24 Parganas.",
  keywords:
    "Digital Banking, AEPS, Mobile Recharge, PVC Card Print, PAN Card, GST Registration, GST Return, Income Tax Filing, MSME Registration, Trade Licence, Jaynagar, South 24 Parganas",
  icons: {
    icon: "/assets/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
