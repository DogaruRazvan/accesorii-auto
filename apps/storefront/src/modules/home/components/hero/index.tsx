import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getT } from "@lib/i18n/server"
import HeroScene from "./scene"

const Hero = async () => {
  const t = await getT()
  return (
    // 200vh outer = scroll driver giving room for the full cinematic animation
    <div className="relative h-[200vh] w-full">

      {/* Sticky inner — stays pinned while the outer 200vh scrolls through */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-page">

        {/* Glow behind the model */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16),rgba(255,255,255,0.04)_32%,transparent_65%)] z-10" />

        {/* Dark vignette (dark mode only) */}
        <div className="hidden dark:block absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55))]" />

        {/* Film grain */}
        <div
          className="hidden dark:block absolute inset-0 z-10 opacity-[0.10] mix-blend-soft-light pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* 3D scene + blur reveal — client component handles all interaction */}
        <HeroScene ctaLabel={t("hero.ctaPrimary")} ctaHref="/store" />

        {/* Mobile bottom scrim */}
        <div className="absolute inset-x-0 bottom-0 h-[46%] z-[25] small:hidden bg-gradient-to-t from-page via-page/85 to-transparent pointer-events-none" />

        {/* Text overlay: title top, subtitle + CTAs bottom */}
        <div className="relative z-30 h-full flex flex-col justify-between items-center text-center px-6 pt-20 pb-10 small:pt-24 small:pb-14 pointer-events-none">

          {/* Top — eyebrow + title */}
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

          {/* Bottom — subtitle + secondary CTA */}
          <div className="flex flex-col items-center gap-6 max-w-xl">
            <p className="font-display text-content/90 text-lg small:text-xl font-medium tracking-tight leading-snug dark:[text-shadow:_0_2px_20px_rgb(0_0_0_/_60%)]">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
              <LocalizedClientLink href="/store?view=all">
                <button className="bg-content/10 text-content hover:bg-content/20 border border-content/30 backdrop-blur-sm shadow-lg px-8 py-3.5 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95">
                  {t("hero.ctaSecondary")}
                </button>
              </LocalizedClientLink>
            </div>
          </div>
        </div>

        {/* Scroll indicator — shown before animation completes */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <div className="w-6 h-10 rounded-full border-2 border-content/40 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-content/70 animate-bounce" />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Hero
