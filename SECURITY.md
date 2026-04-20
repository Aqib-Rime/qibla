# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in Qibla, **please do not open a public GitHub issue.** Public issues are visible to everyone and can put users at risk before a fix ships.

Instead, report it privately using one of these channels:

- **GitHub Private Vulnerability Reporting** — open [Report a vulnerability](https://github.com/Aqib-Rime/qibla/security/advisories/new) on the Security tab of the repo (preferred)
- **Email** — send details to the maintainer directly via the email listed on [@Aqib-Rime's GitHub profile](https://github.com/Aqib-Rime)

Please include:

- A description of the vulnerability
- Steps to reproduce
- The affected component (mobile app / admin / API / auth / DB)
- Your assessment of the impact
- Any suggested mitigations, if you have them

## What to expect

- **Acknowledgement** within 72 hours
- **Initial assessment** within 7 days
- **Fix or mitigation plan** communicated before any public disclosure
- **Credit** in the release notes once the fix ships, if you want it

## Supported versions

This project is pre-1.0 and under active development. Only the `main` branch is supported. Please run the latest commit when reporting issues.

## Scope

In-scope:

- The mobile app (`apps/mobile`)
- The admin / API (`apps/admin`)
- All shared packages (`packages/*`)
- The deployment configuration (Cloudflare Workers, EAS)

Out of scope (report to the upstream project instead):

- Vulnerabilities in Expo, TanStack Start, Drizzle, Better Auth, oRPC, or other dependencies
- Issues in third-party services (Neon, Cloudflare, AlAdhan API, Google Maps)

## Responsible disclosure

We ask that you give us a reasonable window — typically 90 days — to ship a fix before any public disclosure. If the vulnerability is being actively exploited, we will work with you on an accelerated timeline.

Thank you for helping keep Qibla and its users safe.
