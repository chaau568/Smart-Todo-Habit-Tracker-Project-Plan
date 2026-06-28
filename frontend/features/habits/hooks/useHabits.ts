import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { habitService } from "../services/habit.service"
import type { HabitListParams } from "../services/habit.service"
import type { HabitCreatePayload, HabitUpdatePayload } from "../types/habit.types"

export function useHabits(params: HabitListParams = {}) {
  return useQuery({
    queryKey: queryKeys.habits.list(params),
    queryFn: () => habitService.getList(params),
  })
}

export function useCreateHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: HabitCreatePayload) => habitService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tracking.dashboard })
    },
  })
}

export function useUpdateHabit(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: HabitUpdatePayload) => habitService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all })
    },
  })
}

export function useDeleteHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => habitService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tracking.dashboard })
    },
  })
}

export function useCheckInHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => habitService.checkIn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tracking.dashboard })
    },
  })
}

export function useSkipHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => habitService.skip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all })
    },
  })
}

export function useHabitHistory(id: number) {
  return useQuery({
    queryKey: queryKeys.habits.history(id),
    queryFn: () => habitService.getHistory(id),
    enabled: id > 0,
  })
}
