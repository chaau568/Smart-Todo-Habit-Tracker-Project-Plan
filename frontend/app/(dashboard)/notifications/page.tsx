import type { Metadata } from "next"
import { NotificationsContent } from "@/features/notifications/components/NotificationsContent"

export const metadata: Metadata = {
  title: "Smart Todo",
}

export default function NotificationsPage() {
  return <NotificationsContent />
}
