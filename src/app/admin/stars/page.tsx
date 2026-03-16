'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface Star {
  id: string
  name: string
  gender: 'BOY' | 'GIRL'
  imageUrl: string | null
  createdAt: string
  _count: { products: number }
}

export default function AdminStarsPage() {
  const [stars, setStars] = useState<Star[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStars = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/stars')
    if (res.ok) {
      const data = await res.json()
      setStars(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStars()
  }, [fetchStars])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}"을(를) 삭제하시겠습니까?`)) return

    const res = await fetch(`/api/stars/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchStars()
    } else {
      alert('삭제에 실패했습니다.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stars</h1>
        <Link
          href="/admin/stars/new"
          className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
        >
          New Star
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : stars.length === 0 ? (
        <p className="text-gray-500 text-sm">No stars yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">Gender</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">Products</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {stars.map((star) => (
                <tr key={star.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{star.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                        star.gender === 'BOY'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-pink-50 text-pink-700'
                      }`}
                    >
                      {star.gender}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{star._count.products}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(star.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/stars/${star.id}/edit`}
                        className="text-sm text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(star.id, star.name)}
                        className="text-sm text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
