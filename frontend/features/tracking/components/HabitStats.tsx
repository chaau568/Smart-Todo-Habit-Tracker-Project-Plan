import type { HabitMetrics } from "../types/tracking.types"

interface Props {
  habits: HabitMetrics
}

interface StatRowProps {
  label: string
  value: number | string
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#9C8F87]">{label}</span>
      <span className="text-sm font-medium text-[#2A2522]">{value}</span>
    </div>
  )
}

export function HabitStats({ habits }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D7] p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-medium text-[#9C8F87] uppercase tracking-wide">
            Habits
          </p>
          <p className="text-2xl font-semibold text-[#2A2522] mt-1">
            {habits.total}
          </p>
        </div>
        <span className="text-xs font-medium text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
          {habits.completion_rate}% done
        </span>
      </div>

      <div className="mb-5">
        {/* Current streak highlight */}
        <div className="flex items-center gap-3 p-3 bg-[#FBF4EC] rounded-xl mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#C17F3B]/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17F3B" strokeWidth="2">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-[#9C8F87]">Current streak</p>
            <p className="text-lg font-semibold text-[#2A2522]">
              {habits.current_streak}
              <span className="text-xs font-normal text-[#9C8F87] ml-1">days</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <StatRow label="Best streak" value={`${habits.max_streak} days`} />
          <StatRow label="Total check-ins" value={habits.total_succeeded} />
        </div>
      </div>

      <div className="h-1.5 bg-[#E8E0D7] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#4A6FA5] rounded-full transition-all duration-700"
          style={{ width: `${habits.completion_rate}%` }}
        />
      </div>
    </div>
  )
}
