import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SchoolIdentity } from '../../../lib/mockApi/types'
import { schoolIdentityApi } from './schoolIdentityApi'

export const schoolIdentityKeys = {
  all: ['school', 'identity'] as const,
}

export function useSchoolIdentity() {
  return useQuery({
    queryKey: schoolIdentityKeys.all,
    queryFn: () => schoolIdentityApi.get(),
  })
}

export function useUpdateSchoolIdentity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<SchoolIdentity>) => schoolIdentityApi.update(patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: schoolIdentityKeys.all })
    },
  })
}

