"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useRef, useState } from "react"

type Cat = Pick<HttpTypes.StoreProductCategory, "id" | "name" | "handle">

const ChevronRight = ({ className = "" }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export default function StoreMenu({
  label,
  allLabel,
  categories,
}: {
  label: string
  allLabel: string
  categories: Cat[]
}) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (timer.current) clearTimeout(timer.current)
    setOpen(true)
  }
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 130)
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <LocalizedClientLink
        href="/store"
        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-content/70 hover:text-cta hover:bg-cta/10 transition-all duration-200"
      >
        {label}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </LocalizedClientLink>

      {/* pt-3 = punte de hover intre buton si panou (sa nu se inchida) */}
      <div
        className={`absolute left-0 top-full pt-3 transition-all duration-200 ${
          open
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-1 invisible"
        }`}
      >
        <div className="w-[460px] rounded-2xl border border-line bg-card shadow-2xl shadow-black/10 p-3">
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 gap-1">
              {categories.map((c) => (
                <LocalizedClientLink
                  key={c.id}
                  href={`/categories/${c.handle}`}
                  className="group/item flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm text-content/80 hover:bg-cta/10 hover:text-cta transition-colors"
                >
                  <span className="line-clamp-1">{c.name}</span>
                  <ChevronRight className="shrink-0 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                </LocalizedClientLink>
              ))}
            </div>
          ) : null}

          <div className={categories.length > 0 ? "mt-2 pt-2 border-t border-line" : ""}>
            <LocalizedClientLink
              href="/store?view=all"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-cta hover:bg-cta/10 transition-colors"
            >
              {allLabel}
              <ChevronRight />
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
