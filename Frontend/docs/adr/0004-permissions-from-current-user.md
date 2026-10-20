# ADR-0004: Permissions come from the backend's current-user response

- Status: accepted
- Date: 2026-10-20

## Context

Community leaders (pengurus) see the dashboard and billing; members (anggota) see less.
The backend owns users and roles.

## Decision

`GET /me` returns the user with a flat `permissions: string[]` of `<resource>.<action>`
codes. The frontend gates on permissions, never on role names, in four places: code,
menu entry, route guard (`checkPermission` → `<NoPermission />`), action gating
(`usePermissions().can`). The codes in `src/constants/permissions.ts` are a draft until the
backend confirms them.

## Consequences

- Roles can change on the backend without frontend changes.
- UI gating is convenience; the backend must enforce every permission (the mock does).
- Permissions per community (a user who leads one community and is a member of another) are
  not modelled yet; `/me` would need a per-community shape. Decide with the backend team.
