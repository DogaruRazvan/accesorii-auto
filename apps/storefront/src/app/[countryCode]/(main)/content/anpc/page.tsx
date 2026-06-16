import { Metadata } from "next"
import LegalPage from "@modules/content/components/legal-page"

export const metadata: Metadata = {
  title: "ANPC — MENV Divers",
  description:
    "Informații ANPC, SOL și soluționarea alternativă a litigiilor.",
}

export default function Anpc() {
  return (
    <LegalPage title="ANPC" lastUpdated="—">
      {/* TODO: înlocuiește conținutul de mai jos cu textul final (din .txt). */}
      <p>
        Conținutul acestei pagini urmează să fie completat. Aici vor apărea
        informațiile ANPC și link-urile oficiale (SOL / SAL).
      </p>
    </LegalPage>
  )
}
