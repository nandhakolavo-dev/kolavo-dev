'use client'

import { useSearchParams } from 'next/navigation'

/** Reads `?error=1` on the client so the page shell stays static. */
export function SignInError({ message }: { message: string }) {
  const params = useSearchParams()
  if (!params.has('error')) return null
  return (
    <p role='alert' className='text-sm text-destructive'>
      {message}
    </p>
  )
}
