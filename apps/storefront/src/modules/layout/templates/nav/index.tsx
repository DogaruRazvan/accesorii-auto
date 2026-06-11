import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <nav className="content-container flex items-center justify-between w-full h-full">

          {/* Left: mobile menu + desktop links */}
          <div className="flex items-center gap-x-8 flex-1 basis-0">
            <MobileMenu regions={regions} />
            <div className="hidden small:flex items-center gap-x-6 text-sm font-medium text-gray-600">
              <LocalizedClientLink
                href="/store"
                className="hover:text-gray-900 transition-colors"
                data-testid="nav-store-link"
              >
                Magazin
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/store"
                className="hover:text-gray-900 transition-colors"
              >
                Categorii
              </LocalizedClientLink>
            </div>
          </div>

          {/* Center: logo */}
          <LocalizedClientLink
            href="/"
            className="text-lg font-bold tracking-widest uppercase text-gray-900 hover:text-brand-primary transition-colors"
            data-testid="nav-store-link"
          >
            MENV Divers
          </LocalizedClientLink>

          {/* Right: account + cart */}
          <div className="flex items-center gap-x-4 flex-1 basis-0 justify-end">
            <LocalizedClientLink
              href="/account"
              className="hidden small:flex items-center gap-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              data-testid="nav-account-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  className="flex items-center gap-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  data-testid="nav-cart-link"
                >
                  <CartIcon />
                  <span className="text-sm">0</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>

        </nav>
      </header>
    </div>
  )
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
