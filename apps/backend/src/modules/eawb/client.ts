import type { BookedShipment, EawbOptions, Rate, ShipmentRequest } from "./types"
import { createHash } from "node:crypto"

export class EawbApiError extends Error {
  constructor(public status: number, public uncertain: boolean) {
    super(status === 401 || status === 403
      ? "Integrarea eAWB nu este autorizată. Contactați magazinul."
      : status === 400 || status === 422
        ? "eAWB nu a acceptat datele expedierii. Verificați adresa, coletul și serviciul."
        : "Serviciul eAWB nu este disponibil momentan. Încercați din nou mai târziu.")
  }
}

type AccountDefaults = { billing_address_id: number; sender_address_id: number; bank_iban?: string; bank_holder?: string }

export class EawbClient {
  private priceCache = new Map<string, { expires: number; promise: Promise<Rate[]> }>()
  constructor(private options: EawbOptions) {}

  private defaults?: Promise<AccountDefaults>

  async request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.options.base_url}${path}`, {
        method, redirect: "error", cache: "no-store",
        headers: { "X-API-Key": this.options.api_key, "Content-Type": "application/json", Accept: "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(this.options.timeout_ms),
      })
      if (!response.ok) throw new EawbApiError(response.status, response.status >= 500 || response.status === 408)
      return await response.json() as T
    } catch (error) {
      // Never propagate upstream bodies, request headers, addresses or bank details.
      if (error instanceof EawbApiError) throw error
      throw new EawbApiError(0, true)
    }
  }

  /** Raw request for binary responses (label PDF). */
  async requestBuffer(path: string, method = "GET", body?: unknown): Promise<Buffer> {
    try {
      const response = await fetch(`${this.options.base_url}${path}`, {
        method, redirect: "error", cache: "no-store",
        headers: { "X-API-Key": this.options.api_key, "Content-Type": "application/json", Accept: "application/pdf" },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(this.options.timeout_ms * 2),
      })
      if (!response.ok) throw new EawbApiError(response.status, response.status >= 500)
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      if (error instanceof EawbApiError) throw error
      throw new EawbApiError(0, true)
    }
  }

  /**
   * Default billing/pickup address and COD bank account of the eAWB account,
   * used whenever EAWB_BILLING_ADDRESS_ID / EAWB_SENDER_ADDRESS_ID / EAWB_BANK_* are not set.
   */
  accountDefaults(): Promise<AccountDefaults> {
    if (!this.defaults) {
      const list = (r: any): any[] => (Array.isArray(r) ? r : Array.isArray(r?.data) ? r.data : Array.isArray(r?.list) ? r.list : [])
      const pick = (items: any[]) => Number((items.find((a) => a.is_default) || items[0])?.id) || 0
      this.defaults = Promise.all([
        this.options.billing_address_id ? null : this.request<any>("/addresses/billing?all=true"),
        this.options.sender_address_id ? null : this.request<any>("/addresses/shipping?all=true"),
        this.options.bank_iban && this.options.bank_holder ? null : this.request<any>("/account/profile").catch(() => null),
      ]).then(([billing, senders, profile]) => {
        const p = profile?.data ?? profile ?? {}
        const result: AccountDefaults = {
          billing_address_id: this.options.billing_address_id || pick(list(billing)),
          sender_address_id: this.options.sender_address_id || pick(list(senders)),
          bank_iban: this.options.bank_iban || (p.bank_iban ? String(p.bank_iban).replace(/\s/g, "").toUpperCase() : undefined),
          bank_holder: this.options.bank_holder || (p.bank_holder ? String(p.bank_holder) : undefined),
        }
        const shape = (r: any) => (r == null ? "-" : Array.isArray(r) ? `listă[${r.length}]` : `{${Object.keys(r).join(",")}}`)
        if (!result.billing_address_id) throw new Error(`Contul eAWB nu are o adresă de facturare salvată (răspuns ${shape(billing)}).`)
        if (!result.sender_address_id) throw new Error(`Contul eAWB nu are o adresă de ridicare (expediere) salvată (răspuns ${shape(senders)}). Adăugați-o în eawb.ro → Adrese.`)
        return result
      }).catch((error) => { this.defaults = undefined; throw error })
    }
    return this.defaults
  }

  /** Fills account defaults into a request built with placeholder IDs (0). */
  async prepare(body: ShipmentRequest): Promise<ShipmentRequest> {
    const d = await this.accountDefaults()
    const out: ShipmentRequest = JSON.parse(JSON.stringify(body))
    out.billing_to.billing_address_id ||= d.billing_address_id
    out.address_from.address_from_id ||= d.sender_address_id
    if (Number(out.extra.bank_repayment_amount) > 0) {
      out.extra.bank_iban ||= d.bank_iban
      out.extra.bank_holder ||= d.bank_holder
      if (!out.extra.bank_iban || !out.extra.bank_holder) {
        throw new Error("Pentru ramburs setați EAWB_BANK_IBAN și EAWB_BANK_HOLDER sau completați IBAN-ul în contul eAWB.")
      }
    }
    return out
  }

  /**
   * Valid RON door-to-door rates from every allowed carrier for this shipment,
   * cheapest first. Carriers that cannot serve the address are skipped.
   */
  async allRates(body: ShipmentRequest): Promise<Rate[]> {
    const allowed = this.options.carrier_ids
    const valid = (r: Rate) => r && r.service_id === 1 && (!allowed.length || allowed.includes(r.carrier_id)) &&
      r.price?.currency?.toUpperCase() === "RON" && typeof r.price.total === "number" &&
      Number.isFinite(r.price.total) && r.price.total >= 0
    let rates: Rate[] = []
    // carrier_id 0 may return every carrier at once; fall back to one request per carrier.
    try { rates = (await this.prices({ ...body, carrier_id: 0 })).filter(valid) } catch { rates = [] }
    if (!rates.length) {
      const carriers = [...new Set((await this.services()).filter((s) => s.service_id === 1 &&
        (!allowed.length || allowed.includes(s.carrier_id))).map((s) => s.carrier_id))]
      const settled = await Promise.allSettled(carriers.map((carrier_id) => this.prices({ ...body, carrier_id })))
      rates = settled.flatMap((r) => (r.status === "fulfilled" ? r.value : [])).filter(valid)
    }
    return rates.sort((a, b) => a.price.total - b.price.total)
  }

  /** PDF with the labels of the given eAWB orders (account's saved format, A4 by default). */
  async labelsPdf(orderIds: number[]) {
    return this.requestBuffer("/orders/labels", "POST", { order_ids: orderIds })
  }

  async services() {
    return this.request<Array<{ carrier_id: number; carrier_name: string; service_id: number; service_name: string }>>("/locations/services?country_code=RO&service_id=1")
  }

  async prices(body: ShipmentRequest): Promise<Rate[]> {
    const key = createHash("sha256").update(JSON.stringify(body)).digest("hex")
    const cached = this.priceCache.get(key)
    if (cached && cached.expires > Date.now()) return cached.promise
    if (this.priceCache.size >= 200) this.priceCache.clear()
    const promise = this.prepare(body).then((prepared) => this.request<{ data: Rate[] }>("/orders/prices", "POST", prepared)).then((result) => {
      if (!Array.isArray(result.data)) throw new EawbApiError(0, true)
      return result.data
    }).catch((error) => { this.priceCache.delete(key); throw error })
    this.priceCache.set(key, { expires: Date.now() + 30_000, promise })
    return promise
  }

  async createOrder(body: ShipmentRequest): Promise<BookedShipment> {
    // Deliberately no automatic retries: this request charges the merchant wallet.
    const result = await this.request<{ data: BookedShipment }>("/orders", "POST", await this.prepare(body))
    if (!Number.isSafeInteger(result.data?.order_id) || result.data.order_id <= 0 || !result.data?.awb_number ||
      result.data.carrier_id !== body.carrier_id || result.data.service_id !== body.service_id) throw new EawbApiError(0, true)
    return result.data
  }

  async cancelOrder(id: number) {
    return this.request(`/orders/${id}?refund_channel=wallet`, "DELETE")
  }

  async label(awb: string) {
    return this.request<Record<string, any>>(`/orders/label-link/${encodeURIComponent(awb)}`)
  }
}
