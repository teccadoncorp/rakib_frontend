"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await api.forgotPassword(String(form.get("email") || ""));
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" style={{ background: "linear-gradient(135deg, #f8fafc, #e0f2fe)", minHeight: "70vh", padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid var(--border-light)", padding: 36, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: "1.45rem", color: "var(--navy-deep)", marginBottom: 8 }}>Forgot password</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--slate-500)", marginBottom: 20 }}>
            Enter the email on your account. We will send a reset link through SMTP.
          </p>
          {error ? <div className="alert alert-danger">{error}</div> : null}
          {message ? <div className="alert alert-success">{message}</div> : null}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" required placeholder="name@example.com" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: 12 }}>
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <Link href="/user-login" style={{ color: "var(--primary-blue)", fontWeight: 700 }}>
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
