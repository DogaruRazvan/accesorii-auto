import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return <p role="alert">Opțiunile de livrare sau plată nu pot fi încărcate momentan. Reîncărcați pagina.</p>
  }

  const shippingData = cart.shipping_methods?.at(-1)?.data
  const paymentMode = shippingData?.eawb ? shippingData.payment_mode : null
  const allowedPayments = paymentMethods.filter((method) => !paymentMode ||
    (paymentMode === "cod" ? method.id === "pp_system_default" : method.id.startsWith("pp_stripe_")))

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <Payment key={String(paymentMode || "default")} cart={cart} availablePaymentMethods={allowedPayments} />

      <Review cart={cart} />
    </div>
  )
}
