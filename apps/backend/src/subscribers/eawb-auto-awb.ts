import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createOrderFulfillmentWorkflow } from "@medusajs/medusa/core-flows"
import { eawbEnabled, eawbOptions } from "../modules/eawb/config"
import { EawbClient } from "../modules/eawb/client"
import type EawbBookingService from "../modules/eawb-booking/service"

// Genereaza automat AWB-ul eAWB la plasarea comenzii si trimite eticheta PDF pe
// email catre magazin (EAWB_NOTIFY_EMAIL, implicit menvdivers@yahoo.com).
//
// - Ramburs: AWB imediat (suma ramburs = totalul comenzii).
// - Card: asteptam captarea platii (subscriber-ul capture-payment ruleaza in
//   paralel pe acelasi eveniment), apoi AWB.
// - Foloseste fluxul nativ Medusa (createOrderFulfillmentWorkflow -> providerul
//   eAWB), deci registrul anti-duplicat si toate verificarile raman active.
// - Oprire: EAWB_AUTO_AWB=false (AWB-ul se genereaza manual din Fulfill items).

const CAPTURE_WAIT_MS = 90_000
const CAPTURE_POLL_MS = 5_000
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const orderFields = [
  "id", "display_id", "email", "total", "status",
  "items.id", "items.quantity", "items.requires_shipping",
  "shipping_methods.data", "shipping_address.*",
  "fulfillments.id", "fulfillments.canceled_at", "fulfillments.data", "fulfillments.labels.*",
  "payment_collections.payments.provider_id", "payment_collections.payments.captured_at",
  "payment_collections.payments.canceled_at",
]

export default async function eawbAutoAwbHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
  if (!eawbEnabled()) return
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notification = container.resolve(Modules.NOTIFICATION)
  let options: ReturnType<typeof eawbOptions>
  try { options = eawbOptions() } catch (e: any) {
    logger.error(`eAWB auto: configurare invalidă — ${e?.message}`)
    return
  }
  if (!options.auto_awb) return

  const load = async () => {
    const { data: orders } = await query.graph({ entity: "order", fields: orderFields, filters: { id: data.id } })
    return orders?.[0] as any
  }

  let order = await load()
  const method = order?.shipping_methods?.[0]
  if (!order || order.status === "canceled" || !method?.data?.eawb) return
  if ((order.fulfillments || []).some((f: any) => !f.canceled_at)) return

  const notifyFailure = async (error: string) => {
    logger.error(`eAWB auto: comanda ${order.id} fără AWB — ${error}`)
    try {
      await notification.createNotifications({
        to: options.notify_email, channel: "email", template: "eawb-awb-failed",
        data: { display_id: order.display_id, error },
      })
    } catch (e: any) { logger.error(`eAWB auto: emailul de eroare nu a putut fi trimis — ${e?.message}`) }
  }

  try {
    if (method.data.payment_mode === "card") {
      const deadline = Date.now() + CAPTURE_WAIT_MS
      const captured = (o: any) => (o.payment_collections || []).flatMap((p: any) => p.payments || [])
        .some((p: any) => String(p.provider_id || "").includes("stripe") && p.captured_at && !p.canceled_at)
      while (!captured(order)) {
        if (Date.now() > deadline) return notifyFailure("Plata cu cardul nu a fost încasată în 90 de secunde. Verifică plata, apoi generează AWB-ul din Fulfill items.")
        await sleep(CAPTURE_POLL_MS)
        order = await load()
      }
    }

    const items = (order.items || [])
      .filter((i: any) => i.requires_shipping !== false)
      .map((i: any) => ({ id: i.id, quantity: Number(i.quantity) }))
    await createOrderFulfillmentWorkflow(container).run({ input: { order_id: order.id, items } })
  } catch (e: any) {
    return notifyFailure(e?.message || "Eroare necunoscută la emiterea AWB.")
  }

  // AWB cumparat. De aici, orice eroare afecteaza doar emailul, nu expedierea.
  try {
    order = await load()
    const fulfillment = (order.fulfillments || []).find((f: any) => !f.canceled_at && f.data?.eawb_awb)
    if (!fulfillment) return
    const label = fulfillment.labels?.[0] || {}
    const registry = container.resolve<EawbBookingService>("eawbBooking")
    const [booking] = await registry.listEawbBookings({ order_id: order.id })
    const booked = (booking?.result || {}) as any

    const client = new EawbClient(options)
    let pdf: Buffer | null = null
    try { pdf = await client.labelsPdf([Number(fulfillment.data.eawb_order_id)]) } catch (e: any) {
      logger.warn(`eAWB auto: PDF-ul etichetei nu a putut fi descărcat — ${e?.message}`)
    }
    let labelUrl = String(label.label_url || "")
    if (!labelUrl) {
      try { labelUrl = String((await client.label(fulfillment.data.eawb_awb)).download_url || "") } catch { /* optional */ }
    }

    const a = order.shipping_address || {}
    const awb = String(fulfillment.data.eawb_awb)
    await notification.createNotifications({
      to: options.notify_email, channel: "email", template: "eawb-awb-created",
      data: {
        display_id: order.display_id, awb,
        carrier: booked.carrier, carrier_price: Number(booked.price?.total),
        payment_mode: fulfillment.data.payment_mode, cod_amount: Number(order.total),
        customer_name: [a.first_name, a.last_name].filter(Boolean).join(" "),
        customer_phone: a.phone,
        address: [a.address_1, a.metadata?.eawb_street_number, a.address_2, a.city, a.province, a.postal_code].filter(Boolean).join(", "),
        tracking_url: label.tracking_url || booked.track_url, label_url: labelUrl,
        has_attachment: !!pdf?.length,
      },
      ...(pdf?.length ? {
        attachments: [{ filename: `AWB-${awb}-comanda-${order.display_id}.pdf`, content: pdf.toString("base64"), content_type: "application/pdf", disposition: "attachment" }],
      } : {}),
    })
    logger.info(`eAWB auto: AWB ${awb} pentru comanda ${order.id} trimis pe ${options.notify_email}`)
  } catch (e: any) {
    logger.error(`eAWB auto: AWB emis pentru ${order.id}, dar emailul a eșuat — ${e?.message}`)
  }
}

export const config: SubscriberConfig = { event: "order.placed" }
