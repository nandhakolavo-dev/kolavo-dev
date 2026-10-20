# ADR-0006: Docker image with the Next.js standalone server

- Status: accepted
- Date: 2026-10-20

## Context

The deploy target should not tie Kolavo to one provider.

## Decision

`output: 'standalone'` and a multi-stage `Dockerfile` (Node 24 Alpine, non-root user).
The build stage sets `SKIP_ENV_VALIDATION=1`; runtime config (`API_BASE_URL`, `APP_URL`)
comes from the orchestrator. `API_MOCKING` is forced to `false` in the image.

## Consequences

- Runs anywhere containers run; CI builds the image on every change.
- The team must pick a registry and a host; pushing is not wired yet.
- The sign-in page is prerendered at build time, so mock buttons never appear in an image.
