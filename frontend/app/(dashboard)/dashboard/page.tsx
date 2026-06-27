import type { Metadata } from "next"
import { DashboardContent } from "@/features/tracking/components/DashboardContent"

export const metadata: Metadata = {
  title: "Smart Todo",
}

export default function DashboardPage() {
  return <DashboardContent />
}
