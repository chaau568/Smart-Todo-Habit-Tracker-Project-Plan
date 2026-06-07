export interface ProfileData {
  id: number
  email: string
  username: string
  role: "user" | "admin"
  status: "activate" | "deleted" | "suspended"
  created_at: string
}

export interface UpdateUsernamePayload {
  username: string
  current_password: string
}

export interface UpdateEmailPayload {
  email: string
  current_password: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
  confirm_new_password: string
}
