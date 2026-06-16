import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateShippingOptionsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Adaugă livrare GRATUITĂ peste 500 lei pe opțiunile de livrare cu preț fix.
 *
 * Mecanism: pe fiecare opțiune de livrare (flat rate) păstrăm prețul de bază
 * existent și adăugăm un preț condiționat de 0, cu regula `item_total >= 500`.
 * E exact regula pe care o citește și componenta de pe site (nudge-ul
 * „mai adaugă X lei pentru livrare gratuită").
 *
 * Non-distructiv & idempotent: nu schimbă prețul de bază; dacă regula există
 * deja, sare peste. Pragul se poate schimba din constanta THRESHOLD.
 *
 * Rulează:  npx medusa exec ./src/scripts/free-shipping-over-500.ts
 */
const THRESHOLD = 500 // lei — peste această valoare a coșului, livrarea e 0

export default async function freeShippingOver500({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: options } = await query.graph({
    entity: "shipping_option",
    fields: [
      "id",
      "name",
      "price_type",
      "prices.amount",
      "prices.currency_code",
      "prices.price_rules.attribute",
      "prices.price_rules.operator",
      "prices.price_rules.value",
    ],
  })

  if (!options?.length) {
    logger.warn("Nu există opțiuni de livrare. Creează una mai întâi din admin.")
    return
  }

  for (const option of options as any[]) {
    // Doar opțiunile cu preț fix au prețuri manuale de editat.
    if (option.price_type && option.price_type !== "flat") {
      continue
    }

    const prices = option.prices || []

    // Prețurile de bază = cele FĂRĂ reguli (prețul normal pe monedă). Orice preț
    // cu regulă item_total (ex. un prag vechi de 200) îl înlocuim cu 500.
    const basePrices = prices.filter(
      (p: any) => !(p.price_rules || []).length
    )

    if (!basePrices.length) {
      logger.warn(`"${option.name}": nu are preț de bază — sar peste.`)
      continue
    }

    // Reconstruim lista de prețuri: bazele existente + 0 lei peste prag.
    const newPrices = [
      ...basePrices.map((p: any) => ({
        currency_code: p.currency_code,
        amount: Number(p.amount),
      })),
      ...basePrices.map((p: any) => ({
        currency_code: p.currency_code,
        amount: 0,
        rules: [
          { attribute: "item_total", operator: "gte", value: THRESHOLD },
        ],
      })),
    ]

    await updateShippingOptionsWorkflow(container).run({
      input: [{ id: option.id, prices: newPrices }],
    })

    logger.info(
      `"${option.name}": adăugat livrare gratuită pentru item_total >= ${THRESHOLD}.`
    )
  }

  logger.info("Gata. Livrare gratuită peste 500 lei configurată.")
}
