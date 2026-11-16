import type { EawbOptions, PaymentMode } from "./types"

/**
 * eAWB is on when EAWB_ENABLED=true, or when EAWB_ENABLED is not set at all and
 * EAWB_API_KEY exists (so setting only the key on Railway is enough).
 * EAWB_ENABLED=false always turns it off.
 */
export function eawbEnabled(env: NodeJS.ProcessEnv = process.env) {
  if (env.EAWB_ENABLED === "true") return true
  if (env.EAWB_ENABLED === "false") return false
  return !!env.EAWB_API_KEY?.trim()
}

export function eawbOptions(env: NodeJS.ProcessEnv = process.env): EawbOptions {
  const positive = (key: string, fallback?: string) => {
    const value = Number(env[key] || fallback)
    if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${key} trebuie să fie un întreg pozitiv.`)
    return value
  }
  // Optional address IDs: when missing, the default addresses of the eAWB account are used.
  const optionalId = (key: string) => (env[key]?.trim() ? positive(key) : 0)
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
  // IBAN/holder for COD: from env, otherwise taken from the eAWB account profile at runtime.
  const threshold = env.EAWB_FREE_SHIPPING_THRESHOLD?.trim() || "500"
  const free_shipping_threshold = threshold === "off" ? null : Number(threshold)
  if (free_shipping_threshold !== null && (!Number.isFinite(free_shipping_threshold) || free_shipping_threshold <= 0)) {
    throw new Error("EAWB_FREE_SHIPPING_THRESHOLD acceptă un prag pozitiv sau off.")
  }
  const carrier_ids = (env.EAWB_CARRIER_IDS || "").split(",").filter(Boolean).map(Number)
  if (carrier_ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) throw new Error("EAWB_CARRIER_IDS invalid.")
  // AWB purchase and automatic issuing are on by default; set "false" to turn them off.
  const create_awb = env.EAWB_CREATE_AWB_ENABLED !== "false"
  return {
    api_key: env.EAWB_API_KEY.trim(), base_url: base_url.replace(/\/$/, ""),
    billing_address_id: optionalId("EAWB_BILLING_ADDRESS_ID"),
    sender_address_id: optionalId("EAWB_SENDER_ADDRESS_ID"),
    carrier_ids, payment_modes: [...new Set(payment_modes)], free_shipping_threshold,
    bank_iban: env.EAWB_BANK_IBAN?.replace(/\s/g, "").toUpperCase() || undefined,
    bank_holder: env.EAWB_BANK_HOLDER?.trim() || undefined,
    create_awb,
    auto_awb: create_awb && env.EAWB_AUTO_AWB !== "false",
    notify_email: env.EAWB_NOTIFY_EMAIL?.trim() || "menvdivers@yahoo.com",
    timeout_ms: positive("EAWB_TIMEOUT_MS", "15000"),
    default_parcel: defaultParcel(env.EAWB_DEFAULT_PARCEL),
  }
}

/** "1000,30,20,10" = 1000 g, 30x20x10 cm. Empty = no fallback (products must have their own data). */
function defaultParcel(value?: string) {
  if (!value?.trim()) return undefined
  const [weight, length, width, height] = value.split(/[,x×\s]+/).filter(Boolean).map(Number)
  if (![weight, length, width, height].every((v) => Number.isFinite(v) && v > 0)) {
    throw new Error("EAWB_DEFAULT_PARCEL trebuie să fie greutate_g,lungime_cm,lățime_cm,înălțime_cm (ex. 1000,30,20,10).")
  }
  return { weight, length, width, height }
}
