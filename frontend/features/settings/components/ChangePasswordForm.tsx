"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useChangePassword } from "../hooks/useSettings"
import { parseApiError } from "@/utils/api-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const PASSWORD_RULES = [
  { label: "At least 8 characters",                  test: (p: string) => p.length >= 8 },
  { label: "Contains a number",                       test: (p: string) => /\d/.test(p) },
  { label: "Contains a special character (!@#$%...)", test: (p: string) => /[^a-zA-Z0-9\s]/.test(p) },
]

export function ChangePasswordForm() {
  const router = useRouter()
  const { mutate, isPending } = useChangePassword()

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const toggleShow = (field: keyof typeof showPasswords) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))

  const allRulesMet = PASSWORD_RULES.every((r) => r.test(form.new_password))
  const passwordsMatch =
    form.confirm_new_password.length > 0 &&
    form.new_password === form.confirm_new_password
  const canSubmit = form.current_password && allRulesMet && passwordsMatch

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    mutate(form, {
      onSuccess: () => {
        setSuccess(true)
        setForm({ current_password: "", new_password: "", confirm_new_password: "" })
      },
      onError: (err) => {
        const { general, fields } = parseApiError(err)
        setError(
          general ??
            fields["current_password"] ??
            fields["new_password"] ??
            "Failed to change password."
        )
      },
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D7] p-6 sm:p-8 max-w-md">
      {success && (
        <div className="mb-4 rounded-lg bg-[#DCFCE7] border border-[#16A34A]/20 px-4 py-3">
          <p className="text-sm text-[#166534]">Password changed successfully.</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-[#C55151]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current password */}
        <div className="space-y-1.5">
          <Label className="text-[#2A2522] font-medium text-sm">Current password</Label>
          <PasswordInput
            id="current_password"
            placeholder="••••••••"
            value={form.current_password}
            onChange={set("current_password")}
            show={showPasswords.current}
            onToggle={() => toggleShow("current")}
            disabled={isPending}
          />
        </div>

        {/* New password */}
        <div className="space-y-1.5">
          <Label className="text-[#2A2522] font-medium text-sm">New password</Label>
          <PasswordInput
            id="new_password"
            placeholder="••••••••"
            value={form.new_password}
            onChange={set("new_password")}
            show={showPasswords.new}
            onToggle={() => toggleShow("new")}
            disabled={isPending}
          />
          {form.new_password.length > 0 && (
            <ul className="mt-2 space-y-1">
              {PASSWORD_RULES.map((rule) => {
                const met = rule.test(form.new_password)
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      met ? "text-[#166534]" : "text-[#9C8F87]"
                    }`}
                  >
                    {met ? <CheckIcon /> : <DotIcon />}
                    {rule.label}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <Label className="text-[#2A2522] font-medium text-sm">Confirm new password</Label>
          <PasswordInput
            id="confirm_new_password"
            placeholder="••••••••"
            value={form.confirm_new_password}
            onChange={set("confirm_new_password")}
            show={showPasswords.confirm}
            onToggle={() => toggleShow("confirm")}
            disabled={isPending}
          />
          {form.confirm_new_password.length > 0 && !passwordsMatch && (
            <p className="text-xs text-[#C55151]">Passwords do not match.</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending || !canSubmit}
            className="bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl"
          >
            {isPending ? "Saving..." : "Change password"}
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

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PasswordInputProps {
  id: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  show: boolean
  onToggle: () => void
  disabled?: boolean
}

function PasswordInput({ id, placeholder, value, onChange, show, onToggle, disabled }: PasswordInputProps) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="pr-10"
      />
      <button
        type="button"
        onClick={onToggle}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8F87] hover:text-[#2A2522] transition-colors"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
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

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function DotIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
