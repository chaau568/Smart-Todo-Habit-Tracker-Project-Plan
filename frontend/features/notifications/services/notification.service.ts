import { apiClient } from "@/services/api.client"
import type { ApiSuccess, ListResponse, PaginatedResponse } from "@/types/api.types"
import type { Notification } from "../types/notification.types"

export interface NotificationListParams {
  page?: number
  page_size?: number
}

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<Notification>>>("/notification/")
    return data.data.results
  },

  getList: async (params: NotificationListParams): Promise<PaginatedResponse<Notification>> => {
    const query: Record<string, number> = {}
    if (params.page) query.page = params.page
    if (params.page_size) query.page_size = params.page_size
    const { data } = await apiClient.get<ApiSuccess<PaginatedResponse<Notification>>>("/notification/", { params: query })
    return data.data
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await apiClient.get<ApiSuccess<{ unread_count: number }>>("/notification/unread-count/")
    return data.data.unread_count
  },

  markRead: async (id: number): Promise<Notification> => {
    const { data } = await apiClient.patch<ApiSuccess<Notification>>(`/notification/${id}/read/`)
    return data.data
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.post("/notification/read-all/")
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/notification/${id}/`)
  },
}
