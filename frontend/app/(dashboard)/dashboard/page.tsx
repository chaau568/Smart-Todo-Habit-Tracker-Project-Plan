import type { Metadata } from "next"
import { DashboardContent } from "@/features/tracking/components/DashboardContent"

export const metadata: Metadata = {
  title: "Dashboard — Smart Todo",
}

export default function DashboardPage() {
  return <DashboardContent />
}
