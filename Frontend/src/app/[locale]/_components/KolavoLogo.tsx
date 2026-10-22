import Image from 'next/image'

/** The wordmark image from Redesign/assets (540×132). Decorative when wrapped in a labelled link. */
export function KolavoLogo({ className }: { className?: string }) {
  return (
    <Image
      src='/images/kolavo-logo.png'
      alt='Kolavo'
      width={540}
      height={132}
      priority
      className={className}
    />
  )
}
