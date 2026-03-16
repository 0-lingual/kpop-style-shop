import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import type { StarWithCount } from "@/types"

export const dynamic = "force-dynamic"

async function getStars(): Promise<StarWithCount[]> {
  return prisma.star.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "asc" },
  })
}

export default async function StarsPage() {
  const stars = await getStars()

  const boyGroups = stars.filter((s) => s.gender === "BOY")
  const girlGroups = stars.filter((s) => s.gender === "GIRL")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-10">
        <h1 className="text-3xl font-serif italic font-bold text-black">Explore Groups</h1>
        <p className="text-sm text-[#888888] mt-2">
          Browse K-Pop idol groups and discover their style
        </p>
      </div>

      {/* 전체 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {stars.map((star) => (
          <Link
            key={star.id}
            href={`/products?starId=${star.id}`}
            className="group block"
          >
            <div className="aspect-square bg-gray-900 relative overflow-hidden mb-3">
              {star.imageUrl ? (
                <Image
                  src={star.imageUrl}
                  alt={star.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-serif italic text-white text-2xl font-bold opacity-40">
                    {star.name[0]}
                  </span>
                </div>
              )}
            </div>
            <p className="font-medium text-black text-sm">{star.name}</p>
            <p className="text-xs text-[#888888] mt-0.5">
              {star.gender === "BOY" ? "BOY GROUP" : "GIRL GROUP"}
            </p>
            <p className="text-xs text-[#888888]">{star._count.products} items</p>
          </Link>
        ))}
      </div>

      {/* 성별 섹션 구분 */}
      {boyGroups.length > 0 && girlGroups.length > 0 && (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/products?gender=BOY"
            className="group block bg-gray-900 p-8 text-white hover:bg-black transition-colors"
          >
            <p className="text-xs tracking-widest text-gray-400 mb-3">BOY GROUPS</p>
            <p className="font-serif italic text-3xl font-bold mb-2">Shop Men&apos;s</p>
            <p className="text-sm text-gray-300">
              {boyGroups.map((s) => s.name).join(", ")}
            </p>
            <p className="mt-4 text-sm font-medium group-hover:underline">Browse →</p>
          </Link>
          <Link
            href="/products?gender=GIRL"
            className="group block bg-gray-100 p-8 text-black hover:bg-gray-200 transition-colors"
          >
            <p className="text-xs tracking-widest text-[#888888] mb-3">GIRL GROUPS</p>
            <p className="font-serif italic text-3xl font-bold mb-2">Shop Women&apos;s</p>
            <p className="text-sm text-[#888888]">
              {girlGroups.map((s) => s.name).join(", ")}
            </p>
            <p className="mt-4 text-sm font-medium group-hover:underline">Browse →</p>
          </Link>
        </div>
      )}
    </div>
  )
}
