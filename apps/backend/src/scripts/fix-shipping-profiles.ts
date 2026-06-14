import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Repară eroarea de la checkout:
 *   "The cart items require shipping profiles that are not satisfied by the
 *    current shipping methods"
 *
 * Cauza: produse fără shipping profile (sau pe alt profil decât opțiunea de
 * livrare). Scriptul aliniază TOATE produsele la profilul folosit de opțiunile
 * de livrare existente (curier/ramburs). Idempotent — îl poți rula oricând.
 *
 *   npx medusa exec ./src/scripts/fix-shipping-profiles.ts
 */
export default async function fixShippingProfiles({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const fulfillment = container.resolve(Modules.FULFILLMENT)
  const productModule = container.resolve(Modules.PRODUCT)

  // 1. Profilul tinta = cel folosit de opțiunile de livrare (curier/ramburs).
  //    Fallback: profilul implicit (type "default").
  const profiles = await fulfillment.listShippingProfiles({})
  if (!profiles.length) {
    logger.error(
      "Nu există niciun shipping profile. Creează unul + o opțiune de livrare în Admin, apoi rulează din nou."
    )
    return
  }

  const options = await fulfillment.listShippingOptions(
    {},
    { select: ["id", "name", "shipping_profile_id"] }
  )
  const fromOption = options.find((o) => o.shipping_profile_id)?.shipping_profile_id
  const defaultProfile =
    profiles.find((p) => p.type === "default") || profiles[0]
  const targetProfileId = fromOption || defaultProfile.id
  const targetName =
    profiles.find((p) => p.id === targetProfileId)?.name || targetProfileId

  logger.info(
    `Opțiuni de livrare găsite: ${options.length}. Profil țintă pentru produse: "${targetName}".`
  )

  // 2. Toate produsele -> profilul țintă (workflow-ul gestionează link-ul).
  const products = await productModule.listProducts(
    {},
    { select: ["id"], take: null }
  )
  if (!products.length) {
    logger.info("Niciun produs de actualizat.")
    return
  }

  await updateProductsWorkflow(container).run({
    input: {
      products: products.map((p) => ({
        id: p.id,
        shipping_profile_id: targetProfileId,
      })),
    },
  })

  logger.info(
    `✓ ${products.length} produse aliniate la profilul de livrare "${targetName}". Checkout-ul ar trebui să meargă acum.`
  )
}
