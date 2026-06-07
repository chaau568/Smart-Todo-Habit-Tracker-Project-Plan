import { apiClient } from "@/services/api.client"
import type { ApiSuccess } from "@/types/api.types"
import type {
  ProfileData,
  UpdateUsernamePayload,
  UpdateEmailPayload,
  ChangePasswordPayload,
} from "../types/settings.types"

export const settingsService = {
  getProfile: async (): Promise<ProfileData> => {
    const { data } = await apiClient.get<ApiSuccess<ProfileData>>("/user/profile/")
    return data.data
  },

  updateUsername: async (payload: UpdateUsernamePayload): Promise<ProfileData> => {
    const { data } = await apiClient.put<ApiSuccess<ProfileData>>("/user/profile/", payload)
    return data.data
  },

  updateEmail: async (payload: UpdateEmailPayload): Promise<ProfileData> => {
    const { data } = await apiClient.put<ApiSuccess<ProfileData>>("/user/profile/", payload)
    return data.data
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await apiClient.post("/user/change-password/", payload)
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete("/user/delete/")
  },
}
