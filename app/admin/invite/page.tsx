"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { LottieMark } from "@/components/LottieMark";
import { useAuth } from "@/lib/auth";
import { api, type User } from "@/lib/api";
import { canInviteRole } from "@/lib/roles";

export default function InvitePage() {
  const { token, user } = useAuth();
  const [distributors, setDistributors] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [supSecret, setSupSecret] = useState("");

  useEffect(() => {
    if (!token) return;
    api.staffUsers(token, "distributor").then((res) => setDistributors(res.users)).catch(() => setDistributors([]));
  }, [token]);

  const roles = ["distributor", "retailer", "user"].filter((role) => canInviteRole(user?.role, role));

  async function onInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    setOk("");
    setInviteUrl("");
    try {
      const res = await api.staffInvite(token, {
        role: String(form.get("role") || ""),
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        mobile: String(form.get("mobile") || ""),
        address: String(form.get("address") || ""),
        parentId: String(form.get("parentId") || ""),
      });
      setOk(`${res.user.name} invited as ${res.user.role}. An email was sent (or logged if SMTP is empty).`);
      if (res.inviteUrl) setInviteUrl(res.inviteUrl);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invite failed.");
    } finally {
      setLoading(false);
    }
  }

  async function onSuperior(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    setOk("");
    setInviteUrl("");
    try {
      const res = await api.createSuperior(token, supSecret, {
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        mobile: String(form.get("mobile") || ""),
        address: String(form.get("address") || ""),
        password: String(form.get("password") || ""),
      });
      setOk(`Superior ${res.user.name} created.`);
      if (res.inviteUrl) setInviteUrl(res.inviteUrl);
      e.currentTarget.reset();
      setSupSecret("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Superior create failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell>
      <div className="ap-kicker">Network growth</div>
      <h1 className="ap-title">Invite people</h1>
      <p className="ap-sub" style={{ marginBottom: 20 }}>
        No self-signup for distributors or retailers. Invites go out by email.
      </p>
      {error ? <p style={{ color: "#f87171" }}>{error}</p> : null}
      {ok ? <p style={{ color: "#34d399" }}>{ok}</p> : null}
      {inviteUrl ? (
        <div className="ap-card" style={{ marginBottom: 16 }}>
          <div className="ap-label">SMTP is not configured — share this link now</div>
          <p className="ap-ref" style={{ wordBreak: "break-all" }}>{inviteUrl}</p>
        </div>
      ) : null}

      <div className="ap-card" style={{ marginBottom: 18 }}>
        <h3>Send invite</h3>
        {roles.length === 0 ? (
          <p className="ap-sub">Your role cannot send invites.</p>
        ) : (
          <form onSubmit={onInvite} style={{ display: "grid", gap: 12 }}>
            <select name="role" className="ap-select" required>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <input name="name" className="ap-input" required placeholder="Full name" />
            <input name="email" type="email" className="ap-input" required placeholder="Email" />
            <input name="mobile" className="ap-input" required placeholder="10-digit mobile" />
            <input name="address" className="ap-input" placeholder="Address" />
            {user?.role !== "distributor" && roles.includes("retailer") ? (
              <select name="parentId" className="ap-select">
                <option value="">Distributor (optional for retailer)</option>
                {distributors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} · {d.partnerCode}</option>
                ))}
              </select>
            ) : null}
            <button className="ap-btn" disabled={loading}>{loading ? "Sending..." : "Email invite"}</button>
          </form>
        )}
      </div>

      {user?.role === "admin" ? (
        <div className="ap-card">
          <h3>Create superior</h3>
          <p className="ap-sub" style={{ marginBottom: 12 }}>
            Only admin can do this, and only with the long <code>SUPERIOR_CREATE_SECRET</code> from the server environment.
          </p>
          <form onSubmit={onSuperior} style={{ display: "grid", gap: 12 }}>
            <input className="ap-input" value={supSecret} onChange={(e) => setSupSecret(e.target.value)} placeholder="Superior create secret" required />
            <input name="name" className="ap-input" required placeholder="Full name" />
            <input name="email" type="email" className="ap-input" required placeholder="Email" />
            <input name="mobile" className="ap-input" required placeholder="Mobile" />
            <input name="address" className="ap-input" placeholder="Address" />
            <input name="password" type="password" className="ap-input" placeholder="Optional password — leave blank to email an invite" />
            <button className="ap-btn" disabled={loading}>Create superior</button>
          </form>
        </div>
      ) : null}

      {loading ? (
        <div className="ap-empty">
          <LottieMark kind="loader" size={90} />
        </div>
      ) : null}
    </AdminShell>
  );
}
