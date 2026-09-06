import type { Metadata } from "next";
import { privateMeta } from "@/lib/seo";

export const metadata: Metadata = privateMeta("Apply for a digital service");

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
