import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { MoreServicesCard, ServiceCard } from "@/components/ServiceCard";
import { loadPublicServices } from "@/lib/catalog";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMeta({
  title: "Digital Services in Jaynagar",
  description:
    "AEPS, mobile recharge, PAN, GST registration and returns, income tax, MSME, trade licence, and PVC card printing from Digital Service, Jaynagar.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await loadPublicServices();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <section className="page-banner">
        <div className="container">
          <h1>Our Digital Services</h1>
          <p>Fast, reliable, and affordable compliance & banking services for individuals and business owners.</p>
        </div>
      </section>

      <section style={{ background: "linear-gradient(135deg, #071938, #0d6efd)", padding: "30px 0", color: "#fff" }}>
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}
        >
          <div>
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <i className="fa-solid fa-id-card"></i> Dedicated Portal
            </span>
            <h2 style={{ fontSize: "1.6rem", color: "#ffffff", margin: "8px 0 4px" }}>
              HD PVC Plastic Card Printing Portal
            </h2>
            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", margin: 0 }}>
              Order single or bulk multiple Aadhaar, Voter, Ration, PAN, and Health Cards on waterproof plastic PVC.
            </p>
          </div>
          <div>
            <Link
              href="/pvc-print"
              className="btn btn-primary"
              style={{
                background: "#ffffff",
                color: "var(--primary-blue)",
                fontWeight: 800,
                fontSize: "1rem",
                padding: "12px 24px",
                borderRadius: 12,
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              }}
            >
              Order PVC Cards Now <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="services-grid-6col">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} showTime />
            ))}
            <MoreServicesCard variant="catalog" />
          </div>
        </div>
      </section>
    </>
  );
}
