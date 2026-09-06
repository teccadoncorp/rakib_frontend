"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { api, type PortalSettings } from "@/lib/api";

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<PortalSettings | null>(null);
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (!token) return;
    api.staffSettings(token).then((res) => setSettings(res.settings)).catch(() => setSettings(null));
  }, [token]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !settings) return;
    const res = await api.patchSettings(token, settings);
    setSettings(res.settings);
    setOk("Settings saved for the staff workspace.");
  }

  return (
    <AdminShell>
      <div className="ap-kicker">System</div>
      <h1 className="ap-title">Portal settings</h1>
      <p className="ap-sub" style={{ marginBottom: 18 }}>
        SMTP, superior-create secret and MongoDB stay in <code>server/.env</code>.
      </p>
      {!settings ? (
        <div className="ap-empty"><LottieMark kind="loader" size={110} /></div>
      ) : (
        <form className="ap-card" onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 640 }}>
          {ok ? <p style={{ color: "#34d399" }}>{ok}</p> : null}
          {(
            [
              ["name", "Business name"],
              ["phone", "Phone"],
              ["email", "Email"],
              ["upiId", "UPI ID"],
              ["payeeName", "Payee name"],
              ["hours", "Hours"],
              ["address", "Address"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              <div className="ap-label">{label}</div>
              <input
                className="ap-input"
                value={settings[key]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              />
            </label>
          ))}
          <button className="ap-btn" type="submit">Save settings</button>
        </form>
      )}
    </AdminShell>
  );
}
