import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { CATEGORIES, type Category } from "~/config/taxonomy";

/**
 * All content lives in the top-level `content/` folder, one directory per item:
 *
 *   content/projects/<slug>/en.md   no.md   cover.webp   01.webp …
 *   content/services/<slug>/service.json
 *   content/team/<slug>/profile.md   photo.jpg
 *
 * Adding an item = create the folder and drop files in. No code changes: the
 * loaders below discover new folders, and images are picked up by the
 * `import.meta.glob` maps in src/lib/content.ts.
 *
 * The slug and locale for a project come from the folder + filename, so they
 * are NOT repeated in frontmatter.
 */

const services = defineCollection({
  loader: glob({ pattern: "*/service.json", base: "./content/services" }),
  schema: z.object({
    title: z.string(),
    title_no: z.string(),
    order: z.number().int(),
    tagline: z.string(),
    tagline_no: z.string(),
    body: z.string(),
    body_no: z.string(),
    specs: z
      .array(
        z.object({
          label: z.string(),
          label_no: z.string(),
          value: z.string(),
          value_no: z.string(),
        }),
      )
      .default([]),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*/{en,no}.md", base: "./content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.number().int(),
    client: z.string().optional(),
    location: z.string().optional(),
    /** ids of folders in content/services */
    services: z.array(z.string()).default([]),
    /** browse-by-category tags */
    categories: z
      .array(z.enum(CATEGORIES as unknown as [Category, ...Category[]]))
      .default([]),
    /** optional alt text per image, keyed by filename stem ("01", "cover"…) */
    captions: z.record(z.string(), z.string()).optional(),
    credits: z
      .array(z.object({ role: z.string(), name: z.string() }))
      .default([]),
    links: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: "*/profile.md", base: "./content/team" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    role_no: z.string(),
    bio: z.string(),
    bio_no: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = { services, projects, team };
