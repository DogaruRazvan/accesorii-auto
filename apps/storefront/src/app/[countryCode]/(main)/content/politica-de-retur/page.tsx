import { Metadata } from "next"
import LegalPage from "@modules/content/components/legal-page"

export const metadata: Metadata = {
  title: "Politica de retur — MENV Divers",
  description:
    "Condițiile de retur și rambursare pentru produsele comandate.",
}

export default function PoliticaDeRetur() {
  return (
    <LegalPage title="Politica de retur" lastUpdated="—">
      {/* TODO: înlocuiește conținutul de mai jos cu textul final (din .txt). */}
      <p>
        Conținutul acestei pagini urmează să fie completat. Aici vor apărea
        condițiile de retur și rambursare.
      </p>
    </LegalPage>
  )
}
