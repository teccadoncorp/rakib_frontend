"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}

function VerifyInner() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Checking your verification link...");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("This verification link is missing a token.");
      return;
    }
    api
      .verifyEmail(token)
      .then(() => {
        setState("ok");
        setMessage("Email verified. You can continue applying for services.");
      })
      .catch((err) => {
        setState("error");
        setMessage(err instanceof Error ? err.message : "This link is invalid.");
      });
  }, [token]);

  return (
    <section className="section" style={{ background: "linear-gradient(135deg, #f8fafc, #e0f2fe)", minHeight: "70vh", padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 36, textAlign: "center" }}>
          <h2 style={{ color: "var(--navy-deep)", marginBottom: 12 }}>Email verification</h2>
          <p style={{ color: state === "error" ? "#b91c1c" : "var(--slate-600)" }}>{message}</p>
          {state !== "loading" ? (
            <Link href="/user-login" className="btn btn-primary" style={{ marginTop: 16 }}>
              Continue to login
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
