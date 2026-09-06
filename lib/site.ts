export const SITE = {
  name: "Digital Service",
  tagline: "Your Digital Partner",
  phone: "7872292614",
  phoneDisplay: "7872292614",
  phoneIntl: "+91 7872292614",
  email: "rhossen389@gmail.com",
  whatsapp: "917872292614",
  address:
    "Jibon Mondal Hat, Jaynagar (Bakultala), South 24 Parganas, West Bengal - 743337",
  hours: "Mon - Sat: 9:00 AM - 7:00 PM | Sunday: Closed",
  upiId: "7872292614@ybl",
  payeeName: "Digital Service (Jaynagar)",
  about:
    "We are a trusted digital service provider offering AEPS, recharge, PAN, GST, income tax, MSME and trade licence support from Jaynagar.",
  copyright: "© 2024 Digital Service. All Rights Reserved.",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14777.625488102434!2d88.423912!3d22.186638!2m3!1f0!0!f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02422c54b299e5%3A0x6b77226f328f2ab!2sJaynagar%2C%20West%20Bengal%20743337!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  heroTitle: "Digital Services Made Simple",
  heroSubtitle:
    "Fast, reliable and convenient digital banking, tax, GST and business registration services from one place.",
  heroCta1: "Explore Services",
  heroCta2: "Send Enquiry",
  qrNote: "Pay the service charge with GPay, PhonePe or Paytm, then upload the payment screenshot.",
  enquirySuccess:
    "Your enquiry has been submitted successfully. Our team will verify your details and contact you shortly.",
  statClients: "500+",
  statCompleted: "1000+",
  statExperience: "5+ Years",
  roleSelection: "on",
};

function stripSlash(url: string) {
  return url.replace(/\/$/, "");
}

export function configuredApiUrl() {
  return stripSlash(process.env.NEXT_PUBLIC_API_URL || "");
}

/** Same-origin in the browser so phones never call 127.0.0.1. */
export function getApiUrl() {
  if (typeof window !== "undefined") return "";
  return configuredApiUrl() || "http://127.0.0.1:43124";
}

export const API_URL = configuredApiUrl() || "http://127.0.0.1:43124";

export type SiteInfo = typeof SITE;

export function withSite(partial?: Partial<SiteInfo> | null): SiteInfo {
  const phone = String(partial?.phone || SITE.phone).trim() || SITE.phone;
  const rawWhatsapp = String(partial?.whatsapp || SITE.whatsapp).trim() || SITE.whatsapp;
  const whatsapp = /^\d{10}$/.test(rawWhatsapp) ? `91${rawWhatsapp}` : rawWhatsapp;
  return {
    ...SITE,
    ...partial,
    phone,
    phoneDisplay: phone,
    phoneIntl: phone.startsWith("+") ? phone : `+91 ${phone}`,
    whatsapp,
    email: String(partial?.email || SITE.email).trim() || SITE.email,
    name: String(partial?.name || SITE.name).trim() || SITE.name,
    tagline: String(partial?.tagline || SITE.tagline).trim() || SITE.tagline,
  };
}

export function telHref(site: SiteInfo = SITE) {
  return `tel:${site.phone}`;
}

export function mailHref(site: SiteInfo = SITE) {
  return `mailto:${site.email}`;
}

export function waHref(text?: string, site: SiteInfo = SITE) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function heroTitleParts(title: string) {
  const words = String(title || SITE.heroTitle).trim().split(/\s+/);
  if (words.length < 2) return { lead: title, tail: "" };
  return { lead: words.slice(0, -1).join(" "), tail: words[words.length - 1] };
}

export function upiQrUrl(amount?: number | null, site: SiteInfo = SITE) {
  const params = new URLSearchParams({
    pa: site.upiId,
    pn: site.payeeName,
  });
  if (amount && amount > 0) {
    params.set("am", amount.toFixed(2));
    params.set("cu", "INR");
  }
  const data = `upi://pay?${params.toString()}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data)}`;
}
