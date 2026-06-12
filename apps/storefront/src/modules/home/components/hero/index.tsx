import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spline from "@splinetool/react-spline/next"

// Scena 3D se seteaza prin env var ca sa o poti schimba fara cod.
// Numele folosit in Railway e NEXT_PUBLIC_SPLINE_SCEN (fara E final);
// pastram si varianta cu E ca fallback.
const RAW_SCENE = (
  process.env.NEXT_PUBLIC_SPLINE_SCEN ||
  process.env.NEXT_PUBLIC_SPLINE_SCENE ||
  ""
).trim()

// Spline accepta DOAR fisiere .splinecode exportate din panoul Export.
// Daca s-a pus alt link (editor/preview), il ignoram ca sa nu crape pagina.
const SPLINE_SCENE = RAW_SCENE.endsWith(".splinecode") ? RAW_SCENE : undefined

const Hero = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0E]">
      {/* Glow difuz in spatele cutiei -> o pune in valoare (stil Apple/Linear) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vw] rounded-full bg-[radial-gradient(circle,rgba(120,140,200,0.16),rgba(255,255,255,0.05)_30%,transparent_65%)] z-10" />

      {/* Vigneta -> intuneca marginile, focalizeaza centrul */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55))]" />

      {/* Film grain fin -> textura premium, fara asset extern */}
      <div
        className="absolute inset-0 z-10 opacity-[0.10] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Stratul 3D Spline — vedeta din mijloc */}
      {SPLINE_SCENE && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <Spline scene={SPLINE_SCENE} />
        </div>
      )}

      {/* Continut: titlu sus, CTA jos -> cutia pluteste in golul din mijloc */}
      <div className="relative z-30 min-h-screen flex flex-col justify-between items-center text-center px-6 pt-20 pb-10 small:pt-24 small:pb-14 pointer-events-none">

        {/* SUS — eyebrow + titlu */}
        <div className="flex flex-col items-center gap-4 max-w-4xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-[11px] tracking-[0.3em] uppercase text-white/80 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            MENV Divers
          </span>
          <h1 className="font-display text-4xl small:text-7xl font-extrabold text-white tracking-tight leading-[1.05] [text-shadow:_0_4px_30px_rgb(0_0_0_/_45%)]">
            Tot ce ai nevoie,
            <br />
            <span className="bg-gradient-to-r from-brand-accent to-amber-300 bg-clip-text text-transparent">
              într-un singur loc
            </span>
          </h1>
        </div>

        {/* JOS — subtitlu + CTA (impins spre baza, sub cutie) */}
        <div className="flex flex-col items-center gap-6 max-w-xl">
          <p className="font-display text-white/90 text-lg small:text-xl font-medium tracking-tight leading-snug [text-shadow:_0_2px_20px_rgb(0_0_0_/_60%)]">
            Mii de produse din toate categoriile,
            <br className="hidden small:block" />{" "}
            livrate rapid oriunde în țară.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
            <LocalizedClientLink href="/store">
              <Button
                variant="secondary"
                className="!bg-white !text-brand-primary hover:!bg-brand-light !border-0 shadow-2xl !px-8 !py-3.5 !rounded-full font-semibold transition-transform hover:scale-105 active:scale-95"
              >
                Vezi produsele
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/store?view=all">
              <Button
                variant="secondary"
                className="!bg-white/10 !text-white hover:!bg-white/20 !border !border-white/30 backdrop-blur-sm shadow-lg !px-8 !py-3.5 !rounded-full font-semibold transition-transform hover:scale-105 active:scale-95"
              >
                Toate produsele
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Indicator scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-white/70 animate-bounce" />
        </div>
      </div>
    </div>
  )
}

export default Hero
