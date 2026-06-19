import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { z } from "zod"

// Body pentru crearea unei recenzii (POST /store/products/:id/reviews).
export const CreateProductReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(3).max(2000),
  author_name: z.string().trim().min(2).max(80),
  title: z.string().trim().max(120).optional(),
})
export type CreateProductReviewSchema = z.infer<typeof CreateProductReviewSchema>

const toInt = (val: unknown) =>
  typeof val === "string" && val.length ? parseInt(val, 10) : val

// Query pentru listarea recenziilor (GET /store/products/:id/reviews).
// limit=0 -> doar statistici (medie + numar), fara randuri (folosit pe carduri).
export const GetProductReviewsSchema = z.object({
  offset: z.preprocess(toInt, z.number().min(0).optional()),
  limit: z.preprocess(toInt, z.number().min(0).max(100).optional()),
})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/products/:id/reviews",
      method: "POST",
      middlewares: [validateAndTransformBody(CreateProductReviewSchema)],
    },
    {
      matcher: "/store/products/:id/reviews",
      method: "GET",
      middlewares: [validateAndTransformQuery(GetProductReviewsSchema, {})],
    },
  ],
})
