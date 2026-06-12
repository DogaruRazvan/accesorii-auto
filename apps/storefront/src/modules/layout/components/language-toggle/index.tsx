"use client"

import { useLocale } from "@lib/i18n/context"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Locale } from "@lib/i18n/dictionary"

// Comutator RO/EN pe cookie (fara schimbare de URL). Seteaza cookie-ul si
// reimprospateaza ruta -> componentele server reciteste limba, iar provider-ul
// din layout paseaza noua limba la componentele client.
const LanguageToggle = () => {
  const locale = useLocale()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const setLocale = (l: Locale) => {
    if (l === locale) return
    document.cookie = `locale=${l}; path=/; max-age=31536000; samesite=lax`
    startTransition(() => router.refresh())
  }

  return (
    <div
      className="flex items-center rounded-full border border-line p-0.5 text-[11px] font-semibold select-none"
      role="group"
      aria-label="Selectează limba"
    >
      {(["ro", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          disabled={pending}
          aria-pressed={locale === l}
          className={`px-2 py-1 rounded-full uppercase tracking-wide transition-colors duration-200 ${
            locale === l
              ? "bg-cta text-white"
              : "text-content/60 hover:text-content"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default LanguageToggle
