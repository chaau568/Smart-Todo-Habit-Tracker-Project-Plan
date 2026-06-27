import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { challengeService } from "../services/challenge.service"
import type { ChallengeCreatePayload } from "../types/challenge.types"

const CHALLENGES_KEY = ["challenges"] as const
const LEADERBOARD_KEY = (id: number) => ["challenges", id, "leaderboard"] as const

export function useChallenges() {
  return useQuery({
    queryKey: CHALLENGES_KEY,
    queryFn: challengeService.getAll,
  })
}

export function useCreateChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ChallengeCreatePayload) => challengeService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHALLENGES_KEY }),
  })
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => challengeService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHALLENGES_KEY }),
  })
}

export function useJoinChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => challengeService.join(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHALLENGES_KEY }),
  })
}

export function useLeaveChallenge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => challengeService.leave(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHALLENGES_KEY }),
  })
}

export function useLeaderboard(challengeId: number) {
  return useQuery({
    queryKey: LEADERBOARD_KEY(challengeId),
    queryFn: () => challengeService.getLeaderboard(challengeId),
    enabled: challengeId > 0,
  })
}
