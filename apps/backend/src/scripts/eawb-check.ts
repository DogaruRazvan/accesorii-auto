import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { eawbOptions } from "../modules/eawb/config"
import { EawbClient } from "../modules/eawb/client"

// Read-only diagnostics. No shipments are purchased and no wallet is charged.
export default async function checkEawb({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const options = eawbOptions()
  const client = new EawbClient(options)
  // Adresele configurate explicit sau, implicit, cele marcate implicite în contul eAWB.
  const [defaults, services] = await Promise.all([client.accountDefaults(), client.services()])
  const [billing, senders] = await Promise.all([
    client.request<any>("/addresses/billing?all=true"),
    client.request<any>("/addresses/shipping?all=true"),
  ])
  const ids = (r: any): number[] => (Array.isArray(r) ? r : r?.data ?? r?.list ?? []).map((a: any) => Number(a.id))
  if (!ids(billing).includes(defaults.billing_address_id)) throw new Error("Adresa de facturare nu aparține contului eAWB.")
  if (!ids(senders).includes(defaults.sender_address_id)) throw new Error("Adresa de ridicare nu aparține contului eAWB.")
  if (options.payment_modes.includes("cod") && (!defaults.bank_iban || !defaults.bank_holder)) {
    logger.warn("eAWB: lipsește IBAN-ul pentru ramburs (EAWB_BANK_IBAN/EAWB_BANK_HOLDER sau profilul contului eAWB).")
  }
  logger.info("eAWB: autentificare și adrese confirmate.")
  for (const service of services.filter((s) => s.service_id === 1 && (!options.carrier_ids.length || options.carrier_ids.includes(s.carrier_id)))) {
    logger.info(`Curier disponibil: ${service.carrier_name}, carrier_id=${service.carrier_id}, service_id=${service.service_id}`)
  }
  let offset = 0
  let missing = 0
  let checked = 0
  while (true) {
    const { data: variants } = await query.graph({
      entity: "product_variant", fields: ["id", "sku", "weight", "length", "width", "height", "product.weight"],
      pagination: { skip: offset, take: 100 },
    })
    for (const variant of variants) {
      checked++
      const dimensions = [variant.weight ?? variant.product?.weight, variant.length, variant.width, variant.height]
      if (dimensions.some((v) => !Number.isFinite(Number(v)) || Number(v) <= 0)) {
        missing++
        logger.warn(`Completați greutatea/dimensiunile de ambalare: ${variant.sku || variant.id}`)
      }
    }
    if (variants.length < 100) break
    offset += 100
  }
  logger.info(`Verificate ${checked} variante; ${missing} necesită date de ambalare. Nu a fost emis niciun AWB.`)
  if (missing) throw new Error("Completați datele produselor înainte de activarea transportului eAWB.")
}
