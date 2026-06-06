"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { authService } from "../services/auth.service"
import { parseApiError } from "@/utils/api-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  { label: "Contains a special character (!@#$%...)", test: (p: string) => /[^a-zA-Z0-9\s]/.test(p) },
]

export function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const { mutate: register, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      router.push("/login?registered=true")
    },
    onError: (error) => {
      const { general, fields } = parseApiError(error)
      setGeneralError(general)
      setFieldErrors(fields)
    },
  })

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (fieldErrors[field]) {
        setFieldErrors((prev) => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      }
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)
    setFieldErrors({})
    register(form)
  }

  const allRulesMet = PASSWORD_RULES.every((r) => r.test(form.password))
  const canSubmit = form.email && form.username && allRulesMet && form.confirm_password

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-[#E8E0D7] p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-[#7B9E87] flex items-center justify-center">
              <span className="text-white text-xs font-semibold">S</span>
            </div>
            <span className="text-sm font-medium text-[#9C8F87]">Smart Todo</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#2A2522]">Create account</h1>
          <p className="text-sm text-[#9C8F87] mt-1">Start your productivity journey</p>
        </div>

        {/* Error */}
        {generalError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-[#C55151]">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[#2A2522] font-medium text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              disabled={isPending}
              className={fieldErrors.email ? "border-[#C55151] focus-visible:ring-[#C55151]" : ""}
            />
            {fieldErrors.email && (
              <p className="text-xs text-[#C55151]">{fieldErrors.email}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-[#2A2522] font-medium text-sm">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="your_username"
              value={form.username}
              onChange={handleChange("username")}
              disabled={isPending}
              className={fieldErrors.username ? "border-[#C55151] focus-visible:ring-[#C55151]" : ""}
            />
            {fieldErrors.username && (
              <p className="text-xs text-[#C55151]">{fieldErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[#2A2522] font-medium text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange("password")}
                disabled={isPending}
                className={`pr-10 ${fieldErrors.password ? "border-[#C55151] focus-visible:ring-[#C55151]" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8F87] hover:text-[#2A2522] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-[#C55151]">{fieldErrors.password}</p>
            )}

            {/* Password requirements */}
            {form.password.length > 0 && (
              <ul className="mt-2 space-y-1">
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(form.password)
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        met ? "text-[#4A7C59]" : "text-[#9C8F87]"
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm_password" className="text-[#2A2522] font-medium text-sm">
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={handleChange("confirm_password")}
                disabled={isPending}
                className={`pr-10 ${
                  fieldErrors.confirm_password
                    ? "border-[#C55151] focus-visible:ring-[#C55151]"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8F87] hover:text-[#2A2522] transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {fieldErrors.confirm_password && (
              <p className="text-xs text-[#C55151]">{fieldErrors.confirm_password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending || !canSubmit}
            className="w-full bg-[#7B9E87] hover:bg-[#6A8E77] text-white font-medium h-10 rounded-xl mt-2"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#F5F0EB] text-center">
          <p className="text-sm text-[#9C8F87]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#7B9E87] font-medium hover:text-[#6A8E77] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
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

function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
