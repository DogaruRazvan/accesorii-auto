import { createHash } from "node:crypto"
import { MedusaService } from "@medusajs/framework/utils"
import EawbBooking from "./models/eawb-booking"
import { EawbApiError, EawbClient } from "../eawb/client"
import { invalid } from "../eawb/shipment"
import type { BookedShipment, ShipmentRequest } from "../eawb/types"

export default class EawbBookingService extends MedusaService({ EawbBooking }) {
  async bookOnce(orderId: string, request: ShipmentRequest, client: EawbClient): Promise<BookedShipment> {
    const hash = createHash("sha256").update(JSON.stringify(request)).digest("hex")
    const reuse = (booking: any): BookedShipment => {
      if (booking.status === "booked" && booking.request_hash === hash && booking.result) return booking.result
      invalid(`Expedierea eAWB pentru această comandă are starea ${booking.status}. Verificați registrul eAWB înainte de o nouă emitere.`)
    }
    const [existing] = await this.listEawbBookings({ order_id: orderId })
    if (existing) return reuse(existing)
    let booking: { id: string }
    try {
      // Committed in this independent module BEFORE calling the carrier. The unique
      // order_id also prevents duplicate purchases across workers and restarts.
      booking = await this.createEawbBookings({ order_id: orderId, request_hash: hash, status: "pending" })
    } catch (error) {
      const [concurrent] = await this.listEawbBookings({ order_id: orderId })
      if (concurrent) return reuse(concurrent)
      throw error
    }
    let result: BookedShipment
    try {
      result = await client.createOrder(request)
    } catch (error) {
      await this.updateEawbBookings({
        id: booking.id,
        status: error instanceof EawbApiError && !error.uncertain ? "rejected" : "uncertain",
      })
      throw error
    }
    // If this write fails, the durable pending record blocks another purchase.
    await this.updateEawbBookings({ id: booking.id, status: "booked", result: result as unknown as Record<string, unknown> })
    return result
  }
}
