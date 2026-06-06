"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { authService } from "../services/auth.service"
import { auth } from "@/utils/auth"
import { parseApiError } from "@/utils/api-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get("registered") === "true"

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const { mutate: login, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      auth.setTokens(data.access, data.refresh)
      router.push("/dashboard")
    },
    onError: (error) => {
      const { general, fields } = parseApiError(error)
      setGeneralError(general)
      setFieldErrors(fields)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)
    setFieldErrors({})
    login({ identifier, password })
  }

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
          <h1 className="text-2xl font-semibold text-[#2A2522]">Welcome back</h1>
          <p className="text-sm text-[#9C8F87] mt-1">Sign in to continue your journey</p>
        </div>

        {/* Success message after register */}
        {justRegistered && (
          <div className="mb-4 rounded-lg bg-[#EDF2EE] border border-[#7B9E87]/30 px-4 py-3">
            <p className="text-sm text-[#4A7C59]">Account created! Please sign in.</p>
          </div>
        )}

        {/* Error */}
        {generalError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-[#C55151]">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="identifier" className="text-[#2A2522] font-medium text-sm">
              Email or username
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder="you@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isPending}
              className={fieldErrors.identifier ? "border-[#C55151] focus-visible:ring-[#C55151]" : ""}
            />
            {fieldErrors.identifier && (
              <p className="text-xs text-[#C55151]">{fieldErrors.identifier}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[#2A2522] font-medium text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <Button
            type="submit"
            disabled={isPending || !identifier || !password}
            className="w-full bg-[#7B9E87] hover:bg-[#6A8E77] text-white font-medium h-10 rounded-xl mt-2"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#F5F0EB] text-center">
          <p className="text-sm text-[#9C8F87]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#7B9E87] font-medium hover:text-[#6A8E77] transition-colors"
            >
              Create one
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

function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
