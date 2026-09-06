"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/user-dashboard";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      await login(String(form.get("login_input") || ""), String(form.get("password") || ""));
      router.push(redirect.startsWith("/") ? redirect : "/user-dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid login details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" style={{ background: "linear-gradient(135deg, #f8fafc, #e0f2fe)", minHeight: "75vh", padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid var(--border-light)", padding: 36, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                width: 56,
                height: 56,
                background: "var(--sky-accent)",
                color: "var(--primary-blue)",
                borderRadius: 16,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                marginBottom: 12,
              }}
            >
              <i className="fa-solid fa-right-to-bracket"></i>
            </div>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 6 }}>Customer Login</h2>
            <p style={{ fontSize: "0.88rem", color: "var(--slate-500)" }}>
              Users, retailers and distributors sign in here. The staff panel is an extra workspace for partners.
            </p>
          </div>

          {error ? <div className="alert alert-danger">{error}</div> : null}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Mobile Number or Email</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  name="login_input"
                  className="form-control"
                  required
                  placeholder="10-digit Mobile or Email"
                  style={{ paddingLeft: 38 }}
                />
                <i className="fa-solid fa-mobile-screen-button" style={{ position: "absolute", left: 14, top: 14, color: "var(--slate-500)" }}></i>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input type="password" name="password" className="form-control" required placeholder="Enter password" style={{ paddingLeft: 38 }} />
                <i className="fa-solid fa-lock" style={{ position: "absolute", left: 14, top: 14, color: "var(--slate-500)" }}></i>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: 14, fontSize: "1rem", fontWeight: 800, borderRadius: 12, marginTop: 10 }}
            >
              {loading ? "Signing In..." : "Sign In"} <i className="fa-solid fa-right-to-bracket"></i>
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.88rem" }}>
            <Link href="/forgot-password" style={{ color: "var(--primary-blue)", fontWeight: 700 }}>
              Forgot password?
            </Link>
          </div>

          <div style={{ textAlign: "center", marginTop: 24, fontSize: "0.88rem", color: "var(--slate-500)", borderTop: "1px solid #f1f5f9", paddingTop: 18 }}>
            Don&apos;t have an account?{" "}
            <Link href="/user-register" style={{ color: "var(--primary-blue)", fontWeight: 700 }}>
              Create Account &rarr;
            </Link>
            <div style={{ marginTop: 10 }}>
              Staff, retailer or distributor?{" "}
              <Link href="/admin/login" style={{ color: "var(--primary-blue)", fontWeight: 700 }}>
                Open staff portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
