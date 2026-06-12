"use client"

import { searchProductsLight } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "@lib/i18n/context"

type Suggestion = Pick<HttpTypes.StoreProduct, "id" | "title" | "handle" | "thumbnail">

export default function NavSearchBar() {
  const t = useTranslations()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const countryCode = (params?.countryCode as string) || ""

  const [value, setValue] = useState(searchParams?.get("q") || "")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isStorePage = pathname?.includes("/store")

  useEffect(() => {
    const q = value.trim()
    if (q.length < 2) { setSuggestions([]); setOpen(false); return }
    setLoading(true)
    const t = setTimeout(async () => {
      const results = await searchProductsLight(q, countryCode)
      setSuggestions(results)
      setOpen(results.length > 0)
      setActiveIndex(-1)
      setLoading(false)
    }, 250)
    return () => clearTimeout(t)
  }, [value, countryCode])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  if (!isStorePage) return null

  const goToResults = (q: string) => {
    router.push(`/${countryCode}/store?view=all${q ? `&q=${encodeURIComponent(q)}` : ""}`)
    setOpen(false)
    setValue("")
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      router.push(`/${countryCode}/products/${suggestions[activeIndex].handle}`)
      setOpen(false); setValue(""); return
    }
    goToResults(value.trim())
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !suggestions.length) return
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => (i + 1) % suggestions.length) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => (i <= 0 ? suggestions.length - 1 : i - 1)) }
    else if (e.key === "Escape") setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[340px] mx-4 hidden small:block">
      <form onSubmit={submit}>
        <div className={`relative flex items-center rounded-full border transition-all duration-200 ${focused ? "border-content/25 bg-content/[0.08] shadow-lg" : "border-line bg-content/[0.04]"}`}>
          <span className="absolute left-3.5 text-content/40 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => { setFocused(true); suggestions.length && setOpen(true) }}
            onBlur={() => setFocused(false)}
            placeholder={t("nav.searchPlaceholder")}
            autoComplete="off"
            className="w-full py-2 pl-9 pr-4 bg-transparent text-[13px] text-content placeholder:text-content/40 outline-none"
          />
        </div>
      </form>

      {open && value.trim().length >= 2 && (
        <div className="absolute z-[100] top-[calc(100%+10px)] left-0 right-0 rounded-2xl border border-line bg-card shadow-2xl overflow-hidden">
          {loading && !suggestions.length ? (
            <p className="px-4 py-3 text-sm text-subtle">{t("nav.searching")}</p>
          ) : !suggestions.length ? (
            <p className="px-4 py-3 text-sm text-subtle">{t("nav.noResults")}</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto py-2">
              {suggestions.map((s, i) => (
                <li key={s.id}>
                  <LocalizedClientLink
                    href={`/products/${s.handle}`}
                    onClick={() => { setOpen(false); setValue("") }}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${i === activeIndex ? "bg-muted" : "hover:bg-muted"}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-muted overflow-hidden shrink-0">
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
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-cta hover:bg-muted transition-colors"
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
