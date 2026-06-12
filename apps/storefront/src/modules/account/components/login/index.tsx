"use client"

import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useTranslations } from "@lib/i18n/context"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const t = useTranslations()
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="font-display text-2xl font-bold tracking-tight text-content mb-2">
        {t("auth.welcomeBack")}
      </h1>
      <p className="text-center text-subtle mb-8">
        {t("auth.signInSubtitle")}
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t("auth.email")}
            name="email"
            type="email"
            title={t("auth.emailTitle")}
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label={t("auth.password")}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6 !rounded-full !h-12 !bg-cta hover:!bg-cta-hover">
          {t("auth.signIn")}
        </SubmitButton>
      </form>
      <span className="text-center text-subtle text-sm mt-6">
        {t("auth.notMember")}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-cta font-medium hover:underline"
          data-testid="register-button"
        >
          {t("auth.joinUs")}
        </button>
      </span>
    </div>
  )
}

export default Login
