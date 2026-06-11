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
    <div className="relative h-[85vh] w-full overflow-hidden bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary">
      {/* Decoratiuni gradient (mereu in spate, se vad si cat se incarca Spline) */}
      <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(circle_at_25%_25%,white,transparent_40%)]" />
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_75%_60%,#F97316,transparent_45%)]" />

      {/* Overlay gradient pentru lizibilitate text */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

      {/* Continut text (sub cutia 3D) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6 gap-6 pointer-events-none">
        <span className="text-xs tracking-[0.4em] uppercase text-white/70 font-medium">
          MENV Divers
        </span>
        <h1 className="text-4xl small:text-7xl font-bold text-white tracking-tight max-w-4xl leading-[1.05] drop-shadow-lg">
          Tot ce ai nevoie
          <br />
          pentru mașina ta
        </h1>
        <p className="text-white/80 text-lg small:text-xl max-w-xl">
          Accesorii auto alese cu grijă, livrate rapid.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 pointer-events-auto">
          <LocalizedClientLink href="/store">
            <Button
              variant="secondary"
              className="!bg-white !text-brand-primary hover:!bg-brand-light !border-0 shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              Vezi produsele
            </Button>
          </LocalizedClientLink>
        </div>
      </div>

      {/* Stratul 3D Spline DEASUPRA textului. pointer-events-none ca sa nu
          blocheze butonul de dedesubt. Canvas transparent -> textul si
          gradientul se vad in spate.
          Obiectul apare decentrat (camera scenei priveste din lateral), asa
          ca il impingem spre dreapta cu un translate ca sa ajunga in mijloc.
          Regleaza valoarea translate-x daca nu e fix pe centru. */}
      {SPLINE_SCENE && (
        <div className="absolute inset-0 z-30 pointer-events-none translate-x-[18%]">
          <Spline scene={SPLINE_SCENE} />
        </div>
      )}

      {/* Indicator scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-white/70 animate-bounce" />
        </div>
      </div>
    </div>
  )
}

export default Hero
