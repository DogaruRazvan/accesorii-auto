import Image from "next/image"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { getT } from "@lib/i18n/server"

// Gradiente moderne, on-brand (fallback cand categoria n-are imagine).
// Toate suficient de inchise pentru text alb -> aspect coerent si fresh.
const GRADIENTS: string[] = [
  "linear-gradient(135deg,#059669,#10B981)", // emerald
  "linear-gradient(135deg,#0F766E,#14B8A6)", // teal
  "linear-gradient(135deg,#1E293B,#334155)", // slate
  "linear-gradient(135deg,#065F46,#0D9488)", // deep green
  "linear-gradient(135deg,#0C0A09,#292524)", // near-black
  "linear-gradient(135deg,#134E4A,#1FA2A6)", // cyan-teal
]

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
      <section className="content-container pt-6 pb-0 small:pt-10">
        {topCategories.length > 0 ? (
          <>
            <div className="grid grid-cols-2 small:grid-cols-3 large:grid-cols-4 gap-3 small:gap-4">
              {topCategories.map((cat, i) => {
                const gradient = GRADIENTS[i % GRADIENTS.length]
                const imageUrl = (cat.metadata as Record<string, unknown> | null)?.image as string | undefined
                const hasImage = !!imageUrl

                return (
                  <LocalizedClientLink
                    key={cat.id}
                    href={`/categories/${cat.handle}`}
                    style={hasImage ? {} : { backgroundImage: gradient }}
                    className="group relative overflow-hidden rounded-2xl select-none cursor-pointer text-white h-36 small:h-44 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {/* Imagine de fundal */}
                    {hasImage && (
                      <Image
                        src={imageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width:1024px) 50vw, 25vw"
                      />
                    )}

                    {/* Overlay lizibilitate */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    {/* Initiala mare, decorativa (doar fara imagine) */}
                    {!hasImage && (
                      <span
                        className="absolute -bottom-5 -right-2 font-black leading-none pointer-events-none select-none text-white/10"
                        style={{ fontSize: "clamp(80px,12vw,120px)" }}
                      >
                        {cat.name.charAt(0).toUpperCase()}
                      </span>
                    )}

                    {/* Sageata glass, se umple la hover */}
                    <span className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/25 transition-all duration-300 group-hover:bg-cta group-hover:ring-cta">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </span>

                    {/* Nume jos */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <h2 className="font-semibold text-base small:text-lg tracking-tight leading-tight text-white drop-shadow-sm transition-transform duration-300 group-hover:translate-x-0.5">
                        {cat.name}
                      </h2>
                    </div>
                  </LocalizedClientLink>
                )
              })}
            </div>

            {/* Buton: toate produsele — stilizat cu paleta brand */}
            <div className="mt-7 small:mt-9 flex justify-center">
              <LocalizedClientLink
                href="/store?view=all"
                className="group inline-flex items-center gap-2.5 rounded-full bg-cta hover:bg-cta-hover text-white pl-7 pr-5 py-3.5 text-sm font-semibold shadow-lg shadow-cta/25 transition-all duration-300 hover:scale-[1.03] active:scale-95"
              >
                {t("common.allProducts")}
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </LocalizedClientLink>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-line py-20 text-center text-sm text-subtle">
            {t("landing.emptyCategories")}
          </div>
        )}
      </section>

      {/* ── PRODUSE ───────────────────────────────────── */}
      {featured.length > 0 && region && (
        <section className="mt-14 small:mt-20 border-t border-line">
          <div className="content-container py-12 small:py-16">
            <div className="flex items-center justify-between mb-8 small:mb-10">
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-cta animate-pulse" />
                {t("landing.inStore")}
              </p>
              <LocalizedClientLink
                href="/store?view=all"
                className="text-[11px] font-bold tracking-[0.18em] uppercase text-cta hover:text-cta-hover transition-colors"
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
            className="shrink-0 inline-flex px-7 py-3.5 rounded-full bg-cta hover:bg-cta-hover text-white text-sm font-semibold shadow-xl shadow-cta/20 transition-all hover:scale-105 active:scale-95"
          >
            {t("common.allProducts")}
          </LocalizedClientLink>
        </div>
      </section>

    </div>
  )
}
