export interface LoginPayload {
  identifier: string
  password: string
}

export interface RegisterPayload {
  email: string
  username: string
  password: string
  confirm_password: string
}

export interface LoginResponse {
  id: number
  email: string
  username: string
  role: "user" | "admin"
  status: "activate" | "deleted" | "suspended"
  created_at: string
  access: string
  refresh: string
}

export interface RegisterResponse {
  id: number
  email: string
  username: string
  role: "user" | "admin"
  status: "activate" | "deleted" | "suspended"
  created_at: string
}
