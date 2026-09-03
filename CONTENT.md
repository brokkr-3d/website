# Editing content

Everything the site shows lives in the top-level **`content/`** folder — one
folder per project, service and team member. Add a folder, drop files in, and
the next build picks it up. No code changes.

```
content/
  projects/<slug>/   en.md  no.md  cover.webp  01.webp  02.webp …
  services/<slug>/    service.json
  team/<slug>/         profile.md  photo.jpg
```

The `<slug>` (folder name) is the URL: `content/projects/the-star/` →
`/projects/the-star`. Use lowercase, dashes, no spaces.

---

## Add or edit a project

1. **Folder**: `content/projects/<slug>/`
2. **Images**: drop them straight in the folder.
   - `cover.*` is the big image (card, row, detail hero). If there's no
     `cover.*`, the first image by filename is used.
   - Every other image (`01.webp`, `02.webp`, …) becomes the gallery, shown in
     filename order.
   - Any format works (`.webp`, `.jpg`, `.png`, `.avif`); the build optimises
     and resizes them. Aim for the long edge ≥ 1600 px.
3. **Text**: `en.md` and `no.md`, same structure, only the wording differs:

   ```markdown
   ---
   title: The Star
   summary: One or two sentences — used on the card and as the meta description.
   year: 2025
   client: Trym Ruud            # optional
   location: Oslo               # optional
   services: [3d-design, low-volume-production, full-production]
   categories: [sculpture, art]
   featured: true               # true = also shows on the home page
   order: 1                     # tie-breaker within a year; lower = higher up
   credits:                     # optional
     - role: Digital art
       name: Trym Ruud
   links:                       # optional
     - label: Read more
       url: https://example.com
   captions:                    # optional — alt text per image, by filename
     "01": The Star during assembly
     "02": The finished statue
   ---

   The write-up goes here. Plain paragraphs; blank line between them.
   ```

   - `services:` — folder names from `content/services/` (a wrong name is just
     ignored).
   - `categories:` — must be from the list in `src/config/taxonomy.ts`. To add
     a new category, add its slug + EN/NO label there.
   - Keep `year`, `services`, `categories`, `featured`, `order` **identical** in
     `en.md` and `no.md`. Only `title`, `summary`, `captions` and the body
     should differ between languages.

**Remove a project**: delete its folder.

## Add or edit a service

Edit `content/services/<slug>/service.json` — both languages live in one file
(`title` / `title_no`, `tagline` / `tagline_no`, `body` / `body_no`, plus
`specs` and `order`). A service with no `service.json` won't appear.

## Add or edit a team member

`content/team/<slug>/profile.md` — frontmatter only (`name`, `role` /
`role_no`, `bio` / `bio_no`, `order`). Drop a `photo.*` in the same folder for
the portrait; portrait crop (roughly 4:5) looks best.

---

## Before you publish

```bash
npm run build
```

This validates every file and fails loudly on a bad `year`, an unknown
`category`, a malformed frontmatter, etc. If it passes, commit and push — the
site redeploys automatically.

Ordering on `/projects` and the home page: newest `year` first, then `order`
(low → high) within a year, then title A–Z.
