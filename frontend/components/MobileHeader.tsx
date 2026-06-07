"use client"

import { useSidebar } from "./SidebarContext"

export function MobileHeader() {
  const { toggleMobile } = useSidebar()

  return (
    <header className="flex items-center gap-3 px-4 py-4 border-b border-[#E8E0D7] bg-white md:hidden">
      <button
        onClick={toggleMobile}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4] transition-colors"
        aria-label="Open menu"
      >
        <HamburgerIcon />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[#16A34A] flex items-center justify-center">
          <span className="text-white text-[10px] font-semibold">S</span>
        </div>
        <span className="text-sm font-semibold text-[#2A2522]">Smart Todo</span>
      </div>
    </header>
  )
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}
