import { api, type CatalogService, type PortalSettings } from "./api";
import { SERVICES, type Service, type ServiceDoc } from "./data";
import { withSite, type SiteInfo } from "./site";

export function settingsFromApi(partial?: Partial<PortalSettings> | null): SiteInfo {
  return withSite({
    name: partial?.name,
    tagline: partial?.tagline,
    phone: partial?.phone,
    email: partial?.email,
    whatsapp: partial?.whatsapp,
    address: partial?.address,
    hours: partial?.hours,
    upiId: partial?.upiId,
    payeeName: partial?.payeeName,
    copyright: partial?.copyright,
    mapEmbed: partial?.mapEmbed,
    about: partial?.about,
    heroTitle: partial?.heroTitle,
    heroSubtitle: partial?.heroSubtitle,
    heroCta1: partial?.heroCta1,
    heroCta2: partial?.heroCta2,
    qrNote: partial?.qrNote,
    enquirySuccess: partial?.enquirySuccess,
    statClients: partial?.statClients,
    statCompleted: partial?.statCompleted,
    statExperience: partial?.statExperience,
    roleSelection: partial?.roleSelection,
  });
}

export function toCatalogService(service: Service, index = 0): CatalogService {
  return {
    id: String(service.id ?? service.slug ?? index + 1),
    slug: service.slug,
    title: service.title,
    shortTitle: service.shortTitle || "",
    description: service.description || "",
    overview: service.overview || "",
    icon: service.icon || "fa-briefcase",
    processingTime: service.processingTime || "",
    price: service.price == null ? null : Number(service.price),
    priceLabel: service.priceLabel || "",
    priceDisplay: service.priceDisplay || "",
    documents: Array.isArray(service.documents) ? service.documents : [],
    requiresPartner: Boolean(service.requiresPartner),
    active: service.active !== false,
    sortOrder: Number(service.sortOrder || index + 1),
    retailerFee: service.price ?? null,
    distributorFee: service.price ?? null,
    priceDisplayType: service.price == null ? "contact" : "starting",
    roleOption: service.requiresPartner ? "both" : "hidden",
  };
}

export const FALLBACK_CATALOG = SERVICES.map(toCatalogService);

export function emptyDoc(): ServiceDoc {
  return {
    name: "",
    hint: "",
    formats: "PDF,JPG,JPEG,PNG (Max 5MB)",
    allowed: "pdf,jpg,jpeg,png",
    maxMb: 5,
    required: true,
  };
}

export function serviceFromApi(raw: CatalogService | Service, index = 0): Service {
  const docs = Array.isArray(raw.documents) ? raw.documents : [];
  return {
    id: raw.id ?? index + 1,
    slug: raw.slug,
    title: raw.title,
    shortTitle: raw.shortTitle || "",
    description: raw.description || "",
    overview: raw.overview || "",
    icon: raw.icon || "fa-briefcase",
    processingTime: raw.processingTime || "",
    price: raw.price == null ? null : Number(raw.price),
    priceLabel: raw.priceLabel || "",
    priceDisplay: raw.priceDisplay || (raw.price != null ? `Starting ₹${Number(raw.price).toLocaleString("en-IN")}` : "Contact for Price"),
    documents: docs.map((doc) => ({
      name: doc.name,
      hint: doc.hint || "",
      formats: doc.formats || "PDF,JPG,JPEG,PNG (Max 5MB)",
      allowed: doc.allowed || "pdf,jpg,jpeg,png",
      maxMb: Number(doc.maxMb || 5),
      required: doc.required !== false,
    })),
    requiresPartner: Boolean(raw.requiresPartner),
    active: raw.active !== false,
    sortOrder: Number(raw.sortOrder || 0),
  };
}

export async function loadPublicSettings(): Promise<SiteInfo> {
  try {
    const res = await api.publicSettings();
    return settingsFromApi(res.settings);
  } catch {
    return settingsFromApi();
  }
}

export async function loadPublicServices(): Promise<Service[]> {
  try {
    const res = await api.publicServices();
    const list = (res.services || []).map(serviceFromApi);
    return list.length ? list : SERVICES;
  } catch {
    return SERVICES;
  }
}

export async function loadPublicService(slug: string): Promise<Service | undefined> {
  try {
    const res = await api.publicService(slug);
    if (res.service) return serviceFromApi(res.service);
  } catch {
    /* fall through */
  }
  const list = await loadPublicServices();
  return list.find((item) => item.slug === slug);
}
