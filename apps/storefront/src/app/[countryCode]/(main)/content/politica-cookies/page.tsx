import { Metadata } from "next"
import LegalPage from "@modules/content/components/legal-page"

export const metadata: Metadata = {
  title: "Politica de cookies — MENV Divers",
  description: "Ce sunt cookie-urile și cum le folosim pe acest site.",
}

export default function PoliticaCookies() {
  return (
    <LegalPage title="Politica de cookies" lastUpdated="16 iunie 2026">
      <h2>1. Ce sunt cookie-urile</h2>
      <p>
        Cookie-urile sunt fișiere text de mici dimensiuni stocate de browser pe
        dispozitivul tău atunci când vizitezi un site. Ele permit site-ului să
        funcționeze corect și să rețină anumite preferințe.
      </p>

      <h2>2. Ce cookie-uri folosim</h2>
      <p>
        În prezent, acest site folosește exclusiv{" "}
        <strong>cookie-uri strict necesare</strong> pentru funcționarea sa, de
        exemplu pentru:
      </p>
      <ul>
        <li>menținerea coșului de cumpărături și a sesiunii;</li>
        <li>reținerea preferințelor de limbă și de temă (dark / light);</li>
        <li>reținerea opțiunii tale privind consimțământul pentru cookie-uri.</li>
      </ul>
      <p>
        Aceste cookie-uri sunt esențiale și nu pot fi dezactivate fără a afecta
        funcționarea site-ului. Nu folosim în prezent cookie-uri de analiză sau
        de marketing.
      </p>

      <h2>3. Cookie-uri de la terți</h2>
      <p>
        Procesatorul de plăți <strong>Stripe</strong> poate seta cookie-uri
        proprii în timpul plății, pentru securizarea tranzacției și prevenirea
        fraudei.
      </p>

      <h2>4. Cum controlezi cookie-urile</h2>
      <p>
        Poți șterge sau bloca cookie-urile din setările browserului tău.
        Reține că blocarea cookie-urilor strict necesare poate afecta
        funcționarea site-ului (de exemplu, coșul de cumpărături).
      </p>

      <h2>5. Modificări viitoare</h2>
      <p>
        Dacă vom adăuga în viitor instrumente de analiză (ex. Google Analytics)
        sau de marketing, vom actualiza această politică și vom solicita
        consimțământul tău înainte de activarea lor.
      </p>
    </LegalPage>
  )
}
