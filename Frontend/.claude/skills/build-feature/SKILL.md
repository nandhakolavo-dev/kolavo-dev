---
name: build-feature
description: Step-by-step workflow for adding a new page, backend resource or feature to this repo following the playbook. Use when asked to build, add or create a feature, page, screen, CRUD, or resource.
---

# Build a feature

Follow `docs/engineering-playbook.md` §11. This skill is the checklist that keeps the
order and the gates.

## 1. Contract first (stop here if anything is unknown)

Write down, and confirm with the user before code:

- What the feature does, for whom, and the URL of the page.
- The data: fields, which are required, validation rules.
- Where it comes from: endpoints with method, params, response and error shape. Add them
  to `docs/api/openapi.yaml`, marked draft until the backend team confirms.
- Who may read and who may change it (permission codes).
- Which page state is shareable (goes in the URL).

Never invent an endpoint, field, permission code or business rule. Ask.

## 2. Find the pattern to copy

Open the `members` feature (the Vertical Slice Example: `src/app/[locale]/(app)/members/` and `src/services/members/`) and the matching playbook
sections. New code mirrors its structure and names unless there is a reason not to, which
you state.

## 3. Build bottom-up, verifying each layer

1. Mock backend handler (`src/mocks/backend.ts`) and service folder, with tests.
2. Route schema (URL + form), with tests.
3. Route shell with Suspense or loader, and the loading and error states.
4. Components and the empty state.
5. Forms and mutations with success and error toasts.
6. Permissions in all four places; every string in `messages/id.json`.
7. Page or component tests, e2e for key flows.

Run the related tests after each step instead of only at the end.

## 4. Gate

Run `pnpm check` (typecheck, lint, format, tests, build). Run e2e if a user flow changed.
Walk through the playbook's definition of done (§13) item by item and report each as done
or not, with the reason. Report failures with their output; do not hide them.

## 5. Document when it is not obvious

If the feature has a non-obvious contract or behavior, add `docs/<feature>.md` (why, what,
contract, edge cases). If you made a hard-to-reverse choice with real alternatives, add an
ADR in `docs/adr/`.
