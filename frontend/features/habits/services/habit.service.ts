import { apiClient } from "@/services/api.client"
import type { ApiSuccess, ListResponse } from "@/types/api.types"
import type { Habit, HabitCreatePayload, HabitLog, HabitUpdatePayload } from "../types/habit.types"

export const habitService = {
  getAll: async (): Promise<Habit[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<Habit>>>("/habit/")
    return data.data.results
  },

  create: async (payload: HabitCreatePayload): Promise<Habit> => {
    const { data } = await apiClient.post<ApiSuccess<Habit>>("/habit/", payload)
    return data.data
  },

  update: async (id: number, payload: HabitUpdatePayload): Promise<Habit> => {
    const { data } = await apiClient.put<ApiSuccess<Habit>>(`/habit/${id}/`, payload)
    return data.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/habit/${id}/`)
  },

  checkIn: async (id: number): Promise<Habit> => {
    const { data } = await apiClient.post<ApiSuccess<Habit>>(`/habit/${id}/check-in/`)
    return data.data
  },

  skip: async (id: number): Promise<Habit> => {
    const { data } = await apiClient.post<ApiSuccess<Habit>>(`/habit/${id}/skip/`)
    return data.data
  },

  getHistory: async (id: number): Promise<HabitLog[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<HabitLog>>>(`/habit/${id}/history/`)
    return data.data.results
  },
}
