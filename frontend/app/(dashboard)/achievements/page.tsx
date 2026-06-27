import type { Metadata } from "next"
import { AchievementsContent } from "@/features/achievements/components/AchievementsContent"

export const metadata: Metadata = {
  title: "Smart Todo",
}

export default function AchievementsPage() {
  return <AchievementsContent />
}
