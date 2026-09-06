import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>Terms & Conditions</h1>
          <p>General terms and conditions for utilizing Digital Service portal and online application services.</p>
        </div>
      </section>
      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ lineHeight: 1.8, color: "var(--slate-600)" }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 12 }}>1. Service Authorization</h2>
            <p style={{ marginBottom: 20 }}>
              By submitting an application or document upload on <strong>Digital Service</strong>, you authorize our team to verify and process your government filings, GST applications, PAN card applications, or banking services on your behalf.
            </p>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 12 }}>2. Document Accuracy</h2>
            <p style={{ marginBottom: 20 }}>
              The customer is solely responsible for providing genuine, clear, and accurate documents. Providing fraudulent or falsified documents may result in immediate rejection of your application by government or banking authorities.
            </p>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 12 }}>3. Processing Timeframes</h2>
            <p style={{ marginBottom: 20 }}>
              Estimated processing times specified on our website (e.g. 1-3 business days) are guidelines based on standard government portal turnaround times. Delays caused by government server downtimes or department queries are outside our direct control.
            </p>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 12 }}>4. Amendments & Modifications</h2>
            <p style={{ marginBottom: 20 }}>
              Digital Service reserves the right to update service offerings, pricing structures, or document requirements at any time without prior notice.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
