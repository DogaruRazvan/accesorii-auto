"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import Image from "next/image"
import { useRef, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
  </svg>
)

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const count = images.length

  if (count === 0) {
    return (
      <div className="aspect-[4/5] w-full rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
        <PlaceholderImage size={48} />
      </div>
    )
  }

  const go = (i: number) => setIndex((i + count) % count)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx > 50) go(index - 1)
    else if (dx < -50) go(index + 1)
    touchStartX.current = null
  }

  return (
    <div className="w-full">
      {/* Viewport principal */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 group select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Track care gliseaza */}
        <div
          className="flex h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={img.id} className="relative h-full w-full shrink-0">
              {!!img.url && (
                <Image
                  src={img.url}
                  alt={`Imagine produs ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              onClick={() => go(index - 1)}
              aria-label="Imaginea anterioară"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/85 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-90"
            >
              <Chevron dir="left" />
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Imaginea următoare"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/85 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-90"
            >
              <Chevron dir="right" />
            </button>

            {/* Contor */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur text-white text-xs font-medium tracking-wide">
              {index + 1} / {count}
            </div>

            {/* Puncte (mobil) */}
            <div className="small:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={clx(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails (desktop) */}
      {count > 1 && (
        <div className="hidden small:flex mt-4 gap-3 overflow-x-auto no-scrollbar pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => go(i)}
              aria-label={`Vezi imaginea ${i + 1}`}
              className={clx(
                "relative shrink-0 w-16 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200",
                i === index
                  ? "border-brand-accent scale-100"
                  : "border-transparent opacity-50 hover:opacity-100"
              )}
            >
              {!!img.url && (
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                  draggable={false}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
