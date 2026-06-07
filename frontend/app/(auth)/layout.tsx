export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 py-8 sm:px-6">
      {children}
    </div>
  )
}
