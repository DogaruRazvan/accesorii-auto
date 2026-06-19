"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import { getAuthHeaders } from "./cookies"

export type StoreProductReview = {
  id: string
  product_id: string
  author_name: string
  rating: number
  title: string | null
  content: string
  created_at: string
}

export type ReviewDistribution = Record<string, number>

export type ProductReviewsResponse = {
  reviews: StoreProductReview[]
  count: number
  average: number
  distribution: ReviewDistribution
}

export type ProductReviewStats = {
  average: number
  count: number
}

// Tag-uri globale (nu per-vizitator) ca o recenzie noua sa devina vizibila
// pentru toata lumea dupa revalidare.
const reviewsTag = (productId: string) => `product-reviews-${productId}`

/**
 * Statistici scurte (medie + numar) pentru un produs. Folosit pe carduri,
 * unde nu avem nevoie de continutul recenziilor (limit=0 sare peste randuri).
 */
export const getProductReviewStats = async (
  productId: string
): Promise<ProductReviewStats> => {
  try {
    const { average, count } = await sdk.client.fetch<ProductReviewsResponse>(
      `/store/products/${productId}/reviews`,
      {
        method: "GET",
        query: { limit: 0 },
        headers: { ...(await getAuthHeaders()) },
        next: { revalidate: 60, tags: ["reviews", reviewsTag(productId)] },
      }
    )
    return { average, count }
  } catch {
    return { average: 0, count: 0 }
  }
}

/**
 * Lista de recenzii (paginata) + statistici, pentru pagina produsului.
 */
export const getProductReviews = async (
  productId: string,
  { offset = 0, limit = 10 }: { offset?: number; limit?: number } = {}
): Promise<ProductReviewsResponse> => {
  try {
    return await sdk.client.fetch<ProductReviewsResponse>(
      `/store/products/${productId}/reviews`,
      {
        method: "GET",
        query: { offset, limit },
        headers: { ...(await getAuthHeaders()) },
        next: { revalidate: 60, tags: ["reviews", reviewsTag(productId)] },
      }
    )
  } catch {
    return { reviews: [], count: 0, average: 0, distribution: {} }
  }
}

/**
 * Trimite o recenzie noua. Se publica automat (fara moderare in admin).
 */
export const createProductReview = async (
  productId: string,
  data: { rating: number; author_name: string; title?: string; content: string }
): Promise<{ success: boolean; error?: string }> => {
  try {
    await sdk.client.fetch(`/store/products/${productId}/reviews`, {
      method: "POST",
      body: data,
      headers: { ...(await getAuthHeaders()) },
    })

    revalidateTag("reviews")
    revalidateTag(reviewsTag(productId))

    return { success: true }
  } catch (e: any) {
    const message =
      e?.message ||
      "Nu am putut trimite recenzia. Verifică datele și încearcă din nou."
    return { success: false, error: message }
  }
}
