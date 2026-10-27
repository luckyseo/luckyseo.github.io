# Yunseo Park — Portfolio

A personal portfolio site built with Next.js (App Router) and a serif-first
design system ("Bonefold"): Times New Roman for reading, JetBrains Mono for
metadata, one wine accent colour, and light/dark themes driven by CSS custom
properties.

## Requirements

- Node.js 20 or later
- npm (ships with Node)
- Java 11+ (only for `npm run test:rules`)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the Firebase values
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). The page hot-reloads
as you edit files under `app/` and `services/`.

If port 3000 is already taken, Next.js will automatically pick the next free
port (e.g. 3001) — check the terminal output for the actual URL.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Build the static export into `out/` |
| `npm start` | Serve the production build (run `build` first) |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:rules` | Test the Firestore security rules on the local emulator |
| `npm run rules:deploy` | Deploy `firestore.rules` to your Firebase project |

## Project structure

```
app/
  layout.tsx, page.tsx   App Router entry (home page)
  admin/                 /admin: sign-in gate + editing dashboard
  _components/           Shared UI: core primitives, layout, post cards, admin form pieces
  _sections/             One folder per page section: the public view + its editor
                         (hero, education, projects, vlog, contacts, backup)
services/
  config/                Firebase setup from NEXT_PUBLIC_* env values
  auth/                  Google sign-in and the "is this the admin?" check
  content/               Content types, validation, and the Firestore repository
styles/tokens/           Design tokens as CSS custom properties
test/                    Unit tests (edit/, content/, auth/, config/) and rules tests (rules/)
firestore.rules          Who may read/write content (enforced by Firebase)
```

Folders starting with `_` are private to Next.js, so they never become URLs.

## Editing content

Content is **not** stored in this repository. It lives in Firestore and is
edited on the website at `/admin` (there is no link to it on the public page).

- Anyone can read content. Only the admin can write it, and Firestore rules
  enforce that, not the browser.
- The admin is whoever has a document at `admins/{uid}` in Firestore. Your UID
  never appears in the repo.
- Each section saves separately. Validation runs before saving, and links must
  be `https://` or `mailto:`.
- Images: paste public `https://` image links into a project's photo slots.
- **Backup → Export JSON** downloads everything as `*.local.json` (gitignored).
  **Import JSON** restores from a file.

## One-time Firebase setup (free Spark plan)

1. Create a Firebase project on the **Spark** (free) plan. With no billing
   account it cannot be charged. Add a **Web app** and copy its config.
2. Put the values in `.env.local` (see `.env.example`). Add the same names as
   **GitHub repository secrets** (Settings → Secrets and variables → Actions)
   so the deploy build gets them.
3. **Authentication**: enable the **Google** provider only. Under Settings →
   Authorized domains, keep only `localhost` and `luckyseo.github.io`.
4. **Firestore**: create the database in production mode. Copy
   `.firebaserc.example` to `.firebaserc`, set your project ID, then run
   `npx firebase login` and `npm run rules:deploy`.
5. Open `/admin`, sign in with Google, and copy your **User UID** from
   Authentication → Users. In Firestore, create collection `admins` with a
   document whose ID is that UID (no fields needed). Reload `/admin`.
6. Recommended: **App Check**. Register the web app with reCAPTCHA v3, set
   `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (locally and as a secret), deploy, check it
   works, then turn on enforcement for Firestore. For localhost, create a debug
   token and set `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` in `.env.local`.
7. In `/admin` → **Backup → Import JSON**, load `backup/seed.local.json`
   (the original content, kept out of git) to fill the site.

## Notes

- Without `.env.local` the site still runs, but sections are empty and
  `/admin` explains what is missing.
- Content loads in the browser after the page opens, so search engines that do
  not run JavaScript see the page without it.
- On Windows, `npm run test:rules` can leave the emulator's Java process
  running. If port 8181 stays busy, stop it in Task Manager.
- `RecordPlayer`/`Turntable` expects an audio file at `public/audio/`; without
  one the turntable still animates silently.
