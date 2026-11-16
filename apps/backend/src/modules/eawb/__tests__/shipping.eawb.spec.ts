import { buildShipment, choice, shippingFingerprint } from "../shipment"
import { quote } from "../pricing"
import { eawbEnabled, eawbOptions } from "../config"
import { validateCheckout } from "../checkout-validation"
import EawbProviderService from "../service"
import { EawbApiError, EawbClient } from "../client"
import type { EawbOptions, ShipmentContext, ShippingChoice } from "../types"

const options: EawbOptions = {
  api_key: "test-key", base_url: "https://example.invalid/api/public", billing_address_id: 1,
  sender_address_id: 2, carrier_ids: [3], payment_modes: ["card", "cod"],
  free_shipping_threshold: 500, bank_iban: "RO49AAAA1B31007593840000", bank_holder: "Test",
  create_awb: false, auto_awb: false, notify_email: "shop@example.invalid", timeout_ms: 1000,
}
const selected: ShippingChoice = { carrier_id: 3, service_id: 1, payment_mode: "card" }
function context(): ShipmentContext {
  return {
    id: "cart_test", email: "test@example.invalid", currency_code: "ron", item_total: 100, total: 100,
    shipping_address: { country_code: "ro", first_name: "Client", last_name: "Test", phone: "0700000000", city: "Bucuresti", province: "B", postal_code: "010101", address_1: "Strada Test, nr. 1", metadata: { eawb_street_name: "Strada Test", eawb_street_number: "1" } },
    items: [{ id: "item_1", quantity: 2, variant: { weight: 450, length: 30, width: 20, height: 10 } }],
  }
}
const rate = (total: number) => [{ carrier_id: 3, service_id: 1, price: { amount: total / 1.21, vat: total - total / 1.21, total, currency: "RON" } }]

