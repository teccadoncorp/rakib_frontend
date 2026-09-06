"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { api, type Interest } from "@/lib/api";

export default function InterestsPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<Interest[] | null>(null);

  async function load() {
    if (!token) return;
    const res = await api.staffInterests(token);
    setRows(res.interests);
  }

  useEffect(() => {
    load().catch(() => setRows([]));
  }, [token]);

  return (
    <AdminShell>
      <div className="ap-kicker">Demand</div>
      <h1 className="ap-title">Partner interest</h1>
      <p className="ap-sub" style={{ marginBottom: 18 }}>
        Regular users asked for AEPS, recharge or PAN without a retailer or distributor ID.
      </p>
      <div className="ap-card">
        {!rows ? (
          <div className="ap-empty"><LottieMark kind="loader" size={110} /></div>
        ) : rows.length === 0 ? (
          <div className="ap-empty">
            <LottieMark kind="empty" size={140} />
            <p>No interest records yet.</p>
          </div>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Service</th>
                  <th>Note</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.userName}
                      <div style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{row.mobile} · {row.email}</div>
                    </td>
                    <td>{row.serviceTitle}</td>
                    <td>{row.message || "—"}</td>
                    <td>
                      <select
                        className="ap-select"
                        value={row.status}
                        onChange={async (e) => {
                          if (!token) return;
                          await api.patchInterest(token, row.id, e.target.value);
                          await load();
                        }}
                      >
                        <option value="pending">pending</option>
                        <option value="contacted">contacted</option>
                        <option value="converted">converted</option>
                        <option value="closed">closed</option>
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
