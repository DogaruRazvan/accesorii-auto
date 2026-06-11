import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import StoreSearch from "@modules/store/components/store-search"

// Gradiente brand alternate pentru cardurile de categorie (look tip revista)
const CARD_GRADIENTS = [
  "from-brand-primary to-brand-secondary",
  "from-brand-dark to-brand-primary",
  "from-brand-secondary to-brand-accent",
  "from-brand-accent to-brand-primary",
  "from-brand-primary to-brand-dark",
  "from-brand-secondary to-brand-primary",
]

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
    <div className="w-full">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_45%)]" />
        <div className="content-container relative py-20 small:py-28 flex flex-col items-center text-center gap-6">
          <span className="text-xs tracking-[0.3em] uppercase text-brand-light/80 font-medium">
            MENV Divers
          </span>
          <h1 className="text-4xl small:text-6xl font-bold text-white tracking-tight max-w-3xl leading-tight">
            Tot ce ai nevoie, într-un singur loc
          </h1>
          <p className="text-brand-light/80 text-lg max-w-xl">
            Produse din toate categoriile, alese cu grijă. Răsfoiește
            categoriile sau caută direct produsul dorit.
          </p>
          <div className="w-full mt-4">
            <StoreSearch />
          </div>
          {/* Butoane rapide */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <LocalizedClientLink
              href="/store?view=all"
              className="px-6 py-3 rounded-full bg-white text-brand-primary text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Toate produsele
            </LocalizedClientLink>
            <a
              href="#recomandare"
              className="px-6 py-3 rounded-full border border-white/40 text-white text-sm font-semibold transition-all hover:bg-white/10 active:scale-95"
            >
              Recomandarea noastră
            </a>
            <a
              href="#categorii"
              className="px-6 py-3 rounded-full border border-white/40 text-white text-sm font-semibold transition-all hover:bg-white/10 active:scale-95"
            >
              Categorii
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORII — magazine grid */}
      <section id="categorii" className="content-container py-16 small:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl small:text-4xl font-bold text-gray-900 tracking-tight">
              Categorii
            </h2>
            <p className="text-gray-500 mt-2">Alege o categorie și explorează</p>
          </div>
          <LocalizedClientLink
            href="/store?view=all"
            className="hidden small:inline-flex items-center gap-1 text-sm font-medium text-brand-secondary hover:text-brand-primary transition-colors"
          >
            Vezi toate produsele
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </LocalizedClientLink>
        </div>

        {topCategories.length > 0 ? (
          <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-6 auto-rows-[200px]">
            {topCategories.map((cat, i) => (
              <LocalizedClientLink
                key={cat.id}
                href={`/categories/${cat.handle}`}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${
                  CARD_GRADIENTS[i % CARD_GRADIENTS.length]
                } ${i % 5 === 0 ? "medium:col-span-2" : ""} shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
              >
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/0" />
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_20%,white,transparent_50%)]" />
                <div className="relative h-full flex flex-col justify-end p-7">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-white/80 text-sm mt-1 transition-transform group-hover:translate-x-1">
                    Explorează
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </span>
                </div>
              </LocalizedClientLink>
            ))}
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
          className="bg-brand-light/40 border-y border-gray-100"
        >
          <div className="content-container py-16 small:py-24">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl small:text-4xl font-bold text-gray-900 tracking-tight">
                  Recomandarea noastră
                </h2>
                <p className="text-gray-500 mt-2">Produse alese special pentru tine</p>
              </div>
              <LocalizedClientLink
                href="/store?view=all"
                className="hidden small:inline-flex items-center gap-1 text-sm font-medium text-brand-secondary hover:text-brand-primary transition-colors"
              >
                Vezi tot
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </LocalizedClientLink>
            </div>
            <ul className="grid grid-cols-2 medium:grid-cols-4 gap-x-6 gap-y-8">
              {featured.map((p) => (
                <li key={p.id}>
                  <ProductPreview product={p} region={region} isFeatured />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="content-container py-16 small:py-20 text-center">
        <h2 className="text-2xl small:text-3xl font-bold text-gray-900">
          Nu știi exact ce cauți?
        </h2>
        <p className="text-gray-500 mt-2 mb-6">
          Răsfoiește întreaga gamă de produse.
        </p>
        <LocalizedClientLink
          href="/store?view=all"
          className="inline-flex px-8 py-4 rounded-full bg-brand-primary text-white font-semibold shadow-lg transition-all hover:bg-brand-secondary hover:scale-105 active:scale-95"
        >
          Vezi toate produsele
        </LocalizedClientLink>
      </section>
    </div>
  )
}
