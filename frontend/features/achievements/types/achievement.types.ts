export type AchievementRank = "COMMON" | "RARE" | "EPIC" | "LEGENDARY"
export type AchievementType = "task" | "habit"
export type ConditionMetric = "task_succeeded_count" | "habit_succeeded_count" | "habit_max_streak"
export type ConditionOperator = ">=" | ">" | "=="

export interface AchievementCondition {
  metric: ConditionMetric
  operator: ConditionOperator
  value: number
}

export interface Achievement {
  id: number
  title: string
  description: string
  rank: AchievementRank
  type: AchievementType
  condition: AchievementCondition
  is_active: boolean
  created_at: string
}

export interface UserAchievement {
  id: number
  achievement: Achievement
  unlocked_at: string
}

export interface AchievementCreatePayload {
  title: string
  description: string
  rank: AchievementRank
  type: AchievementType
  condition: AchievementCondition
  is_active?: boolean
}

export interface AchievementUpdatePayload {
  title?: string
  description?: string
  rank?: AchievementRank
  type?: AchievementType
  condition?: AchievementCondition
  is_active?: boolean
}
