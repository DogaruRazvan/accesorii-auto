import { EawbClient } from "./client"
import { buildShipment, invalid, money } from "./shipment"
import type { EawbOptions, ShipmentContext, ShippingChoice } from "./types"

export async function quote(client: EawbClient, context: ShipmentContext, selected: ShippingChoice, options: EawbOptions) {
  const request = buildShipment(context, selected, options)
  const free = options.free_shipping_threshold !== null && Number(context.item_total) >= options.free_shipping_threshold
  let shipping = 0
  // COD includes what the customer pays for shipping. Resolve the price/COD dependency
  // to the cent; never silently accept a non-converging or unavailable quote.
  for (let attempt = 0; attempt < 6; attempt++) {
    if (selected.payment_mode === "cod") request.extra.bank_repayment_amount = money(Number(context.item_total) + shipping)
    const rates = await client.prices(request)
    const rate = rates.find((r) => r.carrier_id === selected.carrier_id && r.service_id === selected.service_id)
    if (!rate || rate.price?.currency?.toUpperCase() !== "RON" ||
      typeof rate.price.total !== "number" || !Number.isFinite(rate.price.total) || rate.price.total < 0) {
      invalid("Nu există un tarif eAWB valid pentru această adresă și opțiune.")
    }
    const customerAmount = free ? 0 : money(rate.price.total)
    if (selected.payment_mode === "card" || customerAmount === shipping) {
      return { amount: customerAmount, carrier_amount: money(rate.price.total), request }
    }
    shipping = customerAmount
  }
  invalid("Tariful ramburs nu poate fi stabilit momentan. Alegeți plata cu cardul sau contactați magazinul.")
}
