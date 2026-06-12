import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getT } from "@lib/i18n/server"
import Model3D from "./model-3d"

const Hero = async () => {
  const t = await getT()
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-page">
      {/* Glow difuz in spatele modelului -> il pune in valoare, nuanta verde brand */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16),rgba(255,255,255,0.04)_32%,transparent_65%)] z-10" />

      {/* Vigneta -> drama cinematica DOAR pe dark (pe light ar murdari albul) */}
      <div className="hidden dark:block absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55))]" />

      {/* Film grain fin -> textura premium, fara asset extern */}
      <div
        className="hidden dark:block absolute inset-0 z-10 opacity-[0.10] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Stratul 3D (React Three Fiber) — vedeta din mijloc */}
      <div className="absolute inset-0 z-20">
        <Model3D />
      </div>

      {/* Scrim jos DOAR pe mobil -> pe ecran ingust modelul coboara peste text;
          gradientul topeste baza in fundal si tine textul mereu lizibil. */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] z-[25] small:hidden bg-gradient-to-t from-page via-page/85 to-transparent pointer-events-none" />

      {/* Continut: titlu sus, CTA jos -> modelul pluteste in golul din mijloc */}
      <div className="relative z-30 min-h-screen flex flex-col justify-between items-center text-center px-6 pt-20 pb-10 small:pt-24 small:pb-14 pointer-events-none">

        {/* SUS — eyebrow + titlu */}
        <div className="flex flex-col items-center gap-4 max-w-4xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-content/20 bg-content/5 backdrop-blur-sm text-[11px] tracking-[0.3em] uppercase text-content/80 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cta animate-pulse" />
            MENV Divers
          </span>
          <h1 className="font-display text-4xl small:text-7xl font-extrabold text-content tracking-tight leading-[1.05] dark:[text-shadow:_0_4px_30px_rgb(0_0_0_/_45%)]">
            {t("hero.title1")}
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
              {t("hero.title2")}
            </span>
          </h1>
        </div>

        {/* JOS — subtitlu + CTA (impins spre baza, sub model) */}
        <div className="flex flex-col items-center gap-6 max-w-xl">
          <p className="font-display text-content/90 text-lg small:text-xl font-medium tracking-tight leading-snug dark:[text-shadow:_0_2px_20px_rgb(0_0_0_/_60%)]">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
            <LocalizedClientLink href="/store">
              <Button
                variant="secondary"
                className="!bg-cta !text-white hover:!bg-cta-hover !border-0 shadow-2xl !px-8 !py-3.5 !rounded-full font-semibold transition-transform hover:scale-105 active:scale-95"
              >
                {t("hero.ctaPrimary")}
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/store?view=all">
              <Button
                variant="secondary"
                className="!bg-content/10 !text-content hover:!bg-content/20 !border !border-content/30 backdrop-blur-sm shadow-lg !px-8 !py-3.5 !rounded-full font-semibold transition-transform hover:scale-105 active:scale-95"
              >
                {t("hero.ctaSecondary")}
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Indicator scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="w-6 h-10 rounded-full border-2 border-content/40 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-content/70 animate-bounce" />
        </div>
      </div>
    </div>
  )
}

export default Hero
