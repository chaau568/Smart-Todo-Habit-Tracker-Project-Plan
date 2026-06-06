import axios from "axios"
import { auth } from "@/utils/auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
})

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = auth.getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = auth.getRefreshToken()

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          })
          auth.setTokens(data.access, refreshToken)
          originalRequest.headers.Authorization = `Bearer ${data.access}`
          return apiClient(originalRequest)
        } catch {
          auth.clearTokens()
          window.location.href = "/login"
        }
      } else {
        auth.clearTokens()
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)
