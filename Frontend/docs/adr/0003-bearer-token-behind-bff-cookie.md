# ADR-0003: Backend bearer token, kept in an httpOnly cookie by a BFF

- Status: accepted (revisit when the backend is designed)
- Date: 2026-10-20

## Context

Users sign in with Google (`scrMasuk`). The backend will issue a bearer token. Storing a
token in browser storage exposes it to any XSS. The team may later prefer a backend-set
session cookie or a full OIDC provider.

## Decision

The backend runs the Google OAuth flow and redirects to `/api/auth/callback?code=…`. That
Route Handler exchanges the one-time code server-to-server (`POST /auth/token`) and stores
the access token in the httpOnly, SameSite=Lax cookie `kolavo_session`. Browser requests go
to `/api/backend/*`, which adds `Authorization: Bearer`. Server Components use
`getServerHttp()`, which reads the same cookie.

## Consequences

- The token never reaches JavaScript.
- One extra hop for browser requests (Next.js → backend).
- Changing the scheme touches only `app/api/auth/*`, `app/api/backend/*` and
  `lib/http.server.ts`: for a backend-set cookie, forward the cookie instead of the bearer;
  for OIDC, replace the callback with the provider's code + PKCE flow.
- Token refresh is not designed yet; the cookie lives as long as `expiresIn`.
