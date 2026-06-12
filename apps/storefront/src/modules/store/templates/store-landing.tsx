import Image from "next/image"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { getT } from "@lib/i18n/server"

// Paleta editorială — alternează cald/rece, deschis/închis (fallback fără imagine)
const TILES: { bg: string; text: string }[] = [
  { bg: "#0A0A0E", text: "#FFFFFF" },
  { bg: "#F5EFE6", text: "#1A0F00" },
  { bg: "#E8F0FB", text: "#0D1F3C" },
  { bg: "#EAEAE6", text: "#1A1A12" },
  { bg: "#111827", text: "#FFFFFF" },
  { bg: "#FBF0EE", text: "#2C1208" },
  { bg: "#F0EDF9", text: "#1A0F2E" },
  { bg: "#1C1C2A", text: "#FFFFFF" },
]

function isWide(i: number) {
  return i === 0 || i % 7 === 5
}

function isDark(textColor: string) {
  return textColor === "#FFFFFF"
}

export default async function StoreLanding({ countryCode }: { countryCode: string }) {
  const t = await getT()
  const region = await getRegion(countryCode)

  const categories = await listCategories().catch(() => [] as HttpTypes.StoreProductCategory[])
  const topCategories = (categories || []).filter((c) => !c.parent_category)

  let featured: HttpTypes.StoreProduct[] = []
  if (region) {
    const { response } = await listProducts({
      countryCode,
      queryParams: { limit: 8 },
    }).catch(() => ({ response: { products: [], count: 0 } }))
    featured = response.products
  }

  return (
    <div className="w-full bg-page min-h-screen">

      {/* ── CATEGORII ─────────────────────────────────── */}
      <section className="content-container pt-6 pb-0 small:pt-8">
        {topCategories.length > 0 ? (
          <div className="grid grid-cols-2 medium:grid-cols-3 gap-2.5 small:gap-3">
            {topCategories.map((cat, i) => {
              const tile = TILES[i % TILES.length]
              const wide = isWide(i)
              const isFirst = i === 0
              const imageUrl = (cat.metadata as Record<string, unknown> | null)?.image as string | undefined
              const hasImage = !!imageUrl
              const dark = hasImage ? true : isDark(tile.text)

              return (
                <LocalizedClientLink
                  key={cat.id}
                  href={`/categories/${cat.handle}`}
                  style={hasImage ? {} : { backgroundColor: tile.bg, color: tile.text }}
                  className={[
                    "group relative overflow-hidden rounded-2xl small:rounded-3xl select-none cursor-pointer",
                    "transition-transform duration-500 hover:scale-[0.985] active:scale-[0.975]",
                    hasImage ? "bg-neutral-900 text-white" : "",
                    wide ? "col-span-2 medium:col-span-2" : "",
                    isFirst
                      ? "h-[260px] small:h-[380px]"
                      : wide
                      ? "h-[160px] small:h-[220px]"
                      : "h-[160px] small:h-[210px]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {/* Imagine de fundal */}
                  {hasImage && (
                    <>
                      <Image
                        src={imageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes={wide ? "(max-width:768px) 100vw, 66vw" : "(max-width:768px) 50vw, 33vw"}
                      />
                      {/* Gradient pentru lizibilitate text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 transition-opacity duration-500 group-hover:from-black/80" />
                    </>
                  )}

                  {/* Hover overlay (doar fără imagine) */}
                  {!hasImage && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: dark
                          ? "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)"
                          : "linear-gradient(135deg, rgba(0,0,0,0.05) 0%, transparent 60%)",
                      }}
                    />
                  )}

                  {/* Număr decorativ watermark (doar fără imagine) */}
                  {!hasImage && (
                    <span
                      className="absolute -bottom-3 -right-2 font-black leading-none pointer-events-none select-none"
                      style={{
                        fontSize: isFirst ? "clamp(100px,18vw,200px)" : "clamp(64px,12vw,130px)",
                        opacity: 0.04,
                        color: tile.text,
                        lineHeight: 1,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}

                  {/* Content */}
                  <div className="absolute inset-0 p-5 small:p-7 flex flex-col justify-end gap-1">
                    <h2
                      className={[
                        "font-bold tracking-tight leading-tight transition-transform duration-300 group-hover:translate-x-1",
                        hasImage ? "text-white" : "",
                        isFirst
                          ? "text-3xl small:text-[2.75rem]"
                          : "text-xl small:text-2xl",
                      ].join(" ")}
                    >
                      {cat.name}
                    </h2>

                    {/* "Explorează →" apare la hover */}
                    <div
                      className={[
                        "flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase",
                        "transition-all duration-300 opacity-0 group-hover:opacity-60 translate-y-1 group-hover:translate-y-0",
                        hasImage ? "text-white" : "",
                      ].join(" ")}
                    >
                      <span>{t("landing.explore")}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-line py-20 text-center text-sm text-subtle">
            {t("landing.emptyCategories")}
          </div>
        )}
      </section>

      {/* ── PRODUSE ───────────────────────────────────── */}
      {featured.length > 0 && region && (
        <section className="mt-14 small:mt-20 border-t border-line">
          <div className="content-container py-12 small:py-16">
            <div className="flex items-center justify-between mb-8 small:mb-10">
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-subtle">
                {t("landing.inStore")}
              </p>
              <LocalizedClientLink
                href="/store?view=all"
                className="text-[11px] font-bold tracking-[0.18em] uppercase text-subtle hover:text-content transition-colors"
              >
                {t("common.seeAll")} &rarr;
              </LocalizedClientLink>
            </div>

            <ul className="grid grid-cols-2 medium:grid-cols-4 gap-x-4 gap-y-10 small:gap-x-5 small:gap-y-14">
              {featured.map((p) => (
                <li key={p.id}>
                  <ProductPreview product={p} region={region} isFeatured />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── FOOTER BAND ───────────────────────────────── */}
      <section className="bg-[#0A0A0E] mt-16 small:mt-24">
        <div className="content-container py-14 small:py-20 flex flex-col small:flex-row items-center justify-between gap-6">
          <p className="text-2xl small:text-3xl font-bold text-white tracking-tight text-center small:text-left">
            {t("footer.tagline")}
          </p>
          <LocalizedClientLink
            href="/store?view=all"
            className="shrink-0 inline-flex px-7 py-3.5 rounded-full bg-white text-gray-950 text-sm font-semibold shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            {t("common.allProducts")}
          </LocalizedClientLink>
        </div>
      </section>

    </div>
  )
}
