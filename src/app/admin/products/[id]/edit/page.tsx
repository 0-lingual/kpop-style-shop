import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const starWearingImages = product.images
    .filter((img: { type: string }) => img.type === 'STAR_WEARING')
    .map((img: { url: string; order: number }) => ({ url: img.url, order: img.order }))

  const productImages = product.images
    .filter((img: { type: string }) => img.type === 'PRODUCT')
    .map((img: { url: string; order: number }) => ({ url: img.url, order: img.order }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm
        productId={id}
        initialData={{
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          starId: product.starId,
          starWearingImages,
          productImages,
        }}
      />
    </div>
  )
}
