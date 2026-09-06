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
};

const FIELDS: { key: keyof PortalSettings; label: string; hint?: string }[] = [
  { key: "name", label: "Business name" },
  { key: "tagline", label: "Tagline" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "WhatsApp number", hint: "Country code + number, no plus. Example 917872292614" },
  { key: "upiId", label: "UPI ID" },
  { key: "payeeName", label: "Payee name" },
  { key: "hours", label: "Working hours" },
];

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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !settings) return;
    setSaving(true);
    setError("");
    setOk("");
    try {
      const res = await api.patchSettings(token, settings);
      setSettings({ ...EMPTY, ...res.settings });
      setOk("Site settings saved. The public website, apply page, and customer dashboard pick this up immediately.");
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
        These fields drive the public website header, footer, contact page, about copy, and UPI payment details on customer applications.
        SMTP, the superior-create secret, and MongoDB stay in <code>server/.env</code>.
      </p>
      {!settings ? (
        <div className="ap-empty"><LottieMark kind="loader" size={110} /></div>
      ) : (
        <form className="ap-card" onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 760 }}>
          {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
          {ok ? <p style={{ color: "#047857" }}>{ok}</p> : null}
          {FIELDS.map(({ key, label, hint }) => (
            <label key={key}>
              <div className="ap-label">{label}</div>
              <input
                className="ap-input"
                value={settings[key]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              />
              {hint ? <div className="ap-muted">{hint}</div> : null}
            </label>
          ))}
          <label>
            <div className="ap-label">Address</div>
            <textarea
              className="ap-textarea"
              rows={3}
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </label>
          <label>
            <div className="ap-label">About the business</div>
            <textarea
              className="ap-textarea"
              rows={4}
              value={settings.about}
              onChange={(e) => setSettings({ ...settings, about: e.target.value })}
            />
            <div className="ap-muted">Shown on the home about block, about page, and footer.</div>
          </label>
          <label>
            <div className="ap-label">Copyright line</div>
            <input
              className="ap-input"
              value={settings.copyright}
              onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
            />
          </label>
          <label>
            <div className="ap-label">Google Maps embed URL</div>
            <textarea
              className="ap-textarea"
              rows={3}
              value={settings.mapEmbed}
              onChange={(e) => setSettings({ ...settings, mapEmbed: e.target.value })}
            />
          </label>
          <button className="ap-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save site settings"}
          </button>
        </form>
      )}
    </AdminShell>
  );
}
