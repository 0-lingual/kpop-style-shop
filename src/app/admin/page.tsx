import Link from 'next/link'

async function getStats() {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const [starsRes, productsRes] = await Promise.all([
    fetch(`${baseUrl}/api/stars`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/products`, { cache: 'no-store' }),
  ])

  const stars = starsRes.ok ? await starsRes.json() : []
  const products = productsRes.ok ? await productsRes.json() : []

  return {
    starsCount: Array.isArray(stars) ? stars.length : 0,
    productsCount: Array.isArray(products) ? products.length : 0,
  }
}

export default async function AdminDashboardPage() {
  const { starsCount, productsCount } = await getStats()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 max-w-xl">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Stars</p>
          <p className="text-4xl font-bold text-gray-900 mb-4">{starsCount}</p>
          <Link
            href="/admin/stars"
            className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            Go to Stars
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Products</p>
          <p className="text-4xl font-bold text-gray-900 mb-4">{productsCount}</p>
          <Link
            href="/admin/products"
            className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            Go to Products
          </Link>
        </div>
      </div>
    </div>
  )
}
