# Alpha Motion — am-production

Marketing site for Alpha Motion, built from Figma file `MAE6trb9cxb8nKwpoBAhVy`. Next.js App Router, Turbopack, TypeScript, Tailwind v4, Framer Motion. Fully static today — content is imported from `src/content/` at build time, there is no backend, database, or auth.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — local dev server
- `npm run build` / `npm run start` — production build and serve
- `npm run lint` — ESLint
- `npm run test:e2e` — Playwright suite (visual regression, animation, accessibility, interaction, font-rendering)
- `npm run test:e2e:update` — regenerate Playwright visual snapshots

## Structure

- `src/app/` — routes (App Router)
- `src/components/` — `home/`, `projects/`, `contact/`, `layout/`, `ui/`, grouped by domain
- `src/content/` — site copy and datasets (`copy.ts`, `site.ts`, `*.json`), validated at import time via `src/content/schema.ts`
- `tests/` — Playwright specs
