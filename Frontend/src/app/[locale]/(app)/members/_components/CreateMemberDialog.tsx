'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateMember } from '@/services/members'

import { createMemberFormSchema, MEMBER_STATUSES, type MemberFormValues } from '../schema'

const DEFAULT_VALUES: MemberFormValues = { name: '', email: '', status: 'active' }

export function CreateMemberDialog() {
  const t = useTranslations()
  const tForm = useTranslations('Members.form')
  const [open, setOpen] = useState(false)
  const schema = useMemo(() => createMemberFormSchema(tForm), [tForm])
  const form = useForm<MemberFormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })
  const { errors } = form.formState

  const createMember = useCreateMember({
    toastSuccess: t('Members.create.success'),
    toastError: t('Members.create.error'),
    onSuccess: () => {
      form.reset(DEFAULT_VALUES)
      setOpen(false)
    }
  })

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) form.reset(DEFAULT_VALUES)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden />
          {t('Members.create.open')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Members.create.title')}</DialogTitle>
          <DialogDescription>{t('Members.create.description')}</DialogDescription>
        </DialogHeader>
        <form
          id='create-member-form'
          noValidate
          className='flex flex-col gap-4'
          onSubmit={form.handleSubmit(values => createMember.mutate(values))}
        >
          <div className='flex flex-col gap-2'>
            <Label htmlFor='member-name'>{tForm('name')}</Label>
            <Input
              id='member-name'
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'member-name-error' : undefined}
              {...form.register('name')}
            />
            {errors.name && (
              <p id='member-name-error' className='text-sm text-destructive'>
                {errors.name.message}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='member-email'>{tForm('email')}</Label>
            <Input
              id='member-email'
              type='email'
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'member-email-error' : undefined}
              {...form.register('email')}
            />
            {errors.email && (
              <p id='member-email-error' className='text-sm text-destructive'>
                {errors.email.message}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <Label id='member-status-label'>{tForm('status')}</Label>
            <Controller
              control={form.control}
              name='status'
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-labelledby='member-status-label'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBER_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>
                        {t(`Members.status.${status}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant='outline' onClick={() => handleOpenChange(false)}>
            {t('Common.cancel')}
          </Button>
          <Button type='submit' form='create-member-form' disabled={createMember.isPending}>
            {createMember.isPending ? t('Common.saving') : t('Members.create.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
