import { apiClient } from "@/services/api.client"
import type { ApiSuccess, ListResponse } from "@/types/api.types"
import type { Task, TaskCreatePayload, TaskUpdatePayload } from "../types/task.types"

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<Task>>>("/task/")
    return data.data.results
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
