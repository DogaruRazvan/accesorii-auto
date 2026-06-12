import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  searchQuery,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchQuery?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="content-container py-8" data-testid="category-container">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center gap-1 text-sm text-subtle hover:text-content transition-colors w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Înapoi la magazin
        </LocalizedClientLink>

        <h1
          className="text-2xl small:text-3xl font-bold text-content tracking-tight"
          data-testid="store-page-title"
        >
          {searchQuery ? `Rezultate pentru „${searchQuery}”` : "Toate produsele"}
        </h1>
      </div>

      {/* Sort + grid */}
      <div className="flex flex-col small:flex-row small:items-start">
        <RefinementList sortBy={sort} />
        <div className="w-full">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              searchQuery={searchQuery}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
