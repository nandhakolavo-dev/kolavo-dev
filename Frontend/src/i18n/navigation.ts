import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

/** Locale-aware replacements for `next/link` and `next/navigation`. Use these, not the Next.js ones. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
