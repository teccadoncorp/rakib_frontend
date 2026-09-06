import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { MoreServicesCard, ServiceCard } from "@/components/ServiceCard";
import { SERVICES } from "@/lib/data";
import { canonical, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Digital Banking & Online Services | Digital Service - Your Digital Partner",
  description:
    "Fast, reliable digital banking, GST, PAN, income tax, MSME and PVC card printing from Digital Service, Jaynagar (Bakultala), South 24 Parganas.",
  path: "/",
  absolute: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Digital Service offerings",
          itemListElement: SERVICES.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: service.title,
            url: canonical(`/services/${service.slug}`),
          })),
        }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Digital Services Made <span>Simple</span>
            </h1>
            <p className="hero-subtitle">
              Fast, reliable and convenient digital banking, tax, GST and business registration services from one place.
            </p>
            <div className="hero-ctas">
              <a href="#services" className="btn btn-primary">
                <span>Explore Services</span>
                <i className="fa-solid fa-arrow-right"></i>
              </a>
              <Link href="/apply" className="btn btn-outline">
                <span>Send Enquiry</span>
                <i className="fa-solid fa-paper-plane"></i>
              </Link>
            </div>
            <div className="hero-badges">
              <div className="badge-item">
                <div className="badge-icon">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <span>Secure Process</span>
              </div>
              <div className="badge-item">
                <div className="badge-icon">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <span>100% Confidential</span>
              </div>
              <div className="badge-item">
                <div className="badge-icon">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <span>Quick Support</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-wrapper">
            <div className="floating-circle-icon" style={{ top: 20, left: 10 }}>
              <i className="fa-solid fa-building-columns" style={{ color: "#0d6efd" }}></i>
            </div>
            <div className="floating-circle-icon" style={{ top: 60, right: 20 }}>
              <i className="fa-solid fa-indian-rupee-sign" style={{ color: "#f59e0b" }}></i>
            </div>
            <div className="floating-circle-icon" style={{ bottom: 80, left: 20 }}>
              <i className="fa-solid fa-file-shield" style={{ color: "#10b981" }}></i>
            </div>

            <div className="phone-mockup-frame">
              <div className="phone-top-bar">
                <i className="fa-solid fa-building-columns"></i> Digital Service
              </div>
              <div className="phone-items-list">
                <PhoneRow icon="fa-fingerprint" title="AEPS" sub="Balance Enquiry" />
                <PhoneRow icon="fa-mobile-screen-button" title="Mobile Recharge" sub="Prepaid / DTH" />
                <PhoneRow icon="fa-id-card" title="PAN Card" sub="Apply Portal" />
                <PhoneRow icon="fa-file-invoice" title="GST Services" sub="Registration & Return" />
                <PhoneRow icon="fa-calculator" title="Tax Filing" sub="Income Tax" />
              </div>
            </div>

            <svg className="hero-illustration-person" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M70 240 C70 170 120 160 160 160 C200 160 250 170 250 240 L260 400 L60 400 Z" fill="#0d6efd" />
              <path d="M125 160 L160 210 L195 160 Z" fill="#ffffff" opacity="0.9" />
              <path d="M120 160 L160 185 L135 190 Z" fill="#0056b3" />
              <path d="M200 160 L160 185 L185 190 Z" fill="#0056b3" />
              <rect x="142" y="125" width="36" height="40" rx="10" fill="#f5c29b" />
              <ellipse cx="160" cy="100" rx="42" ry="48" fill="#f5c29b" />
              <path d="M118 90 C118 50 150 45 160 45 C180 45 202 50 202 90 C195 70 180 60 160 60 C140 60 125 70 118 90 Z" fill="#1e293b" />
              <path d="M125 105 C125 135 140 145 160 145 C180 145 195 135 195 105 C185 130 175 135 160 135 C145 135 135 130 125 105 Z" fill="#1e293b" opacity="0.9" />
              <circle cx="145" cy="92" r="3.5" fill="#1e293b" />
              <circle cx="175" cy="92" r="3.5" fill="#1e293b" />
              <path d="M148 112 Q160 122 172 112" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M60 280 Q100 250 135 280" stroke="#f5c29b" strokeWidth="20" strokeLinecap="round" fill="none" />
              <rect x="120" y="250" width="50" height="90" rx="10" fill="#0f172a" />
              <rect x="124" y="254" width="42" height="82" rx="6" fill="#38bdf8" />
            </svg>

            <div className="hero-trusted-pill">
              <div className="trusted-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--navy-deep)" }}>Your Trusted</div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary-blue)" }}>Digital Partner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Our <span>Services</span>
            </h2>
          </div>
          <div className="services-grid-6col">
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
            <MoreServicesCard variant="home" />
          </div>
        </div>
      </section>

      <div className="container">
        <div className="value-bar-container">
          <div className="value-grid-4col">
            <ValueBox icon="fa-bolt" title="Fast & Reliable" text="Quick processing and timely delivery" />
            <ValueBox icon="fa-shield-halved" title="Secure & Safe" text="100% secure process and data protection" />
            <ValueBox icon="fa-headset" title="Expert Support" text="Professional guidance at every step" />
            <ValueBox icon="fa-hand-holding-dollar" title="Affordable Price" text="Best services at reasonable cost" />
          </div>
        </div>
      </div>

      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="about-grid-2col">
            <div className="about-banner-illustration">
              <div style={{ textAlign: "center" }}>
                <BankSvg />
              </div>
            </div>
            <div>
              <h2 className="section-title" style={{ textAlign: "left", marginBottom: 16 }}>
                About <span>Us</span>
              </h2>
              <p style={{ color: "var(--slate-600)", fontSize: "0.92rem", lineHeight: 1.7 }}>
                We are a trusted digital service provider offering a wide range of online services including AEPS, Recharge, PAN Card, GST, Income Tax, MSME Registration, Trade Licence and many more. Our goal is to make digital services simple, accessible and reliable for everyone.
              </p>
              <div className="about-stats-grid">
                <Stat icon="fa-users" value="500+" label="Happy Clients" />
                <Stat icon="fa-file-circle-check" value="1000+" label="Services Completed" />
                <Stat icon="fa-award" value="5+ Years" label="of Experience" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              How It <span>Works</span>
            </h2>
          </div>
          <div className="process-grid-5steps">
            <Step green icon="fa-file-lines" n="Step 1" title="Select Service" text="Choose the service you need from our list" />
            <Step icon="fa-cloud-arrow-up" n="Step 2" title="Fill Details" text="Fill the enquiry form and upload documents" />
            <Step green icon="fa-paper-plane" n="Step 3" title="Submit Enquiry" text="Submit your enquiry and get reference ID" />
            <Step icon="fa-headset" n="Step 4" title="We Process" text="Our experts will process your request" />
            <Step green icon="fa-circle-check" n="Step 5" title="Get It Done" text="Receive your service successfully" />
          </div>
          <div className="cta-banner-box">
            <div>
              <h3>Need Any Service?</h3>
              <p>We are here to help you. Send your enquiry now and our team will contact you shortly.</p>
            </div>
            <Link href="/apply" className="btn">
              <span>Send Enquiry Now</span>
              <i className="fa-solid fa-paper-plane"></i>
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      <section className="section" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              What Our <span>Clients Say</span>
            </h2>
          </div>
          <div className="testimonial-wrapper">
            <div style={{ fontSize: "3rem", color: "#10b981", position: "absolute", left: 0, top: 0, fontFamily: "serif", lineHeight: 1 }}>
              “
            </div>
            <div style={{ fontSize: "3rem", color: "#10b981", position: "absolute", right: 0, bottom: 0, fontFamily: "serif", lineHeight: 1 }}>
              ”
            </div>
            <div className="testimonial-avatar-box">
              <i className="fa-solid fa-user-tie"></i>
            </div>
            <p className="testimonial-text">
              &quot;Very good service and fast processing. I got my GST registration done without any hassle. Highly recommended!&quot;
            </p>
            <div className="testimonial-author-name">- Rahul Das</div>
            <div className="stars-rating">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <div className="slider-pagination-dots">
              <span className="dot-item active"></span>
              <span className="dot-item"></span>
              <span className="dot-item"></span>
              <span className="dot-item"></span>
              <span className="dot-item"></span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PhoneRow({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="phone-service-row">
      <div className="phone-service-icon">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="phone-service-info">
        <h5>{title}</h5>
        <p>{sub}</p>
      </div>
    </div>
  );
}

