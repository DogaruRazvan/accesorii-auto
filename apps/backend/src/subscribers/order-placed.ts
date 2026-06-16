import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

// Medusa v2: totalurile calculate ale comenzii (order.total/subtotal) pot veni
// 0 prin query.graph in subscriber. unit_price-ul liniilor e insa stocat brut
// si de incredere. Extragem robust din number/string/BigNumber.
function toNumber(amount: unknown): number {
  if (amount == null) return 0
  if (typeof amount === "number") return Number.isFinite(amount) ? amount : 0
  if (typeof amount === "string") {
    const n = parseFloat(amount)
    return Number.isFinite(n) ? n : 0
  }
  if (typeof amount === "object") {
    const o = amount as Record<string, any>
    const c =
      o.numeric ??
      o.value ??
      o.raw_?.value ??
      o.raw?.value ??
      (typeof o.valueOf === "function" ? o.valueOf() : undefined)
    const n = parseFloat(String(c))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

// Trimite emailul de confirmare cand o comanda e plasata.
// Ruleaza asincron — daca pica trimiterea, doar logam (nu blocam comanda).
export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notification = container.resolve(Modules.NOTIFICATION)

  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "total",
        "subtotal",
        "shipping_total",
        "items.title",
        "items.quantity",
        "items.unit_price",
        "items.total",
        "shipping_methods.amount",
        "shipping_address.first_name",
        "shipping_address.last_name",
        "shipping_address.address_1",
        "shipping_address.city",
        "shipping_address.postal_code",
        "shipping_address.province",
        "shipping_address.country_code",
        "shipping_address.phone",
      ],
      filters: { id: data.id },
    })

    const order = orders?.[0]
    if (!order || !order.email) {
      logger.warn(`order.placed: comanda ${data.id} fără email — sar peste.`)
      return
    }

    const addr = order.shipping_address
    const customer_name = addr
      ? [addr.first_name, addr.last_name].filter(Boolean).join(" ")
      : ""

    // Totalurile calculate vin 0 prin query.graph -> le reconstruim din datele
    // brute: unit_price * cantitate pentru fiecare linie, plus livrarea.
    const items = (order.items || []).map((it: any) => {
      const quantity = toNumber(it.quantity) || 1
      const unit_price = toNumber(it.unit_price)
      const lineTotal = toNumber(it.total) || unit_price * quantity
      return { title: it.title, quantity, unit_price, total: lineTotal }
    })

    const subtotal = items.reduce((s, it) => s + it.total, 0)
    const shipping_total = (order.shipping_methods || []).reduce(
      (s: number, m: any) => s + toNumber(m.amount),
      0
    )
    // Folosim totalul comenzii daca exista; altfel reconstruim din subtotal+livrare.
    const total = toNumber(order.total) || subtotal + shipping_total

    logger.info(
      `order.placed totals: subtotal=${subtotal} shipping=${shipping_total} total=${total} (item0 unit_price=${JSON.stringify(order.items?.[0]?.unit_price)})`
    )

    await notification.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-placed",
      data: {
        display_id: order.display_id,
        customer_name,
        currency_code: order.currency_code,
        items,
        subtotal,
        shipping_total,
        total,
        shipping_address: addr,
      },
    })

    logger.info(`order.placed: email de confirmare trimis către ${order.email}`)

    // Notificare către proprietarul magazinului (daca e setat STORE_OWNER_EMAIL)
    const ownerEmail = process.env.STORE_OWNER_EMAIL
    if (ownerEmail) {
      await notification.createNotifications({
        to: ownerEmail,
        channel: "email",
        template: "order-placed-admin",
        data: {
          display_id: order.display_id,
          customer_name,
          customer_email: order.email,
          customer_phone: addr?.phone,
          currency_code: order.currency_code,
          items,
          total,
          shipping_address: addr,
        },
      })
      logger.info(`order.placed: notificare comandă nouă trimisă către ${ownerEmail}`)
    }
  } catch (e: any) {
    logger.error(`order.placed: eroare la trimiterea emailului — ${e?.message}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
