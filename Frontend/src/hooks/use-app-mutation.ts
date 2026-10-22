import { useMutation, useQueryClient, type QueryKey, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'sonner'

type AppMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationFn'
> & {
  /** Toast shown on success. The call site writes it because only it knows the record name. */
  toastSuccess: string
  /** Toast shown on error. The server message is appended when present. */
  toastError: string
  /** Query keys to invalidate after success. */
  invalidateKeys?: QueryKey[]
}

/** Every create/update/delete goes through here so feedback and cache invalidation are never forgotten. */
export function useAppMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  {
    toastSuccess,
    toastError,
    invalidateKeys = [],
    onSuccess,
    onError,
    ...options
  }: AppMutationOptions<TData, TVariables>
) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    ...options,
    mutationFn,
    onSuccess: async (...args) => {
      await Promise.all(invalidateKeys.map(queryKey => queryClient.invalidateQueries({ queryKey })))
      toast.success(toastSuccess)
      await onSuccess?.(...args)
    },
    onError: (error, ...rest) => {
      toast.error(toastError, { description: error.message })
      onError?.(error, ...rest)
    }
  })
}
