"use client"

import { useRef } from "react"

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {dir === "left" ? (
      <polyline points="15 18 9 12 15 6" />
    ) : (
      <polyline points="9 18 15 12 9 6" />
    )}
  </svg>
)

const ProductCarousel = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLUListElement>(null)

  const scroll = (dir: number) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" })
  }

  return (
    <div className="relative group/carousel -mx-1">
      <ul
        ref={ref}
        className="flex gap-4 small:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar px-1 pb-2"
      >
        {children}
      </ul>

      {/* Sageti desktop — apar la hover */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Înapoi"
        className="hidden small:flex absolute left-1 top-[38%] -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg items-center justify-center text-gray-800 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95"
      >
        <Chevron dir="left" />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Înainte"
        className="hidden small:flex absolute right-1 top-[38%] -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg items-center justify-center text-gray-800 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95"
      >
        <Chevron dir="right" />
      </button>
    </div>
  )
}

export default ProductCarousel
