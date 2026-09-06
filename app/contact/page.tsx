"use client";

import { FormEvent, useState } from "react";
import { SITE, waHref } from "@/lib/site";
import { api } from "@/lib/api";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await api.contact({
        name: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || ""),
        subject: String(form.get("subject") || ""),
        message: String(form.get("message") || ""),
      });
      setStatus("ok");
      setMessage("Thank you. Your message has been received. Our team will contact you shortly.");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Unable to send message right now.");
    }
  }

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Have questions or need assistance? Reach out to our local team today.</p>
        </div>
      </section>

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

            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border-light)",
                borderRadius: 20,
                padding: 36,
                boxShadow: "var(--card-shadow)",
              }}
            >
              <h3 style={{ fontSize: "1.3rem", marginBottom: 20, color: "var(--navy-deep)" }}>Send Us a Message</h3>
              {status !== "idle" ? (
                <div className={status === "ok" ? "alert alert-success" : "alert alert-danger"}>{message}</div>
              ) : null}
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact_name">
                    Your Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input type="text" id="contact_name" name="name" className="form-control" required placeholder="Enter full name" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact_phone">
                      Phone Number <span style={{ color: "red" }}>*</span>
                    </label>
                    <input type="tel" id="contact_phone" name="phone" className="form-control" required placeholder="10-digit mobile number" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact_email">Email (Optional)</label>
                    <input type="email" id="contact_email" name="email" className="form-control" placeholder="name@example.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact_subject">Subject</label>
                  <input type="text" id="contact_subject" name="subject" className="form-control" placeholder="e.g. Query regarding GST 1" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact_message">
                    Your Message <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea id="contact_message" name="message" className="form-control" rows={4} required placeholder="Write your message here..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: 12, fontSize: "0.98rem", marginTop: 10 }}>
                  Send Message <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>

          <div style={{ marginTop: 50, borderRadius: 20, overflow: "hidden", border: "1px solid var(--border-light)", boxShadow: "var(--card-shadow)" }}>
            <iframe
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
