"use client"

import { useRouter, useSearchParams } from "next/navigation"
import type { StarWithCount } from "@/types"

interface ProductFiltersProps {
  stars: StarWithCount[]
}

export default function ProductFilters({ stars }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStarId = searchParams.get("starId") ?? ""
  const currentGender = searchParams.get("gender") ?? ""
  const currentSort = searchParams.get("sort") ?? "newest"

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  const genderOptions = [
    { label: "All", value: "" },
    { label: "Boy Group", value: "BOY" },
    { label: "Girl Group", value: "GIRL" },
  ]

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
  ]

  return (
    <div className="flex flex-wrap gap-4 items-center py-4 border-b border-[#E0E0E0]">
      {/* Group 드롭다운 */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-[#888888] whitespace-nowrap">Group</label>
        <select
          value={currentStarId}
          onChange={(e) => updateFilter("starId", e.target.value)}
          className="border border-[#E0E0E0] text-sm px-3 py-1.5 bg-white focus:outline-none focus:border-black min-w-[140px]"
        >
          <option value="">All Groups</option>
          {stars.map((star) => (
            <option key={star.id} value={star.id}>
              {star.name}
            </option>
          ))}
        </select>
      </div>

      {/* Gender 버튼 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#888888]">Gender</span>
        <div className="flex gap-1">
          {genderOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("gender", opt.value)}
              className={`px-3 py-1.5 text-sm border transition-colors ${
                currentGender === opt.value
                  ? "border-black bg-black text-white"
                  : "border-[#E0E0E0] text-black hover:border-black"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort 드롭다운 */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm text-[#888888] whitespace-nowrap">Sort by</label>
        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="border border-[#E0E0E0] text-sm px-3 py-1.5 bg-white focus:outline-none focus:border-black min-w-[180px]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
