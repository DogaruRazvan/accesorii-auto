import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

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

    await notification.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-placed",
      data: {
        display_id: order.display_id,
        customer_name,
        currency_code: order.currency_code,
        items: order.items,
        subtotal: order.subtotal,
        shipping_total: order.shipping_total,
        total: order.total,
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
          items: order.items,
          total: order.total,
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
