import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { challengeService } from "../services/challenge.service"
import type { ChallengeListParams } from "../services/challenge.service"
import type { ChallengeCreatePayload } from "../types/challenge.types"

export function useChallenges(params: ChallengeListParams = {}) {
  return useQuery({
    queryKey: queryKeys.challenges.list(params),
    queryFn: () => challengeService.getList(params),
  })
}

export function useCreateChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ChallengeCreatePayload) => challengeService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all }),
  })
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => challengeService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all }),
  })
}

export function useJoinChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => challengeService.join(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all }),
  })
}

export function useLeaveChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => challengeService.leave(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all }),
  })
}

export function useLeaderboard(challengeId: number) {
  return useQuery({
    queryKey: ["challenges", challengeId, "leaderboard"] as const,
    queryFn: () => challengeService.getLeaderboard(challengeId),
    enabled: challengeId > 0,
  })
}
