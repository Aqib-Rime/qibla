# Contributing to Qibla

Thanks for your interest in Qibla. Contributions, bug reports, and feature ideas are all welcome.

## Before you start

For anything non-trivial, **please open an issue first** so we can align on scope and direction before you spend time writing code. Small fixes (typos, obvious bugs, docs improvements) can go straight to a PR.

## Development setup

The full getting-started guide lives in the [README](./README.md#getting-started). Quick version:

```bash
git clone https://github.com/Aqib-Rime/qibla.git
cd qibla
bun install
cp .env.example .env.local    # fill in Neon URL + auth secret
bun db:push
bun db:seed
bun run dev:admin             # terminal 1
cd apps/mobile && bun start   # terminal 2
```

## Workflow

1. Fork the repo and create a topic branch from `main` — prefer a short, descriptive name: `feat/events-admin`, `fix/qibla-heading-drift`, `docs/env-vars`
2. Make your change
3. Keep these commands green before opening the PR:
   ```bash
   bun run typecheck
   bun run lint
   ```
4. Open a PR against `main`

## Commit messages

Follow the existing convention — [Conventional Commits](https://www.conventionalcommits.org/) with a feature scope:

```
feat(mobile/qibla): add calibration overlay
fix(admin/reviews): recompute rating on status change
docs: add EAS build notes
chore: bump expo to 54.0.34
```

Do **not** amend, squash, or rewrite commits already pushed to `main`.

## PR checklist

- [ ] The PR title follows the Conventional Commits format
- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes
- [ ] The change is covered by the existing README / docs (or docs updated)
- [ ] For mobile UI changes: tested in a dev build on a real device (not just Expo Go)
- [ ] For admin changes: tested against a real Neon database, not a mocked one
- [ ] No secrets committed (check `.env.local`, `.dev.vars`)

## Coding guidelines

- **TypeScript everywhere** — no `any` unless there's a comment explaining why
- **Feature-module architecture** — new mobile features live in `apps/mobile/features/<name>/` with `components/`, `hooks/`, `lib/`, and a barrel `index.ts`. See existing features for the pattern
- **Route files are thin** — they should re-export from a feature module, not contain logic
- **Styling** — NativeWind on mobile, Tailwind v4 + shadcn primitives on admin. No ad-hoc StyleSheet or CSS-in-JS
- **API** — add new endpoints to `packages/api`. Use `publicProcedure` / `authedProcedure` / `adminProcedure` depending on access level
- **DB** — all schema changes go through Drizzle. Run `bun db:generate` to create a migration, commit the generated SQL

## Reporting bugs

Open a [bug report](https://github.com/Aqib-Rime/qibla/issues/new/choose) with:

- Platform + OS version (iOS 18 on iPhone 15, Android 14 on Pixel 8, etc.)
- Steps to reproduce
- Expected vs actual behavior
- Logs / screenshots if you have them

## Security issues

Please do **not** open a public issue for security vulnerabilities. See [SECURITY.md](./SECURITY.md) for responsible disclosure.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
