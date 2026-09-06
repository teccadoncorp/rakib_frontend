import type { Metadata } from "next";
import { BankSvg, WhyChooseUs } from "../page";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <>
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
                We are a trusted digital service provider offering a wide range of online services including AEPS, Recharge, PAN Card, GST, Income Tax, MSME Registration, Trade Licence and many more. Our goal is to make digital services simple, accessible and reliable for everyone.
              </p>
              <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 24 }}>
                Whether you need AEPS cash withdrawal, urgent mobile/DTH recharge, fresh PAN card application, new GST registration, income tax filing, or MSME certification, we eliminate paperwork complexity and deliver fast results.
              </p>
              <div className="about-stats-grid">
                <div className="stat-box-item">
                  <div style={{ fontSize: "1.2rem", color: "var(--primary-blue)", marginBottom: 4 }}>
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <div className="stat-num-value">500+</div>
                  <div className="stat-text-label">Happy Clients</div>
                </div>
                <div className="stat-box-item">
                  <div style={{ fontSize: "1.2rem", color: "var(--primary-blue)", marginBottom: 4 }}>
                    <i className="fa-solid fa-file-circle-check"></i>
                  </div>
                  <div className="stat-num-value">1000+</div>
                  <div className="stat-text-label">Services Completed</div>
                </div>
                <div className="stat-box-item">
                  <div style={{ fontSize: "1.2rem", color: "var(--primary-blue)", marginBottom: 4 }}>
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div className="stat-num-value">5+ Years</div>
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
