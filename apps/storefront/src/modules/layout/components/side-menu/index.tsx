"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
}

const MobileMenu = ({ regions }: SideMenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="small:hidden flex items-center">
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col gap-[5px] p-1 text-gray-900 transition-opacity hover:opacity-60"
        data-testid="nav-menu-button"
        aria-label="Deschide meniu"
      >
        <span className="block w-5 h-0.5 bg-current rounded-full" />
        <span className="block w-5 h-0.5 bg-current rounded-full" />
        <span className="block w-5 h-0.5 bg-current rounded-full" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/10 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        data-testid="side-menu-backdrop"
      />

      {/* Drawer — Apple liquid glass (frosted white) */}
      <div
        className={`fixed top-0 left-0 h-full w-[82%] max-w-xs z-[70] transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-white/60 backdrop-blur-3xl backdrop-saturate-200 border-r border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.12)]`}
        data-testid="nav-menu-popup"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 h-16">
          <span className="font-semibold tracking-wide uppercase text-gray-900 text-sm">
            MENV Divers
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-gray-500 transition-all duration-200 hover:text-gray-900 active:scale-90"
            data-testid="close-menu-button"
            aria-label="Închide meniu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Links — minimalist black & white */}
        <nav className="flex flex-col px-7 mt-4">
          {[
            { label: "Acasă", href: "/" },
            { label: "Magazin", href: "/store" },
            { label: "Categorii", href: "/store" },
            { label: "Contul meu", href: "/account" },
            { label: "Coș", href: "/cart" },
          ].map(({ label, href }) => (
            <LocalizedClientLink
              key={href + label}
              href={href}
              onClick={() => setOpen(false)}
              className="py-4 text-2xl font-light tracking-tight text-gray-900 transition-all duration-200 hover:pl-1.5 hover:opacity-100 opacity-80 active:opacity-50"
              data-testid={`${label.toLowerCase()}-link`}
            >
              {label}
            </LocalizedClientLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default MobileMenu
