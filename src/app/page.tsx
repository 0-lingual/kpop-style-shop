import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import type { StarWithCount, ProductWithRelations } from "@/types"
import HeroBanner from "@/components/layout/HeroBanner"

export const dynamic = "force-dynamic"

async function getStars(): Promise<StarWithCount[]> {
  return prisma.star.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    take: 5,
    orderBy: { createdAt: "asc" },
  })
}

async function getNewArrivals(): Promise<ProductWithRelations[]> {
  return prisma.product.findMany({
    include: {
      star: true,
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  })
}

export default async function Home() {
  const [stars, newArrivals] = await Promise.all([getStars(), getNewArrivals()])

  return (
    <main>
      {/* 히어로 섹션 */}
      <HeroBanner />

      {/* Featured Groups 섹션 */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif italic font-bold text-black">Featured Groups</h2>
            <Link href="/stars" className="text-sm text-gray-500 hover:text-black transition-colors">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
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
                      <span className="font-serif italic text-white text-xl font-bold opacity-40">
                        {star.name[0]}
                      </span>
                    </div>
                  )}
                </div>
                <p className="font-medium text-black text-sm">{star.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 font-medium ${
                      star.gender === "BOY"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-pink-50 text-pink-600"
                    }`}
                  >
                    {star.gender === "BOY" ? "BOY" : "GIRL"}
                  </span>
                  <span className="text-xs text-[#888888]">{star._count.products} items</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals 섹션 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif italic font-bold text-black">New Arrivals</h2>
            <Link href="/products?sort=newest" className="text-sm text-gray-500 hover:text-black transition-colors">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => {
              const productImg = product.images.find((img) => img.type === "PRODUCT")
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden mb-3">
                    {productImg ? (
                      <Image
                        src={productImg.url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-300 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#888888] mb-1">{product.star.name}</p>
                  <p className="text-sm font-medium text-black leading-snug mb-1 line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-black">${product.price.toFixed(2)}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
