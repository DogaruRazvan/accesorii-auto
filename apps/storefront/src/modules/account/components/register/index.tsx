"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { useTranslations } from "@lib/i18n/context"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const t = useTranslations()
  const [message, formAction] = useActionState(signup as (state: string | null, formData: FormData) => Promise<string | null>, null as string | null)

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="font-display text-2xl font-bold tracking-tight text-content mb-2 text-center">
        {t("auth.createTitle")}
      </h1>
      <p className="text-center text-subtle mb-6">
        {t("auth.createSubtitle")}
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t("auth.firstName")}
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label={t("auth.lastName")}
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label={t("auth.email")}
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label={t("auth.phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label={t("auth.password")}
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-subtle text-sm mt-6">
          {t("auth.agreePrefix")}{" "}
          <LocalizedClientLink
            href="/content/politica-de-confidentialitate"
            className="text-content underline"
          >
            {t("auth.privacyPolicy")}
          </LocalizedClientLink>{" "}
          {t("auth.and")}{" "}
          <LocalizedClientLink
            href="/content/termeni-si-conditii"
            className="text-content underline"
          >
            {t("auth.termsOfUse")}
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full mt-6 !rounded-full !h-12 !bg-cta hover:!bg-cta-hover" data-testid="register-button">
          {t("auth.join")}
        </SubmitButton>
      </form>
      <span className="text-center text-subtle text-sm mt-6">
        {t("auth.alreadyMember")}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-cta font-medium hover:underline"
        >
          {t("auth.signIn")}
        </button>
      </span>
    </div>
  )
}

export default Register
