import type { Metadata } from "next";
import { privateMeta } from "@/lib/seo";

export const metadata: Metadata = privateMeta("Sign out");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