describe("eAWB shipment and live pricing", () => {
  test("builds parcel sequences and converts grams to kg without guessing package dimensions", () => {
    const payload = buildShipment(context(), selected, options)
    expect(payload.content).toMatchObject({ parcels_count: 2, total_weight: 0.9 })
    expect(payload.content.parcels.map((p) => p.sequence_no)).toEqual([1, 2])
    expect(payload.content.parcels[0].size).toEqual({ weight: 0.45, length: 30, width: 20, height: 10 })
    expect(payload.address_to.street_number).toBe("1")
    expect(payload.extra.bank_repayment_amount).toBeUndefined()
  })
  test.each(["weight", "length", "width", "height"])("rejects missing %s", (field) => {
    const cart = context(); delete cart.items[0].variant![field]
    expect(() => buildShipment(cart, selected, options)).toThrow("greutatea sau dimensiunile")
  })
  test("falls back to EAWB_DEFAULT_PARCEL only for missing values", () => {
    const cart = context(); cart.items[0].variant = { weight: 300 }
    const payload = buildShipment(cart, selected, { ...options, default_parcel: { weight: 1000, length: 30, width: 20, height: 10 } })
    expect(payload.content.parcels[0].size).toEqual({ weight: 0.3, length: 30, width: 20, height: 10 })
    expect(eawbOptions({ EAWB_API_KEY: "k", EAWB_DEFAULT_PARCEL: "1000,30,20,10" }).default_parcel).toEqual({ weight: 1000, length: 30, width: 20, height: 10 })
    expect(() => eawbOptions({ EAWB_API_KEY: "k", EAWB_DEFAULT_PARCEL: "1kg" })).toThrow("EAWB_DEFAULT_PARCEL")
  })
  test("requires an explicit street number, not a guessed split", () => {
    const cart = context(); cart.shipping_address.metadata = {}
    expect(() => buildShipment(cart, selected, options)).toThrow("numărul străzii")
  })
  test("does not accept unknown carriers, locker services or payment modes", () => {
    expect(() => choice({ ...selected, carrier_id: 99 }, options)).toThrow()
    expect(() => choice({ ...selected, service_id: 2 }, options)).toThrow()
    expect(() => choice({ ...selected, payment_mode: "free" }, options)).toThrow()
  })
  test("uses final VAT-inclusive price, not base amount plus a guessed surcharge", async () => {
    const client = { prices: jest.fn().mockResolvedValue(rate(24.2)) }
    expect((await quote(client as any, context(), selected, options)).amount).toBe(24.2)
    expect(client.prices).toHaveBeenCalledTimes(1)
  })
  test.each([499.99, 500, 650])("free shipping threshold for item total %s", async (amount) => {
    const cart = context(); cart.item_total = amount
    const client = { prices: jest.fn().mockResolvedValue(rate(24)) }
    expect((await quote(client as any, cart, selected, options)).amount).toBe(amount >= 500 ? 0 : 24)
    expect(client.prices).toHaveBeenCalledTimes(1)
  })
  test("free shipping still requires a valid carrier quote", async () => {
    const cart = context(); cart.item_total = 600
    await expect(quote({ prices: async () => [] } as any, cart, selected, options)).rejects.toThrow("tarif eAWB valid")
  })
  test("COD converges using merchandise plus shipping, including percentage surcharges", async () => {
    const amounts: number[] = []
    const client = { prices: async (request: any) => { amounts.push(request.extra.bank_repayment_amount); return rate(Math.round((20 + request.extra.bank_repayment_amount * 0.01) * 100) / 100) } }
    const result = await quote(client as any, context(), { ...selected, payment_mode: "cod" }, options)
    expect(result.amount).toBe(21.21)
    expect(amounts).toEqual([100, 121, 121.21])
    expect(result.request.extra.bank_repayment_amount).toBe(121.21)
  })
  test("free COD includes merchandise only in repayment", async () => {
    const cart = context(); cart.item_total = 500
    const client = { prices: jest.fn().mockResolvedValue(rate(30)) }
    const result = await quote(client as any, cart, { ...selected, payment_mode: "cod" }, options)
    expect(result.amount).toBe(0)
    expect(result.request.extra.bank_repayment_amount).toBe(500)
  })
  test("rejects nonconverging COD instead of undercharging", async () => {
    const client = { prices: async (request: any) => rate(request.extra.bank_repayment_amount + 1) }
    await expect(quote(client as any, context(), { ...selected, payment_mode: "cod" }, options)).rejects.toThrow("ramburs")
  })
  test.each([NaN, Infinity, -1])("rejects invalid rate %s", async (value) => {
    await expect(quote({ prices: async () => rate(value) } as any, context(), selected, options)).rejects.toThrow()
  })
  test("rejects foreign currency", async () => {
    const rates = rate(20); rates[0].price.currency = "EUR"
    await expect(quote({ prices: async () => rates } as any, context(), selected, options)).rejects.toThrow()
  })
  test("quote fingerprint changes with address, quantity, discount and payment mode", () => {
    const original = shippingFingerprint(context(), selected, options)
    for (const mutate of [
      (c: ShipmentContext) => { c.shipping_address.city = "Brasov" },
      (c: ShipmentContext) => { c.items[0].quantity = 3 },
      (c: ShipmentContext) => { c.item_total = 90 },
    ]) { const c = context(); mutate(c); expect(shippingFingerprint(c, selected, options)).not.toBe(original) }
    expect(shippingFingerprint(context(), { ...selected, payment_mode: "cod" }, options)).not.toBe(original)
  })
  test("provider ignores forged client prices, package weight and payment mode", async () => {
    const query = { graph: jest.fn().mockResolvedValue({ data: [context()] }) }
    const provider = new EawbProviderService({ query, eawbBooking: {} as any }, options)
    const prices = jest.spyOn(EawbClient.prototype, "prices").mockResolvedValue(rate(23))
    try {
      const result = await provider.calculatePrice(selected, { price: 0, payment_mode: "cod", weight: 0 }, { id: "cart_test" } as any)
      expect(result).toEqual({ calculated_amount: 23, is_calculated_price_tax_inclusive: true })
      expect(prices.mock.calls[0][0].extra.bank_repayment_amount).toBeUndefined()
      const validated = await provider.validateFulfillmentData(selected, { eawb_fingerprint: "forged" }, { id: "cart_test" })
      expect(validated.eawb_fingerprint).toBe(shippingFingerprint(context(), selected, options))
    } finally { prices.mockRestore() }
  })
  test("AWB creation is disabled independently of price calculation", async () => {
    const provider = new EawbProviderService({ query: {}, eawbBooking: {} as any }, options)
    await expect(provider.createFulfillment({}, [], { id: "order_test" }, {})).rejects.toThrow("dezactivată")
  })
  test("configuration rejects incomplete activation and allows explicit no-free-shipping policy", () => {
    expect(() => eawbOptions({})).toThrow("EAWB_API_KEY")
    const config = eawbOptions({ EAWB_API_KEY: "test", EAWB_BILLING_ADDRESS_ID: "1", EAWB_SENDER_ADDRESS_ID: "2", EAWB_PAYMENT_MODES: "card", EAWB_FREE_SHIPPING_THRESHOLD: "off" })
    expect(config.free_shipping_threshold).toBeNull()
    expect(config.create_awb).toBe(true)
    expect(config.auto_awb).toBe(true)
    expect(config.notify_email).toBe("menvdivers@yahoo.com")
    expect(eawbOptions({ EAWB_API_KEY: "test", EAWB_CREATE_AWB_ENABLED: "false" })).toMatchObject({ create_awb: false, auto_awb: false })
    expect(eawbOptions({ EAWB_API_KEY: "test", EAWB_AUTO_AWB: "false" })).toMatchObject({ create_awb: true, auto_awb: false })
  })
  test("only EAWB_API_KEY is needed: addresses/IBAN default to the eAWB account", () => {
    expect(eawbEnabled({ EAWB_API_KEY: "k" })).toBe(true)
    expect(eawbEnabled({ EAWB_API_KEY: "k", EAWB_ENABLED: "false" })).toBe(false)
    expect(eawbEnabled({})).toBe(false)
    expect(eawbOptions({ EAWB_API_KEY: "k" })).toMatchObject({ billing_address_id: 0, sender_address_id: 0, payment_modes: ["card", "cod"], free_shipping_threshold: 500 })
  })
  test("prepare fills default addresses and COD bank account from the account", async () => {
    const client = new EawbClient({ ...options, billing_address_id: 0, sender_address_id: 0, bank_iban: undefined, bank_holder: undefined })
    const request = jest.spyOn(client, "request").mockImplementation(async (path: string) => {
      if (path.startsWith("/addresses/billing")) return { data: [{ id: 7 }, { id: 8, is_default: true }] } as any
      if (path.startsWith("/addresses/shipping")) return { data: [{ id: 9, is_default: true }] } as any
      return { data: { bank_iban: "RO49 AAAA 1B31 0075 9384 0000", bank_holder: "Magazin" } } as any
    })
    const body = buildShipment(context(), { ...selected, payment_mode: "cod" }, { ...options, billing_address_id: 0, sender_address_id: 0, bank_iban: undefined, bank_holder: undefined })
    const out = await client.prepare(body)
    expect(out.billing_to.billing_address_id).toBe(8)
    expect(out.address_from.address_from_id).toBe(9)
    expect(out.extra).toMatchObject({ bank_iban: "RO49AAAA1B31007593840000", bank_holder: "Magazin" })
    expect(body.billing_to.billing_address_id).toBe(0)
    await client.prepare(body)
    expect(request).toHaveBeenCalledTimes(3)
  })
})

