"use client"

import { useState } from "react"
import { useProfile } from "@/features/settings/hooks/useSettings"
import { Pagination } from "@/components/Pagination"
import type { PageSize } from "@/components/Pagination"
import {
  useAchievements,
  useMyAchievements,
  useCreateAchievement,
  useUpdateAchievement,
  useDeactivateAchievement,
} from "../hooks/useAchievements"
import { AchievementForm } from "./AchievementForm"
import type {
  Achievement,
  AchievementCreatePayload,
  AchievementRank,
  AchievementType,
  AchievementUpdatePayload,
} from "../types/achievement.types"

type TypeFilter = "all" | AchievementType

const TYPE_TABS: { label: string; value: TypeFilter }[] = [
  { label: "All",   value: "all" },
  { label: "Task",  value: "task" },
  { label: "Habit", value: "habit" },
]

const RANK_STYLES: Record<AchievementRank, { badge: string; border: string; icon: string }> = {
  COMMON:    { badge: "bg-gray-50 text-[#9C8F87] border border-gray-200",       border: "border-gray-200",   icon: "⬜" },
  RARE:      { badge: "bg-blue-50 text-blue-700 border border-blue-200",        border: "border-blue-200",   icon: "🔷" },
  EPIC:      { badge: "bg-purple-50 text-purple-700 border border-purple-200",  border: "border-purple-200", icon: "💜" },
  LEGENDARY: { badge: "bg-amber-50 text-amber-700 border border-amber-200",     border: "border-amber-200",  icon: "⭐" },
}

const TYPE_LABELS: Record<AchievementType, string> = {
  task:  "Task",
  habit: "Habit",
}

const METRIC_LABELS: Record<string, string> = {
  task_succeeded_count:  "Tasks completed",
  habit_succeeded_count: "Habit check-ins",
  habit_max_streak:      "Max streak (days)",
}

