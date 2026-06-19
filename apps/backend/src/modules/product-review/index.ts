import { Module } from "@medusajs/framework/utils"
import ProductReviewModuleService from "./service"

// Numele modulului MUST fi camelCase (fara cratime), e folosit ca cheie de
// rezolvare in container (req.scope.resolve("productReview")).
export const PRODUCT_REVIEW_MODULE = "productReview"

export default Module(PRODUCT_REVIEW_MODULE, {
  service: ProductReviewModuleService,
})
