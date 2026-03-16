"use client"

import Image from "next/image"
import { useState } from "react"
import type { ProductImage } from "@prisma/client"

interface ImageGalleryProps {
  images: ProductImage[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {/* 메인 이미지 placeholder */}
        <div className="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center rounded-sm">
          <span className="text-gray-400 text-sm">No image available</span>
        </div>
      </div>
    )
  }

  const mainImage = images[selectedIndex]

  return (
    <div className="flex flex-col gap-3">
      {/* 메인 이미지 */}
      <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden rounded-sm">
        <Image
          src={mainImage.url}
          alt="Product image"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 580px"
        />
        {mainImage.type === "STAR_WEARING" && (
          <span className="absolute bottom-3 left-3 bg-black text-white text-xs px-2 py-1 font-medium tracking-wide">
            Star wearing this
          </span>
        )}
      </div>

      {/* 썸네일 */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 bg-gray-50 overflow-hidden rounded-sm border-2 transition-colors ${
                idx === selectedIndex ? "border-black" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={img.url}
                alt={`Product image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
