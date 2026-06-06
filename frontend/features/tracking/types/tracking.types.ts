export interface ScoreBreakdown {
  task_rate: number
  habit_rate: number
  streak_bonus: number
}

export interface TaskMetrics {
  total: number
  succeeded: number
  failed: number
  in_progress: number
  pending: number
  completion_rate: number
}

export interface HabitMetrics {
  total: number
  max_streak: number
  current_streak: number
  total_succeeded: number
  completion_rate: number
}

export interface DashboardData {
  productivity_score: number
  score_breakdown: ScoreBreakdown
  tasks: TaskMetrics
  habits: HabitMetrics
}
