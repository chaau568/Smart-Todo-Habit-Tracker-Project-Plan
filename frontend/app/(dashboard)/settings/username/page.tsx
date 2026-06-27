import type { Metadata } from "next"
import Link from "next/link"
import { ChangeUsernameForm } from "@/features/settings/components/ChangeUsernameForm"

export const metadata: Metadata = {
  title: "Smart Todo",
}

export default function ChangeUsernamePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-sm text-[#9C8F87] hover:text-[#2A2522] transition-colors mb-6"
      >
        <BackArrow />
        Back to Settings
      </Link>
      <h1 className="text-xl sm:text-2xl font-semibold text-[#2A2522] mb-6">Change username</h1>
      <ChangeUsernameForm />
    </div>
  )
}

function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  )
}
