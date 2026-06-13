"use client"

import { usePathname } from "next/navigation"

// Ascunde footer-ul DOAR pe home (scena cinematica full-screen).
// Home = "/" sau "/{cc}" (ex. /ro, /us). Restul paginilor il pastreaza.
export default function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/" || /^\/[a-z]{2}$/.test(pathname)

  if (isHome) return null
  return <>{children}</>
}
