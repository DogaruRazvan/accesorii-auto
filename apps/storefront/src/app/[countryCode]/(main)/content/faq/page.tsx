import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Întrebări frecvente — MENV Divers",
  description:
    "Răspunsuri la cele mai frecvente întrebări despre comenzi, livrare, plată, retur și garanție la MENV Divers.",
}

type QA = { q: string; a: string }
type Section = { title: string; items: QA[] }

const SECTIONS: Section[] = [
  {
    title: "Comenzi & livrare",
    items: [
      {
        q: "Cum plasez o comandă?",
        a: "Adaugi produsele dorite în coș, completezi datele de livrare și alegi metoda de plată. După finalizare primești un email de confirmare cu detaliile comenzii.",
      },
      {
        q: "În cât timp ajunge comanda?",
        a: "Livrăm prin curier Sameday, în 1–3 zile lucrătoare de la confirmarea comenzii, pe tot teritoriul României.",
      },
      {
        q: "Cât costă livrarea?",
        a: "Costul livrării este 25 lei. Pentru comenzile de peste 500 lei livrarea este gratuită.",
      },
      {
        q: "Livrați și în afara României?",
        a: "Momentan livrăm exclusiv pe teritoriul României.",
      },
    ],
  },
  {
    title: "Plată",
    items: [
      {
        q: "Ce metode de plată acceptați?",
        a: "Poți plăti cu cardul bancar online (procesat securizat prin Stripe) sau ramburs — la livrare, în numerar sau cu cardul, către curier.",
      },
      {
        q: "Plata cu cardul este sigură?",
        a: "Da. Plățile cu cardul sunt procesate securizat prin Stripe. Nu stocăm și nu avem acces la datele cardului tău.",
      },
    ],
  },
  {
    title: "Retur & garanție",
    items: [
      {
        q: "Pot returna un produs?",
        a: "Da. Conform legii, ai dreptul de a returna produsele în termen de 14 zile de la primire, fără a fi nevoie să justifici motivul.",
      },
      {
        q: "În ce condiții pot returna produsul?",
        a: "Produsul trebuie returnat nedesfăcut, nefolosit și în ambalajul original, împreună cu toate accesoriile.",
      },
      {
        q: "Cine plătește transportul returului?",
        a: "Costul transportului pentru returnarea produsului este suportat de client.",
      },
      {
        q: "Cât durează rambursarea banilor?",
        a: "După ce primim și verificăm produsul returnat, îți restituim contravaloarea în cel mult 14 zile.",
      },
    ],
  },
  {
    title: "Produse & magazin",
    items: [
      {
        q: "Ce produse vindeți?",
        a: "Comercializăm produse din categoriile: auto, moto, grădinărit, unelte, jucării și articole de pescuit.",
      },
      {
        q: "Produsele afișate sunt pe stoc?",
        a: "Disponibilitatea afișată pe site este actualizată. Dacă apare o problemă de stoc după plasarea comenzii, te contactăm pentru a găsi o soluție.",
      },
    ],
  },
  {
    title: "Cont & contact",
    items: [
      {
        q: "Trebuie să îmi fac cont ca să comand?",
        a: "Nu este obligatoriu. Poți comanda și fără cont, însă un cont îți permite să urmărești comenzile și să salvezi adresele de livrare.",
      },
      {
        q: "Cum vă pot contacta?",
        a: "Ne poți scrie la Menvdivers@yahoo.com sau suna la 0735 867 408, Luni–Vineri, între 10:00 și 18:00. Detalii complete găsești în pagina de Contact.",
      },
    ],
  },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SECTIONS.flatMap((s) => s.items).map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}

function ChevronIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-subtle transition-transform duration-200 group-open:rotate-180"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function FaqPage() {
  return (
    <div className="content-container py-12 small:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl small:text-4xl font-semibold text-content mb-2">
          Întrebări frecvente
        </h1>
        <p className="text-subtle mb-10 max-w-2xl">
          Răspunsuri rapide la cele mai des întâlnite întrebări despre comenzi,
          livrare, plată și retur.
        </p>

        <div className="flex flex-col gap-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-content mb-3">
                {section.title}
              </h2>
              <div className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl bg-card border border-line overflow-hidden transition-colors open:border-cta/40"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 text-content font-medium select-none [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <ChevronIcon />
                    </summary>
                    <p className="px-5 pb-5 -mt-1 text-subtle leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA — nu ai gasit raspunsul */}
        <div className="mt-12 rounded-2xl bg-muted/40 border border-line p-6 small:p-8 text-center">
          <h2 className="text-lg font-semibold text-content mb-1">
            Nu ai găsit răspunsul?
          </h2>
          <p className="text-subtle mb-5">
            Suntem aici să te ajutăm. Scrie-ne sau sună-ne în timpul programului.
          </p>
          <LocalizedClientLink
            href="/content/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-cta text-white font-semibold transition-colors hover:bg-cta-hover"
          >
            Contactează-ne
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
