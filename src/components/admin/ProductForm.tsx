'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Star {
  id: string
  name: string
}

interface ImageEntry {
  url: string
  type: 'STAR_WEARING' | 'PRODUCT'
  order: number
  preview?: string
  file?: File
}

interface ProductFormProps {
  initialData?: {
    name: string
    description: string
    price: number
    starId: string
    starWearingImages: { url: string; order: number }[]
    productImages: { url: string; order: number }[]
  }
  productId?: string
}

export default function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!productId

  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [price, setPrice] = useState(initialData?.price?.toString() ?? '')
  const [starId, setStarId] = useState(initialData?.starId ?? '')
  const [stars, setStars] = useState<Star[]>([])

  const [starWearingImages, setStarWearingImages] = useState<ImageEntry[]>(
    initialData?.starWearingImages.map((img, i) => ({
      url: img.url,
      type: 'STAR_WEARING' as const,
      order: i,
      preview: img.url,
    })) ?? []
  )

  const [productImages, setProductImages] = useState<ImageEntry[]>(
    initialData?.productImages.map((img, i) => ({
      url: img.url,
      type: 'PRODUCT' as const,
      order: i,
      preview: img.url,
    })) ?? []
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/stars')
      .then((r) => r.json())
      .then((data: Star[]) => setStars(data))
      .catch(() => {})
  }, [])

  function handleImageFiles(
    files: FileList,
    type: 'STAR_WEARING' | 'PRODUCT',
    maxCount: number,
    current: ImageEntry[],
    setter: (imgs: ImageEntry[]) => void
  ) {
    const remaining = maxCount - current.length
    const selected = Array.from(files).slice(0, remaining)
    const newEntries: ImageEntry[] = selected.map((file, i) => ({
      url: '',
      type,
      order: current.length + i,
      preview: URL.createObjectURL(file),
      file,
    }))
    setter([...current, ...newEntries])
  }

  function removeImage(
    index: number,
    list: ImageEntry[],
    setter: (imgs: ImageEntry[]) => void
  ) {
    const updated = list.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }))
    setter(updated)
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Image upload failed')
    const data = await res.json()
    return data.url as string
  }

  async function resolveImages(list: ImageEntry[]): Promise<{ url: string; type: 'STAR_WEARING' | 'PRODUCT'; order: number }[]> {
    return Promise.all(
      list.map(async (img, i) => {
        const url = img.file ? await uploadImage(img.file) : img.url
        return { url, type: img.type, order: i }
      })
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const resolvedStarWearing = await resolveImages(starWearingImages)
      const resolvedProduct = await resolveImages(productImages)
      const allImages = [...resolvedStarWearing, ...resolvedProduct]

      const payload = {
        name,
        description: description || undefined,
        price: parseFloat(price),
        starId,
        images: allImages,
      }

      const res = isEdit
        ? await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to save product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {/* Star */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Star *</label>
        <select
          value={starId}
          onChange={(e) => setStarId(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
        >
          <option value="">-- Select Star --</option>
          {stars.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="1"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 resize-none"
        />
      </div>

      {/* Star Wearing Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wearing Photos <span className="text-gray-400 font-normal">(max 3)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {starWearingImages.map((img, i) => (
            <div key={i} className="relative w-20 h-20">
              <Image
                src={img.preview ?? img.url}
                alt={`wearing-${i}`}
                fill
                className="object-cover rounded border border-gray-200"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeImage(i, starWearingImages, setStarWearingImages)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {starWearingImages.length < 3 && (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                handleImageFiles(e.target.files, 'STAR_WEARING', 3, starWearingImages, setStarWearingImages)
                e.target.value = ''
              }
            }}
            className="block text-sm text-gray-600"
          />
        )}
      </div>

      {/* Product Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Photos <span className="text-gray-400 font-normal">(max 5)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {productImages.map((img, i) => (
            <div key={i} className="relative w-20 h-20">
              <Image
                src={img.preview ?? img.url}
                alt={`product-${i}`}
                fill
                className="object-cover rounded border border-gray-200"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeImage(i, productImages, setProductImages)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {productImages.length < 5 && (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                handleImageFiles(e.target.files, 'PRODUCT', 5, productImages, setProductImages)
                e.target.value = ''
              }
            }}
            className="block text-sm text-gray-600"
          />
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white text-sm px-5 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="bg-gray-100 text-gray-700 text-sm px-5 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
