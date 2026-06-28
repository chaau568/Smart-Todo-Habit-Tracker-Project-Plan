import { apiClient } from "@/services/api.client"
import type { ApiSuccess, ListResponse, PaginatedResponse } from "@/types/api.types"
import type { Challenge, ChallengeCreatePayload, ChallengeParticipant } from "../types/challenge.types"

export interface ChallengeListParams {
  page?: number
  page_size?: number
}

export const challengeService = {
  getAll: async (): Promise<Challenge[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<Challenge>>>("/challenge/")
    return data.data.results
  },

  getList: async (params: ChallengeListParams): Promise<PaginatedResponse<Challenge>> => {
    const query: Record<string, number> = {}
    if (params.page) query.page = params.page
    if (params.page_size) query.page_size = params.page_size
    const { data } = await apiClient.get<ApiSuccess<PaginatedResponse<Challenge>>>("/challenge/", { params: query })
    return data.data
  },

  create: async (payload: ChallengeCreatePayload): Promise<Challenge> => {
    const { data } = await apiClient.post<ApiSuccess<Challenge>>("/challenge/", payload)
    return data.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/challenge/${id}/`)
  },

  join: async (id: number): Promise<ChallengeParticipant> => {
    const { data } = await apiClient.post<ApiSuccess<ChallengeParticipant>>(`/challenge/${id}/join/`)
    return data.data
  },

  leave: async (id: number): Promise<void> => {
    await apiClient.post(`/challenge/${id}/leave/`)
  },

  getLeaderboard: async (id: number): Promise<{ results: ChallengeParticipant[]; challenge: string }> => {
    const { data } = await apiClient.get<ApiSuccess<{ results: ChallengeParticipant[]; challenge: string }>>(
      `/challenge/${id}/leaderboard/`
    )
    return data.data
  },
}
