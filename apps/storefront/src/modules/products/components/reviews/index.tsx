import { getProductReviews } from "@lib/data/reviews"
import { HttpTypes } from "@medusajs/types"
import StarRating from "@modules/products/components/star-rating"
import ReviewForm from "./review-form"

const dateFmt = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export default async function ProductReviews({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { reviews, count, average, distribution } = await getProductReviews(
    product.id,
    { limit: 20 }
  )

  const jsonLd =
    count > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          image: product.thumbnail ? [product.thumbnail] : undefined,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: average,
            reviewCount: count,
            bestRating: 5,
            worstRating: 1,
          },
          review: reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
            },
            author: { "@type": "Person", name: r.author_name },
            reviewBody: r.content,
            datePublished: r.created_at,
          })),
        }
      : null

  return (
    <section
      id="reviews"
      className="content-container my-16 small:my-24 scroll-mt-24"
    >
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <h2 className="text-2xl small:text-3xl font-semibold text-content mb-8">
        Recenzii
      </h2>

      <div className="grid grid-cols-1 large:grid-cols-[320px_1fr] gap-10 large:gap-16">
        {/* Coloana stanga: sumar + formular */}
        <div className="flex flex-col gap-6">
          {count > 0 ? (
            <div className="rounded-2xl border border-line bg-card p-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-content tabular-nums leading-none">
                  {average.toFixed(1)}
                </span>
                <div className="flex flex-col gap-1">
                  <StarRating value={average} size="md" />
                  <span className="text-sm text-subtle">
                    {count}{" "}
                    {count === 1 ? "recenzie" : count < 20 ? "recenzii" : "de recenzii"}
                  </span>
                </div>
              </div>

              {/* Distributie pe stele */}
              <div className="mt-5 flex flex-col gap-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const n = distribution?.[star] ?? 0
                  const pct = count ? (n / count) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-subtle tabular-nums">{star}</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-amber-400 shrink-0"
                      >
                        <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5z" />
                      </svg>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full bg-amber-400"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="w-5 text-right text-subtle tabular-nums">
                        {n}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-card p-6 text-center">
              <StarRating value={0} size="lg" className="justify-center" />
              <p className="mt-3 font-semibold text-content">
                Încă nu există recenzii
              </p>
              <p className="mt-1 text-sm text-subtle">
                Fii primul care lasă o părere despre acest produs.
              </p>
            </div>
          )}

          <ReviewForm productId={product.id} />
        </div>

        {/* Coloana dreapta: lista recenzii */}
        <div>
          {reviews.length > 0 ? (
            <ul className="flex flex-col divide-y divide-line">
              {reviews.map((r) => (
                <li key={r.id} className="py-6 first:pt-0">
                  <div className="flex items-center justify-between gap-4">
                    <StarRating value={r.rating} size="sm" />
                    <span className="text-xs text-subtle">
                      {dateFmt.format(new Date(r.created_at))}
                    </span>
                  </div>
                  {r.title && (
                    <p className="mt-2 font-semibold text-content">{r.title}</p>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-content/80 whitespace-pre-line">
                    {r.content}
                  </p>
                  <p className="mt-2 text-xs font-medium text-subtle">
                    {r.author_name}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-subtle">
              Nicio recenzie momentan. Părerea ta poate fi prima!
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
