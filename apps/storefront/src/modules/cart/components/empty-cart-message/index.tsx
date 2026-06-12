import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getT } from "@lib/i18n/server"

const EmptyCartMessage = async () => {
  const t = await getT()
  return (
    <div
      className="py-32 small:py-48 flex flex-col justify-center items-center text-center"
      data-testid="empty-cart-message"
    >
      <div className="w-16 h-16 rounded-full bg-muted border border-line flex items-center justify-center mb-6 text-subtle">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <h1 className="text-2xl small:text-3xl font-bold tracking-tight text-content">
        {t("empty.title")}
      </h1>
      <p className="text-base text-subtle mt-3 mb-8 max-w-md">
        {t("empty.sub")}
      </p>
      <LocalizedClientLink
        href="/store"
        className="inline-flex px-7 py-3.5 rounded-full bg-cta text-white font-semibold shadow-lg transition-all hover:bg-cta-hover hover:scale-105 active:scale-95"
      >
        {t("empty.cta")}
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
