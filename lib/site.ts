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
  copyright: "© 2024 Digital Service. All Rights Reserved.",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14777.625488102434!2d88.423912!3d22.186638!2m3!1f0!0!f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02422c54b299e5%3A0x6b77226f328f2ab!2sJaynagar%2C%20West%20Bengal%20743337!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:43124";

export function telHref() {
  return `tel:${SITE.phone}`;
}

export function mailHref() {
  return `mailto:${SITE.email}`;
}

export function waHref(text?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function upiQrUrl(amount?: number | null) {
  const params = new URLSearchParams({
    pa: SITE.upiId,
    pn: SITE.payeeName,
  });
  if (amount && amount > 0) {
    params.set("am", amount.toFixed(2));
    params.set("cu", "INR");
  }
  const data = `upi://pay?${params.toString()}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data)}`;
}
