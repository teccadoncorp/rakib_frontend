import { getApiUrl } from "./site";
import type { Role } from "./roles";

export type User = {
  id: string;
  userCode: string;
  partnerCode?: string;
  parentId?: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  role: Role;
  status?: "active" | "invited" | "suspended";
  emailVerified?: boolean;
  invitedBy?: string;
  createdAt?: string | null;
};

export type Application = {
  id: string;
  ref: string;
  type: "service" | "pvc";
  title: string;
  serviceSlug?: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  amount: number | null;
  createdAt: string;
  customerName: string;
  mobile: string;
  email?: string;
  address?: string;
  message?: string;
  utr?: string;
  files?: string[];
  userId?: string;
  partnerId?: string;
  partnerCode?: string;
  partnerRole?: string;
};

export type Interest = {
  id: string;
  userId: string;
  serviceSlug: string;
  serviceTitle: string;
  message: string;
  status: "pending" | "contacted" | "converted" | "closed";
  createdAt: string;
  userName: string;
  mobile: string;
  email: string;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type Partner = {
  id: string;
  name: string;
  role: Role;
  partnerCode: string;
  status: string;
};

export type StaffOverview = {
  users: number;
  distributors: number;
  retailers: number;
  applications: number;
  pending: number;
  completed: number;
  interests: number;
  contacts: number;
};

export type PortalSettings = {
  name: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  upiId: string;
  payeeName: string;
};

function networkError(err: unknown) {
  if (err instanceof TypeError && /fetch|network|load/i.test(err.message)) {
    return new Error(
      "Cannot reach the server from this device. Use the live site (not a saved file), stay on HTTPS, and try again."
    );
  }
  return err instanceof Error ? err : new Error("Request failed");
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
  let res: Response;
  try {
    res = await fetch(`${getApiUrl()}${path}`, {
      ...rest,
      headers: {
        ...(rest.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch (err) {
    throw networkError(err);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || "Request failed");
  }
  return data as T;
}

export const api = {
  register: (payload: Record<string, string>) =>
    request<{ token: string; user: User; message?: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (login_input: string, password: string) =>
    request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ login_input, password }),
    }),
  staffLogin: (username: string, password: string) =>
    request<{ token: string; user: User }>("/api/auth/staff-login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  adminLogin: (username: string, password: string) =>
    request<{ token: string; user: User }>("/api/auth/staff-login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  me: (token: string) => request<{ user: User }>("/api/auth/me", { token }),
  verifyEmail: (token: string) =>
    request<{ ok: boolean }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  forgotPassword: (email: string) =>
    request<{ ok: boolean; message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    request<{ ok: boolean }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  acceptInvite: (token: string, password: string) =>
    request<{ token: string; user: User }>("/api/auth/accept-invite", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  contact: (payload: Record<string, string>) =>
    request<{ ok: boolean }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  track: (ref: string) =>
    request<{ applications: Application[] }>(`/api/track?ref=${encodeURIComponent(ref)}`),
  lookupPartner: (code: string) =>
    request<{ partner: Partner }>(`/api/partners/lookup?code=${encodeURIComponent(code)}`),
  myApplications: (token: string) =>
    request<{ applications: Application[] }>("/api/applications", { token }),
  myInterests: (token: string) =>
    request<{ interests: Interest[] }>("/api/interests", { token }),
  submitInterest: (token: string, payload: { serviceSlug: string; message?: string }) =>
    request<{ interest: Interest }>("/api/interests", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  submitApplication: (token: string, form: FormData) =>
    request<{ application: Application }>("/api/applications", {
      method: "POST",
      token,
      body: form,
    }),
  submitPvc: (token: string, form: FormData) =>
    request<{ application: Application }>("/api/pvc-orders", {
      method: "POST",
      token,
      body: form,
    }),
  staffOverview: (token: string) =>
    request<{ overview: StaffOverview }>("/api/staff/overview", { token }),
  staffUsers: (token: string, role?: string) =>
    request<{ users: User[]; total?: number }>(`/api/staff/users${role ? `?role=${encodeURIComponent(role)}` : ""}`, { token }),
  createStaffUser: (token: string, payload: Record<string, string>, secret?: string) =>
    request<{ user: User }>("/api/staff/users", {
      method: "POST",
      token,
      headers: secret ? { "X-Superior-Secret": secret } : undefined,
      body: JSON.stringify(payload),
    }),
  staffInvite: (token: string, payload: Record<string, string>) =>
    request<{ user: User; inviteUrl?: string }>("/api/staff/invite", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  createSuperior: (token: string, secret: string, payload: Record<string, string>) =>
    request<{ user: User; inviteUrl?: string }>("/api/staff/superiors", {
      method: "POST",
      token,
      headers: { "X-Superior-Secret": secret },
      body: JSON.stringify(payload),
    }),
  patchUser: (token: string, id: string, payload: Record<string, string>) =>
    request<{ user: User }>(`/api/staff/users/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }),
  staffApplications: (token: string, query?: { type?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (query?.type) params.set("type", query.type);
    if (query?.status) params.set("status", query.status);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return request<{ applications: Application[]; total?: number }>(`/api/staff/applications${suffix}`, { token });
  },
  patchApplication: (token: string, id: string, payload: string | Record<string, string | number | null>) =>
    request<{ application: Application }>(`/api/staff/applications/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(typeof payload === "string" ? { status: payload } : payload),
    }),
  staffInterests: (token: string) =>
    request<{ interests: Interest[] }>("/api/staff/interests", { token }),
  patchInterest: (token: string, id: string, status: string) =>
    request<{ interest: Interest }>(`/api/staff/interests/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status }),
    }),
  staffContacts: (token: string) =>
    request<{ contacts: Contact[] }>("/api/staff/contacts", { token }),
  staffSettings: (token: string) =>
    request<{ settings: PortalSettings }>("/api/staff/settings", { token }),
  patchSettings: (token: string, payload: Partial<PortalSettings>) =>
    request<{ settings: PortalSettings }>("/api/staff/settings", {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }),
  adminUsers: (token: string) =>
    request<{ users: User[] }>("/api/staff/users", { token }),
  adminEnquiries: (token: string) =>
    request<{ applications: Application[] }>("/api/staff/applications", { token }),
};
