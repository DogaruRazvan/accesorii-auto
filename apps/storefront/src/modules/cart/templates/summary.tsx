"use client"

import { Button, Heading } from "@modules/common/components/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "@lib/i18n/context"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const t = useTranslations()
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-5 rounded-3xl border border-line bg-card p-6 shadow-sm">
      <Heading
        level="h2"
        className="text-xl font-bold tracking-tight text-content"
      >
        {t("summary.title")}
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="w-full !rounded-full !h-12 !bg-cta hover:!bg-cta-hover !text-white !border-0 transition-colors">
          {t("summary.checkout")}
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
