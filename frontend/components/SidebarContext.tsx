"use client"

import { createContext, useContext, useState } from "react"

interface SidebarContextValue {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggle: () => void
  toggleMobile: () => void
  closeMobile: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggle: () => setIsCollapsed((v) => !v),
        toggleMobile: () => setIsMobileOpen((v) => !v),
        closeMobile: () => setIsMobileOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider")
  return ctx
}
