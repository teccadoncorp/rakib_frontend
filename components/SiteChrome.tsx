"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/lib/auth";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <AuthProvider>
      {isAdmin ? (
        children
      ) : (
        <>
          <SiteHeader />
          {children}
          <SiteFooter />
        </>
      )}
    </AuthProvider>
  );
}
