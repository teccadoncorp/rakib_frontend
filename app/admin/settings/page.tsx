"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { api, type PortalSettings } from "@/lib/api";

const EMPTY: PortalSettings = {
  name: "",
  tagline: "",
  phone: "",
  email: "",
  whatsapp: "",
  address: "",
  hours: "",
  upiId: "",
  payeeName: "",
  about: "",
  copyright: "",
  mapEmbed: "",
  heroTitle: "",
  heroSubtitle: "",
  heroCta1: "",
  heroCta2: "",
  qrNote: "",
  enquirySuccess: "",
  statClients: "",
  statCompleted: "",
  statExperience: "",
  roleSelection: "on",
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <div className="ap-label">{label}</div>
      {children}
      {hint ? <div className="ap-muted">{hint}</div> : null}
    </label>
  );
}

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<PortalSettings | null>(null);
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.staffSettings(token).then((res) => setSettings({ ...EMPTY, ...res.settings })).catch(() => setSettings(EMPTY));
  }, [token]);

  function set<K extends keyof PortalSettings>(key: K, value: PortalSettings[K]) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !settings) return;
    setSaving(true);
    setError("");
    setOk("");
    try {
      const res = await api.patchSettings(token, settings);
      setSettings({ ...EMPTY, ...res.settings });
      setOk("Site settings saved. Homepage, contact, apply payment, and the customer dashboard now use this copy.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="ap-kicker">CMS</div>
      <h1 className="ap-title">Site settings</h1>
      <p className="ap-sub" style={{ marginBottom: 18 }}>
        Same controls as the old admin: business details, UPI/QR, homepage hero, stats, and enquiry copy.
      </p>
      {!settings ? (
        <div className="ap-empty"><LottieMark kind="loader" size={110} /></div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16, maxWidth: 820 }}>
          {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
          {ok ? <p style={{ color: "#047857" }}>{ok}</p> : null}

          <section className="ap-card" style={{ display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>Business details</h2>
            <Field label="Site title / business name"><input className="ap-input" value={settings.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Tagline"><input className="ap-input" value={settings.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
            <Field label="Phone number"><input className="ap-input" value={settings.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="Email address"><input className="ap-input" value={settings.email} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="WhatsApp number" hint="10-digit or 91XXXXXXXXXX. Used for the floating chat button.">
              <input className="ap-input" value={settings.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
            </Field>
            <Field label="Business address">
              <textarea className="ap-textarea" rows={3} value={settings.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field label="Working hours"><input className="ap-input" value={settings.hours} onChange={(e) => set("hours", e.target.value)} /></Field>
            <Field label="Copyright line"><input className="ap-input" value={settings.copyright} onChange={(e) => set("copyright", e.target.value)} /></Field>
          </section>

          <section className="ap-card" style={{ display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>Online UPI payment & QR</h2>
            <Field label="UPI ID / VPA"><input className="ap-input" value={settings.upiId} onChange={(e) => set("upiId", e.target.value)} /></Field>
            <Field label="Payee / account name"><input className="ap-input" value={settings.payeeName} onChange={(e) => set("payeeName", e.target.value)} /></Field>
            <Field label="QR payment instructions">
              <textarea className="ap-textarea" rows={3} value={settings.qrNote} onChange={(e) => set("qrNote", e.target.value)} />
            </Field>
            <Field label="Retailer / distributor role on apply forms">
              <select className="ap-select" value={settings.roleSelection} onChange={(e) => set("roleSelection", e.target.value)}>
                <option value="on">ON (show partner ID when the service needs it)</option>
                <option value="mandatory">ON (mandatory partner ID for every service)</option>
                <option value="off">OFF (hide partner ID from customers)</option>
              </select>
            </Field>
          </section>

          <section className="ap-card" style={{ display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>Homepage content</h2>
            <Field label="Hero title"><input className="ap-input" value={settings.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} /></Field>
            <Field label="Hero subtitle">
              <textarea className="ap-textarea" rows={3} value={settings.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
            </Field>
            <div className="ap-form-grid">
              <Field label="Hero button 1"><input className="ap-input" value={settings.heroCta1} onChange={(e) => set("heroCta1", e.target.value)} /></Field>
              <Field label="Hero button 2"><input className="ap-input" value={settings.heroCta2} onChange={(e) => set("heroCta2", e.target.value)} /></Field>
            </div>
            <Field label="About us paragraph">
              <textarea className="ap-textarea" rows={4} value={settings.about} onChange={(e) => set("about", e.target.value)} />
            </Field>
            <div className="ap-form-grid">
              <Field label="Stat: Happy clients"><input className="ap-input" value={settings.statClients} onChange={(e) => set("statClients", e.target.value)} /></Field>
              <Field label="Stat: Services completed"><input className="ap-input" value={settings.statCompleted} onChange={(e) => set("statCompleted", e.target.value)} /></Field>
              <Field label="Stat: Years of experience"><input className="ap-input" value={settings.statExperience} onChange={(e) => set("statExperience", e.target.value)} /></Field>
            </div>
            <Field label="Enquiry success message">
              <textarea className="ap-textarea" rows={3} value={settings.enquirySuccess} onChange={(e) => set("enquirySuccess", e.target.value)} />
            </Field>
            <Field label="Google Maps embed URL">
              <textarea className="ap-textarea" rows={3} value={settings.mapEmbed} onChange={(e) => set("mapEmbed", e.target.value)} />
            </Field>
          </section>

          <button className="ap-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save all settings"}
          </button>
        </form>
      )}
    </AdminShell>
  );
}
