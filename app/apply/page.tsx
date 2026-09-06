"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { formatInr, getService } from "@/lib/data";
import { upiQrUrl } from "@/lib/site";
import { useCatalog, useSettings } from "@/lib/cms";
import { api, type Partner } from "@/lib/api";
import { isPartnerRole, isStaffRole, roleLabel, serviceRequiresPartner } from "@/lib/roles";

export default function ApplyPage() {
  return (
    <Suspense>
      <ApplyInner />
    </Suspense>
  );
}

function ApplyInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, token, ready } = useAuth();
  const slug = params.get("service") || "aeps";
  const catalog = useCatalog();
  const settings = useSettings();
  const service = useMemo(
    () => catalog.find((item) => item.slug === slug) || getService(slug) || catalog[0],
    [catalog, slug]
  );
  const [step, setStep] = useState(1);
  const [partnerCode, setPartnerCode] = useState("");
  const [partner, setPartner] = useState<Partner | null>(null);
  const [partnerHint, setPartnerHint] = useState("");
  const [interestMsg, setInterestMsg] = useState("");
  const [interestOk, setInterestOk] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const needsPartner =
    settings.roleSelection !== "off" &&
    (settings.roleSelection === "mandatory" || serviceRequiresPartner(service.slug, service.requiresPartner));
  const staffPartner = isStaffRole(user?.role) || isPartnerRole(user?.role);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace(`/user-login?redirect=/apply?service=${slug}`);
  }, [ready, user, router, slug]);

  if (!ready || !user) return null;

  function goStep2() {
    const name = (document.getElementById("applyCustName") as HTMLInputElement)?.value.trim();
    const mobile = (document.getElementById("applyCustMobile") as HTMLInputElement)?.value.trim();
    const address = (document.getElementById("applyCustAddress") as HTMLInputElement)?.value.trim();
    if (!name) return alert("Please enter your Full Name.");
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) return alert("Please enter a valid 10-digit Mobile Number.");
    if (!address) return alert("Please enter your Business / Shop Address.");
    const docs = Array.from(document.querySelectorAll<HTMLInputElement>('.doc-file-input[data-mandatory="1"]'));
    for (const input of docs) {
      if (input.files?.length === 0) {
        alert(`Please attach mandatory document: ${input.dataset.docName || "Mandatory Document"}`);
        return;
      }
    }
    if (needsPartner && !staffPartner && !partner) {
      alert("Enter a valid retailer or distributor ID, or show interest if you do not have one.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 180, behavior: "smooth" });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const form = new FormData(e.currentTarget);
    form.set("service_slug", service.slug);
    form.set("partner_code", partner?.partnerCode || partnerCode);
    try {
      const res = await api.submitApplication(token, form);
      setSuccess(`${settings.enquirySuccess} Reference ID: ${res.application.ref}`);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit application.");
    }
  }

  const priceText = service.price ? formatInr(service.price) : "As Applicable / Contact";

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>Online Service Application</h1>
          <p>Select your service, fill in your details, attach required documents, and complete online QR payment.</p>
        </div>
      </section>

      <section className="section" style={{ background: "#f8fafc", padding: "40px 0 60px" }}>
        <div className="container" style={{ maxWidth: 920 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30, gap: 12 }}>
            <div id="applyStep1Tab" style={tabStyle(step === 1)}>
              <span>1</span> Service Details & Documents
            </div>
            <i className="fa-solid fa-chevron-right" style={{ color: "var(--slate-400)" }}></i>
            <div id="applyStep2Tab" style={tabStyle(step === 2)}>
              <span>2</span> Online UPI Payment QR
            </div>
          </div>

          <div className="form-card" style={{ background: "#ffffff", borderRadius: 20, border: "1px solid var(--border-light)", padding: 32, boxShadow: "0 10px 30px rgba(0,0,0,0.04)", maxWidth: "none" }}>
            {error ? <div className="alert alert-danger">{error}</div> : null}
            {success ? <div className="alert alert-success">{success}</div> : null}

            <form onSubmit={onSubmit} encType="multipart/form-data">
              <div style={{ display: step === 1 ? "block" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, borderBottom: "2px solid #f1f5f9", paddingBottom: 12, flexWrap: "wrap", gap: 10 }}>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--navy-deep)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <i className="fa-solid fa-list-check" style={{ color: "var(--primary-blue)" }}></i> Service & Applicant Information
                  </h3>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="serviceSelect">Select Service <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="service_id"
                    id="serviceSelect"
                    className="form-control"
                    value={service.slug}
                    onChange={(e) => router.push(`/apply?service=${e.target.value}`)}
                  >
                    {catalog.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title} {s.price ? ` (${formatInr(s.price)})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {needsPartner ? (
                  <div className="form-group" style={{ marginTop: 20 }}>
                    {staffPartner ? (
                      <div className="alert alert-success">
                        Applying under your {roleLabel(user.role).toLowerCase()} ID{" "}
                        <strong>{user.partnerCode || user.userCode}</strong>. No extra partner code is needed.
                      </div>
                    ) : (
                      <>
                        <label className="form-label" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--navy-deep)" }}>
                          Retailer / Distributor ID <span style={{ color: "red" }}>*</span>
                        </label>
                        <p style={{ fontSize: "0.85rem", color: "var(--slate-500)", margin: "0 0 10px" }}>
                          AEPS, all mobile recharge and PAN can only be filed with an active partner ID. If you do not have one, show interest and our team will connect you.
                        </p>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="DST-XXXXXX or RTL-XXXXXX"
                            value={partnerCode}
                            onChange={(e) => {
                              setPartnerCode(e.target.value.toUpperCase());
                              setPartner(null);
                              setPartnerHint("");
                            }}
                            style={{ flex: 1, minWidth: 220 }}
                          />
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={async () => {
                              setPartnerHint("");
                              try {
                                const res = await api.lookupPartner(partnerCode);
                                setPartner(res.partner);
                                setPartnerHint(`${res.partner.name} · ${roleLabel(res.partner.role)}`);
                              } catch (err) {
                                setPartner(null);
                                setPartnerHint(err instanceof Error ? err.message : "Partner not found.");
                              }
                            }}
                          >
                            Verify ID
                          </button>
                        </div>
                        {partnerHint ? (
                          <p style={{ marginTop: 8, fontSize: "0.85rem", color: partner ? "#15803d" : "#b91c1c" }}>{partnerHint}</p>
                        ) : null}
                        <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: "#f8fafc", border: "1px dashed #cbd5e1" }}>
                          <strong style={{ display: "block", marginBottom: 8 }}>No partner ID? Show interest</strong>
                          <textarea
                            className="form-control"
                            rows={2}
                            placeholder="Tell us your area, shop type, or why you need this service."
                            value={interestMsg}
                            onChange={(e) => setInterestMsg(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ marginTop: 10 }}
                            onClick={async () => {
                              if (!token) return;
                              try {
                                await api.submitInterest(token, { serviceSlug: service.slug, message: interestMsg });
                                setInterestOk("Interest recorded. We will contact you with a retailer or distributor.");
                              } catch (err) {
                                setError(err instanceof Error ? err.message : "Unable to record interest.");
                              }
                            }}
                          >
                            Show interest while logged in
                          </button>
                          {interestOk ? <p style={{ color: "#15803d", marginTop: 8, fontSize: "0.85rem" }}>{interestOk}</p> : null}
                        </div>
                      </>
                    )}
                  </div>
                ) : null}

                <hr style={{ border: 0, borderTop: "1px solid var(--border-light)", margin: "24px 0" }} />
                <h3 style={{ fontSize: "1.15rem", marginBottom: 16, color: "var(--navy-deep)" }}>
                  <i className="fa-solid fa-user" style={{ color: "var(--primary-blue)" }}></i> Applicant / Customer Information
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name <span style={{ color: "red" }}>*</span></label>
                    <input type="text" name="customer_name" id="applyCustName" className="form-control" required placeholder="e.g. Rahul Das" defaultValue={user.name} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number <span style={{ color: "red" }}>*</span></label>
                    <input type="tel" name="mobile" id="applyCustMobile" className="form-control" required placeholder="10-digit mobile number" defaultValue={user.mobile} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Email Address (Optional)</label>
                    <input type="email" name="email" className="form-control" placeholder="name@example.com" defaultValue={user.email || ""} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business / Shop Address <span style={{ color: "red" }}>*</span></label>
                    <input type="text" name="address" id="applyCustAddress" className="form-control" required placeholder="Full Village/City/P.O. Address" defaultValue={user.address || ""} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message / Additional Instructions (Optional)</label>
                  <textarea name="message" className="form-control" rows={2} placeholder="Provide any special remarks, password for Aadhaar PDF, or details..."></textarea>
                </div>

                <hr style={{ border: 0, borderTop: "1px solid var(--border-light)", margin: "30px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                  <h3 style={{ fontSize: "1.15rem", margin: 0, color: "var(--navy-deep)" }}>
                    <i className="fa-solid fa-folder-open" style={{ color: "var(--primary-blue)" }}></i> Required Documents for {service.title}
                  </h3>
                  <span style={{ fontSize: "0.78rem", color: "var(--slate-500)", fontWeight: 600 }}>Configured via Admin</span>
                </div>

                {service.documents.length === 0 ? (
                  <div style={{ padding: 16, background: "#e7f1ff", borderRadius: 10, color: "var(--primary-blue)", fontSize: "0.9rem", marginBottom: 20 }}>
                    <i className="fa-solid fa-info-circle"></i> No mandatory documents required for this service. Proceed to payment QR.
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 24 }}>
                    {service.documents.map((doc, i) => (
                      <div className="file-upload-box" key={doc.name}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <strong style={{ fontSize: "0.95rem", color: "var(--navy-deep)" }}>
                            {doc.name} {doc.required ? <span style={{ color: "red" }}>*</span> : null}
                          </strong>
                          <span className={doc.required ? "doc-badge-req" : "doc-badge-opt"}>
                            {doc.required ? "Mandatory" : "Optional"}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.82rem", color: "var(--slate-500)", textAlign: "left", marginBottom: 10 }}>{doc.hint}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: "0.8rem", color: "var(--slate-500)" }}>
                          <span>Allowed: {doc.formats}</span>
                        </div>
                        <input
                          type="file"
                          name={`doc_${i + 1}`}
                          className="doc-file-input"
                          style={{ marginTop: 10, width: "100%", fontSize: "0.85rem" }}
                          data-mandatory={doc.required ? "1" : "0"}
                          data-doc-name={doc.name}
                          required={doc.required}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 30 }}>
                  <button type="button" onClick={goStep2} className="btn btn-primary" style={{ width: "100%", padding: 15, fontSize: "1.05rem", fontWeight: 800, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span>Proceed to Payment QR & Proof &rarr;</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>

              <div style={{ display: step === 2 ? "block" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, borderBottom: "2px solid #f1f5f9", paddingBottom: 12, flexWrap: "wrap", gap: 10 }}>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--navy-deep)", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
                    <i className="fa-solid fa-qrcode" style={{ color: "var(--primary-blue)", fontSize: "1.4rem" }}></i> Online UPI QR Payment & Screenshot Proof
                  </h3>
                  <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--primary-blue)", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                    &larr; Edit Details & Documents
                  </button>
                </div>

                {settings.qrNote ? <p style={{ fontSize: "0.92rem", color: "var(--slate-600)", marginBottom: 16 }}>{settings.qrNote}</p> : null}
                <div style={{ background: "linear-gradient(135deg, #f0f7ff, #e0f2fe)", border: "2px solid #38bdf8", borderRadius: 16, padding: 24, marginBottom: 24 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, alignItems: "flex-start" }}>
                    <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 14, padding: 14, textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", width: "100%", boxSizing: "border-box" }}>
                      <img src={upiQrUrl(service.price, settings)} alt="UPI QR Code Payment" style={{ maxWidth: 170, width: "100%", height: "auto", display: "block", margin: "0 auto", borderRadius: 6 }} />
                      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10, fontSize: "0.7rem", fontWeight: 700, color: "var(--slate-600)", flexWrap: "wrap" }}>
                        <span style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: 4 }}>GPay</span>
                        <span style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: 4 }}>PhonePe</span>
                        <span style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: 4 }}>Paytm</span>
                      </div>
                    </div>
                    <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                      <div style={{ background: "#ffffff", borderRadius: 12, padding: 16, border: "1px solid var(--border-light)", marginBottom: 16, wordBreak: "break-word" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                          <span style={{ fontSize: "0.85rem", color: "var(--slate-500)", fontWeight: 600 }}>Service Charges:</span>
                          <strong style={{ fontSize: "1.1rem", color: "var(--primary-blue)" }}>{priceText}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: "0.88rem", flexWrap: "wrap", gap: 6 }}>
                          <span style={{ color: "var(--slate-500)", fontWeight: 600 }}>UPI ID (VPA):</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <strong style={{ color: "var(--navy-deep)", letterSpacing: "0.02em", fontSize: "0.85rem" }}>{settings.upiId}</strong>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(settings.upiId);
                                alert("UPI ID copied to clipboard!");
                              }}
                              className="btn"
                              style={{ padding: "2px 8px", fontSize: "0.72rem", background: "var(--sky-accent)", color: "var(--primary-blue)", borderRadius: 4 }}
                            >
                              <i className="fa-solid fa-copy"></i> Copy
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--slate-500)" }}>
                          <span>Payee Name: <strong>{settings.payeeName}</strong></span>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.82rem" }}>Upload Payment Screenshot / Proof</label>
                          <input type="file" name="payment_screenshot" className="form-control" accept="image/*,.pdf" style={{ fontSize: "0.82rem", padding: "8px 12px" }} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.82rem" }}>Transaction Ref / UTR No. (Optional)</label>
                          <input type="text" name="utr_number" className="form-control" placeholder="12-digit UTR No." style={{ fontSize: "0.82rem", padding: "8px 12px" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 30 }}>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: 16, fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", borderRadius: 12, boxShadow: "0 6px 20px rgba(13,110,253,0.3)" }}>
                    Submit Application & Payment Proof <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "var(--primary-blue)" : "#e2e8f0",
    color: active ? "#fff" : "var(--slate-600)",
    padding: "8px 18px",
    borderRadius: 20,
    fontSize: "0.88rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };
}

