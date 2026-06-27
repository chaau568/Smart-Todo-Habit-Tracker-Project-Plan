"use client"

import { useEffect } from "react"
import { useLeaderboard } from "../hooks/useChallenges"

interface ChallengeLeaderboardProps {
  challengeId: number
  challengeTitle: string
  onClose: () => void
}

export function ChallengeLeaderboard({ challengeId, challengeTitle, onClose }: ChallengeLeaderboardProps) {
  const { data, isLoading } = useLeaderboard(challengeId)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  const participants = data?.results ?? []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[#E8E0D7] w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D7]">
          <div>
            <h2 className="text-base font-semibold text-[#2A2522]">Leaderboard</h2>
            <p className="text-xs text-[#9C8F87] mt-0.5 truncate max-w-[200px]">{challengeTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-6 py-4 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-[#E8E0D7] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : participants.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[#9C8F87]">No participants yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {participants.map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                    idx === 0 ? "bg-amber-50 border border-amber-200" :
                    idx === 1 ? "bg-gray-50 border border-gray-200" :
                    idx === 2 ? "bg-orange-50 border border-orange-200" :
                    "bg-white border border-[#E8E0D7]"
                  }`}
                >
                  <span className={`text-sm font-bold w-5 text-center ${
                    idx === 0 ? "text-amber-600" :
                    idx === 1 ? "text-gray-500" :
                    idx === 2 ? "text-orange-600" :
                    "text-[#9C8F87]"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm text-[#2A2522] truncate">
                    {p.user.username ?? `User #${p.user.id}`}
                  </span>
                  <span className="text-sm font-semibold text-[#2A2522]">{p.score} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
