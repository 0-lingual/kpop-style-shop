import type { Star, Product, ProductImage } from "@prisma/client"

export type StarWithCount = Star & {
  _count: {
    products: number
  }
}

export type ProductWithRelations = Product & {
  star: Star
  images: ProductImage[]
}
