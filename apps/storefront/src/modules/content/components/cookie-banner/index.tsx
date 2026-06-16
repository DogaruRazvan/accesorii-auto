"use client"

import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const COOKIE_NAME = "menv_cookie_consent"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180 // 180 zile

function hasConsent(): boolean {
  if (typeof document === "undefined") return true
  return document.cookie
    .split("; ")
    .some((c) => c.startsWith(`${COOKIE_NAME}=`))
}

function setConsent(value: "accepted" | "rejected") {
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

/**
 * Banner de consimțământ cookies. Site-ul folosește momentan doar cookie-uri
 * strict necesare, dar bannerul e pregătit pentru viitoare cookie-uri de
 * analiză/marketing. Stilizat cu tokenii de temă, ca să meargă pe dark + light.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!hasConsent()) {
      setVisible(true)
    }
  }, [])

  const handle = (value: "accepted" | "rejected") => {
    setConsent(value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Consimțământ cookies"
      className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-line shadow-lg"
    >
      <div className="content-container py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-subtle flex-1">
          Folosim cookie-uri strict necesare pentru funcționarea site-ului. Prin
          continuarea navigării ești de acord cu utilizarea acestora. Detalii în{" "}
          <LocalizedClientLink
            href="/content/politica-cookies"
            className="underline font-medium text-content hover:opacity-80"
          >
            Politica de cookies
          </LocalizedClientLink>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handle("rejected")}
            className="px-4 py-2 text-sm rounded border border-line text-content hover:bg-muted transition"
          >
            Doar necesare
          </button>
          <button
            onClick={() => handle("accepted")}
            className="px-4 py-2 text-sm rounded bg-cta text-white hover:bg-cta-hover transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
