# Engineering Playbook

The single source of truth for **how code is written in this repo**. `AGENTS.md` points
every AI agent here; humans should read it once end to end.

The living example of every rule is the `members` feature:
`src/app/[locale]/(app)/members/` and `src/services/members/`.
When this file and that code agree, copy the code. When they disagree, say so.

| Task                            | Read                                       |
| ------------------------------- | ------------------------------------------ |
| Any code change under `src/`    | §0, §1, §12, §13                           |
| New page / new backend resource | + §2 to §10, then follow §11               |
| Bug fix or small tweak          | + only the section for the layer you touch |

---

## 0. Read first

- `AGENTS.md`: startup, guardrails, and the Next.js agent rules block at its end.
- The `frontend-architecture` skill: rules plus routing to sections here.
- `docs/stack-profile.md` and `docs/adr/`: why the stack is what it is.
- `docs/api/openapi.yaml`: the **draft** backend contract the mocks follow.
- **`node_modules/next/dist/docs/`** before using any Next.js API or file convention. This
  is Next.js 16 with Cache Components; APIs differ from older versions (`proxy.ts`,
  `error.tsx` receives `retry`, `searchParams` is a Promise, `next/root-params`).

## 1. Non-negotiables

1. **`'use client'` only on component files that are client boundaries.** Never on hooks,
   services or utils.
2. **Request data only inside `<Suspense>`.** Cookies, headers, `searchParams`, the
   current user, uncached data. Pages are sync shells; an async child inside Suspense reads.
   Layouts never await the user at the top level.
3. **Server state through `src/services/<resource>/` and TanStack Query.** Pages prefetch
   on the server with the same `queryOptions` as the client hook, then hydrate.
4. **No `fetch` in components.** `src/lib/http.ts` (`createHttpClient`) is the only HTTP
   client. Browser code uses `http`; server code uses `await getServerHttp()`.
5. **The access token never reaches browser JavaScript.** It lives in the httpOnly
   `kolavo_session` cookie; the browser calls `/api/backend/*`, which adds the bearer token.
6. **Shareable page state = URL**, parsed with the route's Zod schema.
7. **Forms = React Hook Form + Zod.** Schema factories take the translator for messages.
8. **Every create/edit/delete = `useAppMutation`**: success toast, error toast, invalidation.
9. **Every user-facing string comes from `messages/<locale>.json`** via next-intl. No
   hard-coded copy in components.
10. **Primitives from `src/components/ui`** (shadcn). Never hand-roll them.
11. **Route-only code stays in the route** (`_components/ _utils/ __tests__/`); **Rule of
    Three** before sharing.
12. **`<Link>` from `@/i18n/navigation` by default**; `router.push/replace` only when logic
    runs first. Never import `Link`/`useRouter` from `next/*` directly.
13. **Every data screen has loading, empty and error states, plus no-permission.**

## 2. File layout

### Route

```text
src/app/[locale]/(app)/<route>/
  page.tsx          sync shell: metadata + <Suspense fallback={<Skeleton/>}><Content/></Suspense>
  schema.ts         Zod: URL search schema + form schema factories
  error.tsx         'use client' error boundary ({ error: unknown, retry })
  _components/      route-only components
  _utils/           pure helpers: URL state → params, href builder
  __tests__/
```

- `[locale]` is the root segment (next-intl). Indonesian is unprefixed (`/members`); a
  future English would be `/en/members`. Read the locale with `next/root-params`.
- `(app)` holds pages inside the Kolavo App shell (behind sign-in). Public pages (landing,
  community profiles) sit directly under `[locale]`. Route groups do not appear in the URL.
- `masuk/` is the full-page sign-in.
- Add every new `(app)` path prefix to `APP_PATHS` in `src/proxy.ts`.

### Backend resource

```text
src/services/<resource>/
  types.ts · <resource>.ts (raw calls) · query-keys.ts · use-<resource>.ts · index.ts
```

One service module per backend resource. `queryOptions` live in `use-<resource>.ts`
without `'use client'` so Server Components can import them for prefetch. Read functions
take an optional `client: HttpClient` (default: browser `http`); the server passes
`await getServerHttp()`. The client is not part of the query key.

### Plumbing

