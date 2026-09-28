import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { EawbClient } from "../../../../../modules/eawb/client"
import { eawbOptions } from "../../../../../modules/eawb/config"
import type EawbBookingService from "../../../../../modules/eawb-booking/service"
import { safeUrl } from "../../../../../modules/eawb/service"

// /admin routes use Medusa's built-in authenticated user middleware.
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  if (process.env.EAWB_ENABLED !== "true") return res.json({ enabled: false, booking: null })
  const registry = req.scope.resolve<EawbBookingService>("eawbBooking")
  const [booking] = await registry.listEawbBookings({ order_id: req.params.id })
  if (!booking) return res.json({ enabled: true, booking: null })
  const result = booking.result as Record<string, any> | null
  let label_url = ""
  let status: string | null = null
  let upstream_unavailable = false
  if (booking.status === "booked" && result?.awb_number) {
    const client = new EawbClient(eawbOptions())
    const responses = await Promise.allSettled([
      client.label(result.awb_number),
      client.request<Record<string, any>>(`/orders/${Number(result.order_id)}`),
    ])
    if (responses[0].status === "fulfilled") label_url = safeUrl(responses[0].value.download_url || "")
    if (responses[1].status === "fulfilled") status = responses[1].value.current_status || responses[1].value.order_status || null
    upstream_unavailable = responses.some((r) => r.status === "rejected")
  }
  return res.json({
    enabled: true,
    booking: { status: booking.status, awb: result?.awb_number || null, track_url: safeUrl(result?.track_url || ""), label_url, carrier_status: status, upstream_unavailable },
  })
}
