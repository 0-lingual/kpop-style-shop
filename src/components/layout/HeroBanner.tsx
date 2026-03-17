'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const BANNERS = [
  {
    src: '/images/banners/solo-hell5.jpg',
    alt: 'Solo Hell Season 5 Official Poster',
  },
  {
    src: '/images/banners/blackpink.png',
    alt: 'BLACKPINK Group Photo',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative bg-black text-white py-24 px-4 overflow-hidden">
      {/* 배너 이미지 레이어 */}
      {BANNERS.map((banner, i) => (
        <div
          key={banner.src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={banner.src}
            alt={banner.alt}
            fill
            className="object-cover object-center"
            priority={i === 0}
          />
          {/* 텍스트 가독성을 위한 어두운 오버레이 */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}

      {/* 콘텐츠 (기존 텍스트·버튼 그대로) */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <p className="text-sm tracking-[0.3em] text-gray-400 mb-4">K-POP · FASHION · CULTURE</p>
        <h1 className="font-serif italic text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-2xl">
          Dress Like Your Fave K-Pop Stars
        </h1>
        <p className="text-lg text-gray-300 mb-10 max-w-xl">
          Discover outfits worn by BTS, BLACKPINK &amp; more
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/products"
            className="bg-white text-black px-8 py-3 font-medium hover:bg-gray-100 transition-colors"
          >
            Browse Products
          </Link>
          <Link
            href="/stars"
            className="border border-white text-white px-8 py-3 font-medium hover:bg-white hover:text-black transition-colors"
          >
            Explore Groups
          </Link>
        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="flex gap-2 mt-8">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-8 h-0.5 transition-all duration-300 ${
                i === current ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`배너 ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
