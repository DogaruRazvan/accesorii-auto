import { Metadata } from "next"
import LegalPage from "@modules/content/components/legal-page"

export const metadata: Metadata = {
  title: "Politica de confidențialitate — MENV Divers",
  description:
    "Cum colectăm, folosim și protejăm datele tale personale (GDPR).",
}

export default function PoliticaDeConfidentialitate() {
  return (
    <LegalPage title="Politica de confidențialitate" lastUpdated="—">
      {/* TODO: înlocuiește conținutul de mai jos cu textul final (din .txt). */}
      <p>
        Conținutul acestei pagini urmează să fie completat. Aici va apărea
        politica de prelucrare a datelor cu caracter personal.
      </p>
    </LegalPage>
  )
}
