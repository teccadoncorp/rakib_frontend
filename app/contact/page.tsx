import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { breadcrumbJsonLd, canonical, pageMeta } from "@/lib/seo";
import { SITE, waHref } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Contact Digital Service in Jaynagar",
  description:
    "Visit Digital Service at Jibon Mondal Hat, Jaynagar (Bakultala), or call +91 7872292614 / WhatsApp for AEPS, GST, PAN, tax, and PVC card help.",
  path: "/contact",
  keywords: "Digital Service contact, Jaynagar digital centre, Bakultala GST help, 7872292614",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Digital Service",
            url: canonical("/contact"),
          },
        ]}
      />
      <PageBanner
        title="Contact Us"
        subtitle="Have questions or need assistance? Reach out to our local team today."
      />

      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, alignItems: "start" }}>
            <div>
              <h2 style={{ fontSize: "1.6rem", marginBottom: 16, color: "var(--navy-deep)" }}>Get In Touch</h2>
              <p style={{ color: "var(--slate-600)", marginBottom: 28, fontSize: "0.95rem" }}>
                Visit our service centre or contact us directly via phone, WhatsApp, or email for quick support.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 30 }}>
                <InfoRow icon="fa-location-dot" title="Business Address" text={SITE.address} />
                <InfoRow icon="fa-phone" title="Phone Number" text={<a href={`tel:${SITE.phone}`}>{SITE.phoneIntl}</a>} />
                <InfoRow icon="fa-envelope" title="Email Address" text={<a href={`mailto:${SITE.email}`}>{SITE.email}</a>} />
                <InfoRow icon="fa-clock" title="Working Hours" text={SITE.hours} />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href={`tel:${SITE.phone}`} className="btn btn-primary">
                  <i className="fa-solid fa-phone"></i> Call Now
                </a>
                <a href={waHref()} target="_blank" rel="noreferrer" className="btn" style={{ background: "#25d366", color: "#fff" }}>
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
              </div>
            </div>

            <ContactForm />
          </div>

          <div style={{ marginTop: 50, borderRadius: 20, overflow: "hidden", border: "1px solid var(--border-light)", boxShadow: "var(--card-shadow)" }}>
            <iframe
              title="Digital Service Jaynagar map"
              src={SITE.mapEmbed}
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({ icon, title, text }: { icon: string; title: string; text: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div
        style={{
          width: 42,
          height: 42,
          background: "var(--sky-accent)",
          color: "var(--primary-blue)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "1.1rem",
        }}
      >
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <strong style={{ color: "var(--navy-deep)", display: "block", fontSize: "0.95rem" }}>{title}</strong>
        <p style={{ fontSize: "0.88rem", color: "var(--slate-600)", marginTop: 2 }}>{text}</p>
      </div>
    </div>
  );
}
