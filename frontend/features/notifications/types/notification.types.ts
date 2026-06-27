export type NotificationType =
  | "task_reminder"
  | "habit_reminder"
  | "achievement_unlocked"
  | "challenge_update"

export interface Notification {
  id: number
  title: string
  description: string
  type: NotificationType
  is_read: boolean
  task_id: number | null
  habit_id: number | null
  scheduled_at: string
  sent_at: string | null
  created_at: string
}
