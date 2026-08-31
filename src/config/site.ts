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
  /** TODO(founder): confirm street/postal before launch */
  address: {
    street: "Ivan Bjørndalsgate 9",
    postal: "0472 Oslo",
    country: { en: "Norway", no: "Norge" },
    coords: { lat: 59.9388968, lng: 10.7651815 },
    mapUrl:
      "https://www.google.com/maps/place/Brokkr/@59.9388968,10.7651815,807m/data=!3m2!1e3!4b1!4m6!3m5!1s0x46416d6a605c6611:0x1e2701755258f854!8m2!3d59.9388968!4d10.7651815!16s%2Fg%2F11ln1ckhpw",
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/brokkr3d/" },
  ],
  /**
   * Contact-form access key for Web3Forms (https://web3forms.com — free, no
   * account: enter an email, get a key). Safe to commit: it is a public,
   * per-form key, already visible in the page HTML. Empty = form hidden, the
   * contact page falls back to email only. Overridable via PUBLIC_WEB3FORMS_KEY.
   */
  web3formsKey: "" as string,
} as const;

/** Order controls the header nav. `key` maps into the i18n route-segment map. */
export const NAV = [
  { key: "services" as const },
  { key: "projects" as const },
  { key: "about" as const },
  { key: "contact" as const },
];
