"use client";

import Link from "next/link";
import { MobileBottomNav } from "./MobileBottomNav";
import { useCatalog, useSettings } from "@/lib/cms";
import { mailHref, telHref, waHref } from "@/lib/site";

export function SiteFooter() {
  const settings = useSettings();
  const services = useCatalog();
  const featured = services.slice(0, 4);

  return (
    <>
      <section className="pre-footer-bar">
        <div className="container">
          <div className="pre-footer-grid">
            <div className="pre-footer-box">
              <div className="pre-footer-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h2>Address</h2>
                <p>{settings.address}</p>
              </div>
            </div>
            <div className="pre-footer-box">
              <div className="pre-footer-icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <h2>Phone</h2>
                <p>
                  <a href={telHref(settings)}>{settings.phone}</a>
                </p>
              </div>
            </div>
            <div className="pre-footer-box">
              <div className="pre-footer-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <h2>Email</h2>
                <p>
                  <a href={mailHref(settings)}>{settings.email}</a>
                </p>
              </div>
            </div>
            <div className="pre-footer-box">
              <div className="pre-footer-icon">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <h2>Working Hours</h2>
                <p>{settings.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-dark">
        <div className="container">
          <div className="footer-5col-grid">
            <div className="footer-brand">
              <Link href="/" className="logo" style={{ color: "#fff", display: "inline-block" }}>
                <img
                  src="/assets/images/logo.png"
                  alt={`${settings.name} logo — Jaynagar digital banking and GST centre`}
                  width={160}
                  height={56}
                  style={{
                    height: 56,
                    width: "auto",
                    maxHeight: 56,
                    background: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: 10,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Link>
              <p style={{ marginTop: 16 }}>
                {settings.about ||
                  "Your trusted partner for digital banking, taxation and business compliance services. We are committed to provide fast, secure and reliable services."}
              </p>
            </div>

            <nav className="footer-col" aria-label="Quick links">
              <h2>Quick Links</h2>
              <ul className="footer-link-list">
                <li><Link href="/">Home</Link></li>
                <li>
                  <Link href="/pvc-print" style={{ color: "#38bdf8", fontWeight: 700 }}>
                    Order PVC Card
                  </Link>
                </li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/track">Track Application</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </nav>

            <nav className="footer-col" aria-label="Services">
              <h2>Our Services</h2>
              <ul className="footer-link-list">
                <li><Link href="/pvc-print">PVC Card Printing</Link></li>
                {featured.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`}>{service.shortTitle || service.title}</Link>
                  </li>
                ))}
                <li><Link href="/services">More Services</Link></li>
              </ul>
            </nav>

            <nav className="footer-col" aria-label="Policies">
              <h2>Important Links</h2>
              <ul className="footer-link-list">
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms & Conditions</Link></li>
                <li><Link href="/privacy-policy">Refund Policy</Link></li>
              </ul>
            </nav>

            <div className="footer-col">
              <h2>Need Help?</h2>
              <p style={{ fontSize: "0.82rem", marginBottom: 6 }}>
                <i className="fa-solid fa-phone" style={{ color: "var(--primary-blue)", marginRight: 6 }}></i>{" "}
                {settings.phone}
              </p>
              <p style={{ fontSize: "0.82rem", marginBottom: 12 }}>
                <i className="fa-solid fa-envelope" style={{ color: "var(--primary-blue)", marginRight: 6 }}></i>{" "}
                {settings.email}
              </p>
              <a href={waHref(undefined, settings)} target="_blank" rel="noreferrer" className="whatsapp-pill-button">
                <i className="fa-brands fa-whatsapp" style={{ fontSize: "1rem" }}></i> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>{settings.copyright}</p>
            <p>
              Designed with <i className="fa-solid fa-heart" style={{ color: "#ef4444" }}></i> for better service
            </p>
          </div>
        </div>
      </footer>

      <a
        href={waHref(undefined, settings)}
        className="whatsapp-float-btn"
        target="_blank"
        rel="noreferrer"
        title="Contact on WhatsApp"
        aria-label="WhatsApp Chat"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>

      <MobileBottomNav />
    </>
  );
}
