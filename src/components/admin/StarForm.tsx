'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface StarFormProps {
  initialData?: {
    name: string
    gender: 'BOY' | 'GIRL'
    imageUrl: string
  }
  starId?: string
}

export default function StarForm({ initialData, starId }: StarFormProps) {
  const router = useRouter()
  const isEdit = !!starId

  const [name, setName] = useState(initialData?.name ?? '')
  const [gender, setGender] = useState<'BOY' | 'GIRL'>(initialData?.gender ?? 'BOY')
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Image upload failed')
    const data = await res.json()
    return data.url as string
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let finalImageUrl = imageUrl

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile)
      }

      const payload = { name, gender, imageUrl: finalImageUrl || undefined }

      const res = isEdit
        ? await fetch(`/api/stars/${starId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/stars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to save star')
      }

      router.push('/admin/stars')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as 'BOY' | 'GIRL')}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
        >
          <option value="BOY">BOY</option>
          <option value="GIRL">GIRL</option>
        </select>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Representative Image</label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            className="w-24 h-24 object-cover rounded border border-gray-200 mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block text-sm text-gray-600"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white text-sm px-5 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Star'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/stars')}
          className="bg-gray-100 text-gray-700 text-sm px-5 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
