import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  const enabled = process.env.EAWB_ENABLED === "true"
  const value = process.env.EAWB_FREE_SHIPPING_THRESHOLD ?? "500"
  res.json({ enabled, free_shipping_threshold: enabled && value !== "off" ? Number(value) : null })
}
