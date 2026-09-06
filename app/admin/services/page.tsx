"use client";

import { AdminShell } from "@/components/AdminShell";
import { SERVICES, formatInr } from "@/lib/data";

export default function AdminServicesPage() {
  return (
    <AdminShell>
      <div className="ap-kicker">Catalog</div>
      <h1 className="ap-title">Services</h1>
      <p className="ap-sub" style={{ marginBottom: 18 }}>
        AEPS, all mobile recharge and PAN stay partner-gated for regular users.
      </p>
      <div style={{ display: "grid", gap: 12 }}>
        {SERVICES.map((s, i) => (
          <div key={s.slug} className="ap-card" style={{ animationDelay: `${i * 40}ms`, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <strong style={{ color: "#fff" }}>{s.title}</strong>
              <p style={{ color: "#94a3b8", margin: "6px 0 0", fontSize: "0.88rem" }}>{s.description}</p>
              {s.requiresPartner ? (
                <span className="ap-chip" style={{ display: "inline-block", marginTop: 10 }}>Needs retailer / distributor ID</span>
              ) : null}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, color: "#7dd3fc" }}>{s.price ? formatInr(s.price) : "As Applicable"}</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{s.processingTime}</div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