function ValueBox({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="value-box">
      <div className="value-circle-icon">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="value-info">
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="stat-box-item">
      <div style={{ fontSize: "1.1rem", color: "var(--primary-blue)", marginBottom: 4 }}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="stat-num-value">{value}</div>
      <div className="stat-text-label">{label}</div>
    </div>
  );
}

function Step({
  icon,
  n,
  title,
  text,
  green,
}: {
  icon: string;
  n: string;
  title: string;
  text: string;
  green?: boolean;
}) {
  return (
    <div className={`process-step-box${green ? " green-step" : ""}`}>
      <div className="process-icon-circle">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="process-step-label">{n}</div>
      <h4 className="process-step-heading">{title}</h4>
      <p className="process-step-text">{text}</p>
    </div>
  );
}

export function WhyChooseUs() {
  const items = [
    { icon: "fa-users", title: "Experienced Team", text: "Our experts have years of experience in digital services and taxation." },
    { icon: "fa-user-group", title: "Customer First", text: "We always prioritize our customers and their satisfaction." },
    { icon: "fa-stopwatch", title: "Quick Processing", text: "We ensure fast and smooth processing of your services." },
    { icon: "fa-eye", title: "Transparent Process", text: "No hidden charges and complete transparency in every step." },
    { icon: "fa-headset", title: "24/7 Support", text: "We are always available to support you at any time." },
  ];
  return (
    <section className="section" style={{ background: "#ffffff" }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Why <span>Choose Us</span>
          </h2>
        </div>
        <div className="why-grid-5col">
          {items.map((item) => (
            <div className="why-item-card" key={item.title}>
              <div className="why-item-icon">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BankSvg() {
  return (
    <svg width="220" height="150" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 50 L100 15 L180 50 Z" fill="#0d6efd" />
      <rect x="30" y="55" width="140" height="10" fill="#0056b3" />
      <rect x="40" y="65" width="16" height="55" fill="#38bdf8" />
      <rect x="75" y="65" width="16" height="55" fill="#38bdf8" />
      <rect x="110" y="65" width="16" height="55" fill="#38bdf8" />
      <rect x="145" y="65" width="16" height="55" fill="#38bdf8" />
      <rect x="25" y="120" width="150" height="12" fill="#0d6efd" />
      <circle cx="165" cy="95" r="10" fill="#f5c29b" />
      <path d="M150 120 C150 108 180 108 180 120 Z" fill="#0f172a" />
      <rect x="145" y="112" width="22" height="12" rx="2" fill="#94a3b8" />
      <circle cx="35" cy="85" r="14" fill="#10b981" />
      <path d="M30 85 L34 89 L41 81" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
