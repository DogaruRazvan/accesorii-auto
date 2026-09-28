import type { EawbOptions, PaymentMode } from "./types"

export function eawbOptions(env: NodeJS.ProcessEnv = process.env): EawbOptions {
  const positive = (key: string, fallback?: string) => {
    const value = Number(env[key] || fallback)
    if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${key} trebuie să fie un întreg pozitiv.`)
    return value
  }
  if (!env.EAWB_API_KEY?.trim()) throw new Error("Lipsește EAWB_API_KEY.")
  const base_url = env.EAWB_API_URL || "https://api.europarcel.com/api/public"
  const url = new URL(base_url)
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new Error("EAWB_API_URL trebuie să fie un URL HTTPS fără credențiale sau parametri.")
  }
  const payment_modes = (env.EAWB_PAYMENT_MODES || "card,cod").split(",").map((s) => s.trim()) as PaymentMode[]
  if (!payment_modes.length || payment_modes.some((m) => !["card", "cod"].includes(m))) {
    throw new Error("EAWB_PAYMENT_MODES acceptă card,cod.")
  }
  if (payment_modes.includes("cod") && (!env.EAWB_BANK_IBAN || !env.EAWB_BANK_HOLDER)) {
    throw new Error("Pentru ramburs sunt necesare EAWB_BANK_IBAN și EAWB_BANK_HOLDER.")
  }
  const threshold = env.EAWB_FREE_SHIPPING_THRESHOLD ?? "500"
  const free_shipping_threshold = threshold === "off" ? null : Number(threshold)
  if (free_shipping_threshold !== null && (!Number.isFinite(free_shipping_threshold) || free_shipping_threshold <= 0)) {
    throw new Error("EAWB_FREE_SHIPPING_THRESHOLD acceptă un prag pozitiv sau off.")
  }
  const carrier_ids = (env.EAWB_CARRIER_IDS || "").split(",").filter(Boolean).map(Number)
  if (carrier_ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) throw new Error("EAWB_CARRIER_IDS invalid.")
  return {
    api_key: env.EAWB_API_KEY.trim(), base_url: base_url.replace(/\/$/, ""),
    billing_address_id: positive("EAWB_BILLING_ADDRESS_ID"),
    sender_address_id: positive("EAWB_SENDER_ADDRESS_ID"),
    carrier_ids, payment_modes: [...new Set(payment_modes)], free_shipping_threshold,
    bank_iban: env.EAWB_BANK_IBAN?.replace(/\s/g, "").toUpperCase(),
    bank_holder: env.EAWB_BANK_HOLDER,
    create_awb: env.EAWB_CREATE_AWB_ENABLED === "true",
    timeout_ms: positive("EAWB_TIMEOUT_MS", "15000"),
  }
}
