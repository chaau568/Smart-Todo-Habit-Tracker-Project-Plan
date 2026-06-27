import { apiClient } from "@/services/api.client"
import type { ApiSuccess, ListResponse } from "@/types/api.types"
import type { Category } from "../types/category.types"

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiSuccess<ListResponse<Category>>>("/category/")
    return data.data.results
  },
}
