'use client'

import { useEffect, useState } from 'react'

/**
 * The last hero word rotates (komunitasmu → organisasimu → …). The server renders the first
 * word, so crawlers and no-JS visitors read a complete sentence. Off when the visitor asks
 * for reduced motion. It sits on its own line so the title height never changes.
 */
export function HeroRotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let swap: number | undefined
    const timer = window.setInterval(() => {
      setVisible(false)
      swap = window.setTimeout(() => {
        setIndex(current => (current + 1) % words.length)
        setVisible(true)
      }, 300)
    }, 2800)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(swap)
    }
  }, [words.length])

  return (
    <span className='text-primary transition-opacity duration-300' style={{ opacity: visible ? 1 : 0 }}>
      {words[index]}
    </span>
  )
}
