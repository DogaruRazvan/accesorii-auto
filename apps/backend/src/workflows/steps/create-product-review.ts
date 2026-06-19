import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRODUCT_REVIEW_MODULE } from "../../modules/product-review"
import type ProductReviewModuleService from "../../modules/product-review/service"

export type CreateProductReviewInput = {
  product_id: string
  customer_id?: string | null
  author_name: string
  rating: number
  title?: string | null
  content: string
}

export const createProductReviewStep = createStep(
  "create-product-review",
  async (input: CreateProductReviewInput, { container }) => {
    const service: ProductReviewModuleService =
      container.resolve(PRODUCT_REVIEW_MODULE)

    const review = await service.createProductReviews(input)

    return new StepResponse(review, review.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }
    const service: ProductReviewModuleService =
      container.resolve(PRODUCT_REVIEW_MODULE)
    await service.deleteProductReviews(id)
  }
)
