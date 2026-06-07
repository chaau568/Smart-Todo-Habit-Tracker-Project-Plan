"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDeleteAccount } from "../hooks/useSettings"
import { auth } from "@/utils/auth"
import { parseApiError } from "@/utils/api-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const CONFIRM_PHRASE = "delete my account"

export function DeleteAccountSection() {
  const router = useRouter()
  const { mutate, isPending } = useDeleteAccount()

  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState<string | null>(null)

  const isConfirmed = confirmText === CONFIRM_PHRASE

  const handleDelete = () => {
    setError(null)
    mutate(undefined, {
      onSuccess: () => {
        auth.clearTokens()
        router.push("/login")
      },
      onError: (err) => {
        const { general } = parseApiError(err)
        setError(general ?? "Failed to delete account. Please try again.")
      },
    })
  }

  return (
    <div className="space-y-4 max-w-md">
      {/* Warning card */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <WarningIcon />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800 mb-1">This action is permanent</p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>All tasks and habits will be deleted</li>
              <li>Your achievements and progress will be lost</li>
              <li>This cannot be undone</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation */}
      <div className="bg-white rounded-2xl border border-[#E8E0D7] p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-[#C55151]">{error}</p>
          </div>
        )}

        <div className="space-y-1.5 mb-5">
          <Label className="text-[#2A2522] font-medium text-sm">
            Type{" "}
            <code className="px-1.5 py-0.5 bg-[#F0FDF4] text-[#166534] rounded text-xs font-mono">
              {CONFIRM_PHRASE}
            </code>{" "}
            to confirm
          </Label>
          <Input
            type="text"
            placeholder={CONFIRM_PHRASE}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isPending}
            className={isConfirmed ? "border-red-300 focus-visible:ring-red-300" : ""}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isPending || !isConfirmed}
            className="bg-[#C55151] hover:bg-[#A04040] text-white rounded-xl disabled:opacity-40"
          >
            {isPending ? "Deleting..." : "Delete my account"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/settings")}
            className="border-[#E8E0D7] text-[#6B5E54] hover:bg-[#F0FDF4] rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
