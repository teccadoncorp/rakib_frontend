"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBottomNav() {
  const pathname = usePathname();
  const bottomActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile">
      <Link href="/" className={`bottom-nav-item${bottomActive("/") ? " active" : ""}`}>
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </Link>
      <Link href="/pvc-print" className={`bottom-nav-item${bottomActive("/pvc-print") ? " active" : ""}`}>
        <i className="fa-solid fa-id-card"></i>
        <span>Order PVC</span>
      </Link>
      <Link href="/apply" className={`bottom-nav-item bottom-nav-center${bottomActive("/apply") ? " active" : ""}`}>
        <div className="center-btn-circle">
          <i className="fa-solid fa-paper-plane"></i>
        </div>
        <span>Apply</span>
      </Link>
      <Link href="/track" className={`bottom-nav-item${bottomActive("/track") ? " active" : ""}`}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <span>Track</span>
      </Link>
      <Link href="/contact" className={`bottom-nav-item${bottomActive("/contact") ? " active" : ""}`}>
        <i className="fa-solid fa-headset"></i>
        <span>Contact</span>
      </Link>
    </nav>
  );
}
