// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// ---------------------------------------------------------------------------
// Deployment target — custom domain brokkr.design (public/CNAME).
// Served at the domain root, so no `base`. Every internal link goes through
// src/lib/i18n.ts, which respects import.meta.env.BASE_URL ("/" here).
// ---------------------------------------------------------------------------
const SITE = "https://brokkr.design";

export default defineConfig({
  site: SITE,
  trailingSlash: "ignore",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "no"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          no: "no",
        },
      },
    }),
  ],
  build: {
    format: "directory",
  },
});
