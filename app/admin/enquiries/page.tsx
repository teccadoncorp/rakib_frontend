"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { api, type Application } from "@/lib/api";

export default function AdminEnquiriesPage() {
  const { token } = useAuth();
  const [apps, setApps] = useState<Application[] | null>(null);

  async function load() {
    if (!token) return;
    const res = await api.staffApplications(token);
    setApps(res.applications);
  }

  useEffect(() => {
    load().catch(() => setApps([]));
  }, [token]);

  return (
    <AdminShell>
      <div className="ap-kicker">Pipeline</div>
      <h1 className="ap-title">Applications</h1>
      <p className="ap-sub" style={{ marginBottom: 18 }}>
        Distributors and retailers only see files tagged with their network IDs.
      </p>
      <div className="ap-card">
        {!apps ? (
          <div className="ap-empty"><LottieMark kind="loader" size={110} /></div>
        ) : apps.length === 0 ? (
          <div className="ap-empty">
            <LottieMark kind="empty" size={140} />
            <p>No applications in your scope yet.</p>
          </div>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Partner</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontFamily: "monospace", color: "#7dd3fc" }}>{a.ref}</td>
                    <td>
                      {a.title}
                      <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{a.type}</div>
                    </td>
                    <td>{a.customerName} / {a.mobile}</td>
                    <td>{a.partnerCode || "—"}</td>
                    <td>
                      <select
                        className="ap-select"
                        value={a.status}
                        onChange={async (e) => {
                          if (!token) return;
                          await api.patchApplication(token, a.id, e.target.value);
                          await load();
                        }}
                      >
                        <option value="pending">pending</option>
                        <option value="in_progress">in progress</option>
                        <option value="completed">completed</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
