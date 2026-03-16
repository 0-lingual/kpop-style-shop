import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import ImageGallery from "@/components/product/ImageGallery"
import { ImageType } from "@prisma/client"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      star: true,
      images: { orderBy: { order: "asc" } },
    },
  })

  if (!product) {
    notFound()
  }

  // 관련 상품 조회 (같은 그룹, 최대 4개)
  const relatedProducts = await prisma.product.findMany({
    where: {
      starId: product.starId,
      NOT: { id: product.id },
    },
    take: 4,
    include: {
      images: { orderBy: { order: "asc" } },
      star: true,
    },
  })

  // 메인 이미지: STAR_WEARING 우선, 없으면 PRODUCT 첫번째
  const starWearingImages = product.images.filter((img) => img.type === ImageType.STAR_WEARING)
  const productImages = product.images.filter((img) => img.type === ImageType.PRODUCT)

  // 갤러리 표시 순서: STAR_WEARING 먼저, 그 다음 PRODUCT
  const galleryImages = [...starWearingImages, ...productImages]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 브레드크럼 */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
          <Link href="/products" className="flex items-center gap-1 hover:text-black transition-colors">
            <span>←</span>
            <span>Products</span>
          </Link>
          <span>/</span>
          <span className="text-black font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* 메인 2컬럼 레이아웃 */}
        <div className="flex gap-12 items-start">
          {/* 왼쪽: 이미지 갤러리 (고정 너비 580px) */}
          <div className="flex-shrink-0 w-[580px]">
            <ImageGallery images={galleryImages} />
          </div>

          {/* 오른쪽: 상품 정보 */}
          <div className="flex-1 min-w-0 pt-2">
            {/* 그룹명 배지 */}
            <span className="inline-block bg-black text-white text-xs font-medium px-3 py-1 tracking-widest uppercase mb-4">
              {product.star.name}
            </span>

            {/* 상품명 */}
            <h1 className="text-4xl font-serif italic text-black leading-tight mb-4">
              {product.name}
            </h1>

            {/* 가격 */}
            <p className="text-3xl font-bold text-black mb-6">
              ${product.price.toFixed(2)}
            </p>

            {/* 구매하기 버튼 */}
            <button
              onClick={undefined}
              type="button"
              className="w-full h-14 bg-black text-white font-medium text-base tracking-wide hover:bg-gray-900 transition-colors cursor-not-allowed"
              title="준비 중입니다"
              disabled
            >
              Buy Now — Coming Soon
            </button>

            <hr className="my-8 border-gray-200" />

            {/* 상품 설명 */}
            {product.description && (
              <>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                    Description
                  </p>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
                <hr className="my-8 border-gray-200" />
              </>
            )}

            {/* View all 링크 */}
            <Link
              href={`/products?starId=${product.starId}`}
              className="text-sm font-medium text-black hover:underline transition-all"
            >
              View all {product.star.name} items →
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-serif italic text-black mb-8">
              More from {product.star.name}
            </h2>
            <div className="grid grid-cols-4 gap-6">
              {relatedProducts.map((related) => {
                const mainImg =
                  related.images.find((img) => img.type === ImageType.STAR_WEARING) ??
                  related.images[0]

                return (
                  <Link
                    key={related.id}
                    href={`/products/${related.id}`}
                    className="group block"
                  >
                    {/* 상품 이미지 */}
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                      {mainImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mainImg.url}
                          alt={related.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    {/* 상품 정보 */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{related.star.name}</p>
                      <p className="text-sm font-medium text-black leading-snug mb-1 group-hover:underline">
                        {related.name}
                      </p>
                      <p className="text-sm font-bold text-black">${related.price.toFixed(2)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
