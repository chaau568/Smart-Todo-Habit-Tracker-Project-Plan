"use client"

import Link from "next/link"
import { useProfile } from "../hooks/useSettings"

interface SettingsRowProps {
  href: string
  label: string
  description: string
  icon: React.ReactNode
  danger?: boolean
}

function SettingsRow({ href, label, description, icon, danger = false }: SettingsRowProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-colors group ${
        danger
          ? "hover:bg-red-50 border border-transparent hover:border-red-100"
          : "hover:bg-[#F0FDF4] border border-transparent hover:border-[#DCFCE7]"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          danger
            ? "bg-red-50 text-[#C55151] group-hover:bg-red-100"
            : "bg-[#F0FDF4] text-[#16A34A] group-hover:bg-[#DCFCE7]"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? "text-[#C55151]" : "text-[#2A2522]"}`}>
          {label}
        </p>
        <p className="text-xs text-[#9C8F87] mt-0.5">{description}</p>
      </div>
      <ChevronRightIcon className={danger ? "text-[#C55151]/50" : "text-[#9C8F87]"} />
    </Link>
  )
}

function ProfileCard() {
  const { data: profile, isLoading } = useProfile()

  const initials = profile
    ? (profile.username || profile.email).slice(0, 2).toUpperCase()
    : "??"

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D7] p-6 flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] flex items-center justify-center shrink-0">
        <span className="text-[#16A34A] text-lg font-semibold">{initials}</span>
      </div>
      <div className="min-w-0">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-28 bg-[#E8E0D7] rounded animate-pulse" />
            <div className="h-3 w-40 bg-[#E8E0D7] rounded animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-base font-medium text-[#2A2522] truncate">
              {profile?.username || "—"}
            </p>
            <p className="text-sm text-[#9C8F87] truncate">{profile?.email || "—"}</p>
          </>
        )}
      </div>
    </div>
  )
}

export function SettingsHub() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-semibold text-[#2A2522] mb-6">Settings</h1>

      {/* Profile card */}
      <section className="mb-6">
        <ProfileCard />
      </section>

      {/* Account section */}
      <section className="mb-4">
        <p className="text-xs font-medium text-[#9C8F87] uppercase tracking-wide px-1 mb-2">
          Account
        </p>
        <div className="bg-white rounded-2xl border border-[#E8E0D7] divide-y divide-[#E8E0D7] overflow-hidden">
          <SettingsRow
            href="/settings/username"
            label="Change username"
            description="Update your display name"
            icon={<UserIcon />}
          />
          <SettingsRow
            href="/settings/email"
            label="Change email"
            description="Update your email address"
            icon={<EmailIcon />}
          />
          <SettingsRow
            href="/settings/password"
            label="Change password"
            description="Update your account password"
            icon={<LockIcon />}
          />
        </div>
      </section>

      {/* Danger zone */}
      <section>
        <p className="text-xs font-medium text-[#C55151] uppercase tracking-wide px-1 mb-2">
          Danger zone
        </p>
        <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
          <SettingsRow
            href="/settings/delete-account"
            label="Delete account"
            description="Permanently delete your account and all data"
            icon={<TrashIcon />}
            danger
          />
        </div>
      </section>
    </div>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}
