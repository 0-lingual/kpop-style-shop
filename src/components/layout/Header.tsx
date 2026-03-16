"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function HeaderNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const gender = searchParams.get("gender")
  const isProducts = pathname === "/products"
  const isStars = pathname === "/stars"

  // 서브 네비 active 상태 판단
  const isAll = isProducts && !gender
  const isWoman = isProducts && gender === "GIRL"
  const isMan = isProducts && gender === "BOY"

  const subNavClass = (active: boolean) =>
    `px-4 py-1.5 text-sm font-medium transition-colors border-b-2 ${
      active
        ? "border-black text-black"
        : "border-transparent text-gray-500 hover:text-black"
    }`

  return (
    <header className="bg-white border-b border-[#E0E0E0]">
      {/* 메인 헤더 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="font-serif italic font-bold text-2xl text-black tracking-tight">
            KPOP STYLE
          </Link>

          {/* 메인 네비 */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/" ? "text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors ${
                isProducts ? "text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              Products
            </Link>
            <Link
              href="/stars"
              className={`text-sm font-medium transition-colors ${
                isStars ? "text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              Stars
            </Link>
          </nav>
        </div>
      </div>

      {/* 서브 네비 바 */}
      <div className="border-t border-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-10">
            <Link href="/products" className={subNavClass(isAll)}>
              All
            </Link>
            <Link href="/products?gender=GIRL" className={subNavClass(isWoman)}>
              Woman
            </Link>
            <Link href="/products?gender=BOY" className={subNavClass(isMan)}>
              Man
            </Link>
            <Link href="/stars" className={subNavClass(isStars)}>
              K-POP Idol Groups
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="bg-white border-b border-[#E0E0E0] h-[104px]" />
    }>
      <HeaderNav />
    </Suspense>
  )
}
