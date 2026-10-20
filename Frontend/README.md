# kolavo-web

The Kolavo community platform: a public landing page for community leaders, plus the
Kolavo App where members and leaders manage their communities.

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · shadcn/ui ·
TanStack Query · React Hook Form + Zod · next-intl (Indonesian) · Vitest · Playwright.

The backend API does not exist yet. The app ships with a mock backend that follows the
draft contract in [`docs/api/openapi.yaml`](docs/api/openapi.yaml), so everything runs
locally without it.

## Run it

Requires Node 24 (`.nvmrc`, via [fnm](https://github.com/Schniz/fnm)) and pnpm.

```bash
fnm use
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000 for the landing page, then **Masuk** and pick a mock role:
**Pengurus** can add and delete members, **Anggota** can only read.

## Scripts

| Script                        | What it does                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev`                    | Dev server on port 3000                                                               |
| `pnpm build` / `pnpm start`   | Production build / server                                                             |
| `pnpm check`                  | Typecheck, lint, format check, unit tests, build: the gate before "done"              |
| `pnpm typecheck`              | `next typegen` + `tsc`                                                                |
| `pnpm lint` / `pnpm format`   | ESLint / Prettier (write)                                                             |
| `pnpm test` / `pnpm test:run` | Vitest watch / once                                                                   |
| `pnpm test:e2e`               | Playwright against the production build and the mock backend (run `pnpm build` first) |

## Environment

| Variable       | Meaning                                                                         |
| -------------- | ------------------------------------------------------------------------------- |
| `APP_URL`      | Public URL of this app (OAuth redirect URIs)                                    |
| `API_BASE_URL` | Backend API. Until it exists: `<APP_URL>/api/mock`                              |
| `API_MOCKING`  | `true` serves the mock backend and the role picker. Never `true` in production. |

## Deploy

`docker build -t kolavo-web .` builds a standalone Node image (see `Dockerfile`); pass
`APP_URL` and `API_BASE_URL` at runtime. CI (`.github/workflows/frontend-ci.yml` at the repo
root) runs the full gate, e2e, and the image build on every change under `Frontend/`.

## Where the docs live

- [`AGENTS.md`](AGENTS.md): instructions for AI agents (and a good summary for humans).
- [`docs/engineering-playbook.md`](docs/engineering-playbook.md): how code is written here.
- [`docs/stack-profile.md`](docs/stack-profile.md): what was decided and why.
- [`docs/adr/`](docs/adr/): architecture decisions.
- [`docs/api/openapi.yaml`](docs/api/openapi.yaml): the draft backend contract.
- Design source: [`../Redesign/`](../Redesign/) (tokens in `REFERENCE.md`).
