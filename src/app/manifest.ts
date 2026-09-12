import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";

/**
 * Web App Manifest — servido em /manifest.webmanifest.
 * Ver docs/pwa/offline-strategy.md.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: siteConfig.locale,
    dir: "ltr",
    background_color: siteConfig.themeColor.dark,
    theme_color: siteConfig.themeColor.dark,
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
