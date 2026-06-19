import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import ProductReviewModule from "../modules/product-review"

// Un produs are mai multe recenzii. Stergerea produsului sterge recenziile.
export default defineLink(ProductModule.linkable.product, {
  linkable: ProductReviewModule.linkable.productReview,
  isList: true,
  deleteCascade: true,
})
