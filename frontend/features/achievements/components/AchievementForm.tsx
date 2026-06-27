"use client"

import { useEffect, useState } from "react"
import { parseApiError } from "@/utils/api-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type {
  Achievement,
  AchievementCreatePayload,
  AchievementRank,
  AchievementType,
  AchievementUpdatePayload,
  ConditionMetric,
  ConditionOperator,
} from "../types/achievement.types"

interface AchievementFormProps {
  achievement?: Achievement
  onSave: (payload: AchievementCreatePayload | AchievementUpdatePayload) => Promise<void>
  onClose: () => void
}

const METRIC_OPTIONS: { value: ConditionMetric; label: string }[] = [
  { value: "task_succeeded_count", label: "Tasks completed" },
  { value: "habit_succeeded_count", label: "Habit check-ins" },
  { value: "habit_max_streak", label: "Max streak (days)" },
]

const OPERATOR_OPTIONS: { value: ConditionOperator; label: string }[] = [
  { value: ">=", label: "At least (≥)" },
  { value: ">",  label: "More than (>)" },
  { value: "==", label: "Exactly (=)" },
]

export function AchievementForm({ achievement, onSave, onClose }: AchievementFormProps) {
  const isEdit = !!achievement

  const [title, setTitle] = useState(achievement?.title ?? "")
  const [description, setDescription] = useState(achievement?.description ?? "")
  const [rank, setRank] = useState<AchievementRank>(achievement?.rank ?? "COMMON")
  const [type, setType] = useState<AchievementType>(achievement?.type ?? "task")
  const [metric, setMetric] = useState<ConditionMetric>(
    achievement?.condition?.metric ?? "task_succeeded_count"
  )
  const [operator, setOperator] = useState<ConditionOperator>(
    achievement?.condition?.operator ?? ">="
  )
  const [conditionValue, setConditionValue] = useState(
    achievement?.condition?.value?.toString() ?? "1"
  )
  const [isActive, setIsActive] = useState(achievement?.is_active ?? true)

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
    if (!description.trim()) errors.description = "Description is required."
    const numValue = Number(conditionValue)
    if (!Number.isInteger(numValue) || numValue < 1) {
      errors.condition_value = "Value must be a positive integer."
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payload: AchievementCreatePayload | AchievementUpdatePayload = {
      title: title.trim(),
      description: description.trim(),
      rank,
      type,
      condition: { metric, operator, value: numValue },
      is_active: isActive,
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
      <div className="bg-white rounded-2xl border border-[#E8E0D7] w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D7] shrink-0">
          <h2 className="text-base font-semibold text-[#2A2522]">
            {isEdit ? "Edit achievement" : "New achievement"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto">
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {generalError && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-sm text-[#C55151]">{generalError}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="ach-title" className="text-sm font-medium text-[#2A2522]">
              Title <span className="text-[#C55151]">*</span>
            </Label>
            <Input
              id="ach-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Achievement name"
              disabled={isSaving}
              className={fieldErrors.title ? "border-[#C55151]" : ""}
            />
            {fieldErrors.title && <p className="text-xs text-[#C55151]">{fieldErrors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="ach-desc" className="text-sm font-medium text-[#2A2522]">
              Description <span className="text-[#C55151]">*</span>
            </Label>
            <textarea
              id="ach-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="How to unlock this achievement..."
              rows={2}
              disabled={isSaving}
              className={`w-full rounded-xl border px-3 py-2 text-sm text-[#2A2522] placeholder:text-[#9C8F87] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] resize-none disabled:opacity-50 ${
                fieldErrors.description ? "border-[#C55151]" : "border-[#E8E0D7]"
              }`}
            />
            {fieldErrors.description && (
              <p className="text-xs text-[#C55151]">{fieldErrors.description}</p>
            )}
          </div>

          {/* Rank + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ach-rank" className="text-sm font-medium text-[#2A2522]">
                Rank
              </Label>
              <select
                id="ach-rank"
                value={rank}
                onChange={(e) => setRank(e.target.value as AchievementRank)}
                disabled={isSaving}
                className="w-full rounded-xl border border-[#E8E0D7] px-3 py-2 text-sm text-[#2A2522] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white disabled:opacity-50"
              >
                <option value="COMMON">Common</option>
                <option value="RARE">Rare</option>
                <option value="EPIC">Epic</option>
                <option value="LEGENDARY">Legendary</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ach-type" className="text-sm font-medium text-[#2A2522]">
                Type
              </Label>
              <select
                id="ach-type"
                value={type}
                onChange={(e) => setType(e.target.value as AchievementType)}
                disabled={isSaving}
                className="w-full rounded-xl border border-[#E8E0D7] px-3 py-2 text-sm text-[#2A2522] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white disabled:opacity-50"
              >
                <option value="task">Task</option>
                <option value="habit">Habit</option>
              </select>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#2A2522]">Unlock condition</Label>
            <div className="bg-[#F9FAFB] rounded-xl border border-[#E8E0D7] p-3 space-y-3">
              <div className="space-y-1.5">
                <span className="text-xs text-[#9C8F87]">Metric</span>
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value as ConditionMetric)}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-[#E8E0D7] px-3 py-2 text-sm text-[#2A2522] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white disabled:opacity-50"
                >
                  {METRIC_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-xs text-[#9C8F87]">Condition</span>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value as ConditionOperator)}
                    disabled={isSaving}
                    className="w-full rounded-lg border border-[#E8E0D7] px-3 py-2 text-sm text-[#2A2522] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white disabled:opacity-50"
                  >
                    {OPERATOR_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs text-[#9C8F87]">Value</span>
                  <Input
                    type="number"
                    min={1}
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    disabled={isSaving}
                    className={fieldErrors.condition_value ? "border-[#C55151]" : ""}
                  />
                </div>
              </div>
              {fieldErrors.condition_value && (
                <p className="text-xs text-[#C55151]">{fieldErrors.condition_value}</p>
              )}
              {/* Preview */}
              <p className="text-xs text-[#16A34A] font-medium">
                Unlock when:{" "}
                {METRIC_OPTIONS.find((m) => m.value === metric)?.label}{" "}
                {operator} {conditionValue || "?"}
              </p>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive((v) => !v)}
              disabled={isSaving}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors disabled:opacity-50 ${
                isActive ? "bg-[#16A34A]" : "bg-[#E8E0D7]"
              }`}
            >
              <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <Label className="text-sm font-medium text-[#2A2522] cursor-pointer" onClick={() => setIsActive((v) => !v)}>
              Active{" "}
              <span className="text-[#9C8F87] font-normal">
                ({isActive ? "visible to all users" : "hidden from users"})
              </span>
            </Label>
          </div>

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
              {isSaving ? "Saving..." : isEdit ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
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
