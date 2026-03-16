'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductImage {
  id: string
  url: string
  type: 'STAR_WEARING' | 'PRODUCT'
  order: number
}

interface Star {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  price: number
  star: Star
  images: ProductImage[]
  createdAt: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/products')
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts()
  }, [fetchProducts])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}"을(를) 삭제하시겠습니까?`)) return

    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchProducts()
    } else {
      alert('삭제에 실패했습니다.')
    }
  }

  function getProductImage(images: ProductImage[]) {
    return images.find((img) => img.type === 'PRODUCT') ?? images[0]
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
        >
          New Product
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-sm">No products yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">Image</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">Star</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">Price</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const thumb = getProductImage(product.images)
                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {thumb ? (
                        <div className="relative w-12 h-12">
                          <Image
                            src={thumb.url}
                            alt={product.name}
                            fill
                            className="object-cover rounded border border-gray-200"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-400">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.star.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ₩{product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-sm text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
