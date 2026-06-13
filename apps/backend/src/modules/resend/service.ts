import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import { Resend } from "resend"
import { orderPlacedEmail } from "./templates/order-placed"

type Options = {
  api_key: string
  from: string
}

type InjectedDependencies = {
  logger: Logger
}

// Maparea template -> constructor de email (subiect + HTML).
const TEMPLATES: Record<
  string,
  (data: any) => { subject: string; html: string }
> = {
  "order-placed": orderPlacedEmail,
}

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "resend"

  protected logger_: Logger
  protected options_: Options
  protected client: Resend

  constructor({ logger }: InjectedDependencies, options: Options) {
    super()
    this.logger_ = logger
    this.options_ = options
    this.client = new Resend(options.api_key)
  }

  static validateOptions(options: Record<string, unknown>) {
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Resend: lipsește `api_key` în opțiunile providerului."
      )
    }
    if (!options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Resend: lipsește `from` (adresa expeditorului)."
      )
    }
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const build = TEMPLATES[notification.template]
    if (!build) {
      this.logger_.warn(
        `Resend: template necunoscut "${notification.template}" — nu trimit email.`
      )
      return {}
    }

    const { subject, html } = build(notification.data ?? {})

    const { data, error } = await this.client.emails.send({
      from: this.options_.from,
      to: notification.to,
      subject,
      html,
    })

    if (error) {
      this.logger_.error(`Resend: eroare la trimitere — ${error.message}`)
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, error.message)
    }

    return { id: data?.id }
  }
}

export default ResendNotificationProviderService
