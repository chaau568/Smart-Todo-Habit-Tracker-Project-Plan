import { apiClient } from "@/services/api.client"
import type { ApiSuccess } from "@/types/api.types"
import type { DashboardData } from "../types/tracking.types"

export const trackingService = {
  getDashboard: async (): Promise<DashboardData> => {
    const { data } = await apiClient.get<ApiSuccess<DashboardData>>(
      "/tracking/dashboard/"
    )
    return data.data
  },
}
