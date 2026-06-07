"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProfile, useUpdateUsername } from "../hooks/useSettings"
import { parseApiError } from "@/utils/api-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function ChangeUsernameForm() {
  const router = useRouter()
  const { data: profile } = useProfile()
  const { mutate, isPending } = useUpdateUsername()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const canSubmit = username.trim() && password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)
    setFieldErrors({})
    setSuccess(false)

    mutate(
      { username: username.trim(), current_password: password },
      {
        onSuccess: () => {
          setSuccess(true)
          setUsername("")
          setPassword("")
        },
        onError: (err) => {
          const { general, fields } = parseApiError(err)
          setGeneralError(general)
          setFieldErrors(fields)
        },
      }
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D7] p-6 sm:p-8 max-w-md">
      <div className="mb-6">
        <p className="text-sm text-[#9C8F87]">
          Current username:{" "}
          <span className="font-medium text-[#2A2522]">{profile?.username ?? "—"}</span>
        </p>
      </div>

      {success && (
        <div className="mb-4 rounded-lg bg-[#DCFCE7] border border-[#16A34A]/20 px-4 py-3">
          <p className="text-sm text-[#166534]">Username updated successfully.</p>
        </div>
      )}

      {generalError && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-[#C55151]">{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-[#2A2522] font-medium text-sm">
            New username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="new_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isPending}
            className={fieldErrors.username ? "border-[#C55151] focus-visible:ring-[#C55151]" : ""}
          />
          {fieldErrors.username && (
            <p className="text-xs text-[#C55151]">{fieldErrors.username}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="current_password" className="text-[#2A2522] font-medium text-sm">
            Confirm with your password
          </Label>
          <div className="relative">
            <Input
              id="current_password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className={`pr-10 ${fieldErrors.current_password ? "border-[#C55151] focus-visible:ring-[#C55151]" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8F87] hover:text-[#2A2522] transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fieldErrors.current_password && (
            <p className="text-xs text-[#C55151]">{fieldErrors.current_password}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending || !canSubmit}
            className="bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl"
          >
            {isPending ? "Saving..." : "Save changes"}
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
      </form>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}
