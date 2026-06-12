import "server-only"
import { cookies } from "next/headers"
import { dict, defaultLocale, Locale } from "./dictionary"

// Citeste limba din cookie (server). Fara cookie -> RO (implicit).
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const v = store.get("locale")?.value
  return v === "en" ? "en" : "ro"
}

// Helper de traducere pentru componente server: const t = await getT(); t("nav.store")
export async function getT() {
  const locale = await getLocale()
  const table = dict[locale]
  return (key: string, fallback?: string) =>
    table[key] ?? dict[defaultLocale][key] ?? fallback ?? key
}
