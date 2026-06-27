import { apiClient } from "@/services/api.client"
import type { ApiSuccess, ListResponse } from "@/types/api.types"
import type { Achievement, AchievementCreatePayload, AchievementUpdatePayload, UserAchievement } from "../types/achievement.types"

export const achievementService = {
  getAll: async (): Promise<Achievement[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<Achievement>>>("/achievement/")
    return data.data.results
  },

  getMy: async (): Promise<UserAchievement[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<UserAchievement>>>("/achievement/my/")
    return data.data.results
  },

  create: async (payload: AchievementCreatePayload): Promise<Achievement> => {
    const { data } = await apiClient.post<ApiSuccess<Achievement>>("/achievement/", payload)
    return data.data
  },

  update: async (id: number, payload: AchievementUpdatePayload): Promise<Achievement> => {
    const { data } = await apiClient.put<ApiSuccess<Achievement>>(`/achievement/${id}/`, payload)
    return data.data
  },

  deactivate: async (id: number): Promise<void> => {
    await apiClient.delete(`/achievement/${id}/`)
  },
}
