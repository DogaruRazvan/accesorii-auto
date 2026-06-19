import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { capturePaymentWorkflow } from "@medusajs/medusa/core-flows"

// Capteaza automat platile cu cardul (Stripe) imediat ce comanda e plasata.
//
// NU folosim capture:true in config-ul Stripe: acela capteaza la confirmarea
// cardului (PaymentIntent -> "succeeded"), inainte ca Medusa sa fi terminat
// checkout-ul. O sesiune deja capturata nu mai poate fi anulata, iar Medusa
// crapa cu "Could not delete all payment sessions" -> 500 pe pagina de checkout.
//
// Aici capturam DUPA ce comanda e plasata: sesiunea de plata a fost deja
// convertita intr-o plata autorizata (status requires_capture pe Stripe), deci
// captarea reuseste si banii se incaseaza efectiv, automat.
export default async function capturePaymentHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "payment_collections.payments.id",
        "payment_collections.payments.provider_id",
        "payment_collections.payments.captured_at",
        "payment_collections.payments.canceled_at",
      ],
      filters: { id: data.id },
    })

    const order = orders?.[0]
    if (!order) {
      return
    }

    const payments =
      order.payment_collections?.flatMap((pc: any) => pc.payments ?? []) ?? []

    for (const payment of payments) {
      // Sarim peste platile deja capturate/anulate.
      if (payment.captured_at || payment.canceled_at) {
        continue
      }

      // Capturam doar cardul (Stripe). Ramburs-ul (pp_system_default) se
      // incaseaza la livrare, deci il lasam in pace.
      const isCard = String(payment.provider_id || "").includes("stripe")
      if (!isCard) {
        continue
      }

      await capturePaymentWorkflow(container).run({
        input: { payment_id: payment.id },
      })

      logger.info(
        `order.placed: plata ${payment.id} (comanda ${data.id}) capturata automat.`
      )
    }
  } catch (e: any) {
    logger.error(
      `order.placed: eroare la captarea automata a platii — ${e?.message}`
    )
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
