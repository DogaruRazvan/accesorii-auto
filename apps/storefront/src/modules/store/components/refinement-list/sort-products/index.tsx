"use client"

import { clx } from "@modules/common/components/ui"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

type Dir = "up" | "down" | null

const sortOptions: { value: SortOptions; label: string; dir: Dir }[] = [
  { value: "created_at", label: "Noutăți", dir: null },
  { value: "price_asc", label: "Preț crescător", dir: "up" },
  { value: "price_desc", label: "Preț descrescător", dir: "down" },
]

const ArrowVertical = ({ dir }: { dir: Exclude<Dir, null> }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={clx(
      "transition-transform duration-300 ease-out",
      dir === "up"
        ? "group-hover:-translate-y-0.5"
        : "group-hover:translate-y-0.5"
    )}
  >
    {dir === "up" ? (
      <>
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="6 11 12 5 18 11" />
      </>
    ) : (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="6 13 12 19 18 13" />
      </>
    )}
  </svg>
)

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  return (
    <div className="flex flex-col gap-y-3" data-testid={dataTestId}>
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-cta">
        Sortează
      </span>

      <div className="flex flex-wrap gap-2">
        {sortOptions.map((o) => {
          const active = o.value === sortBy
          return (
            <button
              key={o.value}
              onClick={() => setQueryParams("sortBy", o.value)}
              data-active={active}
              className={clx(
                "group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                active
                  ? "border-cta text-cta bg-cta/10"
                  : "border-line text-subtle hover:text-content hover:border-content/30"
              )}
            >
              <span>{o.label}</span>
              {o.dir && <ArrowVertical dir={o.dir} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SortProducts
