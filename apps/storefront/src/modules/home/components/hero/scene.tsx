"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Model3D from "./model-3d"
import HomeSearch from "./home-search"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface HeroSceneProps {
  eyebrow: string
  title1: string
  title2: string
  subtitle: string
  scrollHint: string
  revealText: string
  ctaLabel: string
  ctaHref: string
  trust: { shipping: string; returns: string; pay: string }
}

// La ce procent din scroll (0-1) apare ecranul blurat cu butonul.
const REVEAL_AT = 0.92

/* ─── Iconite mici pentru chips-urile de incredere ─────────────────────── */
const IconBox = ({ children }: { children: ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    {children}
  </svg>
)
const ShippingIcon = () => (
  <IconBox>
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </IconBox>
)
const ReturnIcon = () => (
  <IconBox>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </IconBox>
)
const PayIcon = () => (
  <IconBox>
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </IconBox>
)

export default function HeroScene({
  eyebrow,
  title1,
  title2,
  subtitle,
  scrollHint,
  revealText,
  ctaLabel,
  ctaHref,
  trust,
}: HeroSceneProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const p = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0
      progress.current = p
      setDone(p >= REVEAL_AT)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const chips = [
    { label: trust.shipping, icon: <ShippingIcon /> },
    { label: trust.returns, icon: <ReturnIcon /> },
    { label: trust.pay, icon: <PayIcon /> },
  ]

  return (
    // Pista de scroll scurta — animatia se termina din ~1-2 sec de derulare.
    <div ref={trackRef} className="relative h-[175vh] w-full bg-page">
      {/* Inner pin: ramane fix sub nav (5rem) cat timp derulezi prin pista */}
      <div className="sticky top-20 h-[calc(100dvh-5rem)] w-full overflow-hidden">

        {/* Glow difuz in spatele modelului — accent verde brand */}
        <div className="absolute left-[62%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18),rgba(255,255,255,0.04)_34%,transparent_66%)] z-10 small:block hidden" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16),transparent_64%)] z-10 small:hidden" />

        {/* Vigneta cinematica — doar pe dark */}
        <div className="hidden dark:block absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.6))]" />

        {/* Film grain fin — textura premium */}
        <div
          className="hidden dark:block absolute inset-0 z-10 opacity-[0.10] mix-blend-soft-light pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Canvas 3D — dreapta pe desktop, tot ecranul pe mobil */}
        <div className="absolute inset-0 small:left-[36%] z-20">
          <Model3D progress={progress} />
        </div>

        {/* Scrim sus pe mobil — tine textul lizibil peste model */}
        <div className="small:hidden absolute inset-x-0 top-0 h-2/5 z-[25] bg-gradient-to-b from-page via-page/85 to-transparent pointer-events-none" />

        {/* Text — STANGA pe desktop (langa model), SUS-centrat pe mobil */}
        <div
          className={`absolute z-30 pointer-events-none
            inset-x-0 top-0 px-6 pt-10 flex flex-col items-center text-center
            small:inset-y-0 small:inset-x-auto small:left-0 small:top-0 small:max-w-[40%]
            small:items-start small:justify-center small:pl-16 small:pr-0 small:pt-0 small:text-left
            transition-opacity duration-500 ${done ? "opacity-0" : "opacity-100"}`}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-content/20 bg-content/5 backdrop-blur-sm text-[11px] tracking-[0.3em] uppercase text-content/80 font-medium animate-hero-rise"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cta animate-pulse" />
            {eyebrow}
          </span>

          <h1
            className="mt-5 font-display text-4xl small:text-6xl medium:text-7xl font-extrabold text-content tracking-tight leading-[1.05] dark:[text-shadow:_0_4px_30px_rgb(0_0_0_/_45%)] animate-hero-rise"
            style={{ animationDelay: "0.25s" }}
          >
            {title1}
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
              {title2}
            </span>
          </h1>

          <p
            className="mt-5 max-w-md font-display text-content/90 text-lg small:text-xl font-medium tracking-tight leading-snug dark:[text-shadow:_0_2px_20px_rgb(0_0_0_/_60%)] animate-hero-rise"
            style={{ animationDelay: "0.4s" }}
          >
            {subtitle}
          </p>

          {/* Search cu autocompletare — pointer-events-auto (parintele e none) */}
          <div
            className="mt-7 w-full max-w-md pointer-events-auto animate-hero-rise"
            style={{ animationDelay: "0.55s" }}
          >
            <HomeSearch />
          </div>
        </div>

        {/* Indicator scroll — invita la derulare, dispare cand animatia se termina */}
        <div
          className={`absolute bottom-7 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-500 ${
            done ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-[11px] tracking-[0.25em] uppercase text-content/60 font-medium">
            {scrollHint}
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-content/40 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-content/70 animate-bounce" />
          </div>
        </div>

        {/* ─── Final: ecran blurat + continut modern ─────────────────────── */}
        {/* `fixed inset-0` -> acopera tot viewport-ul (inclusiv nav-ul), deci
            blureaza TOATA pagina din spate, nu doar zona modelului. */}
        <div
          className={`fixed inset-0 z-[60] flex flex-col items-center justify-center px-6 transition-opacity duration-700 ${
            done
              ? "opacity-100 backdrop-blur-2xl bg-black/50"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${
              done ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            {/* Text sugestiv */}
            <p className="text-emerald-300/90 text-xs small:text-sm font-semibold tracking-[0.3em] uppercase">
              {revealText}
            </p>

            {/* Titlu scurt, premium */}
            <h2 className="mt-3 font-display text-3xl small:text-5xl font-extrabold text-white tracking-tight">
              {title1}{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-transparent">
                {title2}
              </span>
            </h2>

            {/* Buton modern — gradient, glow, sageata in cerc */}
            <LocalizedClientLink href={ctaHref} className="mt-8">
              <button className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 pl-8 pr-3 py-3 text-white font-semibold text-base small:text-lg shadow-[0_10px_45px_-8px_rgba(16,185,129,0.75)] ring-1 ring-white/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_55px_-6px_rgba(16,185,129,0.95)] active:translate-y-0">
                <span>{ctaLabel}</span>
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
            </LocalizedClientLink>

            {/* Chips de incredere — mici si moderne, sticla */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
              {chips.map((c) => (
                <div
                  key={c.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md px-4 py-2 text-white/90 text-xs small:text-sm font-medium"
                >
                  <span className="text-emerald-300">{c.icon}</span>
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
