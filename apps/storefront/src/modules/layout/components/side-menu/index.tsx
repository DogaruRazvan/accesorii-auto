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
    <div className="small:hidden">
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col gap-[5px] p-1 text-gray-700 hover:text-gray-900"
        data-testid="nav-menu-button"
        aria-label="Deschide meniu"
      >
        <span className="block w-5 h-0.5 bg-current" />
        <span className="block w-5 h-0.5 bg-current" />
        <span className="block w-5 h-0.5 bg-current" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40"
          onClick={() => setOpen(false)}
          data-testid="side-menu-backdrop"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[70] shadow-xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        data-testid="nav-menu-popup"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
          <span className="font-bold tracking-widest uppercase text-gray-900 text-sm">
            MENV Divers
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-gray-500 hover:text-gray-900"
            data-testid="close-menu-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col px-6 py-8 gap-y-1">
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
              className="flex items-center py-3 text-base text-gray-700 hover:text-gray-900 border-b border-gray-50 last:border-0 transition-colors"
              data-testid={`${label.toLowerCase()}-link`}
            >
              {label}
            </LocalizedClientLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-8 left-6 right-6">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} MENV Divers. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
