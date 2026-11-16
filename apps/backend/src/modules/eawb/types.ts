export type PaymentMode = "card" | "cod"

export type EawbOptions = {
  api_key: string
  base_url: string
  /** 0 = use the account's default billing address (resolved from eAWB). */
  billing_address_id: number
  /** 0 = use the account's default pickup address (resolved from eAWB). */
  sender_address_id: number
  carrier_ids: number[]
  payment_modes: PaymentMode[]
  free_shipping_threshold: number | null
  bank_iban?: string
  bank_holder?: string
  create_awb: boolean
  /** Issue the AWB automatically right after the order is placed (card: after capture). */
  auto_awb: boolean
  /** Who receives the AWB label PDF by email. */
  notify_email: string
  timeout_ms: number
  /** Fallback package for products without weight/dimensions: grams + cm. */
  default_parcel?: { weight: number; length: number; width: number; height: number }
}

export type ShippingChoice = {
  /** 0 together with auto=true: the cheapest allowed carrier is picked per order. */
  carrier_id: number
  auto?: boolean
  service_id: 1
  payment_mode: PaymentMode
}

export type Parcel = {
  sequence_no: number
  size: { weight: number; length: number; width: number; height: number }
}

export type ShipmentRequest = {
  carrier_id: number
  service_id: number
  billing_to: { billing_address_id: number }
  address_from: { address_from_id: number }
  address_to: {
    country_code: string
    contact: string
    email: string
    phone: string
    locality_name: string
    county_name: string
    postal_code: string
    street_name: string
    street_number: string
    street_details?: string
  }
  content: {
    envelopes_count: 0
    pallets_count: 0
    parcels_count: number
    total_weight: number
    parcels: Parcel[]
  }
  extra: {
    parcel_content: string
    internal_identifier?: string
    bank_repayment_amount?: number
    bank_repayment_currency?: string
    bank_iban?: string
    bank_holder?: string
  }
}

export type Rate = {
  carrier_id: number
  carrier?: string
  service_id: number
  price: { amount: number; vat: number; total: number; currency: string }
}

export type BookedShipment = {
  order_id: number
  awb_number: string
  carrier_id: number
  service_id: number
  track_url: string
  price: Rate["price"]
}

// Values below come exclusively from Medusa's server-side query, never the browser.
export type ShipmentContext = {
  id: string
  email?: string | null
  currency_code: string
  item_total: number
  total: number
  shipping_address: Record<string, any>
  items: Array<{
    id: string
    quantity: number
    requires_shipping?: boolean
    variant?: Record<string, any> | null
    product?: Record<string, any> | null
  }>
  [key: string]: any
}
