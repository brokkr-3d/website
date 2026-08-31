# Editing content

All content is plain files in this repo. There is no CMS and no database. The
usual loop is: **you hand Claude a few photos and a short description, Claude
writes/updates the files below and commits + pushes.** This document is the
reference for doing that by hand, and for Claude.

Everything is bilingual: **English (`en`, the default)** and **Norwegian
(`no`)**. Every project needs both language files.

---

## Add a project

1. **Images** → put them in `src/assets/projects/<slug>/`
   - `cover.jpg` (or `.png`) — the card + hero image. Landscape, ≥ 1600px wide.
   - `01.jpg`, `02.jpg`, … — gallery images, ≥ 1600px on the long edge.
   - `<slug>` is lowercase, words separated by hyphens, e.g. `the-star`.

2. **Text** → create two files:
   - `src/content/projects/<slug>.en.md`
   - `src/content/projects/<slug>.no.md`

   Template (fill both files; keep `project`, `year`, `services`, `categories`,
   `featured`, `order` identical in both — only the prose and `alt` text differ):

   ```markdown
   ---
   project: "the-star"             # the shared key that pairs the two language files
   locale: "en"                     # "no" in the .no.md file
   title: "The Star"
   summary: "One or two sentences — used on the card and as the search snippet."
   year: 2024
   client: "Client name"            # optional — omit the line if none
   location: "Oslo"                 # optional
   services: ["3d-design", "full-production"]   # ids from src/content/services/*
   categories: ["sculpture", "art"]            # values from src/config/taxonomy.ts
   featured: true                   # true → may appear on the home page
   order: 0                         # tie-breaker; lower shows first within a year
   cover: "../../assets/projects/the-star/cover.jpg"
   gallery:
     - src: "../../assets/projects/the-star/01.jpg"
       alt: "Describe the image for screen readers and SEO"
     - src: "../../assets/projects/the-star/02.jpg"
       alt: "…"
   credits:                         # optional
     - role: "Design & fabrication"
       name: "Brokkr"
   links:                           # optional — external only (press, video, shop)
     - label: "Coverage in Dezeen"
       url: "https://…"
   ---

   The project write-up goes here as normal Markdown — a few short paragraphs.
   ```

3. **Check** → `npm run build`. It fails loudly if a `service` id or `category`
   is misspelled, an image path is wrong, or a required field is missing.

4. **Publish** → commit both `.md` files + the image folder, push to `main`.
   GitHub Actions builds and deploys automatically.

### The two tags on a project

- **`services`** — which of the five services the project involved. Ids are the
  filenames in `src/content/services/`: `consulting`, `3d-design`,
  `prototyping`, `low-volume-production`, `full-production`. This is what links a
  project to a Service page (and makes it show up there).
- **`categories`** — what kind of thing it is. Allowed values live in
  `src/config/taxonomy.ts` (`lighting`, `furniture`, `art`, `sculpture`, …).
  Visitors browse projects by category on `/projects`.

---

## Edit a service

Services are the five steps in `src/content/services/*.json` (`consulting.json`,
`3d-design.json`, `prototyping.json`, `low-volume-production.json`,
`full-production.json`).

Each file has English fields and a parallel `*_no` field for Norwegian — **keep
them in sync**. `specs` is the little "at a glance" table on the service page.
`order` (1–5) sets the sequence everywhere. Don't rename the files — the
filename is the id that projects reference.

---

## Add a category

Edit `src/config/taxonomy.ts`: add the slug to `CATEGORIES` **and** an
English/Norwegian pair to `CATEGORY_LABELS`. Then use it in a project's
`categories`.

---

## Add / edit a team member

`src/content/team/<first-name>.md` — all fields are frontmatter:

```markdown
---
name: "Alf Petter"
role: "Civil engineer · Strategy"
role_no: "Sivilingeniør · Strategi"
bio: "One or two sentences."
bio_no: "Én eller to setninger."
order: 1
photo: "../../assets/team/alf-petter.jpg"   # optional; ≥ 800px, portrait
---
```

Put the photo in `src/assets/team/`.

---

## Definition of done

- `npm run build` passes with no errors.
- `npm run preview` — the new page looks right in both `en` and `no`.
- Commit content + images together, push to `main`.
