import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import type { Locale } from "~/config/site";

export type ProjectEntry = CollectionEntry<"projects">;
export type ServiceEntry = CollectionEntry<"services">;
export type TeamEntry = CollectionEntry<"team">;

// ---------------------------------------------------------------------------
// Path helpers — the loader ids are "<slug>/<file>" (e.g. "the-star/en",
// "consulting/service", "alf-petter/profile").
// ---------------------------------------------------------------------------
export const projectSlug = (e: ProjectEntry) => e.id.split("/")[0];
export const projectLocale = (e: ProjectEntry) => e.id.split("/")[1] as Locale;
export const serviceSlug = (e: ServiceEntry) => e.id.split("/")[0];
export const teamSlug = (e: TeamEntry) => e.id.split("/")[0];

// ---------------------------------------------------------------------------
// Images — discovered from the item folders, no per-file config.
//   cover  = a file named cover.* (else the first image by filename)
//   gallery = every other image, sorted by filename
// ---------------------------------------------------------------------------
// NB: the pattern must be a plain string literal — Vite analyses it statically.
const projectImages = import.meta.glob<ImageMetadata>(
  "/content/projects/*/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);
const teamImages = import.meta.glob<ImageMetadata>(
  "/content/team/*/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);

const stem = (file: string) => file.replace(/\.[^.]+$/, "");

type MediaFile = { src: ImageMetadata; stem: string };

function folderImages(
  map: Record<string, ImageMetadata>,
  section: string,
  slug: string,
): MediaFile[] {
  const prefix = `/content/${section}/${slug}/`;
  return Object.entries(map)
    .filter(([p]) => p.startsWith(prefix))
    .map(([p, src]) => ({ src, stem: stem(p.slice(prefix.length)) }))
    .sort((a, b) => a.stem.localeCompare(b.stem));
}

export function projectMedia(slug: string): {
  cover?: ImageMetadata;
  gallery: MediaFile[];
} {
  const files = folderImages(projectImages, "projects", slug);
  const coverFile = files.find((f) => f.stem === "cover");
  const cover = coverFile?.src ?? files[0]?.src;
  const gallery = files.filter((f) => f.src !== cover);
  return { cover, gallery };
}

export function teamPhoto(slug: string): ImageMetadata | undefined {
  return folderImages(teamImages, "team", slug)[0]?.src;
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export async function getServices(): Promise<ServiceEntry[]> {
  const services = await getCollection("services");
  return services.sort((a, b) => a.data.order - b.data.order);
}

export async function getServiceSlugs(): Promise<string[]> {
  return (await getServices()).map(serviceSlug);
}

export async function getService(slug: string): Promise<ServiceEntry | undefined> {
  return (await getServices()).find((s) => serviceSlug(s) === slug);
}

/** Pick the fields for one locale out of a service entry. */
export function localizeService(entry: ServiceEntry, locale: Locale) {
  const d = entry.data;
  return {
    id: serviceSlug(entry),
    title: locale === "no" ? d.title_no : d.title,
    tagline: locale === "no" ? d.tagline_no : d.tagline,
    body: locale === "no" ? d.body_no : d.body,
    featured: d.featured,
    order: d.order,
    specs: d.specs.map((s) => ({
      label: locale === "no" ? s.label_no : s.label,
      value: locale === "no" ? s.value_no : s.value,
    })),
  };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const serviceIds = (entry: ProjectEntry): string[] => entry.data.services;

function byRecency(a: ProjectEntry, b: ProjectEntry): number {
  if (b.data.year !== a.data.year) return b.data.year - a.data.year;
  if (a.data.order !== b.data.order) return a.data.order - b.data.order;
  return a.data.title.localeCompare(b.data.title);
}

/** All projects for a locale, newest first. */
export async function getProjects(locale: Locale): Promise<ProjectEntry[]> {
  const projects = await getCollection(
    "projects",
    (p) => projectLocale(p) === locale,
  );
  return projects.sort(byRecency);
}

export async function getFeaturedProjects(
  locale: Locale,
  limit = 6,
): Promise<ProjectEntry[]> {
  const projects = await getProjects(locale);
  const featured = projects.filter((p) => p.data.featured);
  return (featured.length ? featured : projects).slice(0, limit);
}

export async function getProject(
  slug: string,
  locale: Locale,
): Promise<ProjectEntry | undefined> {
  const projects = await getCollection(
    "projects",
    (p) => projectLocale(p) === locale && projectSlug(p) === slug,
  );
  return projects[0];
}

/** Every distinct project slug (locale-independent), newest first. */
export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getCollection("projects", (p) => projectLocale(p) === "en");
  return projects.sort(byRecency).map(projectSlug);
}

/** Projects that used a given service — for the Service detail page. */
export async function projectsForService(
  serviceSlugId: string,
  locale: Locale,
): Promise<ProjectEntry[]> {
  const projects = await getProjects(locale);
  return projects.filter((p) => serviceIds(p).includes(serviceSlugId));
}

/**
 * Other projects related to `project`, scored by shared categories (weight 2)
 * and shared services (weight 1). Back-filled with recent projects so the
 * section is never empty.
 */
export async function relatedProjects(
  project: ProjectEntry,
  locale: Locale,
  limit = 3,
): Promise<ProjectEntry[]> {
  const slug = projectSlug(project);
  const all = (await getProjects(locale)).filter((p) => projectSlug(p) !== slug);
  const cats = new Set(project.data.categories);
  const svcs = new Set(serviceIds(project));

  const scored = all
    .map((p) => {
      const sharedCats = p.data.categories.filter((c) => cats.has(c)).length;
      const sharedSvcs = serviceIds(p).filter((s) => svcs.has(s)).length;
      return { p, score: sharedCats * 2 + sharedSvcs };
    })
    .sort((a, b) => b.score - a.score || byRecency(a.p, b.p));

  const picked = scored.filter((x) => x.score > 0).map((x) => x.p);
  if (picked.length >= limit) return picked.slice(0, limit);

  const backfill = all.filter((p) => !picked.includes(p));
  return [...picked, ...backfill].slice(0, limit);
}

/** Prev / next in the newest-first ordering, for detail-page pagination. */
export async function projectNeighbours(slug: string, locale: Locale) {
  const projects = await getProjects(locale);
  const i = projects.findIndex((p) => projectSlug(p) === slug);
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i >= 0 && i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}

/** Distinct categories actually in use, in taxonomy order. */
export async function usedCategories(locale: Locale): Promise<string[]> {
  const projects = await getProjects(locale);
  const seen = new Set<string>();
  for (const p of projects) for (const c of p.data.categories) seen.add(c);
  return [...seen];
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------
export async function getTeam(): Promise<TeamEntry[]> {
  const team = await getCollection("team");
  return team.sort((a, b) => a.data.order - b.data.order);
}

export function localizeTeam(entry: TeamEntry, locale: Locale) {
  return {
    name: entry.data.name,
    role: locale === "no" ? entry.data.role_no : entry.data.role,
    bio: locale === "no" ? entry.data.bio_no : entry.data.bio,
    photo: teamPhoto(teamSlug(entry)),
  };
}
