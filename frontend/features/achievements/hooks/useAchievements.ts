import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { achievementService } from "../services/achievement.service"
import type { AchievementListParams } from "../services/achievement.service"
import type { AchievementCreatePayload, AchievementUpdatePayload } from "../types/achievement.types"

export function useAchievements(params: AchievementListParams = {}) {
  return useQuery({
    queryKey: queryKeys.achievements.list(params),
    queryFn: () => achievementService.getList(params),
  })
}

export function useMyAchievements() {
  return useQuery({
    queryKey: queryKeys.achievements.my,
    queryFn: achievementService.getMy,
  })
}

export function useCreateAchievement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AchievementCreatePayload) => achievementService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all }),
  })
}

export function useUpdateAchievement(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AchievementUpdatePayload) => achievementService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all }),
  })
}

export function useDeactivateAchievement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => achievementService.deactivate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all }),
  })
}
