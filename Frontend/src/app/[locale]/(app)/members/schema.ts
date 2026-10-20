import { z } from 'zod'

export const MEMBER_STATUSES = ['active', 'pending'] as const
export const PAGE_SIZES = [10, 20, 50] as const

/**
 * URL search params for /members. Every field has a default and a catch,
 * so `?page=banana` falls back instead of crashing the page.
 */
export const membersSearchSchema = z.object({
  search: z.string().trim().default('').catch(''),
  status: z
    .enum(['all', ...MEMBER_STATUSES])
    .default('all')
    .catch('all'),
  page: z.coerce.number().int().min(1).default(1).catch(1),
  pageSize: z.coerce
    .number()
    .refine(value => (PAGE_SIZES as readonly number[]).includes(value))
    .default(10)
    .catch(10)
})

export type MembersSearch = z.infer<typeof membersSearchSchema>

type FormMessage = 'nameRequired' | 'nameTooLong' | 'emailInvalid'

/**
 * Form schema. A factory so error messages come from the translator
 * (`useTranslations('Members.form')`). The backend re-validates.
 */
export const createMemberFormSchema = (t: (key: FormMessage) => string) =>
  z.object({
    name: z.string().trim().min(1, t('nameRequired')).max(100, t('nameTooLong')),
    email: z.email(t('emailInvalid')),
    status: z.enum(MEMBER_STATUSES)
  })

export type MemberFormValues = z.infer<ReturnType<typeof createMemberFormSchema>>
