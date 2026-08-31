import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "~/config/site";

export type ProjectEntry = CollectionEntry<"projects">;
export type ServiceEntry = CollectionEntry<"services">;
export type TeamEntry = CollectionEntry<"team">;

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export async function getServices(): Promise<ServiceEntry[]> {
  const services = await getCollection("services");
  return services.sort((a, b) => a.data.order - b.data.order);
}

export async function getService(id: string): Promise<ServiceEntry | undefined> {
  const services = await getCollection("services");
  return services.find((s) => s.id === id);
}

/** Pick the fields for one locale out of a service entry. */
export function localizeService(entry: ServiceEntry, locale: Locale) {
  const d = entry.data;
  return {
    id: entry.id,
    title: locale === "no" ? d.title_no : d.title,
    tagline: locale === "no" ? d.tagline_no : d.tagline,
    body: locale === "no" ? d.body_no : d.body,
    icon: d.icon,
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
function serviceIds(entry: ProjectEntry): string[] {
  return entry.data.services.map((ref) => ref.id);
}

function byRecency(a: ProjectEntry, b: ProjectEntry): number {
  if (b.data.year !== a.data.year) return b.data.year - a.data.year;
  if (a.data.order !== b.data.order) return a.data.order - b.data.order;
  return a.data.title.localeCompare(b.data.title);
}

/** All projects for a locale, newest first. */
export async function getProjects(locale: Locale): Promise<ProjectEntry[]> {
  const projects = await getCollection("projects", (p) => p.data.locale === locale);
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
  key: string,
  locale: Locale,
): Promise<ProjectEntry | undefined> {
  const projects = await getCollection(
    "projects",
    (p) => p.data.locale === locale && p.data.project === key,
  );
  return projects[0];
}

/** Every distinct project key (locale-independent), newest first. */
export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getCollection("projects", (p) => p.data.locale === "en");
  return projects.sort(byRecency).map((p) => p.data.project);
}

/** Projects that used a given service — for the Service detail page. */
export async function projectsForService(
  serviceId: string,
  locale: Locale,
): Promise<ProjectEntry[]> {
  const projects = await getProjects(locale);
  return projects.filter((p) => serviceIds(p).includes(serviceId));
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
  const all = (await getProjects(locale)).filter(
    (p) => p.data.project !== project.data.project,
  );
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
export async function projectNeighbours(key: string, locale: Locale) {
  const projects = await getProjects(locale);
  const i = projects.findIndex((p) => p.data.project === key);
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
    photo: entry.data.photo,
  };
}
