import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>How we collect, use, and protect your personal information and uploaded documents.</p>
        </div>
      </section>
      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ lineHeight: 1.8, color: "var(--slate-600)" }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 12 }}>1. Information We Collect</h2>
            <p style={{ marginBottom: 20 }}>
              When you submit an application or service enquiry through <strong>Digital Service</strong>, we collect personal information including your full name, phone number, email address, residential/business address, and identity documents (such as Aadhaar card, PAN card, bank details, passport photos) specifically required to process your selected service.
            </p>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 12 }}>2. How We Use Your Documents</h2>
            <p style={{ marginBottom: 20 }}>
              Your uploaded documents are strictly used for verifying and executing your requested digital banking, tax filing, GST registration, or government compliance services. We do not sell, rent, or trade your personal data to any third-party marketing companies.
            </p>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 12 }}>3. Secure Document Protection</h2>
            <p style={{ marginBottom: 20 }}>
              Customer security is our highest priority. All uploaded customer documents are stored with random server-generated filenames in protected server directories. Public web access to these document URLs is restricted, and files can only be accessed by authorized administration staff through authenticated sessions.
            </p>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 12 }}>4. Contact & Inquiries</h2>
            <p style={{ marginBottom: 20 }}>
              If you have any questions regarding your privacy or wish to update your details, please contact us at <strong>rhossen389@gmail.com</strong> or call <strong>+91 7872292614</strong>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
