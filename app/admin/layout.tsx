import type { Metadata } from "next";
import { privateMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...privateMeta("Staff Control Room"),
  title: {
    default: "Staff Control Room",
    template: "%s | Digital Service Staff",
  },
  appleWebApp: { capable: false },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
