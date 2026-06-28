"use client"

import { useState } from "react"
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
  useDeleteNotification,
} from "../hooks/useNotifications"
import { Pagination } from "@/components/Pagination"
import type { PageSize } from "@/components/Pagination"
import type { Notification, NotificationType } from "../types/notification.types"

const TYPE_CONFIG: Record<NotificationType, { label: string; color: string; dot: string }> = {
  task_reminder:        { label: "Task",        color: "text-blue-700 bg-blue-50 border-blue-200",     dot: "#4A6FA5" },
  habit_reminder:       { label: "Habit",       color: "text-purple-700 bg-purple-50 border-purple-200", dot: "#7C3AED" },
  achievement_unlocked: { label: "Achievement", color: "text-amber-700 bg-amber-50 border-amber-200",  dot: "#D97706" },
  challenge_update:     { label: "Challenge",   color: "text-[#166534] bg-[#DCFCE7] border-green-200", dot: "#16A34A" },
}

function NotificationRow({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification
  onMarkRead: (id: number) => void
  onDelete: (id: number) => void
}) {
  const cfg = TYPE_CONFIG[notification.type]

  return (
    <div
      className={`flex gap-4 px-5 py-4 transition-colors ${
        notification.is_read ? "" : "bg-[#F0FDF4]"
      }`}
    >
      {/* Unread dot */}
      <div className="flex items-start pt-1 shrink-0">
        <div
          className={`w-2 h-2 rounded-full mt-0.5 transition-opacity ${
            notification.is_read ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundColor: cfg.dot }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-[#9C8F87]">
            {new Date(notification.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-sm font-medium text-[#2A2522] leading-snug">{notification.title}</p>
        <p className="text-xs text-[#9C8F87] mt-0.5 line-clamp-2">{notification.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!notification.is_read && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#16A34A] hover:bg-[#DCFCE7] transition-colors"
            title="Mark as read"
          >
            <CheckIcon />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#C55151] hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

export function NotificationsContent() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)

  const params = { page, pageSize }

  const { data, isLoading, isError, refetch } = useNotifications(params)
  const notifications = data?.results ?? []
  const totalPages = data?.total_pages ?? 1
  const totalCount = data?.count ?? 0

  const { mutate: markRead } = useMarkRead()
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllRead()
  const { mutate: deleteNotif } = useDeleteNotification()

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size)
    setPage(1)
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E8E0D7] p-8 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-[#2A2522] mb-1">Failed to load notifications</p>
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#2A2522]">Notifications</h1>
          {!isLoading && (
            <p className="text-sm text-[#9C8F87] mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread on this page` : totalCount > 0 ? `${totalCount} total` : "All caught up"}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            disabled={markingAll}
            className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors disabled:opacity-50"
          >
            {markingAll ? "Marking..." : "Mark all read"}
          </button>
        )}
      </div>

      {isLoading ? (
        <NotificationsSkeleton />
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E0D7] p-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
            <BellIcon />
          </div>
          <p className="text-sm font-medium text-[#2A2522] mb-1">No notifications</p>
          <p className="text-xs text-[#9C8F87]">You&apos;re all caught up.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E0D7] overflow-hidden divide-y divide-[#E8E0D7]">
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onMarkRead={markRead}
              onDelete={deleteNotif}
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
    </div>
  )
}

function NotificationsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D7] overflow-hidden divide-y divide-[#E8E0D7]">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4 px-5 py-4 animate-pulse">
          <div className="w-2 h-2 bg-[#E8E0D7] rounded-full mt-2 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-20 bg-[#E8E0D7] rounded" />
            <div className="h-4 w-3/4 bg-[#E8E0D7] rounded" />
            <div className="h-3 w-1/2 bg-[#E8E0D7] rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
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

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}
