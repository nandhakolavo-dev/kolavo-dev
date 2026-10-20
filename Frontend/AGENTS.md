# AI Agent Instructions

Canonical instructions for every AI agent working in this folder. `CLAUDE.md` imports this
file. kolavo-web: the Kolavo community platform, a public landing page for community
leaders plus the Kolavo App where members and leaders manage their communities.

This app lives in `Frontend/` inside the KOLAVO repo. The rest of the repo (`Redesign/`,
`brain/`) is design and business material with its own `CLAUDE.md`; do not edit it from
here. Design tokens and screen decisions come from `../Redesign/REFERENCE.md`.

## Mandatory: read the playbook before writing code

[`docs/engineering-playbook.md`](docs/engineering-playbook.md) is the single source of
truth for how code is written here. **Before any change under `src/`, open it and read
the sections for your task.** Do not rely on memory of it or on generic React habits.

| Task                            | Read in the playbook                                        |
| ------------------------------- | ----------------------------------------------------------- |
| Any code change under `src/`    | §0, §1, §12, §13                                            |
| New page / new backend resource | + §2 to §10, then follow §11 with the `build-feature` skill |
| Bug fix or small tweak          | + only the section for the layer you touch                  |

Skills in `.claude/skills/` (mirrored in `.agents/skills/`):

- `frontend-architecture`: the non-negotiable rules and where each rule is explained.
- `build-feature`: the step-by-step workflow for a new page or resource.

If the playbook and the code disagree, say so and follow the code's established pattern.
If the playbook and a generic best practice disagree, the playbook wins.

## Stack

Next.js 16 App Router with Cache Components, consuming an external API (`API_BASE_URL`,
draft contract in `docs/api/openapi.yaml`). The API does not exist yet: a built-in mock
backend (`src/mocks/`, served at `/api/mock` when `API_MOCKING=true`) follows the contract.
Sign-in is Google via the backend; its bearer token is kept in an httpOnly cookie and
attached by the `/api/backend` proxy. Pages prefetch with TanStack Query on the server and
hydrate. next-intl (Indonesian only, unprefixed URLs), React Hook Form + Zod,
Tailwind CSS 4, shadcn/ui (Radix), Lucide icons, sonner toasts.
Decisions and their reasons: `docs/stack-profile.md` and `docs/adr/`.

## Rules that always apply

Condensed from playbook §1; the playbook has the detail and the recipes.

1. `'use client'` only on component files that are client boundaries; never on hooks,
   services or utils.
2. Request data (cookies, headers, `searchParams`, the current user, uncached data) is read
   only inside `<Suspense>`. Layouts never await the user at the top level.
3. Shareable page state (filters, search, pagination, sort, tabs) lives in the URL, parsed
   with the route's Zod schema in `schema.ts`; every field has `.default()` and `.catch()`.
4. Forms use React Hook Form + Zod (`zodResolver`), schema factories take the translator.
5. Every create/edit/delete goes through `useAppMutation`: success and error toast.
6. Route-only code stays in that route's `_components/ _utils/ __tests__/`.
7. Server state goes through `src/services/<resource>/` and TanStack Query. Pages
   prefetch on the server with the same `queryOptions` the client hook uses (passing
   `await getServerHttp()`), then hydrate. No `fetch` outside `src/lib/http*.ts`.
8. The access token never reaches browser JavaScript: browser calls go to `/api/backend/*`.
9. Every user-facing string lives in `messages/id.json`; use `Link`/`useRouter` from
   `@/i18n/navigation`, not from `next/*`.

- Base UI comes from `src/components/ui` (shadcn). Never hand-roll a primitive.
- Rule of Three before extracting anything shared: 1st use inline, 2nd evaluate, 3rd extract.
- `<Link>` by default; programmatic navigation only when logic runs first.
- Every data screen has loading, empty and error states, and a no-permission state.
- A new protected feature needs all four: permission code, menu entry, route guard, action
  gating (playbook §9). The backend checks the same permission.

Never invent endpoints, response shapes, permission codes, or business rules. Inspect the
code and `docs/api/openapi.yaml`; if it is not there, ask.

## Local startup

```bash
fnm use            # Node 24 from .nvmrc
pnpm install
cp .env.example .env.local   # defaults run against the built-in mock backend
pnpm dev
```

Open `http://localhost:3000`, then `/masuk` and pick a mock role. Treat `.env.local`
values as sensitive: never print them, never commit them.

## Validation

`pnpm check` runs typecheck, lint, format check, unit tests and build. Run it before calling
any task done, plus `pnpm test:e2e` when a user flow changed. Report results honestly: if a
check failed or was skipped, say so with the output.

## Guardrails

- Do not expose or modify credentials in `.env*` files.
- Do not commit `.env.local`, `node_modules`, build output, or generated files.
- Keep the diff to the requested task. Report out-of-scope findings separately instead of
  silently applying them.
- Do not add a dependency without saying why the existing stack cannot cover it.
- Do not "fix" unrelated pre-existing warnings.
- `API_MOCKING` is never `true` in a deployed environment.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
