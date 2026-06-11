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
        className={`fixed inset-0 z-[60] bg-black/20 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        data-testid="side-menu-backdrop"
      />

      {/* Drawer — liquid glass */}
      <div
        className={`fixed top-0 left-0 h-full w-[78%] max-w-xs z-[70] transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border-r border-white/40 shadow-2xl`}
        data-testid="nav-menu-popup"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200/40">
          <span className="font-bold tracking-widest uppercase text-gray-900 text-sm">
            MENV Divers
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-gray-500 transition-all hover:text-gray-900 hover:rotate-90 duration-200"
            data-testid="close-menu-button"
            aria-label="Închide meniu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col px-4 py-6 gap-y-1">
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
              className="group flex items-center justify-between px-3 py-3 rounded-xl text-base text-gray-700 transition-all hover:bg-white/60 hover:text-brand-primary active:scale-[0.98]"
              data-testid={`${label.toLowerCase()}-link`}
            >
              {label}
              <svg className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </LocalizedClientLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-8 left-7 right-7">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} MENV Divers. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
