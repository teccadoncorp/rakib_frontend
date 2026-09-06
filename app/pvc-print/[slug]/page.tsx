import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PVC_CARDS, formatInr } from "@/lib/data";
import { breadcrumbJsonLd, pageMeta, productJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PVC_CARDS.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = PVC_CARDS.find((item) => item.slug === slug);
  if (!card) return pageMeta({ title: "PVC card not found", path: "/pvc-print", index: false });
  return pageMeta({
    title: `${card.title} printing in Jaynagar`,
    description: `${card.subtitle}. Waterproof HD PVC print from Digital Service, Jaynagar. ${formatInr(card.price)} per card.`,
    path: `/pvc-print/${card.slug}`,
    keywords: `${card.title}, PVC card Jaynagar, ${card.subtitle}, plastic card print Bakultala`,
    image: "/assets/images/pvc_card_showcase.jpg",
  });
}

export default async function PvcCardPage({ params }: Props) {
  const { slug } = await params;
  const card = PVC_CARDS.find((item) => item.slug === slug);
  if (!card) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "PVC Cards", path: "/pvc-print" },
            { name: card.title, path: `/pvc-print/${card.slug}` },
          ]),
          productJsonLd({
            name: card.title,
            description: card.subtitle,
            path: `/pvc-print/${card.slug}`,
            price: card.price,
          }),
        ]}
      />
      <section className="page-banner" style={{ background: "linear-gradient(135deg, #071938, #0d6efd)", color: "#fff", padding: "40px 0 30px" }}>
        <div className="container">
          <Link href="/pvc-print" style={{ color: "#38bdf8", fontSize: "0.88rem", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            &larr; Back to PVC Cards Catalog
          </Link>
          <h1 style={{ fontSize: "2rem", color: "#ffffff", marginBottom: 6, display: "flex", alignItems: "center", gap: 12 }}>
            <i className={`fa-solid ${card.icon}`} style={{ color: "#38bdf8" }}></i> {card.title}
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#cbd5e1", margin: 0 }}>{card.subtitle}</p>
        </div>
      </section>

      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, alignItems: "start" }}>
          <div>
            <img
              src="/assets/images/pvc_card_showcase.jpg"
              alt={`${card.title} HD PVC sample from Digital Service Jaynagar`}
              style={{ width: "100%", maxWidth: 480, borderRadius: 16, border: "1px solid #e2e8f0" }}
            />
            <h2 style={{ fontSize: "1.4rem", margin: "24px 0 12px", color: "var(--navy-deep)" }}>What you get</h2>
            <ul style={{ color: "var(--slate-600)", lineHeight: 1.8, paddingLeft: 18 }}>
              <li>Waterproof 800 micron plastic PVC, front and back print</li>
              <li>HD colour that does not fade or peel</li>
              <li>Upload photos or a multi-page PDF at checkout</li>
              <li>Pay by UPI QR (GPay, PhonePe, Paytm, BHIM)</li>
              <li>Printed from Jaynagar (Bakultala) for local delivery or pickup</li>
            </ul>
          </div>
          <aside style={{ background: "#f8fafc", border: "1px solid var(--border-light)", borderRadius: 20, padding: 28, boxShadow: "var(--card-shadow)" }}>
            <span style={{ background: card.badgeBg, color: card.badgeColor, fontWeight: 700, fontSize: "0.75rem", padding: "4px 10px", borderRadius: 20 }}>
              {card.badge}
            </span>
            <p style={{ marginTop: 16, fontSize: "0.82rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
              Print rate
            </p>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: "var(--navy-deep)", margin: "4px 0 16px" }}>
              {formatInr(card.price)} <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--slate-500)" }}>/ card</span>
            </p>
            <p style={{ fontSize: "0.92rem", color: "var(--slate-600)", marginBottom: 20 }}>
              Sign in, upload your card file, and complete UPI payment. You receive a PVC reference ID to track the order.
            </p>
            <Link href={`/pvc-details?card=${card.slug}`} className="btn btn-primary" style={{ width: "100%", padding: 14, fontSize: "1rem" }}>
              Order this card <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <p style={{ marginTop: 14, fontSize: "0.8rem", color: "var(--slate-500)" }}>
              Checkout requires a customer, retailer, or distributor login.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
