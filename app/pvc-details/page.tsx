"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { formatInr, getPvc } from "@/lib/data";
import { upiQrUrl } from "@/lib/site";
import { useSettings } from "@/lib/cms";
import { api } from "@/lib/api";

export default function PvcDetailsPage() {
  return (
    <Suspense>
      <PvcInner />
    </Suspense>
  );
}

function PvcInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, token, ready } = useAuth();
  const settings = useSettings();
  const card = useMemo(() => getPvc(params.get("card")), [params]);
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const total = qty * card.price;

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace(`/user-login?redirect=/pvc-details?card=${card.slug}`);
  }, [ready, user, router, card.slug]);

  if (!ready || !user) return null;

  function goStep2() {
    const name = (document.getElementById("custNameInput") as HTMLInputElement)?.value.trim();
    const mobile = (document.getElementById("custMobileInput") as HTMLInputElement)?.value.trim();
    const address = (document.getElementById("custAddressInput") as HTMLTextAreaElement)?.value.trim();
    if (!name) return alert("Please enter your Full Name.");
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) return alert("Please enter a valid 10-digit WhatsApp Mobile Number.");
    if (!address) return alert("Please enter your Full Delivery Address.");
    if (files.length === 0) return alert("Please select and upload at least one card file / image.");
    setStep(2);
    window.scrollTo({ top: 180, behavior: "smooth" });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const form = new FormData(e.currentTarget);
    form.set("card_slug", card.slug);
    form.set("quantity", String(qty));
    try {
      const res = await api.submitPvc(token, form);
      setSuccess(`Order submitted. Your reference ID is ${res.application.ref}`);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit order.");
    }
  }

  return (
    <>
      <section className="page-banner" style={{ background: "linear-gradient(135deg, #071938, #0d6efd)", color: "#fff", padding: "40px 0 30px" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <Link href="/pvc-print" style={{ color: "#38bdf8", fontSize: "0.88rem", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              &larr; Back to PVC Cards Catalog
            </Link>
            <h1 style={{ fontSize: "2rem", color: "#ffffff", marginBottom: 6, display: "flex", alignItems: "center", gap: 12 }}>
              <i className={`fa-solid ${card.icon}`} style={{ color: "#38bdf8" }}></i> {card.title}
            </h1>
            <p style={{ fontSize: "0.95rem", color: "#cbd5e1", margin: 0 }}>{card.subtitle}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", padding: "14px 24px", borderRadius: 16, textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "#cbd5e1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Print Rate</span>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#4ade80" }}>
              {formatInr(card.price)} <span style={{ fontSize: "0.8rem", color: "#ffffff", fontWeight: 500 }}>/ card</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#f8fafc", padding: "40px 0 60px" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30, gap: 12 }}>
            <div style={tab(step === 1)}><span>1</span> Customer Details & Document Upload</div>
            <i className="fa-solid fa-chevron-right" style={{ color: "var(--slate-400)" }}></i>
            <div style={tab(step === 2)}><span>2</span> UPI Payment QR Scanner</div>
          </div>

          <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid var(--border-light)", padding: 32, boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            {error ? <div className="alert alert-danger">{error}</div> : null}
            {success ? <div className="alert alert-success">{success}</div> : null}
            <form onSubmit={onSubmit} encType="multipart/form-data">
              <div style={{ display: step === 1 ? "block" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, borderBottom: "2px solid #f1f5f9", paddingBottom: 12, flexWrap: "wrap", gap: 10 }}>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--navy-deep)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <i className="fa-solid fa-user-pen" style={{ color: "var(--primary-blue)" }}></i> Basic Details & Card Upload
                  </h3>
                  <span style={{ background: "var(--sky-accent)", color: "var(--primary-blue)", fontSize: "0.8rem", fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                    {card.title}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name <span style={{ color: "red" }}>*</span></label>
                    <input type="text" name="customer_name" id="custNameInput" className="form-control" required placeholder="Enter full name" defaultValue={user.name} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">WhatsApp Mobile Number <span style={{ color: "red" }}>*</span></label>
                    <input type="tel" name="mobile" id="custMobileInput" className="form-control" required placeholder="10-digit mobile number" defaultValue={user.mobile} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address (Optional)</label>
                    <input type="email" name="email" className="form-control" placeholder="name@example.com" defaultValue={user.email || ""} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, alignItems: "flex-start" }}>
                  <div className="form-group">
                    <label className="form-label">Full Delivery Address (with PIN Code) <span style={{ color: "red" }}>*</span></label>
                    <textarea name="address" id="custAddressInput" className="form-control" rows={2} required placeholder="Village/City, Post Office, Police Station, PIN Code, District" defaultValue={user.address || ""}></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity of Cards</label>
                    <select name="quantity" className="form-control" style={{ fontWeight: 700, width: "100%", minWidth: 180, padding: "10px 12px", fontSize: "0.88rem" }} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                      {[1, 2, 3, 4, 5, 10].map((n) => (
                        <option key={n} value={n}>{n} Card{n > 1 ? "s" : ""} (₹{n * 50})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: 16, padding: 22, marginBottom: 24, textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, background: "#e0f2fe", color: "#0284c7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "1.4rem" }}>
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  <h4 style={{ fontSize: "1.05rem", color: "var(--navy-deep)", marginBottom: 6 }}>
                    Upload Multi-Page Card Images or PDF Document <span style={{ color: "red" }}>*</span>
                  </h4>
                  <p style={{ fontSize: "0.84rem", color: "var(--slate-500)", marginBottom: 14, maxWidth: 550, marginLeft: "auto", marginRight: "auto" }}>
                    You can select multiple files at once (e.g. Front Photo, Back Photo, or multi-page PDF document file). Allowed: PDF, JPG, JPEG, PNG (Max 10MB each).
                  </p>
                  <input
                    type="file"
                    name="card_files"
                    id="cardFilesInput"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  />
                  <button type="button" onClick={() => document.getElementById("cardFilesInput")?.click()} className="btn" style={{ background: "var(--primary-blue)", color: "#ffffff", fontWeight: 700, padding: "10px 22px", borderRadius: 10, fontSize: "0.9rem" }}>
                    <i className="fa-solid fa-folder-open"></i> Choose Card Files / Images
                  </button>
                  <div style={{ marginTop: 14, textAlign: "left", display: "flex", flexDirection: "column", gap: 8 }}>
                    {files.map((file) => (
                      <div key={file.name} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "8px 12px", borderRadius: 8, fontSize: "0.82rem", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--navy-deep)" }}>
                        <span>
                          <i className="fa-solid fa-file" style={{ color: "var(--primary-blue)", marginRight: 6 }}></i>{" "}
                          <strong>{file.name}</strong> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                        <span style={{ color: "#16a34a", fontWeight: 700 }}>
                          <i className="fa-solid fa-circle-check"></i> Ready
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label className="form-label">PDF Password / Instructions (Optional)</label>
                  <textarea name="message" className="form-control" rows={2} placeholder="e.g. PDF Password is '1995', or print front & back..."></textarea>
                </div>
                <button type="button" onClick={goStep2} className="btn btn-primary" style={{ width: "100%", padding: 15, fontSize: "1.05rem", fontWeight: 800, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span>Proceed to Payment QR (₹{total.toFixed(2)})</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>

              <div style={{ display: step === 2 ? "block" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, borderBottom: "2px solid #f1f5f9", paddingBottom: 12, flexWrap: "wrap", gap: 10 }}>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--navy-deep)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <i className="fa-solid fa-qrcode" style={{ color: "var(--primary-blue)" }}></i> Scan UPI QR Code to Pay
                  </h3>
                  <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--primary-blue)", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                    &larr; Edit Details & Documents
                  </button>
                </div>
                <div style={{ background: "#1e293b", color: "#ffffff", borderRadius: 14, padding: "18px 24px", textAlign: "center", marginBottom: 22, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Total Amount to Pay</span>
                  <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#4ade80", marginTop: 4 }}>{formatInr(total)}</div>
                  <div style={{ fontSize: "0.8rem", color: "#cbd5e1", marginTop: 2 }}>
                    {qty} x Card(s) @ {formatInr(card.price)} per card
                  </div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #f0f7ff, #e0f2fe)", border: "2px solid #38bdf8", borderRadius: 16, padding: 22, marginBottom: 24 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, alignItems: "flex-start" }}>
                    <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 14, padding: 14, textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                      <img src={upiQrUrl(total, settings)} alt="UPI Payment QR Code" style={{ maxWidth: 170, width: "100%", height: "auto", display: "block", margin: "0 auto", borderRadius: 6 }} />
                      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10, fontSize: "0.7rem", fontWeight: 700, color: "var(--slate-600)", flexWrap: "wrap" }}>
                        <span style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: 4 }}>GPay</span>
                        <span style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: 4 }}>PhonePe</span>
                        <span style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: 4 }}>Paytm</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ background: "#ffffff", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border-light)", marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: "0.88rem" }}>
                          <span style={{ color: "var(--slate-500)", fontWeight: 600 }}>UPI ID (VPA):</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <strong style={{ color: "var(--navy-deep)" }}>{settings.upiId}</strong>
                            <button type="button" onClick={() => { navigator.clipboard.writeText(settings.upiId); alert("UPI ID copied to clipboard!"); }} className="btn" style={{ padding: "2px 8px", fontSize: "0.72rem", background: "var(--sky-accent)", color: "var(--primary-blue)", borderRadius: 4 }}>
                              <i className="fa-solid fa-copy"></i> Copy
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--slate-500)" }}>
                          Payee Name: <strong>{settings.payeeName}</strong>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--slate-600)", marginBottom: 14, lineHeight: 1.4 }}>
                        <i className="fa-solid fa-info-circle" style={{ color: "var(--primary-blue)" }}></i> Scan QR Scanner using Google Pay, PhonePe, Paytm or BHIM UPI app to complete payment. Upload screenshot below.
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.82rem" }}>Payment Screenshot (Optional)</label>
                          <input type="file" name="payment_screenshot" className="form-control" accept="image/*,.pdf" style={{ fontSize: "0.82rem", padding: "8px 12px" }} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.82rem" }}>UTR / Transaction Ref No.</label>
                          <input type="text" name="utr_number" className="form-control" placeholder="12-digit UTR No." style={{ fontSize: "0.82rem", padding: "8px 12px" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: 16, fontSize: "1.1rem", borderRadius: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.03em", boxShadow: "0 6px 20px rgba(13,110,253,0.3)" }}>
                  Confirm Order & Submit Payment Proof <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function tab(active: boolean): React.CSSProperties {
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
