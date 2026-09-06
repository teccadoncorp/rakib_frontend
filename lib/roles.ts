export type Role = "admin" | "superior" | "distributor" | "retailer" | "user";

export const STAFF_ROLES: Role[] = ["admin", "superior", "distributor", "retailer"];
export const PARTNER_ROLES: Role[] = ["distributor", "retailer"];
export const PARTNER_REQUIRED_SLUGS = ["aeps", "mobile-recharge", "pan-card"] as const;

export function normalizeRole(role?: string | null): Role | "customer" | string {
  if (role === "customer") return "user";
  return role || "user";
}

export function isStaffRole(role?: string | null) {
  const r = normalizeRole(role);
  return STAFF_ROLES.includes(r as Role);
}

export function isPublicUser(role?: string | null) {
  const r = normalizeRole(role);
  return r === "user";
}

export function canUseUserPortal(role?: string | null) {
  const r = normalizeRole(role);
  return r === "user" || r === "distributor" || r === "retailer";
}

export function isControlRoomOnly(role?: string | null) {
  const r = normalizeRole(role);
  return r === "admin" || r === "superior";
}

export function isPartnerRole(role?: string | null) {
  const r = normalizeRole(role);
  return PARTNER_ROLES.includes(r as Role);
}

export function serviceRequiresPartner(slug?: string | null, flag?: boolean) {
  if (typeof flag === "boolean") return flag;
  return PARTNER_REQUIRED_SLUGS.includes((slug || "") as (typeof PARTNER_REQUIRED_SLUGS)[number]);
}

export function roleLabel(role?: string | null) {
  const r = normalizeRole(role);
  switch (r) {
    case "admin":
      return "Admin";
    case "superior":
      return "Superior";
    case "distributor":
      return "Distributor";
    case "retailer":
      return "Retailer";
    default:
      return "User";
  }
}

export type NavItem = {
  href: string;
  label: string;
  icon: string;
  roles: Role[];
};

export const STAFF_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "fa-gauge-high", roles: STAFF_ROLES },
  { href: "/admin/users", label: "People", icon: "fa-users", roles: ["admin", "superior", "distributor"] },
  { href: "/admin/invite", label: "Invite", icon: "fa-user-plus", roles: ["admin", "superior", "distributor"] },
  { href: "/admin/enquiries", label: "Customer enquiries", icon: "fa-folder-open", roles: STAFF_ROLES },
  { href: "/admin/interests", label: "Interests", icon: "fa-hand", roles: ["admin", "superior"] },
  { href: "/admin/contacts", label: "Inbox", icon: "fa-envelope-open-text", roles: ["admin", "superior"] },
  { href: "/admin/services", label: "Services & docs", icon: "fa-briefcase", roles: STAFF_ROLES },
  { href: "/admin/settings", label: "Site settings", icon: "fa-sliders", roles: ["admin", "superior"] },
];

export function navForRole(role?: string | null) {
  const r = normalizeRole(role) as Role;
  return STAFF_NAV.filter((item) => item.roles.includes(r));
}

export function canInviteRole(actorRole?: string | null, target?: string | null) {
  const actor = normalizeRole(actorRole);
  if (actor === "admin") return ["distributor", "retailer", "user"].includes(target || "");
  if (actor === "superior") return ["distributor", "retailer"].includes(target || "");
  if (actor === "distributor") return target === "retailer";
  return false;
}