function AchievementCard({
  achievement,
  unlocked,
  unlockedAt,
  isAdmin,
  onEdit,
  onDeactivate,
}: {
  achievement: Achievement
  unlocked: boolean
  unlockedAt?: string
  isAdmin: boolean
  onEdit: (a: Achievement) => void
  onDeactivate: (id: number) => void
}) {
  const rank = RANK_STYLES[achievement.rank]
  const { metric, operator, value } = achievement.condition
  const isInactive = !achievement.is_active

  return (
    <div className={`bg-white rounded-xl border p-4 ${rank.border}`}>
      {isAdmin && isInactive && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9C8F87]" />
          <span className="text-xs text-[#9C8F87]">Inactive — hidden from users</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={`flex items-start gap-3 flex-1 min-w-0 transition-opacity ${isInactive ? "opacity-40" : ""}`}>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${
              unlocked ? "bg-[#F0FDF4]" : "bg-[#F9FAFB]"
            }`}
          >
            {unlocked ? rank.icon : "🔒"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${rank.badge}`}>
                {achievement.rank}
              </span>
              <span className="text-xs text-[#9C8F87] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#E8E0D7]">
                {TYPE_LABELS[achievement.type]}
              </span>
            </div>

            <p className="text-sm font-medium text-[#2A2522] leading-snug">{achievement.title}</p>
            <p className="text-xs text-[#9C8F87] mt-0.5 line-clamp-2">{achievement.description}</p>

            <p className="text-xs text-[#9C8F87] mt-1.5">
              {METRIC_LABELS[metric] ?? metric} {operator} {value}
            </p>

            {unlocked && unlockedAt && (
              <p className="text-xs text-[#16A34A] mt-1 font-medium">
                Unlocked{" "}
                {new Date(unlockedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-1 shrink-0">
            <button
              onClick={() => onEdit(achievement)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#16A34A] hover:bg-[#DCFCE7] transition-colors"
              title="Edit"
            >
              <EditIcon />
            </button>
            <button
              onClick={() => onDeactivate(achievement.id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#C55151] hover:bg-red-50 transition-colors"
              title="Deactivate"
            >
              <DeactivateIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function AchievementsContent() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)
  const [formOpen, setFormOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [deactivateTargetId, setDeactivateTargetId] = useState<number | null>(null)

  const { data: profile } = useProfile()
  const isAdmin = profile?.role === "admin"

  const listParams = {
    ...(typeFilter !== "all" ? { type: typeFilter as AchievementType } : {}),
    page,
    page_size: pageSize,
  }

  const { data, isLoading: loadingAll, isError } = useAchievements(listParams)
  const { data: myList = [], isLoading: loadingMy } = useMyAchievements()
  const { mutateAsync: createAchievement } = useCreateAchievement()
  const { mutateAsync: updateAchievement } = useUpdateAchievement(editingAchievement?.id ?? 0)
  const { mutate: deactivate } = useDeactivateAchievement()

  const isLoading = loadingAll || loadingMy
  const results = data?.results ?? []
  const totalPages = data?.total_pages ?? 1
  const totalCount = data?.count ?? 0
  const rankTotals = data?.rank_totals

  const unlockedMap = new Map(myList.map((ua) => [ua.achievement.id, ua.unlocked_at]))
  const unlockedCount = myList.length
  const activeTotal = rankTotals
    ? Object.values(rankTotals).reduce((a, b) => a + b, 0)
    : 0

  const handleTypeFilter = (value: TypeFilter) => {
    setTypeFilter(value)
    setPage(1)
  }

  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size)
    setPage(1)
  }

  const openCreate = () => {
    setEditingAchievement(null)
    setFormOpen(true)
  }

  const openEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingAchievement(null)
  }

  const handleSave = async (payload: AchievementCreatePayload | AchievementUpdatePayload) => {
    if (editingAchievement) {
      await updateAchievement(payload as AchievementUpdatePayload)
    } else {
      await createAchievement(payload as AchievementCreatePayload)
    }
  }

  const confirmDeactivate = () => {
    if (deactivateTargetId !== null) deactivate(deactivateTargetId)
    setDeactivateTargetId(null)
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E8E0D7] p-8 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-[#2A2522] mb-1">Failed to load achievements</p>
          <p className="text-xs text-[#9C8F87]">Make sure the backend server is running.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#2A2522]">Achievements</h1>
          {!isLoading && activeTotal > 0 && (
            <p className="text-sm text-[#9C8F87] mt-0.5">
              {unlockedCount} / {activeTotal} unlocked
            </p>
          )}
        </div>

        {isAdmin && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-medium px-4 h-9 rounded-xl transition-colors"
          >
            <PlusIcon /> New achievement
          </button>
        )}
      </div>

      {/* Admin badge */}
      {isAdmin && (
        <div className="mb-5 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <ShieldIcon />
          <p className="text-xs text-amber-700 font-medium">
            Admin mode — you can create, edit, and deactivate achievements
          </p>
        </div>
      )}

      {/* Progress bar */}
      {!isLoading && activeTotal > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E0D7] p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#2A2522]">Overall progress</span>
            <span className="text-sm font-semibold text-[#16A34A]">
              {Math.round((unlockedCount / activeTotal) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-[#E8E0D7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#16A34A] rounded-full transition-all duration-700"
              style={{ width: `${(unlockedCount / activeTotal) * 100}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3">
            {(["COMMON", "RARE", "EPIC", "LEGENDARY"] as AchievementRank[]).map((r) => {
              const total = rankTotals?.[r] ?? 0
              const done = myList.filter((ua) => ua.achievement.rank === r).length
              if (total === 0) return null
              return (
                <div key={r} className="text-center">
                  <p className="text-xs text-[#9C8F87]">{r}</p>
                  <p className="text-sm font-semibold text-[#2A2522]">{done}/{total}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Type filter tabs */}
      <div className="flex gap-1.5 mb-5">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTypeFilter(tab.value)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              typeFilter === tab.value
                ? "bg-[#16A34A] text-white"
                : "bg-white border border-[#E8E0D7] text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4]"
            }`}
          >
            {tab.label}
            {typeFilter === tab.value && totalCount > 0 && ` (${totalCount})`}
          </button>
        ))}
      </div>

      {/* Achievement grid */}
      {isLoading ? (
        <AchievementsSkeleton />
      ) : results.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E0D7] p-10 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-[#2A2522] mb-1">
            {typeFilter === "all" ? "No achievements available yet" : `No ${typeFilter} achievements`}
          </p>
          <p className="text-xs text-[#9C8F87] mb-4">
            {isAdmin
              ? "Create the first achievement using the button above."
              : "Check back later — achievements are added by admins."}
          </p>
          {isAdmin && typeFilter === "all" && (
            <button
              onClick={openCreate}
              className="text-sm text-[#16A34A] font-medium hover:text-[#15803D] transition-colors"
            >
              Create achievement
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.map((a) => (
            <AchievementCard
              key={a.id}
              achievement={a}
              unlocked={unlockedMap.has(a.id)}
              unlockedAt={unlockedMap.get(a.id)}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onDeactivate={setDeactivateTargetId}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />

      {formOpen && (
        <AchievementForm
          achievement={editingAchievement ?? undefined}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {deactivateTargetId !== null && (
        <DeactivateConfirmDialog
          onConfirm={confirmDeactivate}
          onCancel={() => setDeactivateTargetId(null)}
        />
      )}
    </div>
  )
}

function AchievementsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#E8E0D7] p-4 animate-pulse">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-[#E8E0D7] rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-[#E8E0D7] rounded" />
              <div className="h-3 w-full bg-[#E8E0D7] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DeactivateConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-2xl border border-[#E8E0D7] w-full max-w-xs shadow-xl p-6">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-amber-50 mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[#2A2522] text-center mb-1">
          Deactivate achievement?
        </h3>
        <p className="text-sm text-[#9C8F87] text-center mb-6">
          Achievement นี้จะถูกซ่อนจากผู้ใช้ทุกคน
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl text-sm font-medium bg-gray-100 text-[#2A2522] hover:bg-gray-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

function DeactivateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
