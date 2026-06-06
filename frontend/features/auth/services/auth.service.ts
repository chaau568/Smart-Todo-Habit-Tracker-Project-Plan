import { apiClient } from "@/services/api.client"
import type { ApiSuccess } from "@/types/api.types"
import type {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RegisterResponse,
} from "../types/auth.types"

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiSuccess<LoginResponse>>(
      "/user/login/",
      payload
    )
    return data.data
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<ApiSuccess<RegisterResponse>>(
      "/user/register/",
      payload
    )
    return data.data
  },
}
