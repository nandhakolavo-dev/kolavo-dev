# ADR-0007: The web app lives in `Frontend/` of the KOLAVO repo

- Status: accepted
- Date: 2026-10-20

## Context

The KOLAVO repo already holds the design prototype (`Redesign/`) and business material
(`brain/`). The web app was generated into `Frontend/`.

## Decision

Keep one repo. The CI workflow (`.github/workflows/frontend-ci.yml` at the repo root) runs
only on changes under `Frontend/`. Husky installs from the repo root
(`prepare: cd .. && husky Frontend/.husky`) and its pre-commit hook runs lint-staged in
`Frontend/`.

## Consequences

- Design and code changes can land in one pull request.
- Running `pnpm install` in `Frontend/` sets `core.hooksPath` for the whole repo, so every
  commit runs the pre-commit hook (it exits quickly when no `Frontend/` file is staged).
- If the app moves to its own repo, drop the `cd ..` in `prepare` and the CI `paths` filter.
