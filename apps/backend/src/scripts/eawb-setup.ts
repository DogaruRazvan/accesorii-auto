import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createShippingOptionsWorkflow } from "@medusajs/medusa/core-flows"
import { eawbEnabled, eawbOptions } from "../modules/eawb/config"
import { EawbClient } from "../modules/eawb/client"

/**
 * Creeaza opțiunile de livrare eAWB „Cel mai ieftin curier” (card și/sau ramburs),
 * cu preț calculat live (gratuit peste EAWB_FREE_SHIPPING_THRESHOLD, implicit 500 lei).
 *
 * - Folosește zona de livrare și profilul opțiunilor existente (din setup-romania).
 * - Activează providerul eawb_eawb pe locația de stoc a zonei.
 * - Idempotent: nu dublează opțiunile dacă există deja.
 * - NU șterge opțiunile vechi (flat); scoate-le din admin ca să nu apară două prețuri.
 *
 * Rulează (cu EAWB_API_KEY setat):  npm run eawb:setup --workspace=@dtc/backend
 * Pe Railway rulează automat la fiecare deploy (preDeployCommand), fără să blocheze deploy-ul.
 */
export default async function eawbSetup({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  if (!eawbEnabled()) throw new Error("eAWB nu e activ: setați EAWB_API_KEY (și nu EAWB_ENABLED=false).")
  const config = eawbOptions()

  // Diagnostic cont eAWB (fără date sensibile în log).
  const client = new EawbClient(config)
  try {
    const d = await client.accountDefaults()
    logger.info(`eAWB: adresa facturare #${d.billing_address_id}, adresa ridicare #${d.sender_address_id}, IBAN ramburs ${d.bank_iban ? "găsit (…" + d.bank_iban.slice(-4) + ")" : "LIPSĂ"}.`)
    const carriers = (await client.services()).filter((s) => s.service_id === 1)
    logger.info(`eAWB: curieri disponibili: ${carriers.map((c) => `${c.carrier_name} (#${c.carrier_id})`).join(", ") || "niciunul"}.`)
  } catch (e: any) {
    logger.error(`eAWB: contul nu poate fi citit — ${e?.message}`)
  }

  const { data: options } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name", "provider_id", "price_type", "data", "service_zone_id", "shipping_profile_id",
      "service_zone.name", "service_zone.fulfillment_set.type", "service_zone.fulfillment_set.location.id"],
  })
  const existing = (options as any[]).filter((o) => o.provider_id === "eawb_eawb")
  const template = (options as any[]).find((o) => o.provider_id !== "eawb_eawb" && o.service_zone?.fulfillment_set?.type === "shipping") ||
    existing[0]
  if (!template) throw new Error("Nu există nicio zonă de livrare. Rulați întâi setup-romania sau creați una din admin.")

  const locationId = template.service_zone?.fulfillment_set?.location?.id
  if (locationId) {
    try {
      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: locationId },
        [Modules.FULFILLMENT]: { fulfillment_provider_id: "eawb_eawb" },
      })
      logger.info(`Provider eawb_eawb activat pe locația ${locationId}.`)
    } catch {
      logger.info(`Provider eawb_eawb era deja activ pe locația ${locationId}.`)
    }
  } else {
    logger.warn("Zona de livrare nu are locație de stoc; AWB-ul nu va putea fi emis până nu legați una.")
  }

  const toCreate = config.payment_modes
    .filter((mode) => !existing.some((o) => o.data?.auto === true && o.data?.payment_mode === mode))
    .map((payment_mode) => ({
      name: payment_mode === "cod" ? "Livrare prin curier — plată ramburs" : "Livrare prin curier — plată cu cardul",
      service_zone_id: template.service_zone_id,
      shipping_profile_id: template.shipping_profile_id,
      provider_id: "eawb_eawb",
      price_type: "calculated" as const,
      data: { id: `auto-1-${payment_mode}`, carrier_id: 0, auto: true, service_id: 1, payment_mode },
      type: {
        label: payment_mode === "cod" ? "Curier (ramburs)" : "Curier (card)",
        description: "Cel mai ieftin curier disponibil pentru adresa ta",
        code: `eawb-auto-${payment_mode}`,
      },
      rules: [
        { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
        { attribute: "is_return", value: "false", operator: "eq" as const },
      ],
    }))

  if (toCreate.length) {
    await createShippingOptionsWorkflow(container).run({ input: toCreate })
    for (const o of toCreate) logger.info(`Creat: "${o.name}" (zona ${template.service_zone?.name}).`)
  } else {
    logger.info("Opțiunile eAWB „cel mai ieftin curier” există deja.")
  }

  const old = (options as any[]).filter((o) => o.provider_id !== "eawb_eawb" && o.service_zone?.fulfillment_set?.type === "shipping" &&
    !/return/i.test(String(o.name)))
  if (old.length) {
    logger.warn(`Opțiuni vechi încă active (ștergeți-le din Admin → Settings → Locations & Shipping): ${old.map((o) => `"${o.name}"`).join(", ")}`)
  }
}
