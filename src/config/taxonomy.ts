/**
 * Project categories — a flat, controlled vocabulary.
 *
 * A category is just a tag on a project ("what kind of thing is it"). Visitors
 * browse projects by category on /projects (filter chips + ?category=<slug>).
 *
 * To add a category: add the slug here AND a label below. `npm run build` will
 * fail on any project referencing a slug that is not in this list.
 */
export const CATEGORIES = [
  "lighting",
  "furniture",
  "homeware",
  "vases-planters",
  "objects",
  "art",
  "sculpture",
  "installation",
  "scenography",
  "props",
  "technical-parts",
  "architecture",
  "retail-fixtures",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, { en: string; no: string }> = {
  lighting: { en: "Lighting", no: "Belysning" },
  furniture: { en: "Furniture", no: "Møbler" },
  homeware: { en: "Homeware", no: "Interiør" },
  "vases-planters": { en: "Vases & planters", no: "Vaser og potter" },
  objects: { en: "Objects", no: "Objekter" },
  art: { en: "Art", no: "Kunst" },
  sculpture: { en: "Sculpture", no: "Skulptur" },
  installation: { en: "Installation", no: "Installasjon" },
  scenography: { en: "Scenography", no: "Scenografi" },
  props: { en: "Props", no: "Rekvisitter" },
  "technical-parts": { en: "Technical parts", no: "Tekniske deler" },
  architecture: { en: "Architecture", no: "Arkitektur" },
  "retail-fixtures": { en: "Retail fixtures", no: "Butikkinnredning" },
};

export function categoryLabel(slug: string, locale: "en" | "no"): string {
  const entry = CATEGORY_LABELS[slug as Category];
  return entry ? entry[locale] : slug;
}

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
