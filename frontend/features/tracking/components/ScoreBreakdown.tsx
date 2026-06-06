import type { ScoreBreakdown as ScoreBreakdownType } from "../types/tracking.types"

interface Props {
  breakdown: ScoreBreakdownType
}

interface BarProps {
  label: string
  value: number
  weight: string
  color: string
}

function BreakdownBar({ label, value, weight, color }: BarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <span className="text-sm text-[#2A2522]">{label}</span>
          <span className="ml-2 text-xs text-[#B5A99F]">× {weight}</span>
        </div>
        <span className="text-sm font-medium text-[#2A2522]">
          {Math.round(value)}%
        </span>
      </div>
      <div className="h-1.5 bg-[#E8E0D7] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export function ScoreBreakdown({ breakdown }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D7] p-6">
      <p className="text-xs font-medium text-[#9C8F87] uppercase tracking-wide mb-5">
        Score Breakdown
      </p>

      <div className="space-y-5">
        <BreakdownBar
          label="Task completion"
          value={breakdown.task_rate}
          weight="0.4"
          color="#7B9E87"
        />
        <BreakdownBar
          label="Habit completion"
          value={breakdown.habit_rate}
          weight="0.4"
          color="#4A6FA5"
        />
        <BreakdownBar
          label="Streak bonus"
          value={breakdown.streak_bonus}
          weight="0.2"
          color="#C17F3B"
        />
      </div>

      <p className="mt-5 text-xs text-[#B5A99F] leading-relaxed">
        Score = (Task × 0.4) + (Habit × 0.4) + (Streak × 0.2)
      </p>
    </div>
  )
}
