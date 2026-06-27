import type { Metadata } from "next"
import { HabitsContent } from "@/features/habits/components/HabitsContent"

export const metadata: Metadata = {
  title: "Smart Todo",
}

export default function HabitsPage() {
  return <HabitsContent />
}
