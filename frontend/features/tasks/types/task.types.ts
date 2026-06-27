export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED"
  | "DELETED"

export interface TaskCategory {
  id: number
  title: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  category: TaskCategory | null
  status: TaskStatus
  start_date: string
  due_date: string
  completed_at: string | null
  note: string | null
  created_at: string
  updated_at: string
}

export interface TaskCreatePayload {
  title: string
  description?: string
  category?: number | null
  start_date: string
  due_date: string
}

export interface TaskUpdatePayload {
  title?: string
  description?: string
  category?: number | null
  start_date?: string
  due_date?: string
  note?: string
}
