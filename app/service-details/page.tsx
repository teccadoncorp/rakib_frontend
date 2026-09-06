"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getService } from "@/lib/data";

export default function ServiceDetailsPage() {
  return (
    <Suspense>
      <DetailsInner />
    </Suspense>
  );
}

function DetailsInner() {
  const params = useSearchParams();
  const service = useMemo(() => getService(params.get("slug")), [params]);

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </div>
      </section>
      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, alignItems: "start" }}>
            <div>
              <div style={{ background: "#f8fafc", border: "1px solid var(--border-light)", borderRadius: 20, padding: 30, marginBottom: 30 }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: 16 }}>Service Overview</h2>
                <div style={{ fontSize: "0.98rem", color: "var(--slate-600)", lineHeight: 1.7 }}>{service.overview}</div>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid var(--border-light)", borderRadius: 20, padding: 30, boxShadow: "var(--card-shadow)", marginBottom: 30 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                  <h3 style={{ fontSize: "1.3rem", margin: 0 }}>
                    <i className="fa-solid fa-file-shield" style={{ color: "var(--primary-blue)", marginRight: 8 }}></i> Required Documents
                  </h3>
                  <span style={{ fontSize: "0.8rem", background: "var(--sky-accent)", color: "var(--primary-blue)", fontWeight: 700, padding: "4px 12px", borderRadius: 20, display: "inline-block" }}>
                    Dynamic Config
                  </span>
                </div>
                {service.documents.length === 0 ? (
                  <p style={{ color: "var(--slate-500)", fontSize: "0.9rem" }}>
                    No specific document uploads required for this service. Simply fill customer details on application.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {service.documents.map((doc) => (
                      <div key={doc.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#f8fafc", border: "1px solid var(--border-light)", borderRadius: 12, flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <strong style={{ fontSize: "0.95rem", color: "var(--navy-deep)" }}>{doc.name}</strong>
                          <p style={{ fontSize: "0.82rem", color: "var(--slate-500)", marginTop: 2 }}>{doc.hint}</p>
                          <span style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>Allowed formats: {doc.formats}</span>
                        </div>
                        <div>
                          <span className={doc.required ? "doc-badge-req" : "doc-badge-opt"}>
                            {doc.required ? "Mandatory" : "Optional"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid var(--border-light)", borderRadius: 20, padding: 30 }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: 16 }}>
                  <i className="fa-solid fa-list-ol" style={{ color: "var(--primary-blue)", marginRight: 8 }}></i> How to Apply
                </h3>
                <ol style={{ marginLeft: 20, color: "var(--slate-600)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                  <li>Click on <strong>&quot;Apply / Send Enquiry&quot;</strong> button below.</li>
                  <li>Fill out your Name, Mobile Number, Email, and Business Address.</li>
                  <li>Upload the required documents listed above (Mandatory documents are marked with red badge).</li>
                  <li>Submit your application to receive a unique <strong>Enquiry Reference ID</strong>.</li>
                  <li>Click <strong>&quot;Contact on WhatsApp&quot;</strong> to immediately share your Enquiry ID with our team for priority processing!</li>
                </ol>
              </div>
            </div>

            <div>
              <div style={{ position: "sticky", top: 100, background: "var(--white)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 30, boxShadow: "var(--card-shadow)", textAlign: "center" }}>
                <div style={{ width: 60, height: 60, background: "var(--sky-accent)", color: "var(--primary-blue)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.6rem" }}>
                  <i className="fa-solid fa-hand-holding-dollar"></i>
                </div>
                <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", color: "var(--slate-500)", letterSpacing: "0.05em" }}>Estimated Pricing</h4>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--navy-deep)", margin: "10px 0" }}>
                  {service.priceDisplay}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", marginBottom: 24 }}>
                  <i className="fa-solid fa-clock" style={{ color: "var(--primary-blue)" }}></i> Processing Time: <strong>{service.processingTime}</strong>
                </div>
                <Link href={`/apply?service=${service.slug}`} className="btn btn-primary" style={{ width: "100%", padding: 14, fontSize: "1rem" }}>
                  Apply / Send Enquiry <i className="fa-solid fa-paper-plane"></i>
                </Link>
                <div style={{ marginTop: 16, fontSize: "0.8rem", color: "var(--slate-500)" }}>
                  <i className="fa-solid fa-lock" style={{ color: "var(--mint-accent)" }}></i> Secure document submission & fast support.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
