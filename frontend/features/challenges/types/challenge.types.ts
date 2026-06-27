export type ChallengeType = "task" | "habit" | "mixed"

export interface Challenge {
  id: number
  title: string
  description: string | null
  challenge_type: ChallengeType
  rules: Record<string, unknown>
  start_date: string | null
  due_date: string | null
  time_periods: number | null
  is_active: boolean
  owner_username: string | null
  created_at: string
  updated_at: string
}

export interface ChallengeParticipantUser {
  id: number
  username: string | null
}

export interface ChallengeParticipant {
  id: number
  user: ChallengeParticipantUser
  score: number
  joined_at: string
}

export interface ChallengeCreatePayload {
  title: string
  description?: string
  challenge_type: ChallengeType
  rules?: Record<string, unknown>
  start_date?: string | null
  due_date?: string | null
  time_periods?: number | null
}
