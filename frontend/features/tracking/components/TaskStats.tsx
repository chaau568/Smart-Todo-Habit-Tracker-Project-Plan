import type { TaskMetrics } from "../types/tracking.types"

interface Props {
  tasks: TaskMetrics
}

interface StatRowProps {
  label: string
  value: number
  dot: string
}

function StatRow({ label, value, dot }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
        <span className="text-sm text-[#9C8F87]">{label}</span>
      </div>
      <span className="text-sm font-medium text-[#2A2522]">{value}</span>
    </div>
  )
}

export function TaskStats({ tasks }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D7] p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-medium text-[#9C8F87] uppercase tracking-wide">
            Tasks
          </p>
          <p className="text-2xl font-semibold text-[#2A2522] mt-1">
            {tasks.total}
          </p>
        </div>
        <span className="text-xs font-medium text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
          {tasks.completion_rate}% done
        </span>
      </div>

      <div className="space-y-3 mb-5">
        <StatRow label="Completed" value={tasks.succeeded} dot="#166534" />
        <StatRow label="In progress" value={tasks.in_progress} dot="#4A6FA5" />
        <StatRow label="Pending" value={tasks.pending} dot="#C17F3B" />
        <StatRow label="Failed" value={tasks.failed} dot="#C55151" />
      </div>

      <div className="h-1.5 bg-[#E8E0D7] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#16A34A] rounded-full transition-all duration-700"
          style={{ width: `${tasks.completion_rate}%` }}
        />
      </div>
    </div>
  )
}
