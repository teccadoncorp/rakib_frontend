import type { NextConfig } from "next";

const phpAliases: Record<string, string> = {
  "/index.php": "/",
  "/services.php": "/services",
  "/pvc-print.php": "/pvc-print",
  "/pvc-details.php": "/pvc-details",
  "/service-details.php": "/service-details",
  "/about.php": "/about",
  "/contact.php": "/contact",
  "/track.php": "/track",
  "/privacy-policy.php": "/privacy-policy",
  "/terms.php": "/terms",
  "/user-login.php": "/user-login",
  "/user-register.php": "/user-register",
  "/user-dashboard.php": "/user-dashboard",
  "/user-logout.php": "/user-logout",
  "/apply.php": "/apply",
  "/admin/login.php": "/admin/login",
  "/admin/index.php": "/admin",
  "/admin/users.php": "/admin/users",
  "/admin/enquiries.php": "/admin/enquiries",
  "/admin/services.php": "/admin/services",
  "/admin/settings.php": "/admin/settings",
  "/admin/invite.php": "/admin/invite",
  "/admin/interests.php": "/admin/interests",
  "/admin/contacts.php": "/admin/contacts",
  "/forgot-password.php": "/forgot-password",
  "/reset-password.php": "/reset-password",
  "/accept-invite.php": "/accept-invite",
  "/verify-email.php": "/verify-email",
};

const nextConfig: NextConfig = {
  async rewrites() {
    return Object.entries(phpAliases).map(([source, destination]) => ({
      source,
      destination,
    }));
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
