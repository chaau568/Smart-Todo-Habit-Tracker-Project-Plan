"use client"

import { useState } from "react"
import {
  useHabits,
  useCreateHabit,
  useUpdateHabit,
  useDeleteHabit,
  useCheckInHabit,
  useSkipHabit,
} from "../hooks/useHabits"
import { HabitCard } from "./HabitCard"
import { HabitForm } from "./HabitForm"
import { HabitHistory } from "./HabitHistory"
import type { Habit, HabitCreatePayload, HabitStatus, HabitUpdatePayload } from "../types/habit.types"

type FilterStatus = "ALL" | HabitStatus

const FILTER_TABS: { label: string; value: FilterStatus }[] = [
  { label: "All",         value: "ALL" },
  { label: "Pending",     value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Succeeded",   value: "SUCCEEDED" },
  { label: "Failed",      value: "FAILED" },
  { label: "Skipped",     value: "SKIPPED" },
]

export function HabitsContent() {
  const [filter, setFilter] = useState<FilterStatus>("ALL")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [formOpen, setFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [historyHabit, setHistoryHabit] = useState<Habit | null>(null)

  const { data: habits = [], isLoading, isError, refetch } = useHabits()
  const { mutateAsync: createHabit } = useCreateHabit()
  const { mutateAsync: updateHabit } = useUpdateHabit(editingHabit?.id ?? 0)
  const { mutateAsync: deleteHabit, variables: deletingId } = useDeleteHabit()
  const { mutateAsync: checkIn, variables: checkingInId } = useCheckInHabit()
  const { mutateAsync: skipHabit, variables: skippingId } = useSkipHabit()

  const filtered = (filter === "ALL" ? habits : habits.filter((h) => h.status === filter))
    .slice()
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.start_date.localeCompare(b.start_date)
        : b.start_date.localeCompare(a.start_date)
    )

  const openCreate = () => {
    setEditingHabit(null)
    setFormOpen(true)
  }

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingHabit(null)
  }

  const handleSave = async (payload: HabitCreatePayload | HabitUpdatePayload) => {
    if (editingHabit) {
      await updateHabit(payload as HabitUpdatePayload)
    } else {
      await createHabit(payload as HabitCreatePayload)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this habit?")) return
    await deleteHabit(id)
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E8E0D7] p-8 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-[#2A2522] mb-1">Failed to load habits</p>
          <p className="text-xs text-[#9C8F87] mb-4">Make sure the backend server is running.</p>
          <button
            onClick={() => refetch()}
            className="text-sm text-[#16A34A] font-medium hover:text-[#15803D] transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#2A2522]">Habits</h1>
          <p className="text-sm text-[#9C8F87] mt-0.5">{habits.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-medium px-4 h-9 rounded-xl transition-colors"
        >
          <PlusIcon /> New habit
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {FILTER_TABS.map((tab) => {
          const count = tab.value === "ALL"
            ? habits.length
            : habits.filter((h) => h.status === tab.value).length
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                filter === tab.value
                  ? "bg-[#16A34A] text-white"
                  : "bg-white border border-[#E8E0D7] text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4]"
              }`}
            >
              {tab.label}{count > 0 && ` (${count})`}
            </button>
          )
        })}
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs text-[#9C8F87]">Sort by start date:</span>
        <button
          onClick={() => setSortOrder("asc")}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            sortOrder === "asc"
              ? "bg-[#16A34A] text-white"
              : "bg-white border border-[#E8E0D7] text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4]"
          }`}
        >
          Oldest ↑
        </button>
        <button
          onClick={() => setSortOrder("desc")}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            sortOrder === "desc"
              ? "bg-[#16A34A] text-white"
              : "bg-white border border-[#E8E0D7] text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4]"
          }`}
        >
          Newest ↓
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <HabitsSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter} onNew={openCreate} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={openEdit}
              onDelete={handleDelete}
              onCheckIn={(id) => checkIn(id)}
              onSkip={(id) => skipHabit(id)}
              onViewHistory={setHistoryHabit}
              isLoading={
                deletingId === habit.id ||
                checkingInId === habit.id ||
                skippingId === habit.id
              }
            />
          ))}
        </div>
      )}

      {/* Form modal */}
      {formOpen && (
        <HabitForm
          habit={editingHabit ?? undefined}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {/* History modal */}
      {historyHabit && (
        <HabitHistory
          habit={historyHabit}
          onClose={() => setHistoryHabit(null)}
        />
      )}
    </div>
  )
}

function HabitsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#E8E0D7] p-4 animate-pulse">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-20 bg-[#E8E0D7] rounded-full" />
          </div>
          <div className="h-4 w-3/4 bg-[#E8E0D7] rounded mb-2" />
          <div className="h-3 w-1/2 bg-[#E8E0D7] rounded" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ filter, onNew }: { filter: FilterStatus; onNew: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D7] p-10 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-[#2A2522] mb-1">
        {filter === "ALL" ? "No habits yet" : `No ${filter.toLowerCase().replace("_", " ")} habits`}
      </p>
      <p className="text-xs text-[#9C8F87] mb-4">
        {filter === "ALL" ? "Build your first habit today." : "Try a different filter."}
      </p>
      {filter === "ALL" && (
        <button
          onClick={onNew}
          className="text-sm text-[#16A34A] font-medium hover:text-[#15803D] transition-colors"
        >
          Create habit
        </button>
      )}
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
