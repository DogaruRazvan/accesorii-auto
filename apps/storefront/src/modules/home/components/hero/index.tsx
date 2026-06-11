"use client"

import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import dynamic from "next/dynamic"
import { useState } from "react"

// Spline foloseste WebGL/window -> incarcam doar pe client, lazy.
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
})

// Scena 3D se seteaza prin env var ca sa o poti schimba fara cod.
// Ex: NEXT_PUBLIC_SPLINE_SCENE=https://prod.spline.design/XXXX/scene.splinecode
const SPLINE_SCENE = process.env.NEXT_PUBLIC_SPLINE_SCENE

const Hero = () => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary">
      {/* Stratul 3D Spline (daca scena e setata) */}
      {SPLINE_SCENE && (
        <div
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Spline scene={SPLINE_SCENE} onLoad={() => setLoaded(true)} />
        </div>
      )}

      {/* Fundal animat de rezerva (cat se incarca Spline sau daca nu e setat) */}
      {!loaded && (
        <>
          <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(circle_at_25%_25%,white,transparent_40%)] animate-pulse" />
          <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_75%_60%,#F97316,transparent_45%)]" />
        </>
      )}

      {/* Overlay gradient pentru lizibilitate text peste 3D */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

      {/* Continut */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6 gap-6 pointer-events-none">
        <span className="text-xs tracking-[0.4em] uppercase text-white/70 font-medium animate-[fade-in-top_0.8s_ease-out]">
          MENV Divers
        </span>
        <h1 className="text-4xl small:text-7xl font-bold text-white tracking-tight max-w-4xl leading-[1.05] drop-shadow-lg">
          Tot ce ai nevoie
          <br />
          pentru mașina ta
        </h1>
        <p className="text-white/80 text-lg small:text-xl max-w-xl">
          Accesorii auto alese cu grijă, livrate rapid.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 pointer-events-auto">
          <LocalizedClientLink href="/store">
            <Button
              variant="secondary"
              className="!bg-white !text-brand-primary hover:!bg-brand-light !border-0 shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              Vezi produsele
            </Button>
          </LocalizedClientLink>
        </div>
      </div>

      {/* Indicator scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-white/70 animate-bounce" />
        </div>
      </div>
    </div>
  )
}

export default Hero
