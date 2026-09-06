"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function AcceptInvitePage() {
  return (
    <Suspense>
      <AcceptInner />
    </Suspense>
  );
}

function AcceptInner() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const router = useRouter();
  const { logout } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.acceptInvite(token, password);
      logout();
      if (res.user.role === "admin" || res.user.role === "superior") router.push("/admin/login?activated=1");
      else router.push("/user-login?activated=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to accept invite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" style={{ background: "linear-gradient(135deg, #f8fafc, #e0f2fe)", minHeight: "70vh", padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid var(--border-light)", padding: 36 }}>
          <h2 style={{ fontSize: "1.45rem", color: "var(--navy-deep)", marginBottom: 8 }}>Accept your invite</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--slate-500)", marginBottom: 18 }}>
            Choose a password to activate your retailer, distributor, or user account.
          </p>
          {!token ? (
            <div className="alert alert-danger">This invite link is missing a token.</div>
          ) : (
            <form onSubmit={onSubmit}>
              {error ? <div className="alert alert-danger">{error}</div> : null}
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" required minLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm password</label>
                <input type="password" name="confirm" className="form-control" required minLength={6} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                {loading ? "Activating..." : "Activate account"}
              </button>
            </form>
          )}
          <div style={{ marginTop: 16 }}>
            <Link href="/" style={{ color: "var(--primary-blue)", fontWeight: 700 }}>
              Back to website
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
