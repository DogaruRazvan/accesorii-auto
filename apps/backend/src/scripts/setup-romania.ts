import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Configurează magazinul pentru România:
 *  1. moneda magazinului -> RON (implicit)
 *  2. regiunea „România" (RON, țara `ro`) cu metodele de plată disponibile
 *     (ramburs = pp_system_default mereu; Stripe se atașează automat dacă
 *     modulul e încărcat, adică dacă STRIPE_API_KEY e setat).
 *
 * Non-distructiv & idempotent: nu șterge produse/categorii și nu recreează
 * regiunea dacă există deja. Rulează cu:
 *   npx medusa exec ./src/scripts/setup-romania.ts
 */
export default async function setupRomania({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const storeModule = container.resolve(Modules.STORE)
  const paymentModule = container.resolve(Modules.PAYMENT)
  const regionModule = container.resolve(Modules.REGION)

  // ── 1. Moneda magazinului: RON implicit (păstrăm și monedele existente) ──
  const [store] = await storeModule.listStores()
  const codes = new Set<string>(
    (store.supported_currencies || []).map((c) => c.currency_code)
  )
  codes.add("ron")
  const supported_currencies = Array.from(codes).map((currency_code) => ({
    currency_code,
    is_default: currency_code === "ron",
  }))

  await updateStoresWorkflow(container).run({
    input: { selector: { id: store.id }, update: { supported_currencies } },
  })
  logger.info(`Monedă magazin actualizată: RON implicit (${Array.from(codes).join(", ")})`)

  // ── 2. Metode de plată disponibile (ramburs + Stripe dacă e încărcat) ──
  const providers = await paymentModule.listPaymentProviders({}, { take: null })
  const providerIds = providers.map((p) => p.id)
  logger.info(`Provideri de plată disponibili: ${providerIds.join(", ") || "niciunul"}`)

  // ── 3. Regiunea România (idempotent) ──
  const regions = await regionModule.listRegions(
    {},
    { relations: ["countries"] }
  )
  const existing = regions.find(
    (r) =>
      r.name === "România" ||
      (r.countries || []).some((c) => c.iso_2 === "ro")
  )

  if (existing) {
    logger.info(
      `Regiunea pentru România există deja (${existing.name}) — sar peste creare.`
    )
  } else {
    await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "România",
            currency_code: "ron",
            countries: ["ro"],
            payment_providers: providerIds,
          },
        ],
      },
    })
    logger.info("Regiune creată: România (RON) cu metodele de plată de mai sus.")
  }

  logger.info("✓ Configurare România finalizată.")
}
