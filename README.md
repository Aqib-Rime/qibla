<div align="center">

# Qibla

**Find your next *salah*, nearby.**

A production-grade mosque finder for iOS, Android, and the web — built as a Bun + Turborepo monorepo with Expo, TanStack Start, oRPC, Drizzle, and Better Auth.

[![CI](https://github.com/Aqib-Rime/qibla/actions/workflows/ci.yml/badge.svg)](https://github.com/Aqib-Rime/qibla/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/Aqib-Rime/qibla?color=blue)](./LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/Aqib-Rime/qibla)](https://github.com/Aqib-Rime/qibla/commits/main)
[![Issues](https://img.shields.io/github/issues/Aqib-Rime/qibla)](https://github.com/Aqib-Rime/qibla/issues)
![Bun](https://img.shields.io/badge/bun-%E2%89%A51.3-fbf0df?logo=bun&logoColor=black)
![Node](https://img.shields.io/badge/node-%E2%89%A524-5fa04e?logo=node.js&logoColor=white)
![Expo SDK](https://img.shields.io/badge/expo-54-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.9-3178c6?logo=typescript&logoColor=white)

</div>

<!--
  v2 additions planned for this hero section:
  - Logo / banner (SVG)
  - App Store / Play Store / TestFlight links when published
-->

---

## About

Qibla helps working professionals and travellers find a nearby mosque, see accurate prayer times, and get notified before each *salah*. Open the app, see mosques around you on a map, tap a pin for times + directions, or use the live compass to face the *qibla*. An admin panel on the web lets operators curate listings, moderate reviews, and manage mosque events.

Launch market: **Dhaka, Bangladesh**. The architecture works anywhere — prayer times come from the AlAdhan API and mosques are stored in Postgres.

## Features

- **Map-first discovery** — full-bleed Google Maps view with bottom-sheet detail, filters, and directions deep-link
- **Prayer times** — AlAdhan-backed, cached server-side, with next-prayer pill always visible
- **Qibla compass** — traditional rotating-dial UX with magnetometer smoothing and calibration overlay
- **Saved mosques** — optimistic heart toggle with a dedicated grid view
- **Reviews** — write, read, and moderate; ratings recompute server-side
- **Search + filters** — recent searches (SecureStore), popular-nearby sort, 4-way filters (open now / women / parking / jummah)
- **Prayer reminders** — daily local notifications per prayer, auto-rescheduled on open
- **Admin panel** — mosques CRUD, review moderation, users list, dashboard stats
- **Email + password auth** — Better Auth with an admin role plugin and Expo server plugin for native clients

<!--
  v2 additions planned for this section:
  - Animated GIF of the compass aligning to the qibla
  - Screenshot grid: map, mosque detail, prayer times, saved, admin dashboard
  - Short demo video link (YouTube / Loom)
-->

## Tech stack

### Mobile (`apps/mobile`)

- **Expo SDK 54** + **Expo Router** (file-based routing)
- **React Native 0.81** on React 19
- **NativeWind v4** (Tailwind CSS for React Native)
- **react-native-maps** (Google Maps on both platforms)
- **@gorhom/bottom-sheet**, **expo-sensors**, **expo-location**, **expo-notifications**, **expo-secure-store**
- **Better Auth** via `@better-auth/expo` + SecureStore session
- **TanStack Query** (server state) + **Zustand** (UI state)
- **oRPC** typed client

### Admin + backend (`apps/admin`)

- **TanStack Start** on **Cloudflare Workers** (Vite + server functions)
- **oRPC** router (same router consumed by the mobile app over HTTP)
- **Drizzle ORM** on **Neon Postgres** via `neon-http`
- **Better Auth** + admin plugin (`admin` | `user` roles)
- **shadcn/ui** components (radix-vega preset)
- **TanStack Router**, **TanStack Table**, **TanStack Form**

### Monorepo tooling

- **Bun 1.3+** workspaces with `linker = "hoisted"` (required for Expo's Babel resolver)
- **Turborepo** for task orchestration + caching
- **Biome** for lint + format
- **TypeScript 5.9** end-to-end

## Project structure

```
qibla/
├── apps/
│   ├── admin/                # TanStack Start on Cloudflare Workers — admin UI + oRPC backend
│   └── mobile/               # Expo app (iOS + Android)
│       └── features/         # Co-located feature modules: components / hooks / lib / index.ts
├── packages/
│   ├── api/                  # oRPC router (public / authed / admin procedures)
│   ├── api-client/           # createQiblaClient({ baseURL }) — typed RouterClient
│   ├── auth/                 # Better Auth config + Drizzle adapter + admin plugin
│   ├── db/                   # Drizzle schema, Neon-HTTP client, Dhaka fixtures seed
│   └── ui/                   # shadcn components used by the admin app
├── prd/                      # Product docs (overview, architecture, scope, progress)
├── biome.json
├── turbo.json
└── package.json
```

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | `>= 24` | Enforced via `engines` field |
| **Bun** | `>= 1.3` | Package manager + workspace runner |
| **Neon account** | — | Free tier works; needs a Postgres database |
| **Google Maps API key** | — | Required for Android; iOS optional (falls back to Apple Maps) |
| **Cloudflare account** | — | Only needed for deploying the admin app + R2 uploads |
| **EAS account** | — | Only needed for mobile dev-client / store builds |
| **Mac + physical device on the same Wi-Fi** | — | Recommended for mobile development |

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/Aqib-Rime/qibla.git
cd qibla
bun install
```

### 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env.local
```

The root `.env.local` holds shared values. The admin app additionally reads server-only values from `apps/admin/.dev.vars` (used by Wrangler / Cloudflare Workers in dev).

Create `apps/admin/.dev.vars`:

```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...        # openssl rand -base64 32
BETTER_AUTH_URL=http://<your-lan-ip>:3000
```

Create `apps/mobile/.env.local`:

```bash
EXPO_PUBLIC_API_URL=http://<your-lan-ip>:3000
```

> **Why the LAN IP?** The Expo app on your phone talks to the admin Worker over your local network during dev. Find yours with `ipconfig getifaddr en0` on macOS. Better Auth will reject requests from untrusted origins, so this IP must also be in `BETTER_AUTH_TRUSTED_ORIGINS`.

### 3. Set up the database

```bash
bun db:push            # push Drizzle schema to Neon
bun db:seed            # seed Dhaka mosque fixtures
bun db:studio          # optional — browse data
```

### 4. Run the apps

Two terminals:

```bash
# Terminal 1 — admin Worker on http://<lan-ip>:3000
bun run dev:admin

# Terminal 2 — Expo Metro with a dev client
cd apps/mobile && bun run start --clear
```

First time on mobile? You need a dev build before `bun run start` can attach. See **Building the mobile app** below. As a fallback for screens that don't need native plugins:

```bash
cd apps/mobile && bun run start:go --clear
```

> Expo Go does not support `expo-notifications` on SDK 53+ — notifications only work in a dev build.

### 5. Create the first admin

Open `http://<lan-ip>:3000/initial-setup` and create the bootstrap admin account. Subsequent users default to the `user` role and can be promoted from the admin panel.

## Environment variables

The canonical list lives in [`.env.example`](./.env.example). Summary:

| Variable | Used by | Required | Notes |
|---|---|---|---|
| `DATABASE_URL` | admin, db package | Yes | Neon Postgres connection string with `sslmode=require` |
| `BETTER_AUTH_SECRET` | admin | Yes | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | admin | Yes | Public URL of the admin app (LAN IP in dev) |
| `BETTER_AUTH_TRUSTED_ORIGINS` | admin | Yes | Comma-separated list; include `qibla://` and your LAN IP |
| `EXPO_PUBLIC_API_URL` | mobile | Yes | Same value as `BETTER_AUTH_URL` in dev |
| `GOOGLE_MAPS_API_KEY_ANDROID` | mobile | Yes (Android) | From Google Cloud Console |
| `GOOGLE_MAPS_API_KEY_IOS` | mobile | Optional | Only needed if you want Google Maps on iOS |
| `CLOUDFLARE_ACCOUNT_ID` | admin deploy | Deploy only | `wrangler whoami` |
| `CLOUDFLARE_API_TOKEN` | admin deploy | Deploy only | Scoped token for Workers + R2 |
| `R2_*` | admin | V2 | Photo uploads (see Roadmap) |

## Scripts

Run from the repo root:

```bash
bun run dev              # run everything in parallel via Turbo
bun run dev:admin        # admin only (TanStack Start on Workers)
bun run build            # build every app
bun run typecheck        # tsc --noEmit across the workspace
bun run lint             # biome check
bun run lint:fix         # biome check --fix
bun run format           # biome format --write

bun db:push              # push schema
bun db:generate          # generate migrations
bun db:migrate           # apply migrations
bun db:studio            # Drizzle Studio
bun db:seed              # seed Dhaka fixtures
```

Mobile-specific (from `apps/mobile/`):

```bash
bun run start            # Metro for dev client
bun run start:go         # Metro for Expo Go (limited)
bun run ios              # build + launch iOS simulator
bun run android          # build + launch Android emulator
bun run prebuild         # regenerate native folders
bun run doctor           # expo-doctor
```

## Building the mobile app (EAS)

Log in once:

```bash
cd apps/mobile
bunx eas-cli@latest login
bunx eas-cli@latest init         # writes projectId into app.config
```

Available profiles (defined in [`apps/mobile/eas.json`](./apps/mobile/eas.json)):

```bash
bun run build:dev:ios            # iOS simulator dev client
bun run build:dev:device         # iOS physical device dev client
bun run build:dev:android        # Android APK dev client
bun run build:preview            # internal distribution build (both platforms)
bun run build:prod               # store-ready build (both platforms)
```

Install the dev-client artifact on your device once, then every subsequent run is just `bun run start`.

## Deploying the admin app

The admin app runs on Cloudflare Workers via the TanStack Start Workers adapter.

```bash
cd apps/admin
bun run build
bun run deploy                   # wraps `wrangler deploy`
```

Before the first deploy:

1. `wrangler login`
2. Create a D1-free Workers project (this app uses Neon, not D1)
3. Mirror your `.dev.vars` into Worker secrets: `wrangler secret put DATABASE_URL`, `BETTER_AUTH_SECRET`, …
4. Update `BETTER_AUTH_URL` + `EXPO_PUBLIC_API_URL` to the production Worker URL

## Roadmap

### Shipped in V1

- Mobile: map, mosque detail, prayer times, qibla compass, saved, reviews, search + filter, profile, settings, prayer reminders, onboarding, email + password auth
- Admin: mosques CRUD, review moderation, users list, dashboard
- Backend: oRPC with public / authed / admin procedures; Neon Postgres via Drizzle; Better Auth
- EAS profiles for dev-client, preview, and production builds

### In progress / pending for V1

- `mosques.nearby` server-side distance filter
- Events admin (`/_admin/events`)
- Mosque photo upload to Cloudflare R2
- Standalone `reviews.mine` endpoint for profile stats
- Google Places search integration
- GitHub Actions CI + first Cloudflare production deploy

### V2 (planned)

- User-submitted mosque listings (`mosque_owner` role)
- Google / phone-OTP sign-in
- Bengali / Arabic localization
- Custom map tiles
- Prayer calculation method settings (currently hardcoded to Karachi + Hanafi)
- **README v2**: logo, screenshots, demo GIF, store links, build-status badges

See [`prd/v1-scope.md`](./prd/v1-scope.md) and [`prd/v2-scope.md`](./prd/v2-scope.md) for the full scope and [`prd/progress.md`](./prd/progress.md) for the live status snapshot.

## Gotchas

A few non-obvious things worth knowing before you dig in (full list in [`prd/progress.md`](./prd/progress.md)):

- **Bun isolated linker breaks Expo's Babel** — keep `linker = "hoisted"` in `bunfig.toml`.
- **NativeWind v4 requires Tailwind v3** — pinned at the workspace root; admin's Tailwind v4 nests inside `apps/admin/node_modules`.
- **NativeWind content glob must include `features/` + `lib/`** — otherwise classes used only inside feature folders silently stop rendering.
- **SDK 54 in a monorepo** needs `autolinkingModuleResolution: true` in `app.config.ts`.
- **Native clients don't send `Origin`** — Better Auth needs `trustedOrigins: ["qibla://", ...]` and the `expo()` server plugin.
- **`vite dev` needs `--host`** for physical-device testing — already configured in `apps/admin/package.json`.
- **`bunx expo install <pkg>` must run from `apps/mobile`** — the root has no Expo SDK.

## Contributing

Contributions are welcome. For anything non-trivial, please open an issue first so we can align on scope.

1. Fork and create a feature branch
2. Run `bun install`
3. Make your changes and keep `bun run typecheck` + `bun run lint` clean
4. Open a PR against `main`

<!--
  v2 addition: CONTRIBUTING.md with coding conventions, PR checklist, and release process.
-->

## License

Released under the [MIT License](./LICENSE). See the `LICENSE` file for the full text.

## Acknowledgments

- **AlAdhan API** — prayer time calculations
- **Neon** — serverless Postgres
- **Cloudflare** — Workers, KV, R2
- **Expo** + **TanStack** + **Better Auth** + **oRPC** + **Drizzle** + **shadcn/ui** — the stack that makes this possible

---

Built by [@Aqib-Rime](https://github.com/Aqib-Rime).
