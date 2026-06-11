import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-sm font-medium uppercase tracking-wide text-brand-secondary hover:text-brand-primary transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <h1
          className="text-3xl small:text-4xl font-bold leading-tight tracking-tight text-gray-950"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        {product.description && (
          <p
            className="text-base leading-relaxed text-gray-500 whitespace-pre-line"
            data-testid="product-description"
          >
            {product.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
