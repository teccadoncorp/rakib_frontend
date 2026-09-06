import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SERVICES } from "@/lib/data";
import { loadPublicService } from "@/lib/catalog";
import { breadcrumbJsonLd, pageMeta, serviceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = (await loadPublicService(slug)) || SERVICES.find((item) => item.slug === slug);
  if (!service) return pageMeta({ title: "Service not found", path: "/services", index: false });
  return pageMeta({
    title: `${service.title} in Jaynagar`,
    description: `${service.description} Digital Service, Jaynagar (Bakultala). Processing: ${service.processingTime}. ${service.priceDisplay}.`,
    path: `/services/${service.slug}`,
    keywords: `${service.title}, ${service.title} Jaynagar, ${service.title} South 24 Parganas, Digital Service`,
  });
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { slug } = await params;
  const service = await loadPublicService(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
          serviceJsonLd({
            name: service.title,
            description: service.overview,
            path: `/services/${service.slug}`,
            price: service.price,
          }),
        ]}
      />
      <section className="page-banner">
        <div className="container">
          <p style={{ fontSize: "0.82rem", marginBottom: 8 }}>
            <Link href="/services" style={{ color: "inherit" }}>
              Services
            </Link>{" "}
            / {service.title}
          </p>
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
                  <h2 style={{ fontSize: "1.3rem", margin: 0 }}>
                    <i className="fa-solid fa-file-shield" style={{ color: "var(--primary-blue)", marginRight: 8 }}></i> Required Documents
                  </h2>
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
                <h2 style={{ fontSize: "1.3rem", marginBottom: 16 }}>
                  <i className="fa-solid fa-list-ol" style={{ color: "var(--primary-blue)", marginRight: 8 }}></i> How to Apply
                </h2>
                <ol style={{ marginLeft: 20, color: "var(--slate-600)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                  <li>Click on <strong>&quot;Apply / Send Enquiry&quot;</strong> button.</li>
                  <li>Fill out your Name, Mobile Number, Email, and Business Address.</li>
                  <li>Upload the required documents listed above (mandatory documents are marked).</li>
                  <li>Submit your application to receive a unique <strong>Enquiry Reference ID</strong>.</li>
                  <li>Share the Enquiry ID on WhatsApp for priority processing.</li>
                </ol>
              </div>
            </div>

            <aside>
              <div style={{ position: "sticky", top: 100, background: "var(--white)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 30, boxShadow: "var(--card-shadow)", textAlign: "center" }}>
                <div style={{ width: 60, height: 60, background: "var(--sky-accent)", color: "var(--primary-blue)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.6rem" }}>
                  <i className="fa-solid fa-hand-holding-dollar"></i>
                </div>
                <h2 style={{ fontSize: "0.9rem", textTransform: "uppercase", color: "var(--slate-500)", letterSpacing: "0.05em", fontWeight: 700 }}>Estimated Pricing</h2>
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
                  <i className="fa-solid fa-lock" style={{ color: "var(--mint-accent)" }}></i> Secure document submission &amp; fast support.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
