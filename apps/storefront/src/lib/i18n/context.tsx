"use client"

import { createContext, useContext } from "react"
import { dict, defaultLocale, Locale } from "./dictionary"

const LocaleContext = createContext<Locale>(defaultLocale)

// Furnizat din layout (server citeste cookie-ul si paseaza limba in jos).
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  )
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

// Hook de traducere pentru componente client: const t = useTranslations(); t("auth.signIn")
export function useTranslations() {
  const locale = useLocale()
  const table = dict[locale]
  return (key: string, fallback?: string) =>
    table[key] ?? dict[defaultLocale][key] ?? fallback ?? key
}