```text
src/
  proxy.ts                    next-intl routing + optimistic sign-in redirect (not security)
                              + real 404 for unknown /k/<slug> (streamed pages can't change status)
  env.ts                      server-only env, Zod, SKIP_ENV_VALIDATION for Docker builds
  i18n/                       routing, navigation, request config
  lib/http.ts                 createHttpClient, HttpError, browser `http`
  lib/http.server.ts          getServerHttp() (bearer from cookie), publicServerHttp
  lib/session.ts              getCurrentUser (cached per request), requireUser, checkPermission
  lib/auth-cookie.ts          cookie name and options
  app/api/backend/[...path]   BFF proxy: cookie → Authorization: Bearer → API_BASE_URL
  app/api/auth/*              google (start), callback (code → token → cookie), sign-out
  app/api/mock/[...path]      dev mock backend (404 unless API_MOCKING=true)
  mocks/                      mock backend + data; MSW server for unit tests
messages/<locale>.json        all copy
```

## 3. The layers (never collapse them)

1. **Data:** `src/services/<resource>/`. Raw calls, keys, query options, hooks.
2. **Server prefetch:** the page's async content component checks permission, prefetches
   with the server client and wraps the view in `HydrationBoundary`.
3. **Presentation:** `_components/*`. The client view reads the hydrated cache with the
   service hook.
4. **Pure logic:** `_utils/*`. No React, unit-tested directly.

## 4. Where code lives and naming

| Scope                      | Kind              | Location                                                  |
| -------------------------- | ----------------- | --------------------------------------------------------- |
| One route                  | component / util  | that route's `_components/`, `_utils/`                    |
| 2+ routes (3rd use proven) | component         | `src/components/shared/`                                  |
| 2+ routes                  | hook              | `src/hooks/`                                              |
| 2+ routes                  | pure util         | `src/utils/`                                              |
| Any                        | app shell         | `src/components/layout/`                                  |
| Any                        | shadcn primitives | `src/components/ui/` (generated; add with the shadcn CLI) |
| Any                        | permission codes  | `src/constants/permissions.ts`                            |
| Any                        | copy              | `messages/<locale>.json`, one namespace per feature       |

**Naming:** components PascalCase (`MembersTable.tsx`); everything else kebab-case
(`members-search.ts`, `use-app-mutation.ts`); Next.js special files keep their names
(`page.tsx`, `error.tsx`); tests `<name>.test.ts(x)`. Variables camelCase, types and
components PascalCase, constants SCREAMING_SNAKE_CASE, booleans as questions (`isPending`),
handlers `on<Event>` as props, `handle<Event>` inside. Code is English; copy is Indonesian.

**State placement:** server data → the TanStack Query cache; shareable state → URL;
everything else → local state in the lowest component that needs it. No global store.

## 5. Data layer

See `src/services/members/`, `src/lib/http.server.ts` and `src/lib/get-query-client.ts`.

```tsx
async function MembersPrefetch({ searchParams }) {
  const { allowed } = await checkPermission(PERMISSIONS.MEMBERS_READ)
  if (!allowed) return <NoPermission />

  const search = membersSearchSchema.parse(await searchParams)
  const client = await getServerHttp() // bearer token from the httpOnly cookie
  const queryClient = getQueryClient() // new per request on the server
  await Promise.all([
    queryClient.prefetchQuery(membersQueryOptions(toMemberParams(search), client)),
    queryClient.prefetchQuery(currentUserQueryOptions(client))
  ])
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MembersView search={search} /> {/* 'use client', calls useMembers(...) */}
    </HydrationBoundary>
  )
}
```

- `staleTime` above zero so the client does not refetch what the server just sent.
- **Display-only public data** (nothing on the client reads or mutates it, e.g. the landing
  showcase) may skip the query cache: an async Server Component calls the service with
  `publicServerHttp` inside `<Suspense>`, after `await io()` (from `next/cache`) so it is
  fetched per request instead of during prerender. See `src/app/[locale]/_components/Showcase.tsx`.
- Per-user pages call `await connection()` before prefetching (TanStack stamps `Date.now()`).
- Mutations run in the browser: `http` → `/api/backend/*` → backend. They never need the
  server client.
- Errors: the backend answers `{ "error": { "code", "message" } }`; `HttpError.message`
  carries that message, and `useAppMutation` shows it in the error toast.

### The mock backend (until the real API exists)

