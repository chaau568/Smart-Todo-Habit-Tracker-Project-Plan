export type HabitStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "SKIPPED"
  | "DELETED"

export interface HabitCategory {
  id: number
  title: string
}

export interface Habit {
  id: number
  title: string
  description: string | null
  category: HabitCategory | null
  status: HabitStatus
  start_date: string
  end_date: string | null
  time_periods: number
  note: string | null
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: number
  completed_date: string
  created_at: string
}

export interface HabitCreatePayload {
  title: string
  description?: string
  category?: number | null
  start_date: string
  end_date?: string | null
  time_periods?: number
}

export interface HabitUpdatePayload {
  title?: string
  description?: string
  category?: number | null
  start_date?: string
  end_date?: string | null
  time_periods?: number
  note?: string
}
