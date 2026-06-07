import { Sidebar, MobileSidebar, MobileSidebarOverlay } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/SidebarContext"
import { BfcacheRefresh } from "@/components/BfcacheRefresh"
import { MobileHeader } from "@/components/MobileHeader"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <BfcacheRefresh />
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile sidebar + overlay */}
        <MobileSidebarOverlay />
        <MobileSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <MobileHeader />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
