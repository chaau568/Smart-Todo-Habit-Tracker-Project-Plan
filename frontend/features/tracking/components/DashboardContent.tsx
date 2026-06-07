"use client"

import { useDashboard } from "../hooks/useDashboard"
import { ProductivityScore } from "./ProductivityScore"
import { ScoreBreakdown } from "./ScoreBreakdown"
import { TaskStats } from "./TaskStats"
import { HabitStats } from "./HabitStats"
import { DashboardSkeleton } from "./DashboardSkeleton"

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#E8E0D7] p-8 sm:p-12 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C55151" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[#2A2522] mb-1">Failed to load dashboard</p>
        <p className="text-xs text-[#9C8F87] mb-4">Make sure the backend server is running.</p>
        <button
          onClick={onRetry}
          className="text-sm text-[#16A34A] font-medium hover:text-[#15803D] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export function DashboardContent() {
  const { data, isLoading, isError, refetch } = useDashboard()

  if (isLoading) return <DashboardSkeleton />
  if (isError || !data) return <ErrorState onRetry={refetch} />

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-[#2A2522]">Dashboard</h1>
        <p className="text-sm text-[#9C8F87] mt-1">{today()}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProductivityScore score={data.productivity_score} />
        <ScoreBreakdown breakdown={data.score_breakdown} />
        <TaskStats tasks={data.tasks} />
        <HabitStats habits={data.habits} />
      </div>
    </div>
  )
}
