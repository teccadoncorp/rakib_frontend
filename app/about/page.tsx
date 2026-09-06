import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { BankSvg, WhyChooseUs } from "../page";
import { loadPublicSettings } from "@/lib/catalog";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMeta({
  title: "About Digital Service, Jaynagar",
  description:
    "Digital Service is a local centre in Jaynagar (Bakultala) for AEPS, recharge, PAN, GST, income tax, MSME and trade licence — fast, confidential, and affordable.",
  path: "/about",
});

export default async function AboutPage() {
  const settings = await loadPublicSettings();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <section className="page-banner">
        <div className="container">
          <h1>About Digital Service</h1>
          <p>Your Local Trusted Digital Partner for Online Banking, GST, Tax Filing, and Business Registration.</p>
        </div>
      </section>

      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="about-grid-2col">
            <div className="about-banner-illustration">
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <BankSvg />
                <h3 style={{ marginTop: 14, color: "var(--navy-deep)", fontSize: "1.2rem" }}>
                  Digital Service Centre
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--slate-500)" }}>
                  Jaynagar (Bakultala), South 24 Parganas
                </p>
              </div>
            </div>
            <div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--primary-blue)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                  display: "inline-block",
                }}
              >
                Our Journey & Mission
              </span>
              <h2 className="section-title" style={{ textAlign: "left", marginBottom: 16 }}>
                Making Digital Compliance <span>Simple & Accessible</span>
              </h2>
              <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 12 }}>
                {settings.about}
              </p>
              <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 24 }}>
                Whether you need AEPS cash withdrawal, urgent mobile/DTH recharge, fresh PAN card application, new GST registration, income tax filing, or MSME certification, we eliminate paperwork complexity and deliver fast results.
              </p>
              <div className="about-stats-grid">
                <div className="stat-box-item">
                  <div style={{ fontSize: "1.2rem", color: "var(--primary-blue)", marginBottom: 4 }}>
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <div className="stat-num-value">{settings.statClients}</div>
                  <div className="stat-text-label">Happy Clients</div>
                </div>
                <div className="stat-box-item">
                  <div style={{ fontSize: "1.2rem", color: "var(--primary-blue)", marginBottom: 4 }}>
                    <i className="fa-solid fa-file-circle-check"></i>
                  </div>
                  <div className="stat-num-value">{settings.statCompleted}</div>
                  <div className="stat-text-label">Services Completed</div>
                </div>
                <div className="stat-box-item">
                  <div style={{ fontSize: "1.2rem", color: "var(--primary-blue)", marginBottom: 4 }}>
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div className="stat-num-value">{settings.statExperience}</div>
                  <div className="stat-text-label">of Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
    </>
  );
}
