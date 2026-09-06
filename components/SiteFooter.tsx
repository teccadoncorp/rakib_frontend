"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, waHref } from "@/lib/site";

export function SiteFooter() {
  const pathname = usePathname();
  const bottomActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

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
                <h5>Address</h5>
                <p>{SITE.address}</p>
              </div>
            </div>
            <div className="pre-footer-box">
              <div className="pre-footer-icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <h5>Phone</h5>
                <p>
                  <a href={`tel:${SITE.phone}`}>{SITE.phone}</a>
                </p>
              </div>
            </div>
            <div className="pre-footer-box">
              <div className="pre-footer-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <h5>Email</h5>
                <p>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </p>
              </div>
            </div>
            <div className="pre-footer-box">
              <div className="pre-footer-icon">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <h5>Working Hours</h5>
                <p>{SITE.hours}</p>
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
                  alt="Digital Service Logo"
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
                Your trusted partner for digital banking, taxation and business compliance services. We are committed to provide fast, secure and reliable services.
              </p>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
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
            </div>

            <div className="footer-col">
              <h4>Our Services</h4>
              <ul className="footer-link-list">
                <li><Link href="/pvc-print">PVC Card Printing</Link></li>
                <li><Link href="/service-details?slug=aeps">AEPS</Link></li>
                <li><Link href="/service-details?slug=gst-registration">GST Services</Link></li>
                <li><Link href="/service-details?slug=income-tax-filing">Income Tax</Link></li>
                <li><Link href="/services">More Services</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Important Links</h4>
              <ul className="footer-link-list">
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms & Conditions</Link></li>
                <li><Link href="/privacy-policy">Refund Policy</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Need Help?</h4>
              <p style={{ fontSize: "0.82rem", marginBottom: 6 }}>
                <i className="fa-solid fa-phone" style={{ color: "var(--primary-blue)", marginRight: 6 }}></i>{" "}
                {SITE.phone}
              </p>
              <p style={{ fontSize: "0.82rem", marginBottom: 12 }}>
                <i className="fa-solid fa-envelope" style={{ color: "var(--primary-blue)", marginRight: 6 }}></i>{" "}
                {SITE.email}
              </p>
              <a href={waHref()} target="_blank" rel="noreferrer" className="whatsapp-pill-button">
                <i className="fa-brands fa-whatsapp" style={{ fontSize: "1rem" }}></i> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>{SITE.copyright}</p>
            <p>
              Designed with <i className="fa-solid fa-heart" style={{ color: "#ef4444" }}></i> for better service
            </p>
          </div>
        </div>
      </footer>

      <a
        href={waHref()}
        className="whatsapp-float-btn"
        target="_blank"
        rel="noreferrer"
        title="Contact on WhatsApp"
        aria-label="WhatsApp Chat"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>

      <nav className="mobile-bottom-nav">
        <Link href="/" className={`bottom-nav-item${bottomActive("/") ? " active" : ""}`}>
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </Link>
        <Link href="/pvc-print" className={`bottom-nav-item${bottomActive("/pvc-print") ? " active" : ""}`}>
          <i className="fa-solid fa-id-card"></i>
          <span>Order PVC</span>
        </Link>
        <Link href="/apply" className={`bottom-nav-item bottom-nav-center${bottomActive("/apply") ? " active" : ""}`}>
          <div className="center-btn-circle">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
          <span>Apply</span>
        </Link>
        <Link href="/track" className={`bottom-nav-item${bottomActive("/track") ? " active" : ""}`}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Track</span>
        </Link>
        <Link href="/contact" className={`bottom-nav-item${bottomActive("/contact") ? " active" : ""}`}>
          <i className="fa-solid fa-headset"></i>
          <span>Contact</span>
        </Link>
      </nav>
    </>
  );
}