`src/mocks/backend.ts` implements `docs/api/openapi.yaml` as plain `Request → Response`.
Development serves it at `/api/mock` (`API_BASE_URL=http://localhost:3000/api/mock`,
`API_MOCKING=true`); unit tests reach it through MSW (`src/mocks/node.ts`). New endpoint:
update the OpenAPI draft first, then the mock, then the service. When the real API ships,
point `API_BASE_URL` at it, set `API_MOCKING=false`, and delete `src/mocks/` handlers that
no longer match (keep MSW for tests).

## 6. Route shell and screen states

```tsx
export default function MembersPage({ searchParams }: PageProps<'/[locale]/members'>) {
  return (
    <Suspense fallback={<MembersSkeleton />}>
      <MembersPrefetch searchParams={searchParams} />
    </Suspense>
  )
}
```

- Loading: the Suspense fallback, matching the real layout.
- Error: `error.tsx` with a retry button (`retry()`), logging the error.
- Empty: inside the list component, with the primary action or a hint to clear filters.
- No permission: `<NoPermission />` from `src/components/shared/no-permission.tsx`.
- Not found: `notFound()` → `[locale]/not-found.tsx`.

## 7. URL state

In the URL: pagination, sort, filters, search, tabs. Not in the URL: dialog state, selected
row, in-progress input.

- Schema in `schema.ts`: every field `.default()` and `.catch()`; parse `await searchParams`
  in the async content component.
- Links: build hrefs with the route's href helper (`membersHref(search, { page: 2 })`),
  which drops default values. Pagination is plain `<Link>`s: works without JavaScript.
- Client controls (search box, selects) call `router.replace(href, { scroll: false })`
  inside `startTransition`. Filter changes reset `page` to 1 in the same call.
- The search box keeps local input and debounces into the URL.

## 8. Forms and mutations

Mutations call the service's raw function through `useAppMutation` with `invalidateKeys`
(see `useCreateMember` in `src/services/members/use-members.ts`). Forms: RHF +
`zodResolver`, schema factory in `schema.ts`:

```ts
const tForm = useTranslations('Members.form')
const schema = useMemo(() => createMemberFormSchema(tForm), [tForm])
const form = useForm<MemberFormValues>({ resolver: zodResolver(schema), defaultValues })
```

- The backend re-validates; the form schema is for fast feedback only.
- Destructive actions confirm with `AlertDialog`.
- Every input has a `<Label htmlFor>`; errors use `aria-invalid` and `aria-describedby`.
- Disable submit on `isPending`.

## 9. Permissions and sign-in

**Sign-in (Google, bearer token, BFF).** `/masuk` links to `/api/auth/google`, which sends
the user to the backend's Google flow. The backend redirects to `/api/auth/callback?code=…`;
the callback exchanges the code server-to-server (`POST /auth/token`) and stores the access
token in the httpOnly `kolavo_session` cookie. Sign-out is a POST to `/api/auth/sign-out`.
To switch to a backend-set cookie or OIDC later, only these Route Handlers,
`lib/http.server.ts` and the BFF proxy change (ADR-0003).

**Permissions: four places, all required.**

1. Code in `src/constants/permissions.ts` (`<resource>.<action>`, must match the backend).
2. Menu entry in `src/components/layout/nav-config.ts` with its permission.
3. Route guard: `checkPermission(...)` in the page's async content → `<NoPermission />`.
   (`requireUser()` redirects to `/masuk` when nobody is signed in.)
4. Action gating: `const { can } = usePermissions()`; `{can(PERMISSIONS.X) && <Button/>}`.

Permissions arrive with the current user (`GET /me`). Hiding UI is convenience; the
backend checks the same permission on every request (the mock does too).

## 10. Components and React patterns

- Server Component by default. Add `'use client'` only to the smallest component that needs
  state, effects, event handlers or browser APIs, and pass it serializable props.
- Do not pass functions from Server to Client Components.

| Apply                                          | Instead of                              |
| ---------------------------------------------- | --------------------------------------- |
| Derive during render                           | `useState` + `useEffect` mirroring data |
| Reset page in the handler that changes filters | effect watching filters                 |
| `key` to reset a child                         | cleanup effects                         |
| Stable keys (`id`)                             | array index                             |
| Hoist static values to module scope            | inline objects every render             |
| Explicit variant components, `children`        | boolean-mode props                      |

