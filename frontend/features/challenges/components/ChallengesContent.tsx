"use client"

import { useState } from "react"
import {
  useChallenges,
  useCreateChallenge,
  useDeleteChallenge,
  useJoinChallenge,
  useLeaveChallenge,
} from "../hooks/useChallenges"
import { ChallengeForm } from "./ChallengeForm"
import { ChallengeLeaderboard } from "./ChallengeLeaderboard"
import type { Challenge, ChallengeCreatePayload, ChallengeType } from "../types/challenge.types"

const TYPE_CONFIG: Record<ChallengeType, { label: string; style: string }> = {
  task:  { label: "Task",  style: "bg-blue-50 text-blue-700 border border-blue-200" },
  habit: { label: "Habit", style: "bg-purple-50 text-purple-700 border border-purple-200" },
  mixed: { label: "Mixed", style: "bg-[#DCFCE7] text-[#166534] border border-green-200" },
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function ChallengeCard({
  challenge,
  currentUsername,
  onJoin,
  onLeave,
  onDelete,
  onLeaderboard,
  isActing,
}: {
  challenge: Challenge
  currentUsername?: string
  onJoin: (id: number) => void
  onLeave: (id: number) => void
  onDelete: (id: number) => void
  onLeaderboard: (challenge: Challenge) => void
  isActing: boolean
}) {
  const typeCfg = TYPE_CONFIG[challenge.challenge_type]
  const isOwner = currentUsername != null && challenge.owner_username === currentUsername

  const start = formatDate(challenge.start_date)
  const due = formatDate(challenge.due_date)

  return (
    <div className={`bg-white rounded-xl border border-[#E8E0D7] p-4 transition-opacity ${isActing ? "opacity-60 pointer-events-none" : ""}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeCfg.style}`}>
            {typeCfg.label}
          </span>
          {challenge.owner_username && (
            <span className="text-xs text-[#9C8F87]">by {challenge.owner_username}</span>
          )}
        </div>
        {isOwner && (
          <button
            onClick={() => onDelete(challenge.id)}
            className="text-xs text-[#9C8F87] hover:text-[#C55151] transition-colors shrink-0"
          >
            Close
          </button>
        )}
      </div>

      <p className="font-medium text-[#2A2522] text-sm mb-1 leading-snug">{challenge.title}</p>

      {challenge.description && (
        <p className="text-xs text-[#9C8F87] mb-2 line-clamp-2">{challenge.description}</p>
      )}

      {(start || due) && (
        <p className="text-xs text-[#9C8F87] mb-3">
          {start && due ? `${start} → ${due}` : start ?? due}
        </p>
      )}

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onLeaderboard(challenge)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7] transition-colors border border-[#E8E0D7]"
        >
          Leaderboard
        </button>
        <button
          onClick={() => onJoin(challenge.id)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors"
        >
          Join
        </button>
        <button
          onClick={() => onLeave(challenge.id)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-50 text-[#9C8F87] hover:bg-gray-100 transition-colors"
        >
          Leave
        </button>
      </div>
    </div>
  )
}

export function ChallengesContent() {
  const [formOpen, setFormOpen] = useState(false)
  const [leaderboardChallenge, setLeaderboardChallenge] = useState<Challenge | null>(null)

  const { data: challenges = [], isLoading, isError, refetch } = useChallenges()
  const { mutateAsync: createChallenge } = useCreateChallenge()
  const { mutate: deleteChallenge, variables: deletingId } = useDeleteChallenge()
  const { mutate: joinChallenge, variables: joiningId } = useJoinChallenge()
  const { mutate: leaveChallenge, variables: leavingId } = useLeaveChallenge()

  const handleSave = async (payload: ChallengeCreatePayload) => {
    await createChallenge(payload)
  }

  const handleDelete = (id: number) => {
    if (!confirm("Close this challenge? It will be deactivated.")) return
    deleteChallenge(id)
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E8E0D7] p-8 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-[#2A2522] mb-1">Failed to load challenges</p>
          <p className="text-xs text-[#9C8F87] mb-4">Make sure the backend server is running.</p>
          <button onClick={() => refetch()} className="text-sm text-[#16A34A] font-medium hover:text-[#15803D] transition-colors">
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#2A2522]">Challenges</h1>
          {!isLoading && <p className="text-sm text-[#9C8F87] mt-0.5">{challenges.length} active</p>}
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-medium px-4 h-9 rounded-xl transition-colors"
        >
          <PlusIcon /> New challenge
        </button>
      </div>

      {isLoading ? (
        <ChallengesSkeleton />
      ) : challenges.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E0D7] p-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
            <TrophyIcon />
          </div>
          <p className="text-sm font-medium text-[#2A2522] mb-1">No active challenges</p>
          <p className="text-xs text-[#9C8F87] mb-4">Create the first one and invite others.</p>
          <button
            onClick={() => setFormOpen(true)}
            className="text-sm text-[#16A34A] font-medium hover:text-[#15803D] transition-colors"
          >
            Create challenge
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {challenges.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              onJoin={joinChallenge}
              onLeave={leaveChallenge}
              onDelete={handleDelete}
              onLeaderboard={setLeaderboardChallenge}
              isActing={deletingId === c.id || joiningId === c.id || leavingId === c.id}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <ChallengeForm onSave={handleSave} onClose={() => setFormOpen(false)} />
      )}

      {leaderboardChallenge && (
        <ChallengeLeaderboard
          challengeId={leaderboardChallenge.id}
          challengeTitle={leaderboardChallenge.title}
          onClose={() => setLeaderboardChallenge(null)}
        />
      )}
    </div>
  )
}

function ChallengesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#E8E0D7] p-4 animate-pulse">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-16 bg-[#E8E0D7] rounded-full" />
          </div>
          <div className="h-4 w-3/4 bg-[#E8E0D7] rounded mb-2" />
          <div className="h-3 w-1/2 bg-[#E8E0D7] rounded" />
        </div>
      ))}
    </div>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
