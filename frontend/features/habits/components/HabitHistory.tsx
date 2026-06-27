"use client"

import { useEffect } from "react"
import { useHabitHistory } from "../hooks/useHabits"
import type { Habit } from "../types/habit.types"

interface HabitHistoryProps {
  habit: Habit
  onClose: () => void
}

export function HabitHistory({ habit, onClose }: HabitHistoryProps) {
  const { data: logs = [], isLoading } = useHabitHistory(habit.id)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[#E8E0D7] w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D7]">
          <div>
            <h2 className="text-base font-semibold text-[#2A2522]">Check-in history</h2>
            <p className="text-xs text-[#9C8F87] mt-0.5 truncate max-w-[200px]">{habit.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-[#E8E0D7] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-3">
                <CalendarIcon />
              </div>
              <p className="text-sm text-[#9C8F87]">No check-ins yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#F0FDF4] border border-[#E8E0D7]"
                >
                  <div className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
                  <span className="text-sm text-[#2A2522]">
                    {new Date(log.completed_date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E0D7]">
          <p className="text-xs text-[#9C8F87] text-center">
            {logs.length} check-in{logs.length !== 1 ? "s" : ""} total
          </p>
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

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
