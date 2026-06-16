import { Metadata } from "next"
import LegalPage from "@modules/content/components/legal-page"

export const metadata: Metadata = {
  title: "Termeni și condiții — MENV Divers",
  description:
    "Termenii și condițiile de utilizare a magazinului online MENV Divers.",
}

export default function TermeniSiConditii() {
  return (
    <LegalPage title="Termeni și condiții" lastUpdated="16 iunie 2026">
      <h2>1. Informații generale</h2>
      <p>
        Acest site este deținut și operat de{" "}
        <strong>SC MENV TRANSCOM SRL</strong>, denumită în continuare
        Vânzătorul, cu următoarele date de identificare:
      </p>
      <ul>
        <li>
          Sediu social: Strada Revoluției nr. 26, oraș Hârșova, județ Constanța
        </li>
        <li>Cod unic de înregistrare (CUI): RO6114438</li>
        <li>Număr de ordine în Registrul Comerțului: J13/280/1994</li>
        <li>Capital social: 200.200 RON</li>
        <li>Reprezentanți legali: Baciu Nicolae, Iordan Elena</li>
        <li>Email: Menvdivers@yahoo.com</li>
        <li>Telefon: 0735 867 408</li>
        <li>
          Punct de lucru: Strada Traian nr. 19, oraș Hârșova, județ Constanța
        </li>
        <li>Program: Luni - Vineri, 10:00 - 18:00</li>
      </ul>
      <p>
        Magazinul online este accesibil la adresa{" "}
        <strong>menvdivers.ro</strong> (denumit în continuare Site-ul).
      </p>

      <h2>2. Acceptarea termenilor</h2>
      <p>
        Prin accesarea și utilizarea Site-ului și prin plasarea unei comenzi,
        Cumpărătorul declară că a citit, a înțeles și acceptă în întregime
        prezentele Termeni și condiții. Dacă nu sunteți de acord cu acești
        termeni, vă rugăm să nu utilizați Site-ul.
      </p>
      <p>
        Vânzătorul își rezervă dreptul de a modifica oricând prezentele
        condiții, fără notificare prealabilă. Versiunea aplicabilă unei comenzi
        este cea aflată pe Site la momentul plasării comenzii.
      </p>

      <h2>3. Produse și prețuri</h2>
      <p>
        MENV DIVERS comercializează produse din categoriile: auto, moto,
        grădinărit, unelte, jucării și articole de pescuit. Toate produsele
        sunt fizice și se livrează doar pe teritoriul României.
      </p>
      <p>
        Prețurile afișate sunt exprimate în lei (RON) și includ TVA. Vânzătorul
        își rezervă dreptul de a modifica prețurile fără notificare prealabilă.
        În cazul unor erori evidente de afișare a prețului, Vânzătorul are
        dreptul de a anula comanda și de a returna sumele achitate.
      </p>
      <p>
        Imaginile produselor au caracter informativ și pot diferi de produsul
        real în privința unor detalii minore.
      </p>

      <h2>4. Plasarea comenzii</h2>
      <p>
        Comanda se consideră finalizată în momentul în care Cumpărătorul
        primește confirmarea pe email. Vânzătorul își rezervă dreptul de a
        anula o comandă în caz de indisponibilitate a produsului, date de
        contact incorecte sau suspiciune de fraudă, cu informarea
        Cumpărătorului.
      </p>

      <h2>5. Modalități de plată</h2>
      <p>Plata produselor se poate face prin:</p>
      <ul>
        <li>
          <strong>Card bancar online</strong> - procesat securizat prin{" "}
          <strong>Stripe</strong>. Vânzătorul nu stochează datele cardului
          dumneavoastră.
        </li>
        <li>
          <strong>Ramburs</strong> - plata se face la livrare, în numerar sau
          cu cardul, către curier.
        </li>
      </ul>

      <h2>6. Livrare</h2>
      <p>
        Livrarea se face exclusiv pe teritoriul României, prin curierul{" "}
        <strong>Sameday</strong>. Termenul estimativ de livrare este de{" "}
        <strong>1 - 3 zile lucrătoare</strong> de la confirmarea comenzii.
      </p>
      <ul>
        <li>Cost livrare: 25 lei</li>
        <li>Livrare gratuită pentru comenzi de peste 500 lei</li>
      </ul>

      <h2>7. Dreptul de retur</h2>
      <p>
        Cumpărătorul are dreptul de a returna produsele în termen de 14 zile,
        conform politicii detaliate în pagina{" "}
        <a href="/content/politica-de-retur">Politică de retur</a>.
      </p>

      <h2>8. Răspundere</h2>
      <p>
        Vânzătorul nu poate fi ținut responsabil pentru daune de orice natură
        pe care Cumpărătorul sau terții le-ar putea suferi ca urmare a
        îndeplinirii obligațiilor conform comenzii. Vânzătorul nu răspunde
        pentru întârzieri cauzate de curier sau de forță majoră.
      </p>

      <h2>9. Proprietate intelectuală</h2>
      <p>
        Întregul conținut al Site-ului (texte, imagini, logo-uri, grafică)
        este proprietatea SC MENV TRANSCOM SRL sau a partenerilor săi și este
        protejat de legislația privind drepturile de autor. Reproducerea fără
        acord scris este interzisă.
      </p>

      <h2>10. Legislație aplicabilă și litigii</h2>
      <p>
        Prezentele condiții sunt guvernate de legislația română. Eventualele
        litigii se vor soluționa pe cale amiabilă sau, în caz contrar, de către
        instanțele competente din România. Pentru soluționarea alternativă a
        litigiilor, consultați pagina <a href="/content/anpc">ANPC</a>.
      </p>
    </LegalPage>
  )
}
