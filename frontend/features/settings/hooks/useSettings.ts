import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { settingsService } from "../services/settings.service"

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: settingsService.getProfile,
  })
}

export function useUpdateUsername() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: settingsService.updateUsername,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.profile }),
  })
}

export function useUpdateEmail() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: settingsService.updateEmail,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.profile }),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: settingsService.changePassword,
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: settingsService.deleteAccount,
  })
}
