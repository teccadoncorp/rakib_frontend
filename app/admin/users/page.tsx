"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { api, type User } from "@/lib/api";
import { roleLabel } from "@/lib/roles";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);
  const [role, setRole] = useState("");
  const [q, setQ] = useState("");

  async function load() {
    if (!token) return;
    const res = await api.staffUsers(token, role || undefined);
    setUsers(res.users);
  }

  useEffect(() => {
    load().catch(() => setUsers([]));
  }, [token, role]);

  const filtered = useMemo(() => {
    const list = users || [];
    const query = q.trim().toLowerCase();
    if (!query) return list;
    return list.filter((u) =>
      [u.name, u.email, u.mobile, u.userCode, u.partnerCode, u.role].some((v) =>
        String(v || "").toLowerCase().includes(query)
      )
    );
  }, [users, q]);

  return (
    <AdminShell>
      <div className="ap-kicker">Directory</div>
      <h1 className="ap-title">People</h1>
      <p className="ap-sub" style={{ marginBottom: 18 }}>
        Admins see everyone. Distributors only see the retailers they created.
      </p>
      <div className="ap-card" style={{ marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input className="ap-input" style={{ maxWidth: 280 }} placeholder="Search name, mobile, code" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="ap-select" style={{ maxWidth: 200 }} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="user">Users</option>
          <option value="retailer">Retailers</option>
          <option value="distributor">Distributors</option>
          <option value="superior">Superiors</option>
          <option value="admin">Admins</option>
        </select>
      </div>
      <div className="ap-card">
        {!users ? (
          <div className="ap-empty"><LottieMark kind="loader" size={110} /></div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty">
            <LottieMark kind="empty" size={140} />
            <p>No people in this view yet.</p>
          </div>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Codes</th>
                  <th>Contact</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                      <div style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{u.userCode}</div>
                    </td>
                    <td>{roleLabel(u.role)}</td>
                    <td style={{ fontFamily: "monospace" }}>{u.partnerCode || "—"}</td>
                    <td>
                      {u.mobile}
                      <div style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{u.email || "—"}</div>
                    </td>
                    <td>
                      <select
                        className="ap-select"
                        value={u.status || "active"}
                        onChange={async (e) => {
                          if (!token) return;
                          await api.patchUser(token, u.id, { status: e.target.value });
                          await load();
                        }}
                      >
                        <option value="active">active</option>
                        <option value="invited">invited</option>
                        <option value="suspended">suspended</option>
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
