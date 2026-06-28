import { apiClient } from "@/services/api.client"
import type { ApiSuccess, ListResponse, PaginatedResponse } from "@/types/api.types"
import type {
  Achievement,
  AchievementCreatePayload,
  AchievementRank,
  AchievementType,
  AchievementUpdatePayload,
  UserAchievement,
} from "../types/achievement.types"

export interface AchievementListParams {
  type?: AchievementType
  page?: number
  page_size?: number
}

export interface AchievementListResponse extends PaginatedResponse<Achievement> {
  rank_totals: Record<AchievementRank, number>
}

export const achievementService = {
  getAll: async (): Promise<Achievement[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<Achievement>>>("/achievement/")
    return data.data.results
  },

  getList: async (params: AchievementListParams): Promise<AchievementListResponse> => {
    const query: Record<string, string | number> = {}
    if (params.type) query.type = params.type
    if (params.page) query.page = params.page
    if (params.page_size) query.page_size = params.page_size
    const { data } = await apiClient.get<ApiSuccess<AchievementListResponse>>("/achievement/", { params: query })
    return data.data
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
