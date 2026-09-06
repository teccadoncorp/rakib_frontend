"use client";

import { FormEvent, useState } from "react";
import { api, type Application } from "@/lib/api";

export function TrackForm({ initialRef = "" }: { initialRef?: string }) {
  const [ref, setRef] = useState(initialRef);
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
          <label htmlFor="track_ref" className="sr-only">
            Reference ID or mobile number
          </label>
          <input
            type="text"
            id="track_ref"
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
            <article
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
              {item.notes ? (
                <div
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 12,
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Admin remarks
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--navy-deep)", margin: "6px 0 0", whiteSpace: "pre-wrap" }}>
                    {item.notes}
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: "0.82rem", color: "var(--slate-500)", marginTop: 8 }}>
                  No admin remarks yet. Check again after our team reviews this file.
                </p>
              )}
            </article>
          ))}
        </div>
      ) : null}
    </>
  );
}
