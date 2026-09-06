"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { canUseUserPortal, isStaffRole, navForRole, roleLabel } from "@/lib/roles";
import { LottieMark } from "./LottieMark";
import "@/app/admin/admin.css";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user || !isStaffRole(user.role)) router.replace("/admin/login");
  }, [ready, user, router]);

  if (!ready) {
    return (
      <div className="ap-login">
        <LottieMark kind="loader" size={140} />
      </div>
    );
  }

  if (!user || !isStaffRole(user.role)) return null;

  const links = navForRole(user.role);

  return (
    <div className="ap-root">
      <aside className={`ap-aside${open ? " open" : ""}`}>
        <div className="ap-brand">
          <img src="/assets/images/logo.png" alt="Digital Service" />
          <div>
            <span>Control room</span>
            <strong>Digital Service</strong>
          </div>
        </div>
        <nav className="ap-nav">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`ap-link${active ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <i className={`fa-solid ${link.icon}`}></i> {link.label}
              </Link>
            );
          })}
        </nav>
        {canUseUserPortal(user.role) ? (
          <Link href="/user-dashboard" className="ap-link" style={{ marginTop: "auto" }} onClick={() => setOpen(false)}>
            <i className="fa-solid fa-circle-user"></i> User dashboard
          </Link>
        ) : null}
        <button
          type="button"
          className="ap-btn danger"
          style={{ marginTop: canUseUserPortal(user.role) ? 8 : "auto", width: "100%" }}
          onClick={() => {
            logout();
            router.push("/admin/login");
          }}
        >
          Sign out
        </button>
      </aside>
      <main className="ap-main">
        <div className="ap-top">
          <div>
            <button type="button" className="ap-mobile-toggle" onClick={() => setOpen((v) => !v)}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="ap-kicker">Staff workspace</div>
          </div>
          <div className="ap-chip">
            {roleLabel(user.role)} · {user.partnerCode || user.userCode}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
