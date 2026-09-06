import Link from "next/link";
import type { Service } from "@/lib/data";

export function ServiceCard({
  service,
  showTime = false,
}: {
  service: Service;
  showTime?: boolean;
}) {
  return (
    <div className="service-card-item">
      <div className="service-icon-wrapper">
        <i className={`fa-solid ${service.icon}`}></i>
      </div>
      <h3 className="service-card-title">{service.title}</h3>
      <p className="service-card-desc">{service.description}</p>
      {showTime ? (
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "var(--primary-blue)",
            background: "var(--sky-accent)",
            padding: "4px 10px",
            borderRadius: 20,
            marginBottom: 14,
            display: "inline-block",
          }}
        >
          <i className="fa-solid fa-clock"></i> {service.processingTime}
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
          marginTop: showTime ? undefined : "auto",
        }}
      >
        <Link
          href={`/apply?service=${service.slug}`}
          className="btn btn-primary btn-sm"
          style={{ width: "100%", fontSize: "0.8rem", padding: "7px 10px" }}
        >
          Apply Now <i className="fa-solid fa-arrow-right"></i>
        </Link>
        <Link
          href={`/service-details?slug=${service.slug}`}
          className="btn btn-outline btn-sm"
          style={{
            width: "100%",
            fontSize: "0.78rem",
            padding: "5px 10px",
            borderColor: "var(--border-light)",
            color: "var(--slate-600)",
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export function MoreServicesCard({ variant = "home" }: { variant?: "home" | "catalog" }) {
  return (
    <div className="service-card-item" style={{ background: "#f8fafc", borderStyle: "dashed" }}>
      <div className="service-icon-wrapper" style={{ background: "#e2e8f0", color: "#64748b" }}>
        <i className="fa-solid fa-ellipsis"></i>
      </div>
      <h3 className="service-card-title">More Services</h3>
      <p className="service-card-desc">
        {variant === "home"
          ? "Many More Services"
          : "Need assistance with custom digital online forms, utility services, or compliance?"}
      </p>
      {variant === "home" ? (
        <Link href="/contact" className="service-apply-link">
          <span>Apply Now</span>
          <i className="fa-solid fa-arrow-right"></i>
        </Link>
      ) : (
        <>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--slate-500)",
              background: "#e2e8f0",
              padding: "4px 10px",
              borderRadius: 20,
              marginBottom: 14,
              display: "inline-block",
            }}
          >
            <i className="fa-solid fa-headset"></i> Custom Support
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
            <Link
              href="/contact"
              className="btn btn-primary btn-sm"
              style={{ width: "100%", fontSize: "0.8rem", padding: "7px 10px" }}
            >
              Contact Us <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
