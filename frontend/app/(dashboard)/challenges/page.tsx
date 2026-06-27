import type { Metadata } from "next"
import { ChallengesContent } from "@/features/challenges/components/ChallengesContent"

export const metadata: Metadata = {
  title: "Smart Todo",
}

export default function ChallengesPage() {
  return <ChallengesContent />
}
