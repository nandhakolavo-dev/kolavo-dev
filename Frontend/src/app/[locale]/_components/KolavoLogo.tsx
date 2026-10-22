import { cn } from '@/lib/utils'

/** The Kolavo wordmark. Shape from a mask, colours from theme tokens, so it follows dark mode. Set the height; the width follows. */
export function KolavoLogo({ className }: { className?: string }) {
  return <span role='img' aria-label='Kolavo' className={cn('kolavo-logo', className)} />
}
