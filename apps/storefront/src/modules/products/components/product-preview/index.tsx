import { getProductPrice } from "@lib/util/get-product-price"
import { getProductReviewStats } from "@lib/data/reviews"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import StarRating from "@modules/products/components/star-rating"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Statistici recenzii (medie + numar). Apar pe card doar daca exista cel
  // putin o recenzie.
  const { average, count } = await getProductReviewStats(product.id)

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div data-testid="product-wrapper" className="flex flex-col">
        <div className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          {/* Buton CTA verde -> apare la hover, indiciu de actiune */}
          <div className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cta text-white shadow-lg shadow-cta/30 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
        <div className="mt-3.5 flex items-start justify-between gap-3">
          <h3
            className="text-sm text-content/70 font-medium leading-snug line-clamp-2 transition-colors group-hover:text-content"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          {cheapestPrice && (
            <div className="shrink-0 text-sm font-bold text-cta">
              <PreviewPrice price={cheapestPrice} />
            </div>
          )}
        </div>
        {count > 0 && (
          <div className="mt-1.5">
            <StarRating value={average} count={count} size="sm" />
          </div>
        )}
      </div>
    </LocalizedClientLink>
  )
}
