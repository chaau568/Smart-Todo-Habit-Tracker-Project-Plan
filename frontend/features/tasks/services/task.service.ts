import { apiClient } from "@/services/api.client"
import type { ApiSuccess, ListResponse, PaginatedResponse } from "@/types/api.types"
import type { Task, TaskCreatePayload, TaskStatus, TaskUpdatePayload } from "../types/task.types"

export interface TaskListParams {
  status?: TaskStatus
  ordering?: string
  page?: number
  page_size?: number
}

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<Task>>>("/task/")
    return data.data.results
  },

  getList: async (params: TaskListParams): Promise<PaginatedResponse<Task>> => {
    const query: Record<string, string | number> = {}
    if (params.status) query.status = params.status
    if (params.ordering) query.ordering = params.ordering
    if (params.page) query.page = params.page
    if (params.page_size) query.page_size = params.page_size
    const { data } = await apiClient.get<ApiSuccess<PaginatedResponse<Task>>>("/task/", { params: query })
    return data.data
  },

  create: async (payload: TaskCreatePayload): Promise<Task> => {
    const { data } = await apiClient.post<ApiSuccess<Task>>("/task/", payload)
    return data.data
  },

  update: async (id: number, payload: TaskUpdatePayload): Promise<Task> => {
    const { data } = await apiClient.put<ApiSuccess<Task>>(`/task/${id}/`, payload)
    return data.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/task/${id}/`)
  },

  complete: async (id: number): Promise<Task> => {
    const { data } = await apiClient.post<ApiSuccess<Task>>(`/task/${id}/complete/`)
    return data.data
  },

  cancel: async (id: number): Promise<Task> => {
    const { data } = await apiClient.post<ApiSuccess<Task>>(`/task/${id}/cancel/`)
    return data.data
  },

  markInProgress: async (id: number): Promise<Task> => {
    const { data } = await apiClient.post<ApiSuccess<Task>>(`/task/${id}/in-progress/`)
    return data.data
  },
}
