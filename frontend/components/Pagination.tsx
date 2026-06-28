"use client"

export const PAGE_SIZES = [10, 25, 50] as const
export type PageSize = (typeof PAGE_SIZES)[number]

interface PaginationProps {
  page: number
  totalPages: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: PageSize) => void
}

export function Pagination({
  page,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (totalCount === 0) return null

  const btnBase =
    "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors"
  const btnActive = "bg-[#16A34A] text-white"
  const btnInactive = "bg-white border border-[#E8E0D7] text-[#9C8F87] hover:text-[#2A2522] hover:bg-[#F0FDF4]"
  const btnDisabled = "bg-white border border-[#E8E0D7] text-[#C4B8B0] cursor-not-allowed"

  return (
    <div className="flex items-center justify-between mt-5">
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#9C8F87]">Per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
          className="text-xs text-[#2A2522] bg-white border border-[#E8E0D7] rounded-lg px-2 h-8 pr-6 appearance-none cursor-pointer hover:bg-[#F0FDF4] transition-colors"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239C8F87' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnInactive}`}
          aria-label="First page"
        >
          «
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnInactive}`}
          aria-label="Previous page"
        >
          ‹
        </button>

        <span className="text-xs text-[#9C8F87] px-2 tabular-nums">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnInactive}`}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnInactive}`}
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  )
}
