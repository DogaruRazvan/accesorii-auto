import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="h-20 bg-[#0A0A0E] border-b border-white/10">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-x-2 uppercase flex-1 basis-0"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block">Înapoi la coș</span>
            <span className="mt-px block small:hidden">Înapoi</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="flex items-center transition-transform hover:scale-105"
            data-testid="store-link"
          >
            <Image
              src="/logo.png"
              alt="MENV Divers"
              width={140}
              height={138}
              className="h-12 w-auto object-contain"
            />
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
