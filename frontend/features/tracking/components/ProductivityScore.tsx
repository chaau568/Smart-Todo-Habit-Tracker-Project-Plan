interface Props {
  score: number
}

function scoreLabel(score: number): { text: string; color: string } {
  if (score >= 80) return { text: "Excellent", color: "#4A7C59" }
  if (score >= 60) return { text: "Good progress", color: "#7B9E87" }
  if (score >= 40) return { text: "Getting there", color: "#C17F3B" }
  return { text: "Needs work", color: "#C55151" }
}

function scoreColor(score: number): string {
  if (score >= 80) return "#4A7C59"
  if (score >= 60) return "#7B9E87"
  if (score >= 40) return "#C17F3B"
  return "#C55151"
}

export function ProductivityScore({ score }: Props) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - Math.min(score / 100, 1))
  const { text, color } = scoreLabel(score)

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D7] p-6 flex flex-col items-center">
      <p className="text-xs font-medium text-[#9C8F87] uppercase tracking-wide mb-5">
        Productivity Score
      </p>

      <div className="relative w-[140px] h-[140px]">
        <svg
          viewBox="0 0 140 140"
          className="w-full h-full -rotate-90"
        >
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="#E8E0D7"
            strokeWidth="10"
          />
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={scoreColor(score)}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold text-[#2A2522]">
            {Math.round(score)}
          </span>
          <span className="text-xs text-[#9C8F87]">/ 100</span>
        </div>
      </div>

      <span className="mt-4 text-sm font-medium" style={{ color }}>
        {text}
      </span>
    </div>
  )
}
