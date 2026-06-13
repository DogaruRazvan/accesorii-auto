import { getT } from "@lib/i18n/server"
import HeroScene from "./scene"

const Hero = async () => {
  const t = await getT()
  return (
    <HeroScene
      eyebrow="MENV Divers"
      title1={t("hero.title1")}
      title2={t("hero.title2")}
      subtitle={t("hero.subtitle")}
      scrollHint={t("hero.scrollHint")}
      revealText={t("hero.revealText")}
      ctaLabel={t("hero.ctaPrimary")}
      ctaHref="/store"
      trust={{
        shipping: t("trust.shippingTitle"),
        returns: t("trust.returnTitle"),
        pay: t("trust.payTitle"),
      }}
    />
  )
}

export default Hero
