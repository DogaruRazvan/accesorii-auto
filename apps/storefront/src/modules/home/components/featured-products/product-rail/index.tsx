import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import ProductCarousel from "@modules/home/components/featured-products/product-carousel"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-16">
      <div className="flex items-end justify-between mb-7">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-accent">
            Colecție
          </span>
          <h2 className="text-2xl small:text-3xl font-bold tracking-tight text-gray-950 mt-1.5">
            {collection.title}
          </h2>
        </div>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="group inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors shrink-0"
        >
          Vezi toate
          <svg
            className="transition-transform duration-200 group-hover:translate-x-0.5"
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
        </LocalizedClientLink>
      </div>

      <ProductCarousel>
        {pricedProducts.map((product) => (
          <li
            key={product.id}
            className="snap-start shrink-0 w-[62%] xsmall:w-[44%] small:w-[30%] medium:w-[23.5%]"
          >
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ProductCarousel>
    </section>
  )
}
