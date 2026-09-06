"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetInner />
    </Suspense>
  );
}

function ResetInner() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
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
      await api.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" style={{ background: "linear-gradient(135deg, #f8fafc, #e0f2fe)", minHeight: "70vh", padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid var(--border-light)", padding: 36 }}>
          <h2 style={{ fontSize: "1.45rem", color: "var(--navy-deep)", marginBottom: 8 }}>Set a new password</h2>
          {!token ? (
            <div className="alert alert-danger">This reset link is missing a token.</div>
          ) : done ? (
            <>
              <div className="alert alert-success">Password updated. You can sign in now.</div>
              <Link href="/user-login" className="btn btn-primary" style={{ width: "100%" }}>
                Go to login
              </Link>
            </>
          ) : (
            <form onSubmit={onSubmit}>
              {error ? <div className="alert alert-danger">{error}</div> : null}
              <div className="form-group">
                <label className="form-label">New password</label>
                <input type="password" name="password" className="form-control" required minLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm password</label>
                <input type="password" name="confirm" className="form-control" required minLength={6} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                {loading ? "Saving..." : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
