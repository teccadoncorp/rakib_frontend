"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { LottieMark } from "@/components/LottieMark";
import "@/app/admin/admin.css";

export default function AdminLoginPage() {
  return (
    <Suspense>
      <StaffLoginInner />
    </Suspense>
  );
}

function StaffLoginInner() {
  const { adminLogin } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminLogin(username.trim(), password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ap-login">
      <div className="ap-login-card">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LottieMark kind="loader" size={110} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div className="ap-kicker">Digital Service</div>
          <h2 className="ap-title" style={{ fontSize: "1.55rem" }}>Staff portal</h2>
          <p className="ap-sub">Admin, superior, distributor and retailer sign in here.</p>
        </div>
        {params.get("activated") ? (
          <p style={{ color: "#34d399", fontSize: "0.88rem" }}>Invite accepted. Sign in with your new password.</p>
        ) : null}
        {error ? <p style={{ color: "#f87171", fontSize: "0.88rem" }}>{error}</p> : null}
        <form onSubmit={onSubmit} noValidate>
          <div style={{ marginBottom: 12 }}>
            <label className="ap-label">Email, mobile or username</label>
            <input
              className="ap-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="admin"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="ap-label">Password</label>
            <input
              className="ap-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="ap-btn" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Opening workspace..." : "Enter control room"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: "0.82rem" }}>
          <Link href="/forgot-password" style={{ color: "#0d6efd" }}>
            Forgot password
          </Link>
          {" · "}
          <Link href="/" style={{ color: "#0d6efd" }}>
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
