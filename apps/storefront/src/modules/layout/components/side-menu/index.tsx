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
        className="flex flex-col gap-[5px] p-1 text-gray-700 transition-colors hover:text-brand-primary"
        data-testid="nav-menu-button"
        aria-label="Deschide meniu"
      >
        <span className="block w-5 h-0.5 bg-current rounded-full" />
        <span className="block w-5 h-0.5 bg-current rounded-full" />
        <span className="block w-5 h-0.5 bg-current rounded-full" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        data-testid="side-menu-backdrop"
      />

      {/* Drawer — blue liquid glass */}
      <div
        className={`fixed top-0 left-0 h-full w-[80%] max-w-xs z-[70] transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-brand-primary/80 backdrop-blur-2xl backdrop-saturate-150 border-r border-white/20 shadow-2xl`}
        data-testid="nav-menu-popup"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/20">
          <span className="font-bold tracking-widest uppercase text-white text-sm">
            MENV Divers
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-white/80 transition-all duration-200 hover:text-white hover:rotate-90 active:scale-90"
            data-testid="close-menu-button"
            aria-label="Închide meniu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Links — minimalist */}
        <nav className="flex flex-col px-6 py-8">
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
              className="py-4 text-lg font-light text-white/90 border-b border-white/10 transition-all duration-200 hover:text-white hover:pl-2 active:opacity-60"
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
