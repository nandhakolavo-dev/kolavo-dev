import { Check } from 'lucide-react'

/** Bullet list with check marks (prototype `.pilar-l`), shared by pillars and plans. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className='flex flex-col gap-2.5'>
      {items.map(item => (
        <li key={item} className='flex gap-2.5 text-[13.5px] leading-snug'>
          <Check className='mt-0.5 size-3.5 shrink-0 text-success' strokeWidth={3} aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}
