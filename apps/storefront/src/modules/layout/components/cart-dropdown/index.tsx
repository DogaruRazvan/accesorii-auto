"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { navIconButton } from "@modules/layout/components/nav-icon/style"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

// Pragul de la care livrarea e gratuită (în lei). Schimbă-l aici dacă oferta diferă.
const FREE_SHIPPING_THRESHOLD = 200

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const remainingForFree = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)
  const freeShippingPct = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  )

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full flex items-center">
          <LocalizedClientLink
            className={navIconButton}
            href="/cart"
            data-testid="nav-cart-link"
            aria-label="Coș"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-cta text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none ring-2 ring-page">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+14px)] right-0 bg-card rounded-2xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.35)] border border-line w-[400px] text-content overflow-hidden"
            data-testid="nav-cart-dropdown"
          >
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <h3 className="text-base font-semibold tracking-tight">
                Coșul tău
              </h3>
              {totalItems > 0 && (
                <span className="text-xs font-medium text-subtle">
                  {totalItems} {totalItems === 1 ? "produs" : "produse"}
                </span>
              )}
            </div>

            {/* Bară progres livrare gratuită */}
            {cartState && cartState.items?.length ? (
              <div className="px-5 pt-4">
                {remainingForFree > 0 ? (
                  <p className="text-xs text-subtle mb-2">
                    Mai adaugă{" "}
                    <span className="font-semibold text-content">
                      {convertToLocale({
                        amount: remainingForFree,
                        currency_code: cartState.currency_code,
                      })}
                    </span>{" "}
                    pentru livrare gratuită
                  </p>
                ) : (
                  <p className="text-xs font-medium text-emerald-600 mb-2 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Felicitări! Ai livrare gratuită
                  </p>
                )}
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cta transition-all duration-500"
                    style={{ width: `${freeShippingPct}%` }}
                  />
                </div>
              </div>
            ) : null}

            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-auto max-h-[360px] px-5 py-4 grid grid-cols-1 gap-y-5 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[80px_1fr] gap-x-3.5"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-20 shrink-0"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col min-w-0">
                              <h3 className="text-sm font-medium text-content truncate">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  data-testid="product-link"
                                >
                                  {item.title}
                                </LocalizedClientLink>
                              </h3>
                              <div className="text-xs text-subtle">
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                              </div>
                              <span
                                className="text-xs text-subtle mt-0.5"
                                data-testid="cart-item-quantity"
                                data-value={item.quantity}
                              >
                                Cantitate: {item.quantity}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-content shrink-0">
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-1 text-xs text-subtle hover:text-red-500"
                            data-testid="cart-item-remove-button"
                          >
                            Elimină
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="px-5 py-4 border-t border-line flex flex-col gap-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-subtle">
                      Subtotal{" "}
                      <span className="text-xs">(fără TVA)</span>
                    </span>
                    <span
                      className="text-lg font-bold tracking-tight text-content"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink
                    href="/cart"
                    onClick={close}
                    className="w-full inline-flex items-center justify-center h-12 rounded-full bg-cta hover:bg-cta-hover text-white text-sm font-semibold transition-all active:scale-[0.98]"
                    data-testid="go-to-cart-button"
                  >
                    Vezi coșul
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex py-14 flex-col gap-y-4 items-center justify-center px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-subtle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <span className="text-sm text-subtle">Coșul tău e gol.</span>
                <LocalizedClientLink
                  href="/store"
                  onClick={close}
                  className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-cta hover:bg-cta-hover text-white text-sm font-semibold transition-all active:scale-95"
                >
                  Descoperă produsele
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
