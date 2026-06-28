import { apiClient } from "@/services/api.client"
import type { ApiSuccess, ListResponse, PaginatedResponse } from "@/types/api.types"
import type { Habit, HabitCreatePayload, HabitLog, HabitUpdatePayload } from "../types/habit.types"

export interface HabitListParams {
  dailyStatus?: "checked_in" | "skipped" | "pending"
  ordering?: string
  page?: number
  page_size?: number
}

export const habitService = {
  getAll: async (): Promise<Habit[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<Habit>>>("/habit/")
    return data.data.results
  },

  getList: async (params: HabitListParams): Promise<PaginatedResponse<Habit>> => {
    const query: Record<string, string | number> = {}
    if (params.dailyStatus) query.daily_status = params.dailyStatus
    if (params.ordering) query.ordering = params.ordering
    if (params.page) query.page = params.page
    if (params.page_size) query.page_size = params.page_size
    const { data } = await apiClient.get<ApiSuccess<PaginatedResponse<Habit>>>("/habit/", { params: query })
    return data.data
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
