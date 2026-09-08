# Yunseo Park — Portfolio

A personal portfolio site built with Next.js (App Router) and a serif-first
design system ("Bonefold"): Times New Roman for reading, JetBrains Mono for
metadata, one wine accent colour, and light/dark themes driven by CSS custom
properties.

## Requirements

- Node.js 20 or later
- npm (ships with Node)

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). The page hot-reloads
as you edit files under `app/` and `components/`.

If port 3000 is already taken, Next.js will automatically pick the next free
port (e.g. 3001) — check the terminal output for the actual URL.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Build an optimised production bundle |
| `npm start` | Serve the production build (run `build` first) |
| `npm run lint` | Run ESLint over the project |

## Project structure

```
app/                 Next.js App Router entry (layout, page, global styles)
components/
  core/               Design-system primitives (Button, Icon, Badge, Tag, ...)
  layout/             Page chrome (Header, Footer, Section)
  portfolio/          Page-specific sections (Hero, ProjectList, VlogList, PostCard, ...)
data/portfolio.ts     Editable content: profile, education, projects, posts
styles/tokens/        Design tokens as CSS custom properties (colour, type, spacing, motion)
public/               Static assets — icons, images, audio
```

## Editing content

Nearly all page copy — the profile blurb, education rows, projects and vlog
posts — lives in [`data/portfolio.ts`](data/portfolio.ts). Edit the arrays
there; no component changes are needed to add, remove, or reorder entries.

## Notes

- No environment variables are required to run the site locally.
- The résumé request dialog validates an email address but does not send
  anything yet — wire it to a form endpoint or mail service before shipping.
- `RecordPlayer`/`Turntable` expects an audio file at `public/audio/`; without
  one the turntable still animates silently.
