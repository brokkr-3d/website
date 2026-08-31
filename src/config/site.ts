/**
 * Static, non-translatable site configuration.
 * UI strings and route segments live in src/lib/i18n.ts.
 */

export const LOCALES = ["en", "no"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const SITE = {
  name: "Brokkr",
  legalName: "BROKKR 3D AS",
  /** Used for <title> suffix and OpenGraph site_name */
  tagline: {
    en: "The artisans of the 21st century",
    no: "Håndverkerne for det 21. århundret",
  },
  /** TODO(founder): confirm before launch — current site shows ap@brokkr.dk */
  email: "ap@brokkr.dk",
  /** TODO(founder): confirm before launch */
  address: {
    street: "Ivan Bjørndalsgate 9",
    postal: "0472 Oslo",
    country: { en: "Norway", no: "Norge" },
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/brokkr3d/" },
  ],
} as const;

/** Order controls the header nav. `key` maps into the i18n route-segment map. */
export const NAV = [
  { key: "services" as const },
  { key: "projects" as const },
  { key: "about" as const },
  { key: "contact" as const },
];
