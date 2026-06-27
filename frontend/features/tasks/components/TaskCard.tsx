"use client"

import { useState } from "react"
import type { Task, TaskStatus } from "../types/task.types"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onComplete: (id: number) => void
  onCancel: (id: number) => void
  onMarkInProgress: (id: number) => void
  isLoading?: boolean
}

const STATUS_STYLES: Record<TaskStatus, string> = {
  PENDING:     "bg-amber-50 text-amber-700 border border-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border border-blue-200",
  SUCCEEDED:   "bg-[#DCFCE7] text-[#166534] border border-green-200",
  FAILED:      "bg-red-50 text-[#C55151] border border-red-100",
  CANCELED:    "bg-gray-50 text-[#9C8F87] border border-gray-200",
  DELETED:     "bg-gray-50 text-[#9C8F87] border border-gray-200",
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING:     "Pending",
  IN_PROGRESS: "In Progress",
  SUCCEEDED:   "Succeeded",
  FAILED:      "Failed",
  CANCELED:    "Canceled",
  DELETED:     "Deleted",
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
  onMarkInProgress,
  isLoading,
}: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const canComplete = task.status === "PENDING" || task.status === "IN_PROGRESS"
  const canMarkInProgress = task.status === "PENDING"
  const canCancel = task.status === "PENDING" || task.status === "IN_PROGRESS"

  return (
    <div className={`bg-white rounded-xl border border-[#E8E0D7] p-4 transition-opacity ${isLoading ? "opacity-60 pointer-events-none" : ""}`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
          {task.category && (
            <span className="text-xs text-[#9C8F87] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#E8E0D7]">
              {task.category.title}
            </span>
          )}
        </div>

        {/* 3-dot overflow menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4] transition-colors"
          >
            <DotsIcon />
          </button>

          {menuOpen && (
            <>
              {/* Backdrop — closes menu on outside click */}
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />

              {/* Dropdown */}
              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl border border-[#E8E0D7] shadow-lg py-1 w-36 overflow-hidden">
                <button
                  onClick={() => { setMenuOpen(false); onEdit(task) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#2A2522] hover:bg-[#F0FDF4] transition-colors text-left"
                >
                  <EditIcon /> Edit
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(task.id) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#C55151] hover:bg-red-50 transition-colors text-left"
                >
                  <TrashIcon /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <p className="font-medium text-[#2A2522] text-sm mb-1 leading-snug">{task.title}</p>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-[#9C8F87] mb-2 line-clamp-2">{task.description}</p>
      )}

      {/* Dates */}
      <p className="text-xs text-[#9C8F87] mb-3">
        {formatDate(task.start_date)} → {formatDate(task.due_date)}
      </p>

      {/* Action buttons */}
      {(canComplete || canMarkInProgress || canCancel) && (
        <div className="flex gap-2 flex-wrap">
          {canComplete && (
            <button
              onClick={() => onComplete(task.id)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#DCFCE7] text-[#166534] hover:bg-[#bbf7d0] transition-colors"
            >
              Complete
            </button>
          )}
          {canMarkInProgress && (
            <button
              onClick={() => onMarkInProgress(task.id)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              Start
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => onCancel(task.id)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-50 text-[#9C8F87] hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Note */}
      {task.note && (
        <p className="mt-3 text-xs text-[#9C8F87] italic border-t border-[#E8E0D7] pt-2">
          {task.note}
        </p>
      )}
    </div>
  )
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
