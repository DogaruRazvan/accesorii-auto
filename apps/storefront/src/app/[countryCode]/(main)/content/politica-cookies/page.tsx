import { Metadata } from "next"
import LegalPage from "@modules/content/components/legal-page"

export const metadata: Metadata = {
  title: "Politica de cookies — MENV Divers",
  description: "Ce sunt cookie-urile și cum le folosim pe acest site.",
}

export default function PoliticaCookies() {
  return (
    <LegalPage title="Politica de cookies" lastUpdated="—">
      {/* TODO: înlocuiește conținutul de mai jos cu textul final (din .txt). */}
      <p>
        Conținutul acestei pagini urmează să fie completat. Aici va apărea
        politica privind utilizarea cookie-urilor.
      </p>
    </LegalPage>
  )
}
