import { Metadata } from "next"
import LegalPage from "@modules/content/components/legal-page"

export const metadata: Metadata = {
  title: "Politica de retur — MENV Divers",
  description:
    "Condițiile de retur și rambursare pentru produsele comandate, conform OUG 34/2014.",
}

export default function PoliticaDeRetur() {
  return (
    <LegalPage title="Politica de retur" lastUpdated="16 iunie 2026">
      <h2>1. Dreptul de retragere</h2>
      <p>
        Conform OUG 34/2014, Cumpărătorul (persoană fizică) are dreptul de a se
        retrage din contract, fără a fi nevoit să justifice decizia, în termen
        de <strong>14 zile calendaristice</strong> de la data la care intră în
        posesia fizică a produsului.
      </p>

      <h2>2. Cum returnezi un produs</h2>
      <p>Pentru a returna un produs, urmează pașii:</p>
      <ul>
        <li>
          Trimite o solicitare la <strong>Menvdivers@yahoo.com</strong> sau
          sună la <strong>0735 867 408</strong>, menționând numărul comenzii.
        </li>
        <li>
          Ambalează produsul în condiții corespunzătoare, împreună cu factura
          sau dovada comenzii.
        </li>
        <li>
          Expediază coletul către punctul de lucru: Strada Traian nr. 19, oraș
          Hârșova, județ Constanța.
        </li>
      </ul>

      <h2>3. Condiții pentru retur</h2>
      <ul>
        <li>
          Produsele trebuie returnate în starea în care au fost primite, fără
          urme de uzură dincolo de cele necesare verificării.
        </li>
        <li>
          Costul returnării produsului este suportat de Cumpărător, cu excepția
          cazului în care produsul livrat a fost greșit sau defect.
        </li>
        <li>
          Nu pot fi returnate produsele exceptate de lege (ex. produse
          personalizate sau care, prin natura lor, nu pot fi returnate).
        </li>
      </ul>

      <h2>4. Rambursarea sumelor</h2>
      <p>
        Vânzătorul rambursează contravaloarea produselor returnate în termen de
        cel mult <strong>14 zile</strong> de la data la care a fost informat
        despre decizia de retragere.
      </p>
      <ul>
        <li>
          Pentru comenzile plătite cu cardul, rambursarea se face automat în
          contul de proveniență.
        </li>
        <li>
          Pentru comenzile plătite ramburs, rambursarea se face prin transfer
          bancar în contul IBAN comunicat de Cumpărător. Contul Vânzătorului
          pentru corespondență este{" "}
          <strong>RO10BRDE140SV04799181400</strong>.
        </li>
      </ul>

      <h2>5. Produse defecte sau neconforme</h2>
      <p>
        Dacă produsul prezintă defecte sau nu corespunde comenzii, Cumpărătorul
        are dreptul la reparare, înlocuire sau rambursare, conform legislației
        privind garanția legală de conformitate. Pentru orice problemă, contactați-ne
        la <strong>Menvdivers@yahoo.com</strong>.
      </p>
    </LegalPage>
  )
}
