'use client'

import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useDeleteMember } from '@/services/members'

export function DeleteMemberButton({ id, name }: { id: string; name: string }) {
  const t = useTranslations()
  const deleteMember = useDeleteMember({
    toastSuccess: t('Members.delete.success', { name }),
    toastError: t('Members.delete.error', { name })
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          aria-label={t('Members.delete.label', { name })}
          disabled={deleteMember.isPending}
        >
          <Trash2 aria-hidden />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Members.delete.title', { name })}</AlertDialogTitle>
          <AlertDialogDescription>{t('Members.delete.description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('Common.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteMember.mutate(id)}>
            {t('Members.delete.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
