import { Suspense } from "react"
import Image from "next/image"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileMenu from "@modules/layout/components/side-menu"
import NavSearchBar from "@modules/layout/components/nav-search"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-20 mx-auto bg-[#0A0A0E] border-b border-white/10">
        <nav className="content-container flex items-center justify-between w-full h-full gap-x-4">

          {/* Left: hamburger (mobile) + logo + desktop links */}
          <div className="flex items-center gap-x-6 shrink-0">
            <div className="small:hidden">
              <MobileMenu regions={regions} />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center transition-transform duration-200 hover:scale-105"
              data-testid="nav-store-link"
            >
              <Image
                src="/logo.png"
                alt="MENV Divers"
                width={160}
                height={158}
                priority
                className="h-14 w-auto object-contain"
              />
            </LocalizedClientLink>
            <div className="hidden small:flex items-center gap-x-8 text-sm font-medium text-white/70">
              <NavLink href="/store">Magazin</NavLink>
            </div>
          </div>

          {/* Center: search (only on store pages) */}
          <Suspense fallback={null}>
            <NavSearchBar />
          </Suspense>

          {/* Right: account + cart */}
          <div className="flex items-center gap-x-5 shrink-0">
            <LocalizedClientLink
              href="/account"
              className="hidden small:flex items-center text-white/70 transition-all duration-200 hover:text-brand-accent hover:scale-110"
              data-testid="nav-account-link"
              aria-label="Contul meu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  className="flex items-center text-white/70 transition-all duration-200 hover:text-brand-accent hover:scale-110"
                  data-testid="nav-cart-link"
                  aria-label="Coș"
                >
                  <CartIcon />
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

/* Desktop link cu underline auriu care creste de la stanga la hover */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <LocalizedClientLink
      href={href}
      className="relative py-1 transition-colors duration-200 hover:text-white after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:rounded-full after:bg-brand-accent after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </LocalizedClientLink>
  )
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
