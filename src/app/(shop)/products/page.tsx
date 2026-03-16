import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { prisma } from "@/lib/db"
import type { StarWithCount, ProductWithRelations } from "@/types"
import ProductFilters from "@/components/product/ProductFilters"
import type { Gender, Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    starId?: string
    gender?: string
    sort?: string
  }>
}

async function getStars(): Promise<StarWithCount[]> {
  return prisma.star.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })
}

async function getProducts(params: {
  starId?: string
  gender?: string
  sort?: string
}): Promise<ProductWithRelations[]> {
  const where: Prisma.ProductWhereInput = {}

  if (params.starId) {
    where.starId = params.starId
  }

  if (params.gender === "BOY" || params.gender === "GIRL") {
    where.star = { gender: params.gender as Gender }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }
  if (params.sort === "price_asc") orderBy = { price: "asc" }
  if (params.sort === "price_desc") orderBy = { price: "desc" }

  return prisma.product.findMany({
    where,
    include: {
      star: true,
      images: { orderBy: { order: "asc" } },
    },
    orderBy,
  })
}

function ProductCard({ product }: { product: ProductWithRelations }) {
  const productImg = product.images.find((img) => img.type === "PRODUCT")

  return (
    <Link href={`/products/${product.id}`} className="group block">
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
      <p className="text-sm font-medium text-black leading-snug mb-1 line-clamp-2">{product.name}</p>
      <p className="text-sm font-bold text-black">${product.price.toFixed(2)}</p>
    </Link>
  )
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const [stars, products] = await Promise.all([
    getStars(),
    getProducts(params),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif italic font-bold text-black">Products</h1>
        <p className="text-sm text-[#888888] mt-1">{products.length} items</p>
      </div>

      {/* 필터 바 */}
      <Suspense fallback={<div className="h-12 border-b border-[#E0E0E0]" />}>
        <ProductFilters stars={stars} />
      </Suspense>

      {/* 상품 그리드 */}
      <div className="mt-8">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg text-[#888888]">No products found</p>
            <Link
              href="/products"
              className="mt-4 inline-block text-sm text-black underline hover:no-underline"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
