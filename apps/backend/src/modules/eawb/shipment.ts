import { createHash } from "node:crypto"
import { MedusaError } from "@medusajs/framework/utils"
import type { EawbOptions, ShipmentContext, ShipmentRequest, ShippingChoice } from "./types"

export function invalid(message: string): never {
  throw new MedusaError(MedusaError.Types.INVALID_DATA, message)
}

export const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

export function choice(data: Record<string, unknown>, options: EawbOptions): ShippingChoice {
  const carrier_id = Number(data.carrier_id)
  const payment_mode = data.payment_mode
  if (!Number.isSafeInteger(carrier_id) || carrier_id <= 0 || Number(data.service_id) !== 1 ||
    (options.carrier_ids.length && !options.carrier_ids.includes(carrier_id)) ||
    (payment_mode !== "card" && payment_mode !== "cod") || !options.payment_modes.includes(payment_mode)) {
    invalid("Opțiunea eAWB nu este disponibilă.")
  }
  return { carrier_id, service_id: 1, payment_mode }
}

function required(value: unknown, label: string, min: number, max: number) {
  const result = String(value ?? "").trim()
  if (result.length < min || result.length > max) invalid(`Completați corect ${label}.`)
  return result
}

export function buildShipment(context: ShipmentContext, selected: ShippingChoice, options: EawbOptions): ShipmentRequest {
  if (context.currency_code?.toLowerCase() !== "ron" || context.shipping_address?.country_code?.toLowerCase() !== "ro") {
    invalid("Livrarea eAWB este disponibilă pentru România, în RON.")
  }
  const address = context.shipping_address
  const meta = address.metadata || {}
  const street = required(meta.eawb_street_name || address.address_1, "strada (fără număr)", 5, 100)
  const streetNumber = required(meta.eawb_street_number, "numărul străzii", 1, 25)
  const email = required(context.email, "adresa de email", 3, 100)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid("Adresa de email nu este validă.")
  const parcels: ShipmentRequest["content"]["parcels"] = []
  for (const item of context.items.filter((i) => i.requires_shipping !== false).sort((a, b) => a.id.localeCompare(b.id))) {
    if (!Number.isSafeInteger(Number(item.quantity)) || item.quantity <= 0 || parcels.length + item.quantity > 100) {
      invalid("Cantitatea coletelor nu este validă pentru eAWB.")
    }
    const variant = item.variant || {}
    // One individually packed parcel per unit. No guessed weights or box sizes.
    // Catalogue convention: weight in grams, dimensions in centimetres.
    const weight = Number(variant.weight ?? item.product?.weight)
    const length = Number(variant.length)
    const width = Number(variant.width)
    const height = Number(variant.height)
    if ([weight, length, width, height].some((v) => !Number.isFinite(v) || v <= 0)) {
      invalid("Lipsesc greutatea sau dimensiunile de ambalare pentru un produs. Contactați magazinul.")
    }
    for (let i = 0; i < item.quantity; i++) {
      parcels.push({ sequence_no: parcels.length + 1, size: { weight: Math.ceil(weight) / 1000, length, width, height } })
    }
  }
  if (!parcels.length) invalid("Nu există produse de expediat.")
  if (!Number.isFinite(Number(context.item_total)) || Number(context.item_total) < 0) invalid("Totalul produselor nu este disponibil.")
  return {
    carrier_id: selected.carrier_id, service_id: selected.service_id,
    billing_to: { billing_address_id: options.billing_address_id },
    address_from: { address_from_id: options.sender_address_id },
    address_to: {
      country_code: "RO", email,
      contact: required(`${address.first_name || ""} ${address.last_name || ""}`, "numele complet", 5, 100),
      phone: required(address.phone, "telefonul", 7, 64),
      locality_name: required(address.city, "localitatea", 1, 100),
      county_name: required(address.province, "județul", 1, 100),
      postal_code: required(address.postal_code, "codul poștal", 4, 50),
      street_name: street, street_number: streetNumber,
      ...(address.address_2 ? { street_details: required(address.address_2, "detaliile adresei", 1, 60) } : {}),
    },
    content: {
      envelopes_count: 0, pallets_count: 0, parcels_count: parcels.length,
      total_weight: Math.round(parcels.reduce((sum, p) => sum + p.size.weight, 0) * 1000) / 1000,
      parcels,
    },
    extra: {
      parcel_content: "Produse comandate din magazin",
      ...(selected.payment_mode === "cod" ? {
        bank_repayment_amount: money(Number(context.item_total)), bank_repayment_currency: "RON",
        bank_iban: options.bank_iban, bank_holder: options.bank_holder,
      } : {}),
    },
  }
}

export function shippingFingerprint(context: ShipmentContext, selected: ShippingChoice, options: EawbOptions) {
  return createHash("sha256").update(JSON.stringify({
    request: buildShipment(context, selected, options),
    item_total: money(Number(context.item_total)), threshold: options.free_shipping_threshold,
    items: context.items.map((i) => [i.id, Number(i.quantity)]).sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
  })).digest("hex")
}

export const cartFields = [
  "id", "email", "currency_code", "item_total", "total", "shipping_address.*", "items.*",
  "items.variant.*", "items.product.weight", "shipping_methods.*",
  "payment_collection.payment_sessions.*",
]

export async function loadCart(query: any, id: string): Promise<ShipmentContext> {
  const { data } = await query.graph({ entity: "cart", fields: cartFields, filters: { id } })
  if (!data[0]) invalid("Coșul nu a fost găsit.")
  return data[0]
}
