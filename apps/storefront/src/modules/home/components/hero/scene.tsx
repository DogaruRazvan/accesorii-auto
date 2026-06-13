"use client"

import { useState, useEffect } from "react"
import Model3D from "./model-3d"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface HeroSceneProps {
  ctaLabel: string
  ctaHref: string
}

export default function HeroScene({ ctaLabel, ctaHref }: HeroSceneProps) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // matches the 200vh scroll driver: full range = 1 viewport scroll
      const p = Math.min(window.scrollY / window.innerHeight, 1)
      setDone(p >= 0.9)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* 3D canvas */}
      <div className="absolute inset-0 z-20">
        <Model3D />
      </div>

      {/* Blur overlay + reveal button */}
      <div
        className={`absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30 transition-opacity duration-700 ${
          done ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <LocalizedClientLink href={ctaHref}>
          <button
            className={`
              bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xl
              px-12 py-5 rounded-full shadow-2xl shadow-emerald-500/40
              border-2 border-emerald-300/40
              transition-all duration-500 hover:scale-105 active:scale-95
              ${done ? "scale-100 opacity-100" : "scale-90 opacity-0"}
            `}
          >
            {ctaLabel}
          </button>
        </LocalizedClientLink>
      </div>
    </>
  )
}
