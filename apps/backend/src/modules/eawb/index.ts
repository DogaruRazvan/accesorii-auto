import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import EawbProviderService from "./service"

export default ModuleProvider(Modules.FULFILLMENT, { services: [EawbProviderService] })
