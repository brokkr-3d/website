import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import { CATEGORIES, type Category } from "~/config/taxonomy";

const localeEnum = z.enum(["en", "no"]);

/**
 * SERVICES — the 5-step way of working. Short prose, so both languages live in
 * one JSON file via parallel `_no` fields.
 */
const services = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/services" }),
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
    icon: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

/**
 * PROJECTS — one Markdown file per project *per locale*
 * (src/content/projects/<project>.<locale>.md). `project` is the join key
 * across locales; language-neutral fields are repeated in both files.
 *
 * NB: the field is deliberately NOT called `slug` — the glob loader treats a
 * `slug` frontmatter field as the entry id and requires it to be unique, which
 * would collide between the .en and .no file of the same project.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      project: z.string(),
      locale: localeEnum,
      title: z.string(),
      summary: z.string(),
      year: z.number().int(),
      client: z.string().optional(),
      location: z.string().optional(),
      /** ← Project ↔ Services relationship (ids of files in src/content/services) */
      services: z.array(reference("services")).default([]),
      /** ← browse-by-category tag */
      categories: z
        .array(z.enum(CATEGORIES as unknown as [Category, ...Category[]]))
        .default([]),
      cover: image(),
      gallery: z
        .array(z.object({ src: image(), alt: z.string() }))
        .default([]),
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

/**
 * TEAM — one Markdown file per person, both languages in frontmatter.
 */
const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      role_no: z.string(),
      bio: z.string(),
      bio_no: z.string(),
      order: z.number().default(0),
      photo: image().optional(),
    }),
});

export const collections = { services, projects, team };
