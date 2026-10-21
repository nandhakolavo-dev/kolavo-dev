import Image from 'next/image'
import { useTranslations } from 'next-intl'

import type { BoardMember } from '@/services/communities'

import { initials } from '../_utils/profile-stats'

const INITIALS_COLORS = [
  'bg-brand-wash text-primary',
  'bg-accent-wash text-accent-ink',
  'bg-success-wash text-success'
] as const

/** Board members by name and role (prototype `#komPengurus`). Public: credentials, not contacts. */
export function BoardList({ board }: { board: BoardMember[] }) {
  const t = useTranslations('CommunityProfile.board')

  return (
    <section aria-labelledby='board-title' className='mt-10'>
      <h2 id='board-title' className='text-[17px] font-semibold tracking-tight'>
        {t('title')}
      </h2>
      <p className='mt-1 text-[13.5px] text-muted-foreground'>{t('lede')}</p>
      {board.length === 0 ? (
        <p className='mt-3 rounded-[13px] border p-[18px] text-sm text-muted-foreground'>{t('empty')}</p>
      ) : (
        <ul className='mt-3 grid gap-3 sm:grid-cols-2'>
          {board.map((member, index) => (
            <li
              key={`${member.name}-${member.role}`}
              className='flex items-center gap-3 rounded-[13px] border bg-card px-4 py-3.5'
            >
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={t('photo', { name: member.name })}
                  width={44}
                  height={44}
                  className='size-11 shrink-0 rounded-full object-cover'
                />
              ) : (
                <span
                  aria-hidden
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${INITIALS_COLORS[index % INITIALS_COLORS.length]}`}
                >
                  {initials(member.name)}
                </span>
              )}
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold'>{member.name}</p>
                <p className='truncate text-[13px] text-muted-foreground'>{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
