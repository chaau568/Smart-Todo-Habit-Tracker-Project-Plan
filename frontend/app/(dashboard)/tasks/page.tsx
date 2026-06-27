import type { Metadata } from "next"
import { TasksContent } from "@/features/tasks/components/TasksContent"

export const metadata: Metadata = {
  title: "Smart Todo",
}

export default function TasksPage() {
  return <TasksContent />
}
