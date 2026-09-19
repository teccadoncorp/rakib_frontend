import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PVC_CARDS, formatInr } from "@/lib/data";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "HD PVC Card Printing in Jaynagar",
  description:
    "Order waterproof Aadhaar, Voter, Ration, PAN, Ayushman, DL and e-Shram PVC cards from Digital Service, Jaynagar. From ₹70 per card with UPI payment.",
  path: "/pvc-print",
  keywords: "PVC card printing Jaynagar, Aadhaar PVC, Voter ID PVC, PAN PVC, Ayushman card print",
  image: "/assets/images/pvc_card_showcase.jpg",
});

export default function PvcPrintPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "PVC Cards", path: "/pvc-print" },
        ])}
      />
      <section className="page-banner" style={{ background: "linear-gradient(135deg, #071938, #0d6efd)", color: "#fff", textAlign: "center", padding: "45px 0 35px" }}>
        <div className="container">
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.15)",
              padding: "4px 14px",
              borderRadius: 20,
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 12,
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <i className="fa-solid fa-id-card"></i> HD Quality PVC Plastic Card Printing
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#ffffff", marginBottom: 10 }}>Select PVC Card Type to Print</h1>
          <p style={{ fontSize: "1rem", color: "#cbd5e1", maxWidth: 680, margin: "0 auto 15px" }}>
            Click on any card below to view details, upload multi-page documents or images, and proceed to online QR payment.
          </p>
        </div>
      </section>

      <section style={{ background: "#ffffff", padding: "30px 0", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div style={{ maxWidth: 550 }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--navy-deep)", marginBottom: 8 }}>Durable & Waterproof Plastic PVC Cards</h2>
            <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", marginBottom: 14 }}>
              Get your government & identity documents printed on high-density 800 micron plastic PVC with vibrant HD color technology that never fades or peels.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-600)" }}>
              <span><i className="fa-solid fa-circle-check" style={{ color: "#10b981" }}></i> ₹50 per Card</span>
              <span><i className="fa-solid fa-circle-check" style={{ color: "#10b981" }}></i> Multi-Page Image Upload</span>
              <span><i className="fa-solid fa-circle-check" style={{ color: "#10b981" }}></i> Instant QR Payment</span>
            </div>
          </div>
          <div>
            <img
              src="/assets/images/pvc_card_showcase.jpg"
              alt="HD waterproof PVC identity cards printed by Digital Service in Jaynagar"
              style={{ maxWidth: 380, width: "100%", height: "auto", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}
            />
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#f8fafc", padding: "45px 0 60px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 35 }}>
            <h2 style={{ fontSize: "1.8rem", color: "var(--navy-deep)", marginBottom: 6 }}>Available PVC Cards</h2>
            <p style={{ color: "var(--slate-500)", fontSize: "0.95rem" }}>Choose a card category to start your print order</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {PVC_CARDS.map((card) => (
              <div
                key={card.slug}
                className="pvc-catalog-card"
                style={{
                  background: "#ffffff",
                  borderRadius: 18,
                  border: "1px solid var(--border-light)",
                  padding: 24,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        background: card.iconBg,
                        color: card.iconColor,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                      }}
                    >
                      <i className={`fa-solid ${card.icon}`}></i>
                    </div>
                    <span style={{ background: card.badgeBg, color: card.badgeColor, fontWeight: 700, fontSize: "0.75rem", padding: "4px 10px", borderRadius: 20 }}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--navy-deep)", marginBottom: 4 }}>{card.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--slate-500)", marginBottom: 16 }}>{card.subtitle}</p>
                </div>
                <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 16, marginTop: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--slate-500)", fontWeight: 600 }}>Printing Rate:</span>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary-blue)" }}>
                      {formatInr(card.price)} <span style={{ fontSize: "0.75rem", color: "var(--slate-500)", fontWeight: 500 }}>/ card</span>
                    </div>
                  </div>
                  <Link
                    href={`/pvc-print/${card.slug}`}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: 12, fontSize: "0.95rem", fontWeight: 700, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <span>Order This Card</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
