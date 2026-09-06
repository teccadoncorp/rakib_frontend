export type ServiceDoc = {
  name: string;
  hint: string;
  formats: string;
  allowed: string;
  maxMb: number;
  required: boolean;
};

export type Service = {
  id: number | string;
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  overview: string;
  icon: string;
  processingTime: string;
  price: number | null;
  priceLabel: string;
  priceDisplay: string;
  documents: ServiceDoc[];
  requiresPartner?: boolean;
  active?: boolean;
  sortOrder?: number;
};

export type PvcCard = {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  price: number;
};

export const SERVICES: Service[] = [
  {
    id: 1,
    slug: "aeps",
    title: "AEPS",
    description:
      "Aadhaar Enabled Payment System for instant cash withdrawal and balance enquiry using biometric verification.",
    overview:
      "Our AEPS (Aadhaar Enabled Payment System) service enables customers to perform basic banking transactions like cash withdrawal, balance enquiry, and mini statements using their Aadhaar number and fingerprint authentication. Fast, secure, and available right in your local area.",
    icon: "fa-fingerprint",
    processingTime: "Instant",
    price: null,
    priceLabel: "Contact for Quote",
    priceDisplay: "Contact for Price",
    documents: [],
    requiresPartner: true,
  },
  {
    id: 2,
    slug: "mobile-recharge",
    title: "All Mobile Recharge",
    description:
      "Instant prepaid mobile recharge, DTH payments, and utility bill processing for all major operators.",
    overview:
      "We provide fast and seamless online recharge services for Airtel, Jio, Vi, BSNL, along with major DTH providers (Tata Play, Airtel Digital TV, Dish TV, Sun Direct) and utility bill payments. Instant confirmation and instant processing.",
    icon: "fa-mobile-screen-button",
    processingTime: "Instant",
    price: null,
    priceLabel: "Contact for Quote",
    priceDisplay: "Contact for Price",
    documents: [],
    requiresPartner: true,
  },
  {
    id: 3,
    slug: "pan-card",
    title: "PAN Card Apply Portal",
    description:
      "Apply for new PAN card, corrections, duplicate PAN card download, and Aadhaar-PAN linking.",
    overview:
      "Complete assistance for fresh Permanent Account Number (PAN) applications, photo/signature updates, name corrections, and re-issuance of damaged or lost PAN cards under Income Tax Department guidelines.",
    icon: "fa-id-card",
    processingTime: "Instant",
    price: 49,
    priceLabel: "Starting ₹49.00",
    priceDisplay: "Starting ₹49.00",
    requiresPartner: true,
    documents: [
      {
        name: "Aadhaar Card",
        hint: "Aadhaar Card for identity and date of birth verification",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "Passport Size Photo",
        hint: "White background recent passport photo",
        formats: "JPG,JPEG,PNG (Max 2MB)",
        allowed: "jpg,jpeg,png",
        maxMb: 2,
        required: true,
      },
      {
        name: "Signature Specimen",
        hint: "Clear signature on white blank paper",
        formats: "JPG,JPEG,PNG (Max 2MB)",
        allowed: "jpg,jpeg,png",
        maxMb: 2,
        required: true,
      },
    ],
  },
  {
    id: 4,
    slug: "gst-registration",
    title: "GST Registration",
    description:
      "Hassle-free new GST registration for proprietorship, partnership, and private limited businesses.",
    overview:
      "Get your business registered under Goods and Services Tax (GST) seamlessly. We handle document verification, portal submission, query responses, and final GSTIN certificate delivery.",
    icon: "fa-file-invoice",
    processingTime: "Instant",
    price: 1799,
    priceLabel: "Starting ₹1,799.00",
    priceDisplay: "Starting ₹1,799.00",
    documents: [
      {
        name: "Aadhaar Card",
        hint: "Clear front and back copy of business applicant Aadhaar Card",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "PAN Card",
        hint: "PAN Card copy of the business proprietor / firm",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "Passport Size Photo",
        hint: "Recent passport size photograph with clear background",
        formats: "JPG,JPEG,PNG (Max 2MB)",
        allowed: "jpg,jpeg,png",
        maxMb: 2,
        required: true,
      },
      {
        name: "Bank Account Proof",
        hint: "Cancelled cheque, passbook first page, or latest bank statement",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "Business Address Proof",
        hint: "Trade license or MSME certificate",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: false,
      },
      {
        name: "Land Proof",
        hint: "Latest land record",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "Electricity Bill",
        hint: "Land owner",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "Rent Agreement / NOC",
        hint: "Property rent agreement or owner NOC and owner aadhaar card, owner Latest Electricity bill if business premises are rented",
        formats: "PDF,JPG,JPEG,PNG (Max 10MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 10,
        required: false,
      },
    ],
  },
  {
    id: 5,
    slug: "gst-return",
    title: "GST Return",
    description:
      "Timely filing of GSTR-1, GSTR-3B, CMP-08, and Annual GSTR-9 returns with accurate tax computation.",
    overview:
      "Stay compliant and avoid heavy late fees. We assist business owners in calculating input tax credit (ITC), preparing outward supply statements, and filing monthly/quarterly GST returns.",
    icon: "fa-calculator",
    processingTime: "Monthly / Quarterly",
    price: null,
    priceLabel: "Contact for Quote",
    priceDisplay: "Contact for Price",
    documents: [],
  },
  {
    id: 6,
    slug: "gst-maintenance",
    title: "GST Maintenance",
    description:
      "Comprehensive ongoing GST compliance, invoice matching, ITC reconciliation, and notice management.",
    overview:
      "End-to-end management of your GST profile. Includes regular GSTR-2B ITC tracking, invoice audit, e-way bill generation support, and responding to tax department notices.",
    icon: "fa-sliders",
    processingTime: "Ongoing Monthly",
    price: null,
    priceLabel: "Contact for Quote",
    priceDisplay: "Contact for Price",
    documents: [],
  },
  {
    id: 7,
    slug: "books-of-account",
    title: "Books of Account",
    description:
      "Professional bookkeeping, ledger maintenance, balance sheet, and profit & loss statement preparation.",
    overview:
      "Accurate financial record-keeping for small businesses, retail shops, traders, and contractors. Maintain clean ledgers, bank reconciliation, trial balance, and financial statements.",
    icon: "fa-book-open",
    processingTime: "Monthly / Quarterly",
    price: null,
    priceLabel: "Contact for Quote",
    priceDisplay: "Contact for Price",
    documents: [],
  },
  {
    id: 8,
    slug: "income-tax-filing",
    title: "Income Tax Filing",
    description:
      "Accurate ITR filing for salaried individuals, traders, business owners, and professionals.",
    overview:
      "File your Income Tax Return (ITR-1, ITR-2, ITR-3, ITR-4) with maximum tax savings, accurate deductions under Old and New Tax Regimes, and fast refund processing.",
    icon: "fa-file-signature",
    processingTime: "2-4 Hours",
    price: 799,
    priceLabel: "Starting ₹799.00",
    priceDisplay: "Starting ₹799.00",
    documents: [
      {
        name: "PAN Card",
        hint: "PAN Card copy of tax filer",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "Aadhaar Card",
        hint: "Aadhaar card copy linked with PAN",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "Form 16 / Salary Certificate",
        hint: "Form 16 issued by employer (if salaried)",
        formats: "PDF,JPG,JPEG,PNG (Max 10MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 10,
        required: false,
      },
      {
        name: "Bank Passbook / Statement",
        hint: "Bank statement of all active accounts for financial year",
        formats: "PDF,JPG,JPEG,PNG (Max 10MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 10,
        required: true,
      },
      {
        name: "Investment & Deduction Proofs",
        hint: "LIC, PPF, Mutual Funds, Medical Insurance certificates",
        formats: "PDF,JPG,JPEG,PNG (Max 10MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 10,
        required: false,
      },
    ],
  },
  {
    id: 9,
    slug: "income-tax-audit",
    title: "Income Tax Audit Filing",
    description:
      "Tax audit report preparation and filing under Section 44AB for high-turnover businesses.",
    overview:
      "Comprehensive tax audit compliance by qualified tax professionals. Detailed scrutiny of books of accounts, Form 3CA/3CB and Form 3CD submission on the Income Tax e-filing portal.",
    icon: "fa-magnifying-glass-dollar",
    processingTime: "5-10 Business Days",
    price: null,
    priceLabel: "Contact for Quote",
    priceDisplay: "Contact for Price",
    documents: [],
  },
  {
    id: 10,
    slug: "msme-registration",
    title: "MSME Registration",
    description:
      "Udyam / MSME online registration to avail government subsidies, low-interest bank loans, and schemes.",
    overview:
      "Official government Udyam registration for Micro, Small, and Medium Enterprises. Unlocks eligibility for priority sector bank lending, government tender benefits, and protection against delayed payments.",
    icon: "fa-building-flag",
    processingTime: "1-2 Hours",
    price: 100,
    priceLabel: "Starting ₹100.00",
    priceDisplay: "Starting ₹100.00",
    documents: [
      {
        name: "Aadhaar Card",
        hint: "Aadhaar Card of business owner",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "PAN Card",
        hint: "PAN Card copy of proprietor/firm",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "Bank Account Details",
        hint: "Bank passbook copy or cancelled cheque showing IFSC code",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
    ],
  },
  {
    id: 11,
    slug: "trade-licence",
    title: "Trade Licence",
    description:
      "Application and renewal of Trade Licence from local Gram Panchayat or Municipality authorities.",
    overview:
      "Obtain official permission to run commercial business activities in Jaynagar, South 24 Parganas, and West Bengal regions. Full assistance from document preparation to approval certificate.",
    icon: "fa-certificate",
    processingTime: "1-5 Hour",
    price: null,
    priceLabel: "Contact for Quote",
    priceDisplay: "Contact for Price",
    documents: [
      {
        name: "Aadhaar Card",
        hint: "Applicant Aadhaar Card",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "PAN Card",
        hint: "PAN Card copy",
        formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
      {
        name: "Land Deed / Tax Receipt",
        hint: "Khaitan, Porcha, or latest land tax receipt of business premises",
        formats: "PDF,JPG,JPEG,PNG (Max 10MB)",
        allowed: "pdf,jpg,jpeg,png",
        maxMb: 10,
        required: true,
      },
      {
        name: "Shop / Establishment Photo",
        hint: "Front photo of shop showing signboard/premises",
        formats: "JPG,JPEG,PNG (Max 5MB)",
        allowed: "jpg,jpeg,png",
        maxMb: 5,
        required: true,
      },
    ],
  },
];

export const PVC_CARDS: PvcCard[] = [
  {
    slug: "aadhaar-pvc",
    title: "Aadhaar PVC Card",
    subtitle: "UIDAI Format HD PVC Plastic Card",
    icon: "fa-id-card",
    iconBg: "#0d6efd15",
    iconColor: "#0d6efd",
    badge: "Most Popular",
    badgeBg: "#0284c715",
    badgeColor: "#0284c7",
    price: 70,
  },
  {
    slug: "voter-pvc",
    title: "Voter ID PVC Card",
    subtitle: "Election Commission Format PVC",
    icon: "fa-check-to-slot",
    iconBg: "#10b98115",
    iconColor: "#10b981",
    badge: "High Demand",
    badgeBg: "#16a34a15",
    badgeColor: "#16a34a",
    price: 70,
  },
  {
    slug: "ration-pvc",
    title: "Digital Ration PVC Card",
    subtitle: "Food & Supplies Department PVC",
    icon: "fa-wheat-awn",
    iconBg: "#f59e0b15",
    iconColor: "#f59e0b",
    badge: "Digital Ration",
    badgeBg: "#d9770615",
    badgeColor: "#d97706",
    price: 70,
  },
  {
    slug: "pan-pvc",
    title: "PAN PVC Card",
    subtitle: "Income Tax Department Format",
    icon: "fa-file-invoice-dollar",
    iconBg: "#6366f115",
    iconColor: "#6366f1",
    badge: "Tax Compliant",
    badgeBg: "#4f46e515",
    badgeColor: "#4f46e5",
    price: 70,
  },
  {
    slug: "ayushman-pvc",
    title: "Ayushman Health PVC Card",
    subtitle: "PM-JAY Health Insurance Card",
    icon: "fa-heart-pulse",
    iconBg: "#10b98115",
    iconColor: "#10b981",
    badge: "Health Card",
    badgeBg: "#05966915",
    badgeColor: "#059669",
    price: 70,
  },
  {
    slug: "dl-pvc",
    title: "Driving License PVC Card",
    subtitle: "Transport Department DL Card",
    icon: "fa-car",
    iconBg: "#8b5cf615",
    iconColor: "#8b5cf6",
    badge: "DL Card",
    badgeBg: "#7c3aed15",
    badgeColor: "#7c3aed",
    price: 90,
  },
  {
    slug: "eshram-pvc",
    title: "e-Shram PVC Card",
    subtitle: "Ministry of Labour & Employment",
    icon: "fa-person-digging",
    iconBg: "#f9731615",
    iconColor: "#f97316",
    badge: "e-Shramik",
    badgeBg: "#ea580c15",
    badgeColor: "#ea580c",
    price: 70,
  },
  {
    slug: "custom-pvc",
    title: "Custom ID / Photo PVC Card",
    subtitle: "School, Job, Health & Custom Cards",
    icon: "fa-id-badge",
    iconBg: "#0284c715",
    iconColor: "#0284c7",
    badge: "Custom Print",
    badgeBg: "#0284c715",
    badgeColor: "#0284c7",
    price: 100,
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Very good service and fast processing. I got my GST registration done without any hassle. Highly recommended!",
    author: "Rahul Das",
  },
];

export function getService(slug?: string | null) {
  if (!slug) return SERVICES[0];
  return SERVICES.find((s) => s.slug === slug) || SERVICES[0];
}

export function getPvc(slug?: string | null) {
  if (!slug) return PVC_CARDS[0];
  return PVC_CARDS.find((c) => c.slug === slug) || PVC_CARDS[0];
}

export function formatInr(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function serviceRequiresPartner(slug?: string | null) {
  return Boolean(getService(slug).requiresPartner);
}
