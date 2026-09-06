"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

export function ContactForm() {
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
    <div
      style={{
        background: "#ffffff",
        border: "1px solid var(--border-light)",
        borderRadius: 20,
        padding: 36,
        boxShadow: "var(--card-shadow)",
      }}
    >
      <h2 style={{ fontSize: "1.3rem", marginBottom: 20, color: "var(--navy-deep)" }}>Send Us a Message</h2>
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
            <label className="form-label" htmlFor="contact_email">
              Email (Optional)
            </label>
            <input type="email" id="contact_email" name="email" className="form-control" placeholder="name@example.com" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="contact_subject">
            Subject
          </label>
          <input type="text" id="contact_subject" name="subject" className="form-control" placeholder="e.g. Query regarding GST" />
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
  );
}