describe("eAWB cheapest courier (auto)", () => {
  const auto: ShippingChoice = { carrier_id: 0, auto: true, service_id: 1, payment_mode: "card" }
  const r = (carrier_id: number, total: number, currency = "RON") => ({ carrier_id, service_id: 1, price: { amount: total, vat: 0, total, currency } })
  const multi = { ...options, carrier_ids: [] as number[] }
  test("auto choice is accepted for both payment modes, even with an allowlist", () => {
    expect(choice({ carrier_id: 0, auto: true, service_id: 1, payment_mode: "cod" }, options)).toEqual({ carrier_id: 0, auto: true, service_id: 1, payment_mode: "cod" })
    expect(() => choice({ carrier_id: 0, auto: true, service_id: 2, payment_mode: "card" }, options)).toThrow()
  })
  test("customer pays the cheapest valid carrier price", async () => {
    const client = { allRates: jest.fn().mockResolvedValue([r(5, 17.5), r(3, 21)]) }
    const result = await quote(client as any, context(), auto, multi)
    expect(result).toMatchObject({ amount: 17.5, carrier_id: 5 })
  })
  test("free shipping over 500 still picks the cheapest carrier for the store", async () => {
    const cart = context(); cart.item_total = 520
    const client = { allRates: jest.fn().mockResolvedValue([r(5, 17.5), r(3, 21)]) }
    expect(await quote(client as any, cart, auto, multi)).toMatchObject({ amount: 0, carrier_amount: 17.5, carrier_id: 5 })
  })
  test("allRates filters invalid/foreign rates, sorts by price and falls back to per-carrier quotes", async () => {
    const client = new EawbClient({ ...options, carrier_ids: [3, 5] })
    jest.spyOn(client, "services").mockResolvedValue([3, 5, 6].map((carrier_id) => ({ carrier_id, carrier_name: `C${carrier_id}`, service_id: 1, service_name: "Standard" })))
    const prices = jest.spyOn(client, "prices").mockImplementation(async (body) => {
      if (body.carrier_id === 0) return []
      if (body.carrier_id === 3) return [r(3, 25)]
      if (body.carrier_id === 5) return [r(5, 19), r(5, 1, "EUR")]
      throw new EawbApiError(422, false)
    })
    const body = buildShipment(context(), auto, options)
    expect((await client.allRates(body)).map((x) => [x.carrier_id, x.price.total])).toEqual([[5, 19], [3, 25]])
    expect(prices.mock.calls.map((c) => c[0].carrier_id)).toEqual([0, 3, 5])
  })
  test("no carrier available means no price, never free shipping by accident", async () => {
    await expect(quote({ allRates: async () => [] } as any, context(), auto, multi)).rejects.toThrow("tarif eAWB valid")
  })
})

