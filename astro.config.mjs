// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// ---------------------------------------------------------------------------
// Deployment target
//
// While the custom domain is not yet pointed at GitHub Pages, the site is
// served from https://brokkr-3d.github.io/website/ and therefore needs `base`.
//
// When DNS for brokkr.design is cut over (see .github/workflows/deploy.yml and
// public/CNAME), switch to:
//     site: "https://brokkr.design",
//     base: undefined,            // or remove the line
// Nothing else needs to change — every internal link goes through
// src/lib/i18n.ts -> localizePath(), which respects import.meta.env.BASE_URL.
// ---------------------------------------------------------------------------
const SITE = "https://brokkr-3d.github.io";
const BASE = "/website";

export default defineConfig({
  site: SITE,
  base: BASE,
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
