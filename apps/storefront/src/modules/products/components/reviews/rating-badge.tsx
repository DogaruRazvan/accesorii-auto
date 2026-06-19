import { getProductReviewStats } from "@lib/data/reviews"
import StarRating from "@modules/products/components/star-rating"

/**
 * Sumar compact (stele + nota) afisat langa titlul produsului, cu ancora catre
 * sectiunea de recenzii. Daca nu exista recenzii, invita la prima recenzie.
 */
export default async function ProductRatingBadge({
  productId,
}: {
  productId: string
}) {
  const { average, count } = await getProductReviewStats(productId)

  if (count === 0) {
    return (
      <a
        href="#reviews"
        className="inline-flex w-fit items-center gap-2 text-sm text-subtle hover:text-content transition-colors"
      >
        <StarRating value={0} size="sm" />
        <span className="underline-offset-2 hover:underline">
          Fii primul care lasă o recenzie
        </span>
      </a>
    )
  }

  return (
    <a
      href="#reviews"
      className="inline-flex w-fit items-center gap-2 group"
      aria-label={`${average.toFixed(1)} din 5 stele, ${count} recenzii`}
    >
      <StarRating value={average} size="sm" showValue />
      <span className="text-sm text-subtle underline-offset-2 group-hover:underline">
        {count} {count === 1 ? "recenzie" : "recenzii"}
      </span>
    </a>
  )
}
