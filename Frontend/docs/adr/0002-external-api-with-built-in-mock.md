# ADR-0002: External API, mocked inside the app until it exists

- Status: accepted
- Date: 2026-10-20

## Context

The backend will be a separate service owned outside this repo, but it does not exist yet.
The UI must be built and tested now. MSW (the kit's usual mock) intercepts requests in the
browser or in one Node process; Next.js also calls the API from the server during render,
so a browser-only mock would not cover server prefetch.

## Decision

- The frontend drafts the contract in `docs/api/openapi.yaml`.
- `src/mocks/backend.ts` implements it as plain `Request → Response`. Development serves it
  as a Route Handler at `/api/mock` (only when `API_MOCKING=true`), and `API_BASE_URL`
  points there. Unit tests reach the same code through MSW.

## Consequences

- One mock for dev, unit tests and e2e; server and browser paths both exercised.
- Switching to the real API is configuration: `API_BASE_URL` + `API_MOCKING=false`.
- The draft contract can diverge from what the backend team builds; review it with them
  before they start, and update mocks and services when it changes.
- The mock ships in the build but answers 404 unless mocking is on.
