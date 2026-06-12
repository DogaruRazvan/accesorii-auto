import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"
import { getT } from "@lib/i18n/server"

const CartTemplate = async ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const t = await getT()
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_400px] gap-x-10 medium:gap-x-16">
            <div className="flex flex-col py-6 gap-y-6">
              <h1 className="text-2xl small:text-3xl font-bold tracking-tight text-content">
                {t("cartpage.title")}
              </h1>
              {!customer && <SignInPrompt />}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-24 py-6">
                {cart && cart.region && <Summary cart={cart} />}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
