import { DEFAULT_LOCALE, LOCALES, type Locale } from "~/config/site";

export { DEFAULT_LOCALE, LOCALES, type Locale };

/**
 * URL segment for each top-level section. Kept identical across locales for now
 * (NO pages live under /no/… with the same segments). If localised slugs are
 * wanted later — /no/tjenester, /no/prosjekter — this is the one place to change,
 * together with the folder names under src/pages/no/.
 */
export const SECTIONS = {
  services: "services",
  projects: "projects",
  about: "about",
  contact: "contact",
} as const;
export type Section = keyof typeof SECTIONS;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, ""); // "" or "/website"

function join(...parts: string[]): string {
  const path = parts
    .filter(Boolean)
    .join("/")
    .replace(/\/{2,}/g, "/")
    .replace(/\/$/, "");
  return path === "" ? "/" : path;
}

/** Prepend the deploy base path (no locale handling). */
export function withBase(path: string): string {
  return join(BASE, path.startsWith("/") ? path : `/${path}`);
}

/**
 * Turn a locale-agnostic path ("/projects/the-star") into a full href for the
 * given locale, including the deploy base path.
 *   en -> /website/projects/the-star
 *   no -> /website/no/projects/the-star
 */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.replace(/^\//, "");
  return locale === DEFAULT_LOCALE
    ? withBase(`/${clean}`)
    : withBase(`/${locale}/${clean}`);
}

/** Href for a top-level section, optionally with a sub-path (e.g. a slug). */
export function sectionHref(locale: Locale, section: Section, sub?: string): string {
  return localizePath(sub ? `/${SECTIONS[section]}/${sub}` : `/${SECTIONS[section]}`, locale);
}

export function homeHref(locale: Locale): string {
  return localizePath("/", locale);
}

/** Detect the current locale from Astro.url.pathname. */
export function localeFromPath(pathname: string): Locale {
  const stripped = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const seg = stripped.split("/").filter(Boolean)[0];
  return (LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : DEFAULT_LOCALE;
}

/**
 * Given the current pathname, return the equivalent path in the other locale —
 * used by the language switch and hreflang alternates.
 */
export function swapLocale(pathname: string, target: Locale): string {
  const stripped = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const segments = stripped.split("/").filter(Boolean);
  if ((LOCALES as readonly string[]).includes(segments[0])) segments.shift();
  return localizePath("/" + segments.join("/"), target);
}

// ---------------------------------------------------------------------------
// UI strings
// ---------------------------------------------------------------------------
type Dict = Record<string, string>;

const STRINGS: Record<Locale, Dict> = {
  en: {
    "nav.services": "Services",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    "a11y.skip": "Skip to content",
    "a11y.menu": "Menu",
    "a11y.close": "Close",
    "a11y.langSwitch": "Read this page in Norwegian",
    "home.servicesHeading": "How we work",
    "home.projectsHeading": "Selected projects",
    "home.allProjects": "All projects",
    "home.allServices": "All services",
    "services.heading": "Services",
    "services.intro": "Five steps, from first conversation to finished production run.",
    "service.projectsHeading": "Projects using this service",
    "service.specsHeading": "At a glance",
    "projects.heading": "Projects",
    "projects.intro": "Things we have made — furniture, lighting, sculpture, props and technical parts.",
    "projects.filterCategory": "Category",
    "projects.filterService": "Service",
    "projects.all": "All",
    "projects.clear": "All projects",
    "projects.empty": "No projects match this filter.",
    "projects.browseByCategory": "Browse by category",
    "project.related": "Related projects",
    "project.year": "Year",
    "project.client": "Client",
    "project.location": "Location",
    "project.credits": "Credits",
    "project.links": "Links",
    "project.services": "Services",
    "project.categories": "Categories",
    "project.next": "Next project",
    "project.prev": "Previous project",
    "project.viewProject": "View project",
    "about.heading": "About",
    "about.teamHeading": "The team",
    "contact.heading": "Contact",
    "contact.emailUs": "Email us",
    "contact.cta": "Get in touch",
    "footer.rights": "All rights reserved.",
    "notFound.heading": "Page not found",
    "notFound.body": "The page you were looking for doesn’t exist.",
    "notFound.back": "Back to home",
  },
  no: {
    "nav.services": "Tjenester",
    "nav.projects": "Prosjekter",
    "nav.about": "Om oss",
    "nav.contact": "Kontakt",
    "a11y.skip": "Hopp til innhold",
    "a11y.menu": "Meny",
    "a11y.close": "Lukk",
    "a11y.langSwitch": "Les denne siden på engelsk",
    "home.servicesHeading": "Slik jobber vi",
    "home.projectsHeading": "Utvalgte prosjekter",
    "home.allProjects": "Alle prosjekter",
    "home.allServices": "Alle tjenester",
    "services.heading": "Tjenester",
    "services.intro": "Fem steg, fra første samtale til ferdig produksjon.",
    "service.projectsHeading": "Prosjekter som bruker denne tjenesten",
    "service.specsHeading": "Kort fortalt",
    "projects.heading": "Prosjekter",
    "projects.intro": "Ting vi har laget — møbler, belysning, skulptur, rekvisitter og tekniske deler.",
    "projects.filterCategory": "Kategori",
    "projects.filterService": "Tjeneste",
    "projects.all": "Alle",
    "projects.clear": "Alle prosjekter",
    "projects.empty": "Ingen prosjekter passer dette filteret.",
    "projects.browseByCategory": "Bla etter kategori",
    "project.related": "Relaterte prosjekter",
    "project.year": "År",
    "project.client": "Kunde",
    "project.location": "Sted",
    "project.credits": "Bidragsytere",
    "project.links": "Lenker",
    "project.services": "Tjenester",
    "project.categories": "Kategorier",
    "project.next": "Neste prosjekt",
    "project.prev": "Forrige prosjekt",
    "project.viewProject": "Se prosjekt",
    "about.heading": "Om oss",
    "about.teamHeading": "Teamet",
    "contact.heading": "Kontakt",
    "contact.emailUs": "Send oss en e-post",
    "contact.cta": "Ta kontakt",
    "footer.rights": "Alle rettigheter reservert.",
    "notFound.heading": "Siden finnes ikke",
    "notFound.body": "Siden du lette etter finnes ikke.",
    "notFound.back": "Tilbake til forsiden",
  },
};

export function useT(locale: Locale) {
  return (key: keyof (typeof STRINGS)["en"]): string =>
    STRINGS[locale][key] ?? STRINGS.en[key] ?? key;
}
