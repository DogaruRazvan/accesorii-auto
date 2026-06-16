import { Metadata } from "next"
import LegalPage from "@modules/content/components/legal-page"

export const metadata: Metadata = {
  title: "ANPC — MENV Divers",
  description:
    "Informații ANPC, SAL și soluționarea alternativă a litigiilor.",
}

export default function Anpc() {
  return (
    <LegalPage title="ANPC" lastUpdated="16 iunie 2026">
      <h2>Protecția consumatorului</h2>
      <p>
        SC MENV TRANSCOM SRL respectă legislația privind protecția
        consumatorilor. Pentru reclamații sau sesizări, te poți adresa
        Autorității Naționale pentru Protecția Consumatorilor (ANPC).
      </p>

      <h2>Soluționarea alternativă a litigiilor (SAL)</h2>
      <p>
        În cazul unui litigiu cu privire la o comandă, ai posibilitatea de a
        recurge la procedura de soluționare alternativă a litigiilor.
        Informații oficiale găsești aici:
      </p>
      <ul>
        <li>
          <a
            href="https://anpc.ro/ce-este-sal/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ANPC - Ce este SAL
          </a>
        </li>
      </ul>

      <h2>Date de contact ANPC</h2>
      <p>
        Site oficial:{" "}
        <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer">
          anpc.ro
        </a>
      </p>

      <h2>Date de contact comerciant</h2>
      <ul>
        <li>SC MENV TRANSCOM SRL</li>
        <li>Email: Menvdivers@yahoo.com</li>
        <li>Telefon: 0735 867 408</li>
        <li>
          Punct de lucru: Strada Traian nr. 19, oraș Hârșova, județ Constanța
        </li>
      </ul>
    </LegalPage>
  )
}
