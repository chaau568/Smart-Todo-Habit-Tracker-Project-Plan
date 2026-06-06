export interface ApiSuccess<T> {
  success: true
  data: T
  message: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string | Record<string, string[]>
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface ListResponse<T> {
  results: T[]
  count: number
}
