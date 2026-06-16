import { Metadata } from "next"
import LegalPage from "@modules/content/components/legal-page"

export const metadata: Metadata = {
  title: "Termeni și condiții — MENV Divers",
  description:
    "Termenii și condițiile de utilizare a magazinului online MENV Divers.",
}

export default function TermeniSiConditii() {
  return (
    <LegalPage title="Termeni și condiții" lastUpdated="—">
      {/* TODO: înlocuiește conținutul de mai jos cu textul final (din .txt). */}
      <p>
        Conținutul acestei pagini urmează să fie completat. Aici vor apărea
        termenii și condițiile de utilizare a magazinului.
      </p>
    </LegalPage>
  )
}
