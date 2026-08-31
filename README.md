# brokkr.design

Marketing site for Brokkr (BROKKR 3D AS). Static, bilingual (EN + NO), built
with [Astro](https://astro.build). Content is plain files in `src/content/` —
see [`CONTENT.md`](./CONTENT.md).

## Prerequisites

- **Node.js ≥ 22.12** — install from <https://nodejs.org> or
  `winget install OpenJS.NodeJS.LTS`.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command           | Does                                             |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start the dev server                            |
| `npm run build`   | Type-check content + build to `dist/`           |
| `npm run preview` | Serve the built `dist/` locally                 |
| `npm run check`   | Astro/TypeScript diagnostics only               |

## Structure

```
src/
  config/        site.ts (contact, nav), taxonomy.ts (project categories)
  content.config.ts   collection schemas (services, projects, team)
  content/       the actual content — services/*.json, projects/*.md, team/*.md
  assets/        images, co-located per project under assets/projects/<slug>/
  lib/           i18n.ts (routing + strings), content.ts (queries)
  components/     UI + components/views/* (one per page type, EN & NO share them)
  pages/         thin route files; /pages/no/* mirror the English routes
  styles/        tokens.css + global.css (hand-rolled design system)
```

Pages: `/` · `/services` + `/services/[slug]` · `/projects` (filter by category
& service) + `/projects/[slug]` · `/about` · `/contact`. Norwegian versions live
under `/no/…`.

## Deployment

Push to `main` → `.github/workflows/deploy.yml` builds and deploys to GitHub
Pages (`brokkr-3d/website`).

**One-time setup:** in the repo, Settings → Pages → Source = **GitHub Actions**.

### Custom domain (brokkr.design)

Currently the site is served from `https://brokkr-3d.github.io/website/`, so
`astro.config.mjs` sets `base: "/website"`. To move to `brokkr.design`:

1. DNS at the registrar:
   - `A` `@` → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`
   - `AAAA` `@` → `2606:50c0:8000::153`, `:8001::153`, `:8002::153`, `:8003::153`
   - `CNAME` `www` → `brokkr-3d.github.io`
2. Add `public/CNAME` containing `brokkr.design`.
3. In `astro.config.mjs` set `const SITE = "https://brokkr.design"` and
   `const BASE = "/"` (or remove `base`).
4. Update `Sitemap:` in `public/robots.txt`.
5. Repo Settings → Pages → Custom domain → `brokkr.design`, enable "Enforce HTTPS".
