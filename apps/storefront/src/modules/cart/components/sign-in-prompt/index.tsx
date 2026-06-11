import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 px-6 py-5">
      <div>
        <Heading level="h2" className="text-lg font-semibold text-gray-950">
          Ai deja cont?
        </Heading>
        <Text className="text-sm text-gray-500 mt-1">
          Autentifică-te pentru o experiență mai bună.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="!rounded-full !border-gray-200 hover:!bg-white"
            data-testid="sign-in-button"
          >
            Autentificare
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
