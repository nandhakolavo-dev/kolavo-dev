import { useFormatter, useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Member } from '@/services/members'

import { DeleteMemberButton } from './DeleteMemberButton'

export function MembersTable({
  members,
  hasFilters,
  canDelete
}: {
  members: Member[]
  hasFilters: boolean
  canDelete: boolean
}) {
  const t = useTranslations('Members')
  const format = useFormatter()

  if (members.length === 0) {
    return (
      <div className='rounded-lg border border-dashed p-10 text-center'>
        <p className='font-medium'>{hasFilters ? t('noMatchTitle') : t('emptyTitle')}</p>
        <p className='text-sm text-muted-foreground'>{hasFilters ? t('noMatchHint') : t('emptyHint')}</p>
      </div>
    )
  }

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('columns.name')}</TableHead>
            <TableHead>{t('columns.email')}</TableHead>
            <TableHead>{t('columns.status')}</TableHead>
            <TableHead>{t('columns.joinedAt')}</TableHead>
            {canDelete && (
              <TableHead className='w-0'>
                <span className='sr-only'>{t('columns.actions')}</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map(member => (
            <TableRow key={member.id}>
              <TableCell className='font-medium'>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                  {t(`status.${member.status}`)}
                </Badge>
              </TableCell>
              <TableCell>{format.dateTime(new Date(member.joinedAt), { dateStyle: 'medium' })}</TableCell>
              {canDelete && (
                <TableCell>
                  <DeleteMemberButton id={member.id} name={member.name} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
