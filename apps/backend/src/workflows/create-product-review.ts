import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import {
  createProductReviewStep,
  CreateProductReviewInput,
} from "./steps/create-product-review"
import { PRODUCT_REVIEW_MODULE } from "../modules/product-review"

const createProductReviewWorkflow = createWorkflow(
  "create-product-review",
  function (input: CreateProductReviewInput) {
    const review = createProductReviewStep(input)

    // Ordinea TREBUIE sa fie ca in defineLink: product intai, apoi recenzia.
    const linkData = transform({ review, input }, ({ review, input }) => [
      {
        [Modules.PRODUCT]: { product_id: input.product_id },
        [PRODUCT_REVIEW_MODULE]: { product_review_id: review.id },
      },
    ])

    createRemoteLinkStep(linkData)

    return new WorkflowResponse({ review })
  }
)

export default createProductReviewWorkflow
