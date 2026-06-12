import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getT } from "@lib/i18n/server"

const SignInPrompt = async () => {
  const t = await getT()
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-muted px-6 py-5">
      <div>
        <Heading level="h2" className="text-lg font-semibold text-content">
          {t("signin.title")}
        </Heading>
        <Text className="text-sm text-subtle mt-1">
          {t("signin.sub")}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="!rounded-full !border-line !bg-card !text-content hover:!bg-page"
            data-testid="sign-in-button"
          >
            {t("signin.cta")}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
