# Stack Profile

> Written by frontend-kit during the Interview. It is the single record of what was
> decided and why. Re-running the kit (`/frontend-kit:create-frontend`) in this folder resumes from here.

- **Status:** validated
- **Date:** 2026-10-20
- **User Level:** junior

## Product

- **Name:** kolavo-web
- **Purpose:** The Kolavo community platform: a public landing page for community leaders, plus the Kolavo App where members and leaders manage their communities.

## Decisions

| Decision                        | Choice                                                                            | Why (one line; required when not the default)                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public pages needing SEO        | yes                                                                               | Landing page and community links (`/k/<slug>`) are shared on WhatsApp and must render link previews.                                                       |
| Backend                         | mocked until available (external later)                                           | The API will be an external service that does not exist yet; the UI is built against mocks that follow a drafted contract.                                 |
| Branch                          | Next.js external API                                                              | SEO on public pages requires server-rendered HTML; the backend lives outside this repo.                                                                    |
| API contract                    | OpenAPI draft at `docs/api/openapi.yaml`, written here                            | No API exists yet; the frontend proposes the contract (members list, create, error shape) for the backend team to adopt.                                   |
| Sign-in                         | backend token (bearer), exchanged for an httpOnly cookie in a Route Handler (BFF) | Chosen by the user; kept behind one module so it can switch to cookie or OIDC later. Login UX is Google SSO (`scrMasuk`). Mocked until the backend exists. |
| Roles and permissions           | yes: permissions come from the backend's current-user response (mocked for now)   | Community leaders see dashboard and billing; reviewers and members see less. Server checks remain the backend's job.                                       |
| Database                        | n.a.                                                                              | External backend.                                                                                                                                          |
| Client state library            | none                                                                              | Multi-step flows (subscription, top-up) live inside one dialog; local state suffices.                                                                      |
| UI languages                    | `id` only now; `next-intl`, prefix-free default locale (`as-needed`)              | Several languages planned; all copy goes into messages from day one so adding a locale is one file.                                                        |
| Brand color / Figma             | `#2D6BE4` primary; tokens from `Redesign/REFERENCE.md`; no Figma                  | Matches the V4 prototype design system (Poppins, pill buttons, radius 13/32).                                                                              |
| Error monitoring                | none                                                                              | Add once real users arrive.                                                                                                                                |
| Deploy target                   | Docker                                                                            | Provider-independent.                                                                                                                                      |
| CI                              | GitHub Actions                                                                    | Repo is on GitHub; one file, easy to remove if the team chooses otherwise.                                                                                 |
| First resource (Vertical Slice) | members                                                                           | Core Kolavo entity (Anggota); the example becomes real work.                                                                                               |

Always included: TypeScript strict, Tailwind CSS 4, shadcn/ui (Radix), Lucide icons,
React Hook Form + Zod, TanStack Query, Vitest + Testing Library + MSW, Playwright,
ESLint + Prettier, Husky + lint-staged, dark mode, Zod-validated env.

## Environment (from the Prerequisite Check)

| Tool            | Required                                  | Found                                             | OK      |
| --------------- | ----------------------------------------- | ------------------------------------------------- | ------- |
| Node.js         | >=22.22.1 (lint-staged@17); Active LTS 24 | v24.22.0 via fnm 1.39.0                           | yes     |
| Package manager | pnpm                                      | pnpm 12.14.0                                      | yes     |
| Git             | any recent                                | 2.54.0                                            | yes     |
| Docker          | only for local image builds               | not installed (user skipped; CI builds the image) | skipped |
| Network         | registry.npmjs.org, ui.shadcn.com         | reachable (after switching network)               | yes     |

## Generation log

- Scaffolded with create-next-app 16.4.2 as `kolavo-web` in a temp folder, then moved into `Frontend/` (npm names cannot contain capitals).
- Versions: next 16.4.2, react 19.3.0, typescript 5.9 and eslint 9 (creator's choice), tailwindcss 4.3, zod 4.6, @tanstack/react-query 5.104, next-intl 4.14, vitest 5, msw 3, @playwright/test 1.64. `@hookform/resolvers` pinned to ^5 (v6 released the day before generation; user chose the verified major). Zero unmet peers.
- pnpm 12 blocks install scripts: `@parcel/watcher` and `@swc/core` (via next-intl) denied in `pnpm-workspace.yaml`; both ship prebuilt binaries.
- **Kit differences:** shadcn preset is now `--base radix --preset nova` (not `radix-nova`); shadcn now imports `cn` from a `cn` package; components repointed to the verified `@/lib/utils` (clsx + tailwind-merge) and the `cn`/`shadcn` packages removed.
- Reference code: Next external-API variant, plus the fullstack slice's toolbar, pagination, create/delete dialogs and tests adapted to services. Renamed `customers` → `members` (statuses active/pending).
- Beyond the verified kit (proved by the validation below): next-intl `[locale]` routing with `next/root-params`; bearer-token BFF (`/api/backend`, `/api/auth/*`); built-in mock backend at `/api/mock` shared with MSW; RBAC in four places; Kolavo tokens and Poppins via `@fontsource/poppins`.
- Repo layout: CI at the repo root (`.github/workflows/frontend-ci.yml`, path-filtered); husky `prepare` runs from the repo root (ADR-0007), not yet run.
- Docker image not built locally (Docker not installed); CI builds it.

## Validation

| Check          | Result |
| -------------- | ------ |
| typecheck      |        |
| lint + format  |        |
| unit tests     |        |
| build          |        |
| e2e smoke      |        |
| dev server 200 |        |
