import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { MoreServicesCard, ServiceCard } from "@/components/ServiceCard";
import { loadPublicServices, loadPublicSettings } from "@/lib/catalog";
import { LANDING_SERVICE_SLUGS, SERVICES, type Service } from "@/lib/data";
import { canonical, pageMeta } from "@/lib/seo";
import { heroTitleParts } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMeta({
  title: "Digital Banking & Online Services | Digital Service - Your Digital Partner",
  description:
    "Fast, reliable digital banking, GST, PAN, income tax, MSME and PVC card printing from Digital Service, Jaynagar (Bakultala), South 24 Parganas.",
  path: "/",
  absolute: true,
});

export default async function HomePage() {
  const [services, settings] = await Promise.all([loadPublicServices(), loadPublicSettings()]);
  const featured = LANDING_SERVICE_SLUGS.map(
    (slug) => services.find((item) => item.slug === slug) || SERVICES.find((item) => item.slug === slug)
  ).filter((item): item is Service => Boolean(item));
  const hero = heroTitleParts(settings.heroTitle);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Digital Service offerings",
          itemListElement: services.map((service, index) => ({
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
            <p className="hero-kicker">Your local digital partner</p>
            <h1 className="hero-title">
              {hero.lead}{hero.tail ? <> <span>{hero.tail}</span></> : null}
            </h1>
            <p className="hero-subtitle">{settings.heroSubtitle}</p>
            <div className="hero-ctas">
              <a href="#services" className="btn btn-primary">
                <span>{settings.heroCta1}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </a>
              <Link href="/apply" className="btn btn-ghost">
                <span>{settings.heroCta2}</span>
              </Link>
            </div>
          </div>

          <div className="hero-visual-wrapper">
            <div className="hero-prop cup" aria-hidden="true">
              <i className="fa-solid fa-leaf" style={{ color: "#16a34a", fontSize: "1.1rem", display: "grid", placeItems: "center", height: "100%" }}></i>
            </div>
            <div className="hero-prop mug" aria-hidden="true"></div>
            <LaptopMockup />
          </div>
        </div>
      </section>

      <section className="hero-features">
        <div className="container">
          <div className="hero-features-panel">
            <div className="hero-features-grid">
              <HeroFeature icon="fa-gauge-high" title="Fast Processing" text="Quick filing and timely delivery for every service." />
              <HeroFeature icon="fa-shield-halved" title="Secure & Reliable" text="Your data stays confidential with a safe process." />
              <HeroFeature icon="fa-headset" title="24/7 Support" text="We are here to help you at every step." />
              <HeroFeature icon="fa-hand-holding-dollar" title="Affordable Price" text="Best digital services at a reasonable cost." />
              <HeroFeature icon="fa-handshake" title="Trusted Partner" text="Local support from Jaynagar for your success." />
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
            {featured.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
            <MoreServicesCard variant="home" />
          </div>
        </div>
      </section>

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
                {settings.about}
              </p>
              <div className="about-stats-grid">
                <Stat icon="fa-users" value={settings.statClients} label="Happy Clients" />
                <Stat icon="fa-file-circle-check" value={settings.statCompleted} label="Services Completed" />
                <Stat icon="fa-award" value={settings.statExperience} label="of Experience" />
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
            <div style={{ fontSize: "3rem", color: "var(--primary-blue)", position: "absolute", left: 0, top: 0, fontFamily: "serif", lineHeight: 1 }}>
              “
            </div>
            <div style={{ fontSize: "3rem", color: "var(--primary-blue)", position: "absolute", right: 0, bottom: 0, fontFamily: "serif", lineHeight: 1 }}>
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

function HeroFeature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="hero-feature">
      <div className="hero-feature-icon">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}

function LaptopMockup() {
  return (
    <div className="laptop-mockup">
      <div className="laptop-screen">
        <div className="laptop-chrome">
          <div className="laptop-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>Digital Service Dashboard</span>
          <span style={{ color: "#00c2ff" }}>Live</span>
        </div>
        <div className="laptop-body">
          <div className="dash-stats">
            <div className="dash-stat">
              <strong>500+</strong>
              <span>Happy clients</span>
            </div>
            <div className="dash-stat">
              <strong>1000+</strong>
              <span>Services done</span>
            </div>
            <div className="dash-stat">
              <strong>5+ yrs</strong>
              <span>Local experience</span>
            </div>
          </div>
          <div className="phone-items-list">
            <PhoneRow icon="fa-id-card" title="PAN & Aadhaar" sub="Apply / update portal" />
            <PhoneRow icon="fa-file-invoice" title="GST Services" sub="Registration & return" />
            <PhoneRow icon="fa-calculator" title="Income Tax" sub="ITR filing support" />
            <PhoneRow icon="fa-certificate" title="Licences" sub="Trade, FSSAI, ISO" />
          </div>
        </div>
      </div>
      <div className="laptop-base"></div>
    </div>
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
      <path d="M20 50 L100 15 L180 50 Z" fill="#061833" />
      <rect x="30" y="55" width="140" height="10" fill="#0a4f86" />
      <rect x="40" y="65" width="16" height="55" fill="#00c2ff" />
      <rect x="75" y="65" width="16" height="55" fill="#00c2ff" />
      <rect x="110" y="65" width="16" height="55" fill="#00c2ff" />
      <rect x="145" y="65" width="16" height="55" fill="#00c2ff" />
      <rect x="25" y="120" width="150" height="12" fill="#061833" />
      <circle cx="165" cy="95" r="10" fill="#f5c29b" />
      <path d="M150 120 C150 108 180 108 180 120 Z" fill="#0f172a" />
      <rect x="145" y="112" width="22" height="12" rx="2" fill="#94a3b8" />
      <circle cx="35" cy="85" r="14" fill="#10b981" />
      <path d="M30 85 L34 89 L41 81" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