describe("eAWB HTTP client", () => {
  afterEach(() => jest.restoreAllMocks())
  test("sends API key server-side and caches identical price calls briefly", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: rate(20) }), { status: 200 }))
    const client = new EawbClient(options)
    const body = buildShipment(context(), selected, options)
    await Promise.all([client.prices(body), client.prices(body)])
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe("https://example.invalid/api/public/orders/prices")
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({ "X-API-Key": "test-key" })
  })
  test("does not leak upstream secrets or personal data on API errors", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(new Response("secret-key and customer-address", { status: 422 }))
    const error = await new EawbClient(options).prices(buildShipment(context(), selected, options)).catch((e) => e)
    expect(error).toBeInstanceOf(EawbApiError)
    expect(error.message).not.toMatch(/secret-key|customer-address/)
  })
  test("a timeout during purchase is uncertain and is not retried", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockRejectedValue(new Error("timeout"))
    const error = await new EawbClient(options).createOrder(buildShipment(context(), selected, options)).catch((e) => e)
    expect(error.uncertain).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe("checkout server validation", () => {
  function ready(mode: "card" | "cod" = "card") {
    const cart = context()
    const selection = { ...selected, payment_mode: mode }
    cart.total = 120
    cart.shipping_methods = [{ amount: 20, data: { eawb_fingerprint: shippingFingerprint(cart, selection, options), eawb_quoted_at: new Date().toISOString() } }]
    cart.payment_collection = { payment_sessions: [{ status: "pending", provider_id: mode === "cod" ? "pp_system_default" : "pp_stripe_stripe" }] }
    return { cart, selection }
  }
  test.each(["card", "cod"] as const)("accepts a consistent %s checkout", (mode) => {
    const { cart, selection } = ready(mode)
    expect(() => validateCheckout(cart, selection, options)).not.toThrow()
  })
  test("rejects COD payment with a card-priced shipping option", () => {
    const { cart, selection } = ready()
    cart.payment_collection.payment_sessions[0].provider_id = "pp_system_default"
    expect(() => validateCheckout(cart, selection, options)).toThrow("Metoda de plată")
  })
  test("rejects changed cart, expired quote and a mismatched total", () => {
    const changed = ready(); changed.cart.items[0].quantity++
    expect(() => validateCheckout(changed.cart, changed.selection, options)).toThrow("reconfirmate")
    const expired = ready()
    expect(() => validateCheckout(expired.cart, expired.selection, options, Date.now() + 16 * 60 * 1000)).toThrow("reconfirmate")
    const discounted = ready(); discounted.cart.total = 110
    expect(() => validateCheckout(discounted.cart, discounted.selection, options)).toThrow("Totalul")
  })
})

describe("fulfillment from admin", () => {
  afterEach(() => jest.restoreAllMocks())
  function fixture(mode: "card" | "cod" = "card") {
    const order = context()
    order.id = "order_test"; order.total = 120
    order.shipping_methods = [{ data: { ...selected, payment_mode: mode, eawb: true } }]
    order.fulfillments = []
    order.payment_collections = [{ payments: [{ provider_id: mode === "card" ? "pp_stripe_stripe" : "pp_system_default", captures: [{ amount: 120 }], refunds: [] }] }]
    const registry = { bookOnce: jest.fn().mockResolvedValue({ order_id: 123, awb_number: "TEST-AWB", carrier_id: 3, service_id: 1, track_url: "https://www.eawb.ro/tracking?awb=TEST-AWB" }) }
    const query = { graph: jest.fn().mockResolvedValue({ data: [order] }) }
    const provider = new EawbProviderService({ query, eawbBooking: registry as any }, { ...options, create_awb: true })
    jest.spyOn(EawbClient.prototype, "label").mockResolvedValue({ download_url: "https://example.invalid/label.pdf" })
    return { order, registry, provider }
  }
  test("creates an AWB and exposes its tracking and PDF in native fulfillment labels", async () => {
    const { provider, registry } = fixture()
    const result = await provider.createFulfillment({}, [{ line_item_id: "item_1", quantity: 2 }], { id: "order_test" }, { id: "ful_test" })
    expect(registry.bookOnce.mock.calls[0][1].extra.internal_identifier).toBe("order_test")
    expect(result.labels[0]).toMatchObject({ tracking_number: "TEST-AWB", label_url: "https://example.invalid/label.pdf" })
    expect(result.data.eawb_order_id).toBe(123)
  })
  test("uses the final order total for COD collection", async () => {
    const { provider, registry } = fixture("cod")
    await provider.createFulfillment({}, [{ line_item_id: "item_1", quantity: 2 }], { id: "order_test" }, {})
    expect(registry.bookOnce.mock.calls[0][1].extra.bank_repayment_amount).toBe(120)
  })
  test("refuses partial shipments and partially paid card orders before purchase", async () => {
    const { provider, order, registry } = fixture()
    await expect(provider.createFulfillment({}, [{ line_item_id: "item_1", quantity: 1 }], { id: "order_test" }, {})).rejects.toThrow("integral")
    order.payment_collections[0].payments[0].captures[0].amount = 50
    await expect(provider.createFulfillment({}, [{ line_item_id: "item_1", quantity: 2 }], { id: "order_test" }, {})).rejects.toThrow("încasată")
    expect(registry.bookOnce).not.toHaveBeenCalled()
  })
  test("label retrieval failure does not roll back a purchased AWB", async () => {
    const { provider, registry } = fixture()
    jest.spyOn(EawbClient.prototype, "label").mockRejectedValue(new Error("timeout"))
    const result = await provider.createFulfillment({}, [{ line_item_id: "item_1", quantity: 2 }], { id: "order_test" }, {})
    expect(result.data.eawb_awb).toBe("TEST-AWB")
    expect(result.labels[0].label_url).toBe("")
    expect(registry.bookOnce).toHaveBeenCalledTimes(1)
  })
})
