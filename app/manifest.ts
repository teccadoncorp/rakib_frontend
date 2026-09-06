import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d6efd",
    lang: "en-IN",
    icons: [
      {
        src: "/assets/images/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/images/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
