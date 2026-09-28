import type { EawbOptions, ShipmentContext, ShippingChoice } from "./types"
import { invalid, money, shippingFingerprint } from "./shipment"

export function validateCheckout(current: ShipmentContext, selected: ShippingChoice, config: EawbOptions, now = Date.now()) {
  if (current.shipping_methods?.length !== 1) invalid("Selectați o singură metodă eAWB.")
  const method = current.shipping_methods[0]
  const age = now - Date.parse(String(method.data?.eawb_quoted_at))
  if (method.data?.eawb_fingerprint !== shippingFingerprint(current, selected, config) ||
    !Number.isFinite(age) || age < 0 || age > 15 * 60 * 1000) {
    invalid("Datele sau tariful livrării trebuie reconfirmate. Reveniți la Livrare și selectați din nou curierul.")
  }
  const sessions = (current.payment_collection?.payment_sessions || []).filter((s: any) => ["pending", "requires_more", "authorized", "captured"].includes(s.status))
  if (sessions.length !== 1 || (selected.payment_mode === "cod"
    ? sessions[0].provider_id !== "pp_system_default"
    : !sessions[0].provider_id?.startsWith("pp_stripe_"))) {
    invalid("Metoda de plată trebuie să corespundă opțiunii de livrare (card sau ramburs).")
  }
  // Shipping promotions/credits change the COD amount used in the quote.
  // Free shipping is applied by the provider using the configured threshold.
  if (money(Number(current.total)) !== money(Number(current.item_total) + Number(method.amount))) {
    invalid("Totalul comenzii diferă de calculul eAWB. Eliminați reducerile de transport sau contactați magazinul.")
  }
}
