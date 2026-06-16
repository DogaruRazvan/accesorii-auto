import { Metadata } from "next"
import LegalPage from "@modules/content/components/legal-page"

export const metadata: Metadata = {
  title: "Politica de confidențialitate — MENV Divers",
  description:
    "Cum colectăm, folosim și protejăm datele tale personale (GDPR).",
}

export default function PoliticaDeConfidentialitate() {
  return (
    <LegalPage title="Politica de confidențialitate" lastUpdated="16 iunie 2026">
      <h2>1. Operatorul de date</h2>
      <p>
        Operatorul datelor cu caracter personal colectate prin acest site este{" "}
        <strong>SC MENV TRANSCOM SRL</strong>, cu sediul social în Strada
        Revoluției nr. 26, oraș Hârșova, județ Constanța, CUI RO6114438. Pentru
        orice solicitare privind datele tale, ne poți contacta la{" "}
        <strong>Menvdivers@yahoo.com</strong> sau la <strong>0735 867 408</strong>.
      </p>

      <h2>2. Ce date colectăm</h2>
      <ul>
        <li>Date de identificare și contact: nume, prenume, email, telefon.</li>
        <li>Adresa de livrare și, dacă e cazul, adresa de facturare.</li>
        <li>Detalii despre comenzile plasate.</li>
        <li>
          Date tehnice minime necesare funcționării site-ului (ex. cookie-uri
          strict necesare).
        </li>
      </ul>
      <p>
        Nu stocăm datele cardului bancar. Plățile cu cardul sunt procesate
        securizat de <strong>Stripe</strong>, care acționează ca operator
        independent pentru datele de plată.
      </p>

      <h2>3. Scopul prelucrării</h2>
      <ul>
        <li>Procesarea și livrarea comenzilor.</li>
        <li>Emiterea documentelor fiscale.</li>
        <li>Comunicarea privind statusul comenzii.</li>
        <li>Îndeplinirea obligațiilor legale (contabile, fiscale).</li>
        <li>Soluționarea cererilor de retur și a reclamațiilor.</li>
      </ul>

      <h2>4. Temeiul legal</h2>
      <p>
        Prelucrăm datele în baza executării contractului (plasarea și livrarea
        comenzii), a obligațiilor legale care ne revin și, acolo unde este
        cazul, a consimțământului tău.
      </p>

      <h2>5. Cui dezvăluim datele</h2>
      <p>
        Datele pot fi transmise exclusiv partenerilor necesari onorării
        comenzii: firma de curierat (<strong>Sameday</strong>), procesatorul de
        plăți (<strong>Stripe</strong>) și, după caz, autorităților publice
        atunci când legea ne obligă. Nu vindem datele tale către terți.
      </p>

      <h2>6. Cât timp păstrăm datele</h2>
      <p>
        Păstrăm datele pe durata necesară îndeplinirii scopurilor de mai sus și
        în conformitate cu termenele legale de arhivare (de ex. documentele
        contabile, conform legislației fiscale).
      </p>

      <h2>7. Drepturile tale</h2>
      <p>Conform GDPR, ai dreptul de:</p>
      <ul>
        <li>acces la datele tale;</li>
        <li>rectificare a datelor inexacte;</li>
        <li>ștergere (dreptul de a fi uitat);</li>
        <li>restricționare a prelucrării;</li>
        <li>portabilitate a datelor;</li>
        <li>opoziție la prelucrare;</li>
        <li>
          a depune o plângere la Autoritatea Națională de Supraveghere a
          Prelucrării Datelor cu Caracter Personal (ANSPDCP).
        </li>
      </ul>
      <p>
        Pentru exercitarea acestor drepturi, scrie-ne la{" "}
        <strong>Menvdivers@yahoo.com</strong>.
      </p>

      <h2>8. Cookie-uri</h2>
      <p>
        Detalii despre modul în care folosim cookie-urile găsești în{" "}
        <a href="/content/politica-cookies">Politica de cookies</a>.
      </p>
    </LegalPage>
  )
}
