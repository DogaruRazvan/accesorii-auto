import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { eawbEnabled } from "../../../../modules/eawb/config"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  const enabled = eawbEnabled()
  const value = process.env.EAWB_FREE_SHIPPING_THRESHOLD?.trim() || "500"
  res.json({ enabled, free_shipping_threshold: enabled && value !== "off" ? Number(value) : null })
}
