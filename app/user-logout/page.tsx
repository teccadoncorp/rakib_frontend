"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout();
    router.replace("/");
  }, [logout, router]);

  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <p>Signing you out...</p>
      </div>
    </section>
  );
}
