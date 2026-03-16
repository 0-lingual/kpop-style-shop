import StarForm from '@/components/admin/StarForm'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getStar(id: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/stars/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function EditStarPage({ params }: PageProps) {
  const { id } = await params
  const star = await getStar(id)

  if (!star) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Star</h1>
      <StarForm
        starId={id}
        initialData={{
          name: star.name,
          gender: star.gender,
          imageUrl: star.imageUrl ?? '',
        }}
      />
    </div>
  )
}
