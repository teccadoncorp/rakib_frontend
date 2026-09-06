"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, type Application } from "@/lib/api";

export default function TrackPage() {
  return (
    <Suspense>
      <TrackInner />
    </Suspense>
  );
}

function TrackInner() {
  const params = useSearchParams();
  const initial = params.get("ref") || "";
  const [ref, setRef] = useState(initial);
  const [results, setResults] = useState<Application[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.track(ref);
      setResults(data.applications);
      if (!data.applications.length) {
        setError("No application found for this Reference ID or Mobile Number.");
      }
    } catch (err) {
      setResults([]);
      setError(err instanceof Error ? err.message : "Unable to track right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>Track Application Status</h1>
          <p>Enter your Reference ID (e.g. ENQ-20260814-0001) or 10-digit Mobile Number to check live progress.</p>
        </div>
      </section>
      <section className="section" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border-light)",
                borderRadius: 20,
                padding: 30,
                boxShadow: "var(--card-shadow)",
                marginBottom: 30,
              }}
            >
              <form onSubmit={onSubmit} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <input
                  type="text"
                  name="ref"
                  className="form-control"
                  style={{ flex: 1, minWidth: 250, fontSize: "1rem", padding: "12px 16px" }}
                  placeholder="Enter Reference ID (e.g. ENQ-20260814-0001) or Mobile Number"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "1rem" }}>
                  <i className="fa-solid fa-magnifying-glass"></i> {loading ? "Tracking..." : "Track Status"}
                </button>
              </form>
            </div>

            {error ? <div className="alert alert-danger">{error}</div> : null}

            {results && results.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {results.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--border-light)",
                      borderRadius: 16,
                      padding: 20,
                    }}
                  >
                    <strong style={{ color: "var(--navy-deep)" }}>{item.title}</strong>
                    <p style={{ fontSize: "0.85rem", color: "var(--slate-500)", marginTop: 6 }}>
                      Ref: <span style={{ fontFamily: "monospace", color: "var(--primary-blue)" }}>{item.ref}</span>
                    </p>
                    <p style={{ fontSize: "0.85rem", marginTop: 4 }}>
                      Status: <strong style={{ textTransform: "capitalize" }}>{item.status.replace("_", " ")}</strong>
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
