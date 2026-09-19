"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { DeliveryFiles } from "@/components/DeliveryFiles";
import { api, type Application, type Interest } from "@/lib/api";
import { useCatalog } from "@/lib/cms";
import { formatInr } from "@/lib/data";
import { canUseUserPortal, isPartnerRole, roleLabel } from "@/lib/roles";

export default function DashboardPage() {
  const { user, token, ready, logout } = useAuth();
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const services = useCatalog();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/user-login?redirect=/user-dashboard");
      return;
    }
    if (!canUseUserPortal(user.role)) {
      router.replace("/admin");
      return;
    }
    if (token) {
      api.myApplications(token).then((res) => setApps(res.applications)).catch(() => setApps([]));
      api.myInterests(token).then((res) => setInterests(res.interests)).catch(() => setInterests([]));
    }
  }, [ready, user, token, router]);

  if (!ready || !user || !canUseUserPortal(user.role)) return null;

  const completed = apps.filter((a) => a.status === "completed").length;
  const progress = apps.filter((a) => a.status === "pending" || a.status === "in_progress").length;

  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #071938, #0d6efd)", color: "#fff", padding: "40px 0 30px" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <span
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              <i className="fa-solid fa-circle-user"></i> {roleLabel(user.role)} Account Portal
            </span>
            <h1 style={{ fontSize: "1.9rem", color: "#ffffff", margin: "10px 0 4px" }}>Welcome back, {user.name}!</h1>
            <p style={{ fontSize: "0.95rem", color: "#cbd5e1", margin: 0 }}>
              User ID: <strong style={{ color: "#38bdf8", fontFamily: "monospace" }}>{user.userCode}</strong>
              {user.partnerCode ? (
                <>
                  &nbsp;|&nbsp; Partner ID: <strong style={{ color: "#38bdf8", fontFamily: "monospace" }}>{user.partnerCode}</strong>
                </>
              ) : null}
              &nbsp;|&nbsp; Mobile: <strong>+91 {user.mobile}</strong>
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {isPartnerRole(user.role) ? (
              <Link href="/admin" className="btn btn-primary" style={{ background: "#38bdf8", color: "#071938", fontWeight: 800 }}>
                <i className="fa-solid fa-shield-halved"></i> Staff panel
              </Link>
            ) : null}
            <Link href="/pvc-print" className="btn btn-primary" style={{ background: "#ffffff", color: "var(--primary-blue)", fontWeight: 800 }}>
              <i className="fa-solid fa-id-card"></i> Order PVC Card
            </Link>
            <Link href="/apply" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#ffffff" }}>
              <i className="fa-solid fa-paper-plane"></i> Apply Service
            </Link>
            <button type="button" onClick={() => { logout(); router.push("/"); }} className="btn" style={{ background: "#ef4444", color: "#ffffff", fontWeight: 700 }}>
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#f8fafc", padding: "40px 0 60px" }}>
        <div className="container">
          {!user.emailVerified ? (
            <div className="alert alert-danger" style={{ marginBottom: 20 }}>
              Verify <strong>{user.email}</strong> from the email we sent. AEPS, recharge and PAN stay locked until a partner ID or interest is recorded.
            </div>
          ) : null}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, marginBottom: 30 }}>
            <Kpi icon="fa-folder-open" bg="#e0f2fe" color="#0284c7" label="Total Applications" value={apps.length} />
            <Kpi icon="fa-circle-check" bg="#dcfce7" color="#16a34a" label="Completed Files" value={completed} valueColor="#15803d" />
            <Kpi icon="fa-clock-rotate-left" bg="#fef3c7" color="#d97706" label="In Progress" value={progress} valueColor="#b45309" />
          </div>

          <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid var(--border-light)", padding: 28, boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <h3 style={{ fontSize: "1.3rem", color: "var(--navy-deep)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-solid fa-list-check" style={{ color: "var(--primary-blue)" }}></i> My Applications & PVC Orders
              </h3>
              <Link href="/track" style={{ fontSize: "0.88rem", color: "var(--primary-blue)", fontWeight: 700, textDecoration: "none" }}>
                <i className="fa-solid fa-magnifying-glass"></i> Live Order Tracker &rarr;
              </Link>
            </div>

            {apps.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", background: "#f8fafc", borderRadius: 14, border: "2px dashed #e2e8f0" }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    background: "#e2e8f0",
                    color: "var(--slate-500)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    fontSize: "1.4rem",
                  }}
                >
                  <i className="fa-solid fa-folder-open"></i>
                </div>
                <h4 style={{ fontSize: "1.1rem", color: "var(--navy-deep)", marginBottom: 6 }}>No Applications Submitted Yet</h4>
                <p style={{ fontSize: "0.88rem", color: "var(--slate-500)", marginBottom: 16 }}>
                  You haven&apos;t submitted any service application or PVC card order yet.
                </p>
                <Link href="/pvc-print" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  Order PVC Plastic Card Now
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "var(--slate-500)", fontSize: "0.78rem", textTransform: "uppercase" }}>
                      <th style={{ padding: "10px 8px" }}>Reference</th>
                      <th style={{ padding: "10px 8px" }}>Service</th>
                      <th style={{ padding: "10px 8px" }}>Status</th>
                      <th style={{ padding: "10px 8px" }}>Date</th>
                      <th style={{ padding: "10px 8px" }}>Your documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map((item) => (
                      <tr key={item.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "var(--primary-blue)" }}>{item.ref}</td>
                        <td style={{ padding: "12px 8px" }}>{item.title}</td>
                        <td style={{ padding: "12px 8px", textTransform: "capitalize" }}>{item.status.replace("_", " ")}</td>
                        <td style={{ padding: "12px 8px" }}>{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <DeliveryFiles
                            files={item.deliveries}
                            title="Ready to download"
                            empty="Not issued yet"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid var(--border-light)", padding: 28, boxShadow: "0 10px 30px rgba(0,0,0,0.03)", marginTop: 22 }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--navy-deep)", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fa-solid fa-briefcase" style={{ color: "var(--primary-blue)" }}></i> Apply for a service
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--slate-500)", margin: "0 0 16px" }}>
              Catalog is managed from the staff CMS. Documents and prices on each apply form match what admin publishes.
            </p>
            {services.length === 0 ? (
              <p style={{ fontSize: "0.9rem", color: "var(--slate-500)", margin: 0 }}>No services are published yet.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/apply?service=${service.slug}`}
                    style={{
                      display: "block",
                      padding: 16,
                      borderRadius: 14,
                      border: "1px solid var(--border-light)",
                      background: "#f8fafc",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <strong style={{ display: "block", color: "var(--navy-deep)" }}>{service.title}</strong>
                    <span style={{ fontSize: "0.82rem", color: "var(--primary-blue)", fontWeight: 700 }}>
                      {service.price ? formatInr(service.price) : service.priceDisplay || "As applicable"}
                    </span>
                    <div style={{ fontSize: "0.78rem", color: "var(--slate-500)", marginTop: 6 }}>
                      {service.documents.length} document{service.documents.length === 1 ? "" : "s"}
                      {service.requiresPartner ? " · partner ID" : ""}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid var(--border-light)", padding: 28, boxShadow: "0 10px 30px rgba(0,0,0,0.03)", marginTop: 22 }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--navy-deep)", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fa-solid fa-hand" style={{ color: "var(--primary-blue)" }}></i> Partner interest
            </h3>
            {interests.length === 0 ? (
              <p style={{ fontSize: "0.9rem", color: "var(--slate-500)", margin: 0 }}>
                AEPS, all mobile recharge and PAN need a retailer or distributor ID. If you do not have one, open those apply pages and show interest while logged in.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "var(--slate-500)", fontSize: "0.78rem", textTransform: "uppercase" }}>
                      <th style={{ padding: "10px 8px" }}>Service</th>
                      <th style={{ padding: "10px 8px" }}>Status</th>
                      <th style={{ padding: "10px 8px" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interests.map((item) => (
                      <tr key={item.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "12px 8px" }}>{item.serviceTitle}</td>
                        <td style={{ padding: "12px 8px", textTransform: "capitalize" }}>{item.status}</td>
                        <td style={{ padding: "12px 8px" }}>{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Kpi({
  icon,
  bg,
  color,
  label,
  value,
  valueColor,
}: {
  icon: string;
  bg: string;
  color: string;
  label: string;
  value: number;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        border: "1px solid var(--border-light)",
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: bg,
          color,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
        }}
      >
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--slate-500)", textTransform: "uppercase" }}>{label}</span>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: valueColor || "var(--navy-deep)" }}>{value}</div>
      </div>
    </div>
  );
}
