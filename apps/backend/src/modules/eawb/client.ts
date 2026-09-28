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

export class EawbClient {
  private priceCache = new Map<string, { expires: number; promise: Promise<Rate[]> }>()
  constructor(private options: EawbOptions) {}

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

  async services() {
    return this.request<Array<{ carrier_id: number; carrier_name: string; service_id: number; service_name: string }>>("/locations/services?country_code=RO&service_id=1")
  }

  async prices(body: ShipmentRequest): Promise<Rate[]> {
    const key = createHash("sha256").update(JSON.stringify(body)).digest("hex")
    const cached = this.priceCache.get(key)
    if (cached && cached.expires > Date.now()) return cached.promise
    if (this.priceCache.size >= 200) this.priceCache.clear()
    const promise = this.request<{ data: Rate[] }>("/orders/prices", "POST", body).then((result) => {
      if (!Array.isArray(result.data)) throw new EawbApiError(0, true)
      return result.data
    }).catch((error) => { this.priceCache.delete(key); throw error })
    this.priceCache.set(key, { expires: Date.now() + 30_000, promise })
    return promise
  }

  async createOrder(body: ShipmentRequest): Promise<BookedShipment> {
    // Deliberately no automatic retries: this request charges the merchant wallet.
    const result = await this.request<{ data: BookedShipment }>("/orders", "POST", body)
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
