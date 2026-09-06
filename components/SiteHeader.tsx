"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth";
import { canUseUserPortal, isStaffRole } from "@/lib/roles";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/pvc-print", label: "Order PVC Card", highlight: true, icon: "fa-id-card" },
  { href: "/services", label: "Services" },
  { href: "/track", label: "Track Status", icon: "fa-magnifying-glass", smallIcon: true },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const close = () => setOpen(false);

  return (
    <>
      <div className="top-bar">
        <div className="container top-bar-container" style={{ justifyContent: "flex-end" }}>
          <div className="top-info-right">
            <div className="top-info-item">
              <i className="fa-solid fa-phone"></i>
              <a href="tel:7872292614">7872292614</a>
            </div>
            <div className="top-info-item">
              <i className="fa-solid fa-envelope"></i>
              <a href="mailto:rhossen389@gmail.com">rhossen389@gmail.com</a>
            </div>
          </div>
        </div>
      </div>

      <header className="navbar">
        <div className="container navbar-container">
          <Logo />

          <nav>
            <ul className="nav-links">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link${isActive(item.href) ? " active" : ""}`}
                    style={
                      item.highlight
                        ? { color: "var(--primary-blue)", fontWeight: 700 }
                        : undefined
                    }
                  >
                    {item.icon ? (
                      <i
                        className={`fa-solid ${item.icon}`}
                        style={{
                          marginRight: 4,
                          fontSize: item.smallIcon ? "0.8rem" : undefined,
                        }}
                      ></i>
                    ) : null}
                    {item.label}
                  </Link>
                </li>
              ))}
              {user && canUseUserPortal(user.role) ? (
                <li>
                  <Link
                    href="/user-dashboard"
                    className={`nav-link${isActive("/user-dashboard") ? " active" : ""}`}
                    style={{ color: "#10b981", fontWeight: 700 }}
                  >
                    <i className="fa-solid fa-circle-user"></i> My Account
                  </Link>
                </li>
              ) : null}
              {user && isStaffRole(user.role) ? (
                <li>
                  <Link
                    href="/admin"
                    className="nav-link"
                    style={{ color: "#38bdf8", fontWeight: 700 }}
                  >
                    <i className="fa-solid fa-shield-halved"></i> Staff Portal
                  </Link>
                </li>
              ) : null}
              {!user ? (
                <li>
                  <Link
                    href="/user-login"
                    className={`nav-link${isActive("/user-login") || isActive("/user-register") ? " active" : ""}`}
                  >
                    <i className="fa-solid fa-right-to-bracket"></i> Login / Register
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>

          <div
            className="nav-right-actions"
            style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}
          >
            <div className="nav-cta" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {user && canUseUserPortal(user.role) ? (
                <Link
                  href="/user-dashboard"
                  className="btn btn-primary"
                  style={{
                    background: "#10b981",
                    border: "none",
                    fontSize: "0.82rem",
                    padding: "6px 12px",
                  }}
                >
                  <span>My Portal</span>
                  <i className="fa-solid fa-user"></i>
                </Link>
              ) : !user ? (
                <Link
                  href="/user-login"
                  className="btn btn-outline"
                  style={{ fontSize: "0.82rem", padding: "5px 12px", borderRadius: 20 }}
                >
                  <span>Login</span>
                  <i className="fa-solid fa-right-to-bracket"></i>
                </Link>
              ) : null}
              <Link
                href="/pvc-print"
                className="btn btn-primary desktop-pvc-btn"
                style={{
                  background: "linear-gradient(135deg, #0d6efd, #0369a1)",
                  border: "none",
                }}
              >
                <span>PVC Print</span>
                <i className="fa-solid fa-id-card"></i>
              </Link>
            </div>

            <button
              className="hamburger"
              aria-label="Toggle navigation"
              onClick={() => setOpen(true)}
              type="button"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <style>{`
        @media (max-width: 768px) {
          .desktop-pvc-btn { display: none !important; }
          .nav-right-actions { margin-left: auto !important; }
        }
      `}</style>

      <div
        className={`backdrop${open ? " show" : ""}`}
        onClick={close}
      ></div>
      <aside className={`mobile-nav${open ? " open" : ""}`}>
        <div className="mobile-nav-header">
          <div className="logo">
            <img
              src="/assets/images/logo.png"
              alt="Digital Service Logo"
              style={{
                height: 48,
                width: "auto",
                background: "#ffffff",
                padding: "4px 8px",
                borderRadius: 8,
                display: "block",
              }}
            />
          </div>
          <button
            type="button"
            onClick={close}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.4rem",
              cursor: "pointer",
              color: "var(--navy-deep)",
            }}
          >
            &times;
          </button>
        </div>

        <ul className="mobile-nav-links">
          <li>
            <Link href="/" onClick={close}>Home</Link>
          </li>
          <li>
            <Link href="/services" onClick={close}>Services</Link>
          </li>
          <li>
            <Link href="/pvc-print" onClick={close} style={{ color: "var(--primary-blue)", fontWeight: 700 }}>
              <i className="fa-solid fa-id-card"></i> Order PVC Plastic Cards
            </Link>
          </li>
          <li>
            <Link href="/track" onClick={close}>
              <i className="fa-solid fa-magnifying-glass"></i> Track Application
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={close}>About Us</Link>
          </li>
          <li>
            <Link href="/contact" onClick={close}>Contact Us</Link>
          </li>
        </ul>

        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          {user && canUseUserPortal(user.role) ? (
            <Link
              href="/user-dashboard"
              className="btn btn-primary"
              onClick={close}
              style={{ width: "100%", background: "#10b981", border: "none", marginBottom: 8 }}
            >
              My Account Portal <i className="fa-solid fa-circle-user"></i>
            </Link>
          ) : null}
          {user && isStaffRole(user.role) ? (
            <Link href="/admin" className="btn btn-primary" onClick={close} style={{ width: "100%" }}>
              Open Staff Portal <i className="fa-solid fa-shield-halved"></i>
            </Link>
          ) : null}
          {!user ? (
            <Link href="/user-login" className="btn btn-primary" onClick={close} style={{ width: "100%" }}>
              Login to Account <i className="fa-solid fa-right-to-bracket"></i>
            </Link>
          ) : null}
        </div>
      </aside>
    </>
  );
}
