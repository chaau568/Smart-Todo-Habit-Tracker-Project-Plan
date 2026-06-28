"use client"

import { useState } from "react"
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useCompleteTask,
  useCancelTask,
  useMarkTaskInProgress,
} from "../hooks/useTasks"
import { Pagination } from "@/components/Pagination"
import type { PageSize } from "@/components/Pagination"
import { TaskCard } from "./TaskCard"
import { TaskForm } from "./TaskForm"
import type { Task, TaskCreatePayload, TaskStatus, TaskUpdatePayload } from "../types/task.types"

type FilterStatus = "ALL" | TaskStatus

const FILTER_TABS: { label: string; value: FilterStatus }[] = [
  { label: "All",         value: "ALL" },
  { label: "Pending",     value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Succeeded",   value: "SUCCEEDED" },
  { label: "Failed",      value: "FAILED" },
  { label: "Canceled",    value: "CANCELED" },
]

export function TasksContent() {
  const [filter, setFilter] = useState<FilterStatus>("ALL")
  const [ordering, setOrdering] = useState<string>("-created_at")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const params = {
    ...(filter !== "ALL" ? { status: filter as TaskStatus } : {}),
    ordering,
    page,
    page_size: pageSize,
  }

  const { data, isLoading, isError, refetch } = useTasks(params)
  const tasks = data?.results ?? []
  const totalPages = data?.total_pages ?? 1
  const totalCount = data?.count ?? 0

  const { mutateAsync: createTask } = useCreateTask()
  const { mutateAsync: updateTask } = useUpdateTask(editingTask?.id ?? 0)
  const { mutateAsync: deleteTask, variables: deletingId } = useDeleteTask()
  const { mutateAsync: completeTask, variables: completingId } = useCompleteTask()
  const { mutateAsync: cancelTask, variables: cancelingId } = useCancelTask()
  const { mutateAsync: markInProgress, variables: progressingId } = useMarkTaskInProgress()

  const handleFilterChange = (value: FilterStatus) => {
    setFilter(value)
    setPage(1)
  }

  const handleOrderingChange = (value: string) => {
    setOrdering(value)
    setPage(1)
  }

  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size)
    setPage(1)
  }

  const openCreate = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingTask(null)
  }

  const handleSave = async (payload: TaskCreatePayload | TaskUpdatePayload) => {
    if (editingTask) {
      await updateTask(payload as TaskUpdatePayload)
    } else {
      await createTask(payload as TaskCreatePayload)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this task?")) return
    await deleteTask(id)
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E8E0D7] p-8 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-[#2A2522] mb-1">Failed to load tasks</p>
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
          <h1 className="text-xl sm:text-2xl font-semibold text-[#2A2522]">Tasks</h1>
          {!isLoading && (
            <p className="text-sm text-[#9C8F87] mt-0.5">{totalCount} {filter !== "ALL" ? filter.toLowerCase().replace("_", " ") : "total"}</p>
          )}
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-medium px-4 h-9 rounded-xl transition-colors"
        >
          <PlusIcon /> New task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange(tab.value)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              filter === tab.value
                ? "bg-[#16A34A] text-white"
                : "bg-white border border-[#E8E0D7] text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4]"
            }`}
          >
            {tab.label}
            {filter === tab.value && totalCount > 0 && ` (${totalCount})`}
          </button>
        ))}
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs text-[#9C8F87]">Sort by start date:</span>
        <button
          onClick={() => handleOrderingChange("start_date")}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            ordering === "start_date"
              ? "bg-[#16A34A] text-white"
              : "bg-white border border-[#E8E0D7] text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4]"
          }`}
        >
          Oldest ↑
        </button>
        <button
          onClick={() => handleOrderingChange("-start_date")}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            ordering === "-start_date"
              ? "bg-[#16A34A] text-white"
              : "bg-white border border-[#E8E0D7] text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4]"
          }`}
        >
          Newest ↓
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <TasksSkeleton />
      ) : tasks.length === 0 ? (
        <EmptyState filter={filter} onNew={openCreate} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEdit}
              onDelete={handleDelete}
              onComplete={(id) => completeTask(id)}
              onCancel={(id) => cancelTask(id)}
              onMarkInProgress={(id) => markInProgress(id)}
              isLoading={
                deletingId === task.id ||
                completingId === task.id ||
                cancelingId === task.id ||
                progressingId === task.id
              }
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

      {/* Form modal */}
      {formOpen && (
        <TaskForm
          task={editingTask ?? undefined}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  )
}

function TasksSkeleton() {
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
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      </div>
      <p className="text-sm font-medium text-[#2A2522] mb-1">
        {filter === "ALL" ? "No tasks yet" : `No ${filter.toLowerCase().replace("_", " ")} tasks`}
      </p>
      <p className="text-xs text-[#9C8F87] mb-4">
        {filter === "ALL" ? "Create your first task to get started." : "Try a different filter."}
      </p>
      {filter === "ALL" && (
        <button
          onClick={onNew}
          className="text-sm text-[#16A34A] font-medium hover:text-[#15803D] transition-colors"
        >
          Create task
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
