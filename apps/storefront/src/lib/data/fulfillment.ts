"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import medusaError from "@lib/util/medusa-error"

export const listCartShippingMethods = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: {
          cart_id: cartId,
        },
        headers,
        next,
        cache: "no-store",
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null
    })
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const body = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  return sdk.client
    .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
      `/store/shipping-options/${optionId}/calculate`,
      {
        method: "POST",
        body,
        headers,
        cache: "no-store",
      }
    )
    .then(({ shipping_option }) => shipping_option)
    .catch(medusaError)
}

export async function getShippingPolicy(): Promise<{ enabled: boolean; free_shipping_threshold: number | null }> {
  return sdk.client.fetch<{ enabled: boolean; free_shipping_threshold: number | null }>("/store/eawb/config", { cache: "no-store" })
    .catch(() => ({ enabled: false, free_shipping_threshold: null }))
}
