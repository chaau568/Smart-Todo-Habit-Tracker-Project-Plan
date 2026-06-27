"use client"

import { useEffect, useState } from "react"
import { parseApiError } from "@/utils/api-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { ChallengeCreatePayload, ChallengeType } from "../types/challenge.types"

interface ChallengeFormProps {
  onSave: (payload: ChallengeCreatePayload) => Promise<void>
  onClose: () => void
}

export function ChallengeForm({ onSave, onClose }: ChallengeFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<ChallengeType>("task")
  const [startDate, setStartDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)
    setFieldErrors({})

    const errors: Record<string, string> = {}
    if (!title.trim()) errors.title = "Title is required."
    if (startDate && dueDate && startDate > dueDate) {
      errors.due_date = "Due date must be on or after start date."
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payload: ChallengeCreatePayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      challenge_type: type,
      start_date: startDate || null,
      due_date: dueDate || null,
    }

    try {
      setIsSaving(true)
      await onSave(payload)
      onClose()
    } catch (err) {
      const { general, fields } = parseApiError(err)
      setGeneralError(general)
      setFieldErrors(fields)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[#E8E0D7] w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D7]">
          <h2 className="text-base font-semibold text-[#2A2522]">New challenge</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {generalError && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-sm text-[#C55151]">{generalError}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ch-title" className="text-sm font-medium text-[#2A2522]">
              Title <span className="text-[#C55151]">*</span>
            </Label>
            <Input
              id="ch-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Challenge name"
              disabled={isSaving}
              className={fieldErrors.title ? "border-[#C55151]" : ""}
            />
            {fieldErrors.title && <p className="text-xs text-[#C55151]">{fieldErrors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ch-desc" className="text-sm font-medium text-[#2A2522]">
              Description
            </Label>
            <textarea
              id="ch-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this challenge about?"
              rows={2}
              disabled={isSaving}
              className="w-full rounded-xl border border-[#E8E0D7] px-3 py-2 text-sm text-[#2A2522] placeholder:text-[#9C8F87] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] resize-none disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ch-type" className="text-sm font-medium text-[#2A2522]">
              Type <span className="text-[#C55151]">*</span>
            </Label>
            <select
              id="ch-type"
              value={type}
              onChange={(e) => setType(e.target.value as ChallengeType)}
              disabled={isSaving}
              className="w-full rounded-xl border border-[#E8E0D7] px-3 py-2 text-sm text-[#2A2522] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white disabled:opacity-50"
            >
              <option value="task">Task</option>
              <option value="habit">Habit</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ch-start" className="text-sm font-medium text-[#2A2522]">
                Start date
              </Label>
              <Input
                id="ch-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ch-due" className="text-sm font-medium text-[#2A2522]">
                Due date
              </Label>
              <Input
                id="ch-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSaving}
                className={fieldErrors.due_date ? "border-[#C55151]" : ""}
              />
              {fieldErrors.due_date && (
                <p className="text-xs text-[#C55151]">{fieldErrors.due_date}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 bg-white border border-[#E8E0D7] text-[#2A2522] hover:bg-[#F0FDF4] h-10 rounded-xl font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white h-10 rounded-xl font-medium"
            >
              {isSaving ? "Creating..." : "Create challenge"}
            </Button>
          </div>
        </form>
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
