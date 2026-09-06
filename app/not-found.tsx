import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Page not found",
  description: "This page is missing. Browse Digital Service offerings or contact the Jaynagar centre.",
  path: "/",
  index: false,
});

export default function NotFound() {
  return (
    <section className="section" style={{ background: "#ffffff", minHeight: "50vh" }}>
      <div className="container" style={{ textAlign: "center", maxWidth: 560 }}>
        <h1 style={{ fontSize: "2rem", color: "var(--navy-deep)", marginBottom: 12 }}>Page not found</h1>
        <p style={{ color: "var(--slate-600)", marginBottom: 24 }}>
          That link is missing or has moved. Open services, PVC cards, or contact the Jaynagar centre.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary">
            Home
          </Link>
          <Link href="/services" className="btn btn-outline">
            Services
          </Link>
          <Link href="/contact" className="btn btn-outline">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
