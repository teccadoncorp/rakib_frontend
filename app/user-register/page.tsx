"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm_password") || "");
    if (password && confirm && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register({
        name: String(form.get("name") || ""),
        mobile: String(form.get("mobile") || ""),
        email: String(form.get("email") || ""),
        address: String(form.get("address") || ""),
        password,
      });
      router.push("/user-dashboard?welcome=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" style={{ background: "linear-gradient(135deg, #f8fafc, #e0f2fe)", minHeight: "80vh", padding: "50px 0" }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid var(--border-light)", padding: 36, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                width: 56,
                height: 56,
                background: "#e0f2fe",
                color: "var(--primary-blue)",
                borderRadius: 16,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                marginBottom: 12,
              }}
            >
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 6 }}>Create Customer Account</h2>
            <p style={{ fontSize: "0.88rem", color: "var(--slate-500)" }}>
              Self-signup is for regular users only. After you register we email a verification link to the address you enter.
            </p>
          </div>

          {error ? <div className="alert alert-danger">{error}</div> : null}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name <span style={{ color: "red" }}>*</span></label>
              <input type="text" name="name" className="form-control" required placeholder="e.g. Rahul Das" />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Mobile Number <span style={{ color: "red" }}>*</span></label>
              <input type="tel" name="mobile" className="form-control" required placeholder="10-digit mobile number" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address <span style={{ color: "red" }}>*</span></label>
              <input type="email" name="email" className="form-control" required placeholder="name@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Village / City Address</label>
              <input type="text" name="address" className="form-control" placeholder="Village / Area Address" />
            </div>
            <div className="form-group">
              <label className="form-label">Create Password <span style={{ color: "red" }}>*</span></label>
              <input type="password" name="password" className="form-control" required placeholder="At least 6 characters" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password <span style={{ color: "red" }}>*</span></label>
              <input type="password" name="confirm_password" className="form-control" required placeholder="Re-enter password" />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: 14, fontSize: "1rem", fontWeight: 800, borderRadius: 12, marginTop: 10 }}
            >
              {loading ? "Creating Account..." : "Create Account & Sign In"} <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24, fontSize: "0.88rem", color: "var(--slate-500)", borderTop: "1px solid #f1f5f9", paddingTop: 18 }}>
            Already have an account?{" "}
            <Link href="/user-login" style={{ color: "var(--primary-blue)", fontWeight: 700 }}>
              Sign In Here &rarr;
            </Link>
            <div style={{ marginTop: 10 }}>
              Retailer or distributor? Ask admin for an invite — there is no self-signup for those roles.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
