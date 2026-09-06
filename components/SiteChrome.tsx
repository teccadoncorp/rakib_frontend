"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/lib/auth";
import { SiteHeader } from "./SiteHeader";

export function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
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
          {footer}
        </>
      )}
    </AuthProvider>
  );
}
