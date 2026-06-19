import { Suspense } from "react"
import Image from "next/image"
import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { HttpTypes, StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileMenu from "@modules/layout/components/side-menu"
import NavSearchBar from "@modules/layout/components/nav-search"
import StoreMenu from "@modules/layout/components/store-menu"
import ThemeToggle from "@modules/layout/components/theme-toggle"
import LanguageToggle from "@modules/layout/components/language-toggle"
import { navIconButton } from "@modules/layout/components/nav-icon/style"
import { getT } from "@lib/i18n/server"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const categories = await listCategories().catch(
    () => [] as HttpTypes.StoreProductCategory[]
  )
  const topCategories = (categories || []).filter((c) => !c.parent_category)
  const t = await getT()

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-20 mx-auto bg-page border-b border-line">
        <nav className="content-container flex items-center justify-between w-full h-full gap-x-4">

          {/* Left: hamburger (mobile) + logo + desktop links */}
          <div className="flex items-center gap-x-2 small:gap-x-6 min-w-0 shrink">
            <div className="small:hidden">
              <MobileMenu regions={regions} />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-1.5 small:gap-2.5 transition-transform duration-200 hover:scale-[1.03] min-w-0"
              data-testid="nav-store-link"
            >
              <Image
                src="/logo.png"
                alt="MENV Divers"
                width={160}
                height={158}
                priority
                className="h-10 small:h-14 w-auto object-contain shrink-0"
              />
              {/* Textul brandului dispare pe ecrane foarte inguste (ex. Fold) ca
                  sa ramana loc pentru cos. Logo-ul ramane mereu. */}
              <span className="hidden min-[400px]:inline-block font-display text-base small:text-xl font-bold tracking-tight text-content leading-none whitespace-nowrap">
                MENV{" "}
                <span className="font-medium text-content/50">Divers</span>
              </span>
            </LocalizedClientLink>
            <div className="hidden small:flex items-center gap-x-2 text-sm font-medium">
              <StoreMenu
                label={t("nav.store")}
                allLabel={t("common.allProducts")}
                categories={topCategories}
              />
              <LocalizedClientLink
                href="/content/faq"
                className="inline-flex items-center px-3.5 py-2 rounded-full text-content/70 hover:text-cta hover:bg-cta/10 transition-all duration-200"
              >
                {t("nav.faq")}
              </LocalizedClientLink>
            </div>
          </div>

          {/* Center: search (only on store pages) */}
          <Suspense fallback={null}>
            <NavSearchBar />
          </Suspense>

          {/* Right: language + theme toggle + account + cart */}
          <div className="flex items-center gap-x-1.5 small:gap-x-3 shrink-0">
            <LanguageToggle />
            <ThemeToggle />
            <LocalizedClientLink
              href="/account"
              className={`hidden small:flex ${navIconButton}`}
              data-testid="nav-account-link"
              aria-label={t("nav.account")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  className={navIconButton}
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

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
