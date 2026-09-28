import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type EawbBookingService from "../modules/eawb-booking/service"
import { EawbClient } from "../modules/eawb/client"
import { eawbOptions } from "../modules/eawb/config"

// Operator-only recovery. Never called by checkout or automatically after a timeout.
export default async function reconcile({ container }: ExecArgs) {
  const orderId = process.env.EAWB_RECONCILE_ORDER_ID
  if (!orderId || process.env.EAWB_RECONCILE_CONFIRM !== orderId) {
    throw new Error("Confirmați verificarea manuală în eAWB: EAWB_RECONCILE_CONFIRM trebuie să fie ID-ul comenzii Medusa.")
  }
  const registry = container.resolve<EawbBookingService>("eawbBooking")
  const [booking] = await registry.listEawbBookings({ order_id: orderId })
  if (!booking || !["pending", "uncertain", "rejected"].includes(booking.status)) {
    throw new Error("Doar emiterile pending/uncertain/rejected pot fi reconciliate prin acest script.")
  }
  const action = process.env.EAWB_RECONCILE_ACTION
  if (action === "confirm-no-awb") {
    // The operator has confirmed in the eAWB account/support that no shipment exists.
    await registry.softDeleteEawbBookings([booking.id])
  } else if (action === "attach") {
    const externalId = Number(process.env.EAWB_RECONCILE_EXTERNAL_ID)
    if (!Number.isSafeInteger(externalId) || externalId <= 0) throw new Error("EAWB_RECONCILE_EXTERNAL_ID invalid.")
    const client = new EawbClient(eawbOptions())
    const remote = await client.request<Record<string, any>>(`/orders/${externalId}`)
    if (!remote.awb || !remote.carrier_id || !remote.service_id || !Number.isFinite(Number(remote.total_amount))) {
      throw new Error("Răspuns eAWB incomplet; nu se poate atașa automat.")
    }
    await registry.updateEawbBookings({
      id: booking.id, status: "booked",
      result: {
        order_id: externalId, awb_number: remote.awb, carrier_id: remote.carrier_id,
        service_id: remote.service_id, track_url: remote.track_url || "",
        price: { amount: Number(remote.subtotal), vat: Number(remote.tax_amount), total: Number(remote.total_amount), currency: remote.currency },
      },
    })
  } else {
    throw new Error("EAWB_RECONCILE_ACTION trebuie să fie attach sau confirm-no-awb.")
  }
  container.resolve(ContainerRegistrationKeys.LOGGER).info(`Registrul eAWB a fost reconciliat pentru ${orderId}. Nu a fost emis niciun AWB de către script.`)
}
