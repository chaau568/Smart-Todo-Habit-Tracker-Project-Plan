"use client"

import { useEffect, useState } from "react"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { parseApiError } from "@/utils/api-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { Habit, HabitCreatePayload, HabitUpdatePayload } from "../types/habit.types"

interface HabitFormProps {
  habit?: Habit
  onSave: (payload: HabitCreatePayload | HabitUpdatePayload) => Promise<void>
  onClose: () => void
}

export function HabitForm({ habit, onSave, onClose }: HabitFormProps) {
  const isEdit = !!habit
  const { data: categories = [] } = useCategories()

  const [title, setTitle] = useState(habit?.title ?? "")
  const [description, setDescription] = useState(habit?.description ?? "")
  const [categoryId, setCategoryId] = useState<string>(habit?.category?.id?.toString() ?? "")
  const [startDate, setStartDate] = useState(habit?.start_date ?? "")
  const [endDate, setEndDate] = useState(habit?.end_date ?? "")
  const [timePeriods, setTimePeriods] = useState(habit?.time_periods?.toString() ?? "1")
  const [note, setNote] = useState(habit?.note ?? "")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const canEditNote = isEdit && habit.status === "SUCCEEDED"

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
    if (!startDate) errors.start_date = "Start date is required."
    if (endDate && startDate && endDate < startDate) {
      errors.end_date = "End date must be on or after start date."
    }
    const periods = Number(timePeriods)
    if (!Number.isInteger(periods) || periods < 1) {
      errors.time_periods = "Time periods must be at least 1."
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payload: HabitCreatePayload | HabitUpdatePayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      category: categoryId ? Number(categoryId) : null,
      start_date: startDate,
      end_date: endDate || null,
      time_periods: periods,
      ...(canEditNote && note.trim() ? { note: note.trim() } : {}),
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
      <div className="bg-white rounded-2xl border border-[#E8E0D7] w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D7] sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-base font-semibold text-[#2A2522]">
            {isEdit ? "Edit habit" : "New habit"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {generalError && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-sm text-[#C55151]">{generalError}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="habit-title" className="text-sm font-medium text-[#2A2522]">
              Title <span className="text-[#C55151]">*</span>
            </Label>
            <Input
              id="habit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Habit name"
              disabled={isSaving}
              className={fieldErrors.title ? "border-[#C55151]" : ""}
            />
            {fieldErrors.title && <p className="text-xs text-[#C55151]">{fieldErrors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="habit-desc" className="text-sm font-medium text-[#2A2522]">
              Description
            </Label>
            <textarea
              id="habit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes..."
              rows={2}
              disabled={isSaving}
              className="w-full rounded-xl border border-[#E8E0D7] px-3 py-2 text-sm text-[#2A2522] placeholder:text-[#9C8F87] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] resize-none disabled:opacity-50"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="habit-category" className="text-sm font-medium text-[#2A2522]">
              Category
            </Label>
            <select
              id="habit-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isSaving}
              className="w-full rounded-xl border border-[#E8E0D7] px-3 py-2 text-sm text-[#2A2522] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white disabled:opacity-50"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="habit-start" className="text-sm font-medium text-[#2A2522]">
                Start date <span className="text-[#C55151]">*</span>
              </Label>
              <Input
                id="habit-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isSaving}
                className={fieldErrors.start_date ? "border-[#C55151]" : ""}
              />
              {fieldErrors.start_date && (
                <p className="text-xs text-[#C55151]">{fieldErrors.start_date}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="habit-end" className="text-sm font-medium text-[#2A2522]">
                End date
              </Label>
              <Input
                id="habit-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isSaving}
                className={fieldErrors.end_date ? "border-[#C55151]" : ""}
              />
              {fieldErrors.end_date && (
                <p className="text-xs text-[#C55151]">{fieldErrors.end_date}</p>
              )}
            </div>
          </div>

          {/* Time periods */}
          <div className="space-y-1.5">
            <Label htmlFor="habit-periods" className="text-sm font-medium text-[#2A2522]">
              Times per day
            </Label>
            <Input
              id="habit-periods"
              type="number"
              min={1}
              value={timePeriods}
              onChange={(e) => setTimePeriods(e.target.value)}
              disabled={isSaving}
              className={`w-28 ${fieldErrors.time_periods ? "border-[#C55151]" : ""}`}
            />
            {fieldErrors.time_periods && (
              <p className="text-xs text-[#C55151]">{fieldErrors.time_periods}</p>
            )}
          </div>

          {/* Note — only for SUCCEEDED habits in edit mode */}
          {canEditNote && (
            <div className="space-y-1.5">
              <Label htmlFor="habit-note" className="text-sm font-medium text-[#2A2522]">
                Note
              </Label>
              <textarea
                id="habit-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reflection or outcome..."
                rows={2}
                disabled={isSaving}
                className="w-full rounded-xl border border-[#E8E0D7] px-3 py-2 text-sm text-[#2A2522] placeholder:text-[#9C8F87] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] resize-none disabled:opacity-50"
              />
            </div>
          )}

          {/* Footer */}
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
              {isSaving ? "Saving..." : isEdit ? "Save changes" : "Create habit"}
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
