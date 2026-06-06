"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { auth } from "@/utils/auth"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Tasks", href: "/tasks" },
  { label: "Habits", href: "/habits" },
  { label: "Achievements", href: "/achievements" },
  { label: "Challenges", href: "/challenges" },
  { label: "Notifications", href: "/notifications" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    auth.clearTokens()
    router.push("/login")
  }

  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-[#E8E0D7] bg-[#F5F0EB] min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#E8E0D7]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#7B9E87] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">S</span>
          </div>
          <span className="font-semibold text-[#2A2522] text-sm">Smart Todo</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-white text-[#2A2522] font-medium shadow-sm"
                  : "text-[#9C8F87] hover:text-[#2A2522] hover:bg-white/70"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#E8E0D7]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm text-[#9C8F87] hover:text-[#C55151] hover:bg-red-50/80 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
