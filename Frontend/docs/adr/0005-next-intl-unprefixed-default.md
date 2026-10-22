# ADR-0005: next-intl from day one, Indonesian unprefixed

- Status: accepted
- Date: 2026-10-20

## Context

The product launches in Indonesian; more languages are planned. Retrofitting i18n means
touching every component, and changing URLs would break shared community links.

## Decision

next-intl with a `[locale]` root segment, `locales: ['id']`, `localePrefix: 'as-needed'`.
All copy lives in `messages/id.json` with typed keys. The locale is read with
`next/root-params`; the root layout has `generateStaticParams` (required by Cache Components).

## Consequences

- Adding English is a messages file and one array entry; Indonesian URLs stay `/members`,
  English becomes `/en/members`.
- Every page sits under `src/app/[locale]/`; navigation uses `@/i18n/navigation`.
- `proxy.ts` combines next-intl routing with the sign-in redirect.
