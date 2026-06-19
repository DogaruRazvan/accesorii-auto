import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_REVIEW_MODULE } from "../../../../../modules/product-review"
import type ProductReviewModuleService from "../../../../../modules/product-review/service"
import createProductReviewWorkflow from "../../../../../workflows/create-product-review"
import { CreateProductReviewSchema } from "../../../../middlewares"

type ReviewRow = {
  id: string
  product_id: string
  author_name: string
  rating: number
  title: string | null
  content: string
  created_at: Date
}

// Statistici: medie (1 zecimala) + distributie pe stele (1..5).
function buildStats(ratings: { rating: number }[]) {
  const count = ratings.length
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let sum = 0
  for (const { rating } of ratings) {
    sum += rating
    if (distribution[rating] !== undefined) {
      distribution[rating] += 1
    }
  }
  const average = count ? Math.round((sum / count) * 10) / 10 : 0
  return { count, average, distribution }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const { offset = 0, limit = 10 } = req.validatedQuery as {
    offset?: number
    limit?: number
  }

  const service: ProductReviewModuleService = req.scope.resolve(
    PRODUCT_REVIEW_MODULE
  )

  // Toate notele produsului (doar campul rating) pentru medie + distributie.
  const allRatings = (await service.listProductReviews(
    { product_id: id },
    { select: ["rating"] }
  )) as { rating: number }[]

  const stats = buildStats(allRatings)

  // Pagina de recenzii pentru afisare. limit=0 => doar statistici.
  let reviews: ReviewRow[] = []
  if (limit > 0) {
    reviews = (await service.listProductReviews(
      { product_id: id },
      {
        skip: offset,
        take: limit,
        order: { created_at: "DESC" },
      }
    )) as unknown as ReviewRow[]
  }

  return res.json({
    reviews,
    count: stats.count,
    average: stats.average,
    distribution: stats.distribution,
  })
}

export async function POST(
  req: MedusaRequest<CreateProductReviewSchema>,
  res: MedusaResponse
) {
  const { id } = req.params
  const { rating, content, author_name, title } = req.validatedBody

  const { result } = await createProductReviewWorkflow(req.scope).run({
    input: {
      product_id: id,
      rating,
      content,
      author_name,
      title: title ?? null,
      customer_id: null,
    },
  })

  return res.status(201).json({ review: result.review })
}
