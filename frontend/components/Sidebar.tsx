"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { auth } from "@/utils/auth"
import { useSidebar } from "./SidebarContext"

const NAV_ITEMS = [
  { label: "Dashboard",     href: "/dashboard",      icon: DashboardIcon },
  { label: "Tasks",         href: "/tasks",           icon: TasksIcon },
  { label: "Habits",        href: "/habits",          icon: HabitsIcon },
  { label: "Achievements",  href: "/achievements",    icon: AchievementsIcon },
  { label: "Challenges",    href: "/challenges",      icon: ChallengesIcon },
  { label: "Notifications", href: "/notifications",   icon: NotificationsIcon },
  { label: "Settings",      href: "/settings",        icon: SettingsIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, toggle, closeMobile } = useSidebar()

  const handleLogout = () => {
    auth.clearTokens()
    router.push("/login")
  }

  return (
    <aside
      className={`shrink-0 flex flex-col border-r border-[#E8E0D7] bg-[#F0FDF4] min-h-screen sticky top-0 transition-all duration-200 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Header — collapsed: S icon (acts as expand btn) | expanded: logo + text + arrow */}
      <div className="border-b border-[#E8E0D7] flex items-center px-3 py-[18px]">
        {isCollapsed ? (
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center mx-auto hover:bg-[#15803D] transition-colors"
            aria-label="Expand sidebar"
          >
            <span className="text-white text-xs font-semibold">S</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5 w-full">
            <div className="w-7 h-7 rounded-lg bg-[#16A34A] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-semibold">S</span>
            </div>
            <span className="font-semibold text-[#2A2522] text-sm flex-1 truncate">Smart Todo</span>
            <button
              onClick={toggle}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#2A2522] hover:bg-white/70 transition-colors shrink-0"
              aria-label="Collapse sidebar"
            >
              <ChevronLeftIcon />
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-xl text-sm transition-colors ${
                isCollapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
              } ${
                isActive
                  ? "bg-white text-[#2A2522] font-medium shadow-sm"
                  : "text-[#9C8F87] hover:text-[#2A2522] hover:bg-white/70"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-[#E8E0D7]">
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Sign out" : undefined}
          className={`w-full flex items-center gap-3 rounded-xl text-sm text-[#9C8F87] hover:text-[#C55151] hover:bg-red-50/80 transition-colors ${
            isCollapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
          }`}
        >
          <SignOutIcon className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}

// ─── Mobile variants ─────────────────────────────────────────────────────────

export function MobileSidebarOverlay() {
  const { isMobileOpen, closeMobile } = useSidebar()
  if (!isMobileOpen) return null
  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 md:hidden"
      onClick={closeMobile}
      aria-hidden
    />
  )
}

export function MobileSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobileOpen, closeMobile } = useSidebar()

  const handleLogout = () => {
    auth.clearTokens()
    router.push("/login")
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-[#E8E0D7] bg-[#F0FDF4] transition-transform duration-200 md:hidden ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="px-4 py-[18px] border-b border-[#E8E0D7] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#16A34A] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">S</span>
          </div>
          <span className="font-semibold text-[#2A2522] text-sm">Smart Todo</span>
        </div>
        <button
          onClick={closeMobile}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#2A2522] hover:bg-white/70 transition-colors"
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-white text-[#2A2522] font-medium shadow-sm"
                  : "text-[#9C8F87] hover:text-[#2A2522] hover:bg-white/70"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[#E8E0D7]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9C8F87] hover:text-[#C55151] hover:bg-red-50/80 transition-colors"
        >
          <SignOutIcon className="w-4 h-4 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function TasksIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function HabitsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function AchievementsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}

function ChallengesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function NotificationsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function SignOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
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
