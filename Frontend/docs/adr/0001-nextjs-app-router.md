# ADR-0001: Next.js App Router, not a Vite SPA

- Status: accepted
- Date: 2026-10-20

## Context

Kolavo has public pages that are shared on WhatsApp and must rank in search: the landing
page and community profiles (`kolavo.app/k/<slug>`). Link previews and crawlers read the
HTML the server sends. A SPA sends an almost empty page.

## Decision

Next.js 16 App Router with Cache Components. Public pages are prerendered or streamed as
HTML; app pages are partially prerendered with server prefetch and client hydration.

## Consequences

- Finished HTML for previews and SEO; the landing page is fully static.
- Needs a Node server in production (Docker image, ADR-0006), unlike static hosting.
- Cache Components rules apply: request data only inside `<Suspense>`.
