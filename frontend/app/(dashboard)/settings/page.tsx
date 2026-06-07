import type { Metadata } from "next"
import { SettingsHub } from "@/features/settings/components/SettingsHub"

export const metadata: Metadata = {
  title: "Settings — Smart Todo",
}

export default function SettingsPage() {
  return <SettingsHub />
}
