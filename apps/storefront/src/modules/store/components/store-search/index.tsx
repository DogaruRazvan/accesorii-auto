"use client"

import { searchProductsLight } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type Suggestion = Pick<
  HttpTypes.StoreProduct,
  "id" | "title" | "handle" | "thumbnail"
>

const StoreSearch = ({ defaultValue = "" }: { defaultValue?: string }) => {
  const [value, setValue] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || ""
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce: cauta sugestii la 250ms dupa ce utilizatorul s-a oprit din tastat
  useEffect(() => {
    const q = value.trim()
    if (q.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      const results = await searchProductsLight(q, countryCode)
      setSuggestions(results)
      setOpen(true)
      setActiveIndex(-1)
      setLoading(false)
    }, 250)

    return () => clearTimeout(timer)
  }, [value, countryCode])

  // Inchide dropdown la click in afara
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const goToResults = (q: string) => {
    const base = `/${countryCode}/store?view=all`
    router.push(q ? `${base}&q=${encodeURIComponent(q)}` : base)
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
    if (!open || suggestions.length === 0) return
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
    <div ref={containerRef} className="w-full max-w-xl mx-auto relative">
      <form onSubmit={submit}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
            placeholder="Caută produse..."
            autoComplete="off"
            className="w-full py-3.5 pl-12 pr-28 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition-all focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-brand-primary text-white text-sm font-medium transition-all hover:bg-brand-secondary active:scale-95"
          >
            Caută
          </button>
        </div>
      </form>

      {/* Dropdown sugestii */}
      {open && value.trim().length >= 2 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden text-left">
          {loading && suggestions.length === 0 ? (
            <div className="px-5 py-4 text-sm text-gray-400">Se caută...</div>
          ) : suggestions.length === 0 ? (
            <div className="px-5 py-4 text-sm text-gray-400">
              Niciun produs găsit.
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-2">
              {suggestions.map((s, i) => (
                <li key={s.id}>
                  <LocalizedClientLink
                    href={`/products/${s.handle}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                      i === activeIndex ? "bg-brand-light" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {s.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.thumbnail}
                          alt={s.title}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="text-sm text-gray-800 line-clamp-1">
                      {s.title}
                    </span>
                  </LocalizedClientLink>
                </li>
              ))}
              <li className="border-t border-gray-100 mt-1">
                <button
                  onClick={() => goToResults(value.trim())}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-brand-secondary hover:bg-gray-50 transition-colors"
                >
                  Vezi toate rezultatele pentru „{value.trim()}”
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default StoreSearch
