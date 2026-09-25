"use client";

import { FormEvent, useMemo, useState } from "react";
import { EnquiryFieldInputs } from "@/components/EnquiryFieldInputs";
import { api } from "@/lib/api";
import { useSettings } from "@/lib/cms";
import { normalizeEnquiryFields, packEnquiryAnswers } from "@/lib/enquiry-fields";
import type { Service } from "@/lib/data";
import { telHref, waHref } from "@/lib/site";

export function PublicServiceEnquiry({ service }: { service: Service }) {
  const settings = useSettings();
  const fields = useMemo(() => normalizeEnquiryFields(service.enquiryFields), [service.enquiryFields]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const waText = `Hello, I want help with ${service.title}.`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setSaving(true);
    setError("");
    setSuccess("");
    const form = new FormData(formEl);
    form.set("service_slug", service.slug);
    packEnquiryAnswers(form, fields);
    try {
      const res = await api.publicEnquiry(form);
      const ref = res.application?.ref || "";
      setSuccess(
        `${settings.enquirySuccess || "Your enquiry has been submitted successfully."} ${ref ? `Your reference ID is ${ref}. Use Track Status to follow progress and download completed documents such as a trade licence PDF.` : ""}`.trim()
      );
      formEl.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit this enquiry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <a href={telHref(settings)} className="btn btn-primary" style={{ flex: 1, minWidth: 140, justifyContent: "center" }}>
          <i className="fa-solid fa-phone"></i> Call {settings.phone}
        </a>
        <a
          href={waHref(waText, settings)}
          target="_blank"
          rel="noreferrer"
          className="btn"
          style={{ flex: 1, minWidth: 140, justifyContent: "center", background: "#25d366", color: "#fff" }}
        >
          <i className="fa-brands fa-whatsapp"></i> WhatsApp
        </a>
      </div>

      <h3 style={{ fontSize: "1.05rem", color: "var(--navy-deep)", margin: "0 0 12px" }}>
        Send an enquiry for {service.title}
      </h3>
      <p style={{ fontSize: "0.85rem", color: "var(--slate-500)", margin: "0 0 16px" }}>
        No login needed. After we finish the work, the completed document for this application appears on Track Status.
      </p>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {success ? <div className="alert alert-success">{success}</div> : null}
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <EnquiryFieldInputs
          fields={fields.map((field) =>
            field.name === "message" && !field.placeholder
              ? { ...field, label: field.label || `Details for ${service.title}`, placeholder: `Tell us what you need for ${service.title}.` }
              : field
          )}
          idPrefix={service.slug}
        />
        {(service.documents || []).map((doc) => (
          <div className="form-group" key={doc.name}>
            <label className="form-label">
              {doc.name} {doc.required ? <span style={{ color: "red" }}>*</span> : <span className="ap-muted">(optional)</span>}
            </label>
            <input
              type="file"
              name={`doc_${String(doc.name || "file").replace(/\s+/g, "_").toLowerCase()}`}
              className="form-control"
              required={Boolean(doc.required)}
              accept={(doc.allowed || "pdf,jpg,jpeg,png").split(",").map((ext) => `.${ext.trim()}`).join(",")}
            />
            <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", marginTop: 4 }}>{doc.hint || doc.formats}</div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: "100%", padding: 12, marginTop: 8 }}>
          {saving ? "Sending..." : "Submit enquiry"} <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}
