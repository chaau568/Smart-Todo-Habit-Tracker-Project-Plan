"use client"

import { useEffect, useState } from "react"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { parseApiError } from "@/utils/api-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { Task, TaskCreatePayload, TaskUpdatePayload } from "../types/task.types"

interface TaskFormProps {
  task?: Task
  onSave: (payload: TaskCreatePayload | TaskUpdatePayload) => Promise<void>
  onClose: () => void
}

export function TaskForm({ task, onSave, onClose }: TaskFormProps) {
  const isEdit = !!task
  const { data: categories = [] } = useCategories()

  const [title, setTitle] = useState(task?.title ?? "")
  const [description, setDescription] = useState(task?.description ?? "")
  const [categoryId, setCategoryId] = useState<string>(task?.category?.id?.toString() ?? "")
  const [startDate, setStartDate] = useState(task?.start_date ?? "")
  const [dueDate, setDueDate] = useState(task?.due_date ?? "")
  const [note, setNote] = useState(task?.note ?? "")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const canEditNote = isEdit && task.status === "SUCCEEDED"

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
    if (!dueDate) errors.due_date = "Due date is required."
    if (startDate && dueDate && startDate > dueDate) {
      errors.due_date = "Due date must be on or after start date."
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payload: TaskCreatePayload | TaskUpdatePayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      category: categoryId ? Number(categoryId) : null,
      start_date: startDate,
      due_date: dueDate,
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
      <div className="bg-white rounded-2xl border border-[#E8E0D7] w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D7]">
          <h2 className="text-base font-semibold text-[#2A2522]">
            {isEdit ? "Edit task" : "New task"}
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
            <Label htmlFor="task-title" className="text-sm font-medium text-[#2A2522]">
              Title <span className="text-[#C55151]">*</span>
            </Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name"
              disabled={isSaving}
              className={fieldErrors.title ? "border-[#C55151]" : ""}
            />
            {fieldErrors.title && <p className="text-xs text-[#C55151]">{fieldErrors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="task-desc" className="text-sm font-medium text-[#2A2522]">
              Description
            </Label>
            <textarea
              id="task-desc"
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
            <Label htmlFor="task-category" className="text-sm font-medium text-[#2A2522]">
              Category
            </Label>
            <select
              id="task-category"
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
              <Label htmlFor="task-start" className="text-sm font-medium text-[#2A2522]">
                Start date <span className="text-[#C55151]">*</span>
              </Label>
              <Input
                id="task-start"
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
              <Label htmlFor="task-due" className="text-sm font-medium text-[#2A2522]">
                Due date <span className="text-[#C55151]">*</span>
              </Label>
              <Input
                id="task-due"
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

          {/* Note — only when editing a SUCCEEDED task */}
          {canEditNote && (
            <div className="space-y-1.5">
              <Label htmlFor="task-note" className="text-sm font-medium text-[#2A2522]">
                Note
              </Label>
              <textarea
                id="task-note"
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
              {isSaving ? "Saving..." : isEdit ? "Save changes" : "Create task"}
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
