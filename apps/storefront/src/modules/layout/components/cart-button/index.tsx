import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"
import { getShippingPolicy } from "@lib/data/fulfillment"

export default async function CartButton() {
  const [cart, policy] = await Promise.all([retrieveCart().catch(() => null), getShippingPolicy()])

  return <CartDropdown cart={cart} freeShippingThreshold={policy.free_shipping_threshold} />
}
