import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import type { CalculateShippingOptionPriceDTO, CreateFulfillmentResult, FulfillmentDTO, FulfillmentItemDTO, FulfillmentOrderDTO } from "@medusajs/framework/types"
import type EawbBookingService from "../eawb-booking/service"
import { EawbClient } from "./client"
import { buildShipment, choice, invalid, loadCart, money, shippingFingerprint } from "./shipment"
import { quote } from "./pricing"
import type { EawbOptions, ShipmentContext } from "./types"

export default class EawbProviderService extends AbstractFulfillmentProviderService {
  static identifier = "eawb"
  private client: EawbClient
  constructor(private readonly dependencies: { query: any; eawbBooking: EawbBookingService }, private options: EawbOptions) {
    super()
    this.client = new EawbClient(options)
  }

  async getFulfillmentOptions() {
    const services = await this.client.services()
    return services.filter((s) => s.service_id === 1 && (!this.options.carrier_ids.length || this.options.carrier_ids.includes(s.carrier_id)))
      .flatMap((s) => this.options.payment_modes.map((payment_mode) => ({
        id: `${s.carrier_id}-1-${payment_mode}`,
        name: `${s.carrier_name} — ${payment_mode === "cod" ? "ramburs" : "plată cu cardul"}`,
        carrier_id: s.carrier_id, service_id: 1, payment_mode,
      })))
  }

  async validateOption(data: Record<string, unknown>) {
    try { choice(data, this.options); return true } catch { return false }
  }
  async canCalculate() { return true }

  async calculatePrice(optionData: CalculateShippingOptionPriceDTO["optionData"], _data: CalculateShippingOptionPriceDTO["data"], context: CalculateShippingOptionPriceDTO["context"]) {
    const selected = choice(optionData, this.options)
    // Medusa 2.15's calculate workflow omits email/currency/totals. Load them on the
    // server rather than accepting client-supplied weights, totals or COD amounts.
    const cart = await loadCart(this.dependencies.query, String(context.id))
    const result = await quote(this.client, cart, selected, this.options)
    return { calculated_amount: result.amount, is_calculated_price_tax_inclusive: true }
  }

  async validateFulfillmentData(optionData: Record<string, unknown>, _data: Record<string, unknown>, context: any) {
    const selected = choice(optionData, this.options)
    const cart = await loadCart(this.dependencies.query, String(context.id))
    return {
      ...selected, eawb: true,
      eawb_fingerprint: shippingFingerprint(cart, selected, this.options),
      eawb_quoted_at: new Date().toISOString(),
    }
  }

  async createFulfillment(
    _data: Record<string, unknown>, items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>,
  ): Promise<CreateFulfillmentResult> {
    if (!this.options.create_awb) invalid("Emiterea AWB este dezactivată. Configurați EAWB_CREATE_AWB_ENABLED după verificarea integrării.")
    if (!order?.id) invalid("Comanda lipsește din cererea de expediere.")
    const { data } = await this.dependencies.query.graph({
      entity: "order", filters: { id: order.id },
      fields: ["id", "email", "currency_code", "item_total", "total", "status", "shipping_address.*", "items.*", "items.variant.*", "items.product.weight", "shipping_methods.*", "fulfillments.*", "payment_collections.payments.*", "payment_collections.payments.captures.*", "payment_collections.payments.refunds.*"],
    })
    const fullOrder = data[0] as ShipmentContext
    if (!fullOrder || fullOrder.status === "canceled") invalid("Comanda nu poate fi expediată.")
    if (fullOrder.shipping_methods?.length !== 1 || !fullOrder.shipping_methods[0].data?.eawb) invalid("Comanda trebuie să aibă o singură metodă eAWB.")
    if ((fullOrder.fulfillments || []).some((f: any) => !f.canceled_at && f.id !== fulfillment.id)) invalid("Comanda are deja o expediere activă.")
    const physical = fullOrder.items.filter((i) => i.requires_shipping !== false)
    if (physical.length !== items.length || physical.some((i) => items.filter((f) => f.line_item_id === i.id).reduce((sum, f) => sum + Number(f.quantity), 0) !== Number(i.quantity))) {
      invalid("Integrarea eAWB expediază comanda integral. Selectați toate produsele și cantitățile.")
    }
    const selected = choice(fullOrder.shipping_methods[0].data, this.options)
    const payments = (fullOrder.payment_collections || []).flatMap((p: any) => p.payments || [])
    const captured = payments.filter((p: any) => p.provider_id?.startsWith("pp_stripe_") && !p.canceled_at)
      .reduce((total: number, p: any) => total + (p.captures || []).reduce((sum: number, c: any) => sum + Number(c.amount), 0) -
        (p.refunds || []).reduce((sum: number, r: any) => sum + Number(r.amount), 0), 0)
    if (selected.payment_mode === "card" && money(captured) < money(Number(fullOrder.total))) {
      invalid("Plata cu cardul trebuie încasată înainte de emiterea AWB.")
    }
    if (selected.payment_mode === "cod" && !payments.some((p: any) => p.provider_id === "pp_system_default" && !p.canceled_at)) {
      invalid("Comanda nu are o plată ramburs validă.")
    }
    const request = buildShipment(fullOrder, selected, this.options)
    request.extra.internal_identifier = fullOrder.id
    if (selected.payment_mode === "cod") request.extra.bank_repayment_amount = money(Number(fullOrder.total))
    const booked = await this.dependencies.eawbBooking.bookOnce(fullOrder.id, request, this.client)
    if (booked.carrier_id !== selected.carrier_id || booked.service_id !== selected.service_id) {
      invalid("AWB-ul salvat nu corespunde serviciului ales. Verificați reconcilierea în registrul eAWB.")
    }
    // Label lookup failing after purchase must never cause another purchase.
    let labelUrl = ""
    try {
      const label = await this.client.label(booked.awb_number)
      labelUrl = String(label.download_url || "")
    } catch { /* The authenticated admin endpoint can retrieve a fresh link later. */ }
    return {
      data: { ...selected, eawb: true, eawb_order_id: booked.order_id, eawb_medusa_order_id: fullOrder.id, eawb_awb: booked.awb_number },
      labels: [{ tracking_number: booked.awb_number, tracking_url: safeUrl(booked.track_url), label_url: safeUrl(labelUrl) }],
    }
  }

  async cancelFulfillment(data: Record<string, unknown>) {
    if (!Number.isSafeInteger(data.eawb_order_id)) invalid("Lipsește identificatorul AWB pentru anulare.")
    await this.client.cancelOrder(Number(data.eawb_order_id))
    const [booking] = await this.dependencies.eawbBooking.listEawbBookings({ order_id: String(data.eawb_medusa_order_id) })
    if (booking) await this.dependencies.eawbBooking.updateEawbBookings({ id: booking.id, status: "cancelled" })
    return data
  }

  async createReturnFulfillment(): Promise<CreateFulfillmentResult> {
    invalid("AWB-urile de retur se creează momentan direct în contul eAWB.")
  }
}

export function safeUrl(value: string) {
  try {
    const url = new URL(value)
    return ["https:", "http:"].includes(url.protocol) ? url.toString() : ""
  } catch { return "" }
}
