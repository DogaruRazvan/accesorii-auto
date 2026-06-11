import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import StoreSearch from "@modules/store/components/store-search"

const ArrowRight = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export default async function StoreLanding({
  countryCode,
}: {
  countryCode: string
}) {
  const region = await getRegion(countryCode)

  const categories = await listCategories().catch(
    () => [] as HttpTypes.StoreProductCategory[]
  )
  const topCategories = (categories || []).filter((c) => !c.parent_category)

  let featured: HttpTypes.StoreProduct[] = []
  if (region) {
    const { response } = await listProducts({
      countryCode,
      queryParams: { limit: 4 },
    }).catch(() => ({ response: { products: [], count: 0 } }))
    featured = response.products
  }

  return (
    <div className="w-full bg-white">
      {/* INTRO — alb, aerisit, stil Apple/Google */}
      <section className="content-container pt-16 pb-10 small:pt-24 small:pb-16 flex flex-col items-center text-center gap-5">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-accent">
          Magazin
        </span>
        <h1 className="text-4xl small:text-6xl font-bold tracking-tight text-gray-950 max-w-3xl leading-[1.05]">
          Tot ce ai nevoie,
          <br className="hidden small:block" /> într-un singur loc
        </h1>
        <p className="text-lg text-gray-500 max-w-xl">
          Răsfoiește categoriile sau caută direct produsul dorit.
        </p>
        <div className="w-full mt-3">
          <StoreSearch />
        </div>
      </section>

      {/* CATEGORII — bento grid (light + tile-uri inchise cu accent auriu) */}
      <section id="categorii" className="content-container pb-16 small:pb-24">
        <div className="flex items-end justify-between mb-7 small:mb-9">
          <h2 className="text-2xl small:text-3xl font-bold tracking-tight text-gray-950">
            Cumpără pe categorii
          </h2>
          <LocalizedClientLink
            href="/store?view=all"
            className="group inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors"
          >
            Vezi toate produsele
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </LocalizedClientLink>
        </div>

        {topCategories.length > 0 ? (
          <div className="grid grid-cols-2 medium:grid-cols-3 gap-4 small:gap-5 auto-rows-[170px] small:auto-rows-[220px]">
            {topCategories.map((cat, i) => {
              const dark = i % 5 === 0
              const wide = i % 5 === 0
              return (
                <LocalizedClientLink
                  key={cat.id}
                  href={`/categories/${cat.handle}`}
                  className={clx(
                    "group relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1",
                    wide && "col-span-2",
                    dark
                      ? "bg-[#0A0A0E] shadow-lg"
                      : "bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:shadow-md"
                  )}
                >
                  {dark && (
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_15%,rgba(217,164,65,0.35),transparent_55%)]" />
                  )}
                  <div className="relative flex justify-end">
                    <span
                      className={clx(
                        "flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 group-hover:rotate-[-45deg]",
                        dark
                          ? "bg-white/10 text-brand-accent"
                          : "bg-white text-gray-400 group-hover:text-brand-accent shadow-sm"
                      )}
                    >
                      <ArrowRight />
                    </span>
                  </div>
                  <h3
                    className={clx(
                      "relative text-xl small:text-2xl font-bold tracking-tight",
                      dark ? "text-white" : "text-gray-950"
                    )}
                  >
                    {cat.name}
                  </h3>
                </LocalizedClientLink>
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
            Încă nu există categorii. Adaugă-le din panoul de admin.
          </div>
        )}
      </section>

      {/* RECOMANDAREA NOASTRĂ */}
      {featured.length > 0 && region && (
        <section
          id="recomandare"
          className="border-t border-gray-100 bg-gray-50/50"
        >
          <div className="content-container py-16 small:py-24">
            <div className="flex items-end justify-between mb-8 small:mb-10">
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-accent">
                  Selecția noastră
                </span>
                <h2 className="text-2xl small:text-3xl font-bold tracking-tight text-gray-950 mt-2">
                  Recomandarea noastră
                </h2>
              </div>
              <LocalizedClientLink
                href="/store?view=all"
                className="group hidden small:inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors"
              >
                Vezi tot
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </LocalizedClientLink>
            </div>
            <ul className="grid grid-cols-2 medium:grid-cols-4 gap-x-5 gap-y-10 small:gap-y-12">
              {featured.map((p) => (
                <li key={p.id}>
                  <ProductPreview product={p} region={region} isFeatured />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA final — band inchis, leaga pagina de brand */}
      <section className="bg-[#0A0A0E]">
        <div className="content-container py-16 small:py-24 text-center flex flex-col items-center gap-5">
          <h2 className="text-2xl small:text-4xl font-bold tracking-tight text-white max-w-lg">
            Nu știi exact ce cauți?
          </h2>
          <p className="text-white/60 max-w-md">
            Răsfoiește întreaga gamă de produse, din toate categoriile.
          </p>
          <LocalizedClientLink
            href="/store?view=all"
            className="inline-flex mt-2 px-8 py-4 rounded-full bg-white text-gray-950 font-semibold shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Vezi toate produsele
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}
