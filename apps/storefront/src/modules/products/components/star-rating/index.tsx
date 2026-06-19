import { clx } from "@modules/common/components/ui"

type Size = "sm" | "md" | "lg"

const PX: Record<Size, number> = { sm: 14, md: 18, lg: 24 }

function StarsRow({ px, className }: { px: number; className: string }) {
  return (
    <div className={clx("flex", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width={px}
          height={px}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5z" />
        </svg>
      ))}
    </div>
  )
}

/**
 * Afiseaza o nota de la 0 la 5 cu stele, inclusiv fractii (umplere partiala).
 * Componenta pur prezentationala (server-safe), folosita pe carduri si pe
 * pagina produsului.
 */
export default function StarRating({
  value,
  count,
  size = "md",
  showValue = false,
  className,
}: {
  value: number
  count?: number
  size?: Size
  showValue?: boolean
  className?: string
}) {
  const px = PX[size]
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))

  return (
    <div className={clx("inline-flex items-center gap-1.5", className)}>
      <div
        className="relative inline-block leading-none"
        role="img"
        aria-label={`${value} din 5 stele`}
      >
        <StarsRow px={px} className="text-content/15" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <StarsRow px={px} className="text-amber-400" />
        </div>
      </div>
      {showValue && value > 0 && (
        <span className="text-sm font-semibold text-content tabular-nums">
          {value.toFixed(1)}
        </span>
      )}
      {typeof count === "number" && (
        <span className="text-xs text-subtle tabular-nums">
          {count > 0 ? `(${count})` : "fără recenzii"}
        </span>
      )}
    </div>
  )
}
