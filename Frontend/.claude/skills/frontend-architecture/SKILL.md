---
name: frontend-architecture
description: Project rules for writing, reviewing or refactoring React code in this repo (components, data fetching, mutations, forms, URL state, folder structure, naming). Use before any change under src/ and when reviewing a diff.
---

# Frontend architecture

This skill is short on purpose. The rules are explained, with examples, in
`docs/engineering-playbook.md`; the living example is the `members` feature. This file
lists what is never negotiable and where to read more. Do not duplicate playbook content
here: one source, no drift.

## Never negotiable

Read `AGENTS.md` "Rules that always apply". They are the same list, kept there so every
agent sees them. If a rule here and there ever differ, `AGENTS.md` wins and this file is
fixed.

## Routing

| Task involves                                        | Read in the playbook              |
| ---------------------------------------------------- | --------------------------------- |
| Fetching, caching, mutations, toasts, invalidation   | §5, §8                            |
| Page structure, loading/empty/error states           | §6                                |
| Filters, search, pagination, tabs                    | §7                                |
| Forms and validation                                 | §8                                |
| Roles, permissions and sign-in                       | §9                                |
| Copy, translations, brand tokens                     | §10                               |
| Component design, effects, re-renders, accessibility | §10                               |
| Where a file goes, naming                            | §2, §4                            |
| A new page or resource                               | §11 and the `build-feature` skill |
| Is it done?                                          | §12, §13                          |

If a task spans several rows, read every matching section.

## Review output

For each issue: severity (low / medium / high), the rule or playbook section violated,
why it matters here, and the concrete fix (code). Only flag issues within the task's
scope; list out-of-scope findings separately and do not apply them silently.
