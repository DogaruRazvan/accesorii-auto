import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { eawbOptions } from "../../modules/eawb/config"
import { choice, invalid, loadCart } from "../../modules/eawb/shipment"
import { validateCheckout } from "../../modules/eawb/checkout-validation"

completeCartWorkflow.hooks.validate(async ({ cart }, { container }) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  // Completed carts must remain idempotent, even when a quote has since expired.
  if (cart.completed_at) return
  const ids = (cart.shipping_methods || []).map((m) => m.shipping_option_id).filter(Boolean)
  if (!ids.length) return
  const { data: options } = await query.graph({ entity: "shipping_option", fields: ["id", "provider_id", "price_type", "data"], filters: { id: ids as string[] } })
  const eawb = options.filter((o) => o.provider_id === "eawb_eawb")
  if (!eawb.length) return
  if (process.env.EAWB_ENABLED !== "true") invalid("Livrarea eAWB este indisponibilă momentan.")
  if (eawb.length !== 1 || cart.shipping_methods.length !== 1) invalid("Selectați o singură metodă eAWB.")
  if (eawb[0].price_type !== "calculated") invalid("Opțiunea eAWB trebuie configurată cu preț calculat în administrarea magazinului.")
  const config = eawbOptions()
  const current = await loadCart(query, cart.id)
  const selected = choice(eawb[0].data || {}, config)
  validateCheckout(current, selected, config)
})
