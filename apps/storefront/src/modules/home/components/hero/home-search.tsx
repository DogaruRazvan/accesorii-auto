"use client"

import { searchProductsLight } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "@lib/i18n/context"

type Suggestion = Pick<HttpTypes.StoreProduct, "id" | "title" | "handle" | "thumbnail">

export default function HomeSearch() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || ""

  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const q = value.trim()
    if (q.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      const r = await searchProductsLight(q, countryCode)
      setSuggestions(r)
      setOpen(true)
      setActiveIndex(-1)
      setLoading(false)
    }, 250)
    return () => clearTimeout(timer)
  }, [value, countryCode])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const goToResults = (q: string) => {
    router.push(`/${countryCode}/store?view=all${q ? `&q=${encodeURIComponent(q)}` : ""}`)
    setOpen(false)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      router.push(`/${countryCode}/products/${suggestions[activeIndex].handle}`)
      setOpen(false)
      return
    }
    goToResults(value.trim())
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !suggestions.length) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <form onSubmit={submit}>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-content/40 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => suggestions.length && setOpen(true)}
            placeholder={t("nav.searchPlaceholder")}
            autoComplete="off"
            className="w-full py-3.5 pl-12 pr-4 rounded-full border border-content/15 bg-card/70 backdrop-blur-md text-content placeholder:text-content/40 shadow-lg outline-none transition-all focus:border-cta/50 focus:ring-2 focus:ring-cta/20"
          />
        </div>
      </form>

      {open && value.trim().length >= 2 && (
        <div className="absolute z-[60] mt-2 w-full rounded-2xl border border-line bg-card shadow-2xl overflow-hidden text-left">
          {loading && !suggestions.length ? (
            <p className="px-5 py-4 text-sm text-subtle">{t("nav.searching")}</p>
          ) : !suggestions.length ? (
            <p className="px-5 py-4 text-sm text-subtle">{t("nav.noResults")}</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-2">
              {suggestions.map((s, i) => (
                <li key={s.id}>
                  <LocalizedClientLink
                    href={`/products/${s.handle}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                      i === activeIndex ? "bg-muted" : "hover:bg-muted"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                      {s.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="text-sm text-content line-clamp-1">{s.title}</span>
                  </LocalizedClientLink>
                </li>
              ))}
              <li className="border-t border-line mt-1">
                <button
                  onClick={() => goToResults(value.trim())}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-cta hover:bg-muted transition-colors"
                >
                  {t("nav.searchAll")} „{value.trim()}"
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