Before writing `useEffect`: derived → render; event → handler; reset → `key`; data →
Server Component or TanStack Query. Effects only sync with external systems.

Accessibility: real buttons/links from `ui`; icon-only buttons have `aria-label`;
decorative icons `aria-hidden`; everything keyboard-operable.

**Styling and brand.** Change tokens in `src/app/globals.css`, never restyle primitives ad
hoc. Kolavo tokens (from `Redesign/REFERENCE.md`): primary `#2D6BE4`, hover `#0045CD`
(`bg-brand-hover`), accent `#FF683D` (`text-brand-accent`), card radius 13px. Dark mode is
the `.dark` block; never write literal colors outside the token blocks.

Buttons are pills (`rounded-full`, brand spec). Sizes: `hero` 56px (landing lead CTA), `xl`
52px (primary page actions), `lg`/`default`/`sm` for dense UI. Hover on primary is `--brand-hover`.
Section surfaces: `bg-surface-alt` (alternate sections), `bg-brand-wash`/`bg-brand-tint`,
`bg-accent-wash` + `text-accent-ink`, `bg-success-wash` + `text-success`.

Fonts: Poppins from `@fontsource/poppins`, mono from `geist`. Never `next/font/google`
(builds must not need the internet).

### Copy and translations

- All copy lives in `messages/id.json`, one namespace per feature (`Members`, `SignIn`).
  Keys are typed (`src/global.d.ts`): a missing key fails typecheck.
- Server Components: `useTranslations` (sync) or `await getTranslations` (async, metadata).
  Client Components: `useTranslations`. Dates and numbers: `useFormatter()`.
- Plurals and variables use ICU syntax: `"{count, plural, other {# anggota}}"`.
- Zod messages come from the translator through schema factories (§8).
- Adding a language: add it to `routing.locales`, add `messages/<locale>.json` with the same
  keys, done. Existing Indonesian URLs do not change.

## 11. Workflow: building something new

Use the `build-feature` skill. Order (bottom-up, each step verifiable):

1. **Nail the contract**: data shape, who may read and write it, URL, shareable state.
   Add it to `docs/api/openapi.yaml` (mark it draft until the backend confirms). Unknown? Ask.
2. Mock backend handler in `src/mocks/backend.ts` + data, with a test.
3. Service folder.
4. Route: `schema.ts` (with tests), `page.tsx` with permission check, server prefetch + hydration.
5. Client view and toolbar; copy in `messages/id.json`.
6. Mutations: service raw function + hook with `invalidateKeys`.
7. Components and screen states; forms. Permissions in all four places (§9).
8. Tests for components with behavior; e2e if it is a key flow.
9. Validate (§12) and check §13.

## 12. Validation gate

| Check                             | Command                                                                    |
| --------------------------------- | -------------------------------------------------------------------------- |
| Everything below in order         | `pnpm check`                                                               |
| Types (runs `next typegen` first) | `pnpm typecheck`                                                           |
| Lint and format                   | `pnpm lint`, `pnpm format:check`                                           |
| Unit and integration              | `pnpm test:run`                                                            |
| Build                             | `pnpm build` (route table: `○` static, `◐` partial prerender, `ƒ` dynamic) |
| Smoke e2e                         | `pnpm build && pnpm test:e2e` (runs against the built-in mock backend)     |

Report results honestly. A skipped check is reported as skipped, with the reason.

## 13. Scope discipline and definition of done

- Only the requested feature. Report neighboring problems separately.
- No new dependency without saying why the stack cannot cover it.
- New shared abstraction with one consumer? Colocate it instead.

Done means:

- [ ] Contract in `docs/api/openapi.yaml`; mock handler matches it
- [ ] Service folder complete; no HTTP outside it; pages prefetch and hydrate
- [ ] Request data read only inside Suspense; `'use client'` only on client components
- [ ] URL state parsed with a schema that has defaults and catches
- [ ] Forms with RHF + Zod; every mutation via `useAppMutation`
- [ ] Loading, empty, error, no-permission states
- [ ] Permission in all four places
- [ ] Every string in `messages/id.json`
- [ ] UI from `src/components/ui`; accessible names on every control
- [ ] Tests: schema, utils, mock/service calls, components with behavior
- [ ] `pnpm check` green
