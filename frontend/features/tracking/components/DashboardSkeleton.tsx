function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E8E0D7] p-6 ${className}`}>
      <div className="h-3 w-24 bg-[#E8E0D7] rounded animate-pulse mb-5" />
      <div className="space-y-3">
        <div className="h-6 w-32 bg-[#E8E0D7] rounded animate-pulse" />
        <div className="h-4 w-full bg-[#E8E0D7] rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-[#E8E0D7] rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-[#E8E0D7] rounded animate-pulse" />
      </div>
    </div>
  )
}

function ScoreSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D7] p-6 flex flex-col items-center">
      <div className="h-3 w-28 bg-[#E8E0D7] rounded animate-pulse mb-5" />
      <div className="w-[140px] h-[140px] rounded-full bg-[#E8E0D7] animate-pulse" />
      <div className="h-4 w-20 bg-[#E8E0D7] rounded animate-pulse mt-4" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="h-7 w-36 bg-[#E8E0D7] rounded animate-pulse mb-2" />
        <div className="h-4 w-48 bg-[#E8E0D7] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ScoreSkeleton />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}
