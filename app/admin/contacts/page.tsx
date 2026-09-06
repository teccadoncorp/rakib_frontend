"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { api, type Contact } from "@/lib/api";

export default function ContactsPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<Contact[] | null>(null);

  useEffect(() => {
    if (!token) return;
    api.staffContacts(token).then((res) => setRows(res.contacts)).catch(() => setRows([]));
  }, [token]);

  return (
    <AdminShell>
      <div className="ap-kicker">Website</div>
      <h1 className="ap-title">Contact inbox</h1>
      <p className="ap-sub" style={{ marginBottom: 18 }}>Messages from the public contact form.</p>
      <div className="ap-card">
        {!rows ? (
          <div className="ap-empty"><LottieMark kind="loader" size={110} /></div>
        ) : rows.length === 0 ? (
          <div className="ap-empty">
            <LottieMark kind="empty" size={140} />
            <p>Inbox is quiet.</p>
          </div>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.name}
                      <div className="ap-muted">{row.phone} · {row.email}</div>
                    </td>
                    <td>{row.subject || "—"}</td>
                    <td>{row.message}</td>
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
