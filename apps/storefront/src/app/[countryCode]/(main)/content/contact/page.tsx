import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — MENV Divers",
  description:
    "Ia legătura cu MENV Divers: telefon, email, program și adresa punctului de lucru din Hârșova, județ Constanța.",
}

const PHONE_DISPLAY = "0735 867 408"
const PHONE_TEL = "+40735867408"
const EMAIL_DISPLAY = "Menvdivers@yahoo.com"
const EMAIL = "menvdivers@yahoo.com"
const STORE_ADDRESS = "Strada Traian nr. 19, oraș Hârșova, județ Constanța"
const SCHEDULE = "Luni – Vineri, 10:00 – 18:00"
const MAPS_QUERY = "Strada Traian 19, Hârșova, Constanța"

const iconClass =
  "shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-cta/10 text-cta"

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "MENV Divers",
  legalName: "SC MENV TRANSCOM SRL",
  email: EMAIL,
  telephone: PHONE_TEL,
  url: "https://menvdivers.ro",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Strada Traian nr. 19",
    addressLocality: "Hârșova",
    addressRegion: "Constanța",
    addressCountry: "RO",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "10:00",
    closes: "18:00",
  },
}

export default function ContactPage() {
  return (
    <div className="content-container py-12 small:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl small:text-4xl font-semibold text-content mb-2">
          Contact
        </h1>
        <p className="text-subtle mb-10 max-w-2xl">
          Ai o întrebare despre un produs, o comandă sau o livrare? Suntem aici
          să te ajutăm. Scrie-ne sau sună-ne în timpul programului.
        </p>

        {/* Carduri de contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <a
            href={`tel:${PHONE_TEL}`}
            className="group flex items-start gap-4 p-5 rounded-2xl bg-card border border-line transition-colors hover:border-cta/40"
          >
            <span className={iconClass}>
              <PhoneIcon />
            </span>
            <span className="flex flex-col">
              <span className="text-sm text-subtle">Telefon</span>
              <span className="text-base font-semibold text-content group-hover:text-cta transition-colors">
                {PHONE_DISPLAY}
              </span>
            </span>
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className="group flex items-start gap-4 p-5 rounded-2xl bg-card border border-line transition-colors hover:border-cta/40"
          >
            <span className={iconClass}>
              <MailIcon />
            </span>
            <span className="flex flex-col min-w-0">
              <span className="text-sm text-subtle">Email</span>
              <span className="text-base font-semibold text-content group-hover:text-cta transition-colors break-all">
                {EMAIL_DISPLAY}
              </span>
            </span>
          </a>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-line">
            <span className={iconClass}>
              <ClockIcon />
            </span>
            <span className="flex flex-col">
              <span className="text-sm text-subtle">Program</span>
              <span className="text-base font-semibold text-content">
                {SCHEDULE}
              </span>
            </span>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-line">
            <span className={iconClass}>
              <PinIcon />
            </span>
            <span className="flex flex-col">
              <span className="text-sm text-subtle">Punct de lucru</span>
              <span className="text-base font-semibold text-content leading-snug">
                {STORE_ADDRESS}
              </span>
            </span>
          </div>
        </div>

        {/* CTA-uri */}
        <div className="flex flex-col xsmall:flex-row gap-3 mb-12">
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-cta text-white font-semibold transition-colors hover:bg-cta-hover"
          >
            <PhoneIcon />
            Sună-ne
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-line bg-card text-content font-semibold transition-colors hover:border-cta/40"
          >
            <MailIcon />
            Scrie-ne pe email
          </a>
        </div>

        {/* Harta */}
        <div className="rounded-2xl overflow-hidden border border-line mb-12">
          <iframe
            title="Harta punctului de lucru MENV Divers"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              MAPS_QUERY
            )}&output=embed`}
            width="100%"
            height="360"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full grayscale-[0.2]"
          />
        </div>

        {/* Date de identificare firma */}
        <div className="rounded-2xl bg-muted/40 border border-line p-6 small:p-8">
          <h2 className="text-xl font-semibold text-content mb-5">
            Date de identificare
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {[
              ["Denumire", "SC MENV TRANSCOM SRL"],
              ["CUI", "RO6114438"],
              ["Reg. Comerțului", "J13/280/1994"],
              ["Capital social", "200.200 RON"],
              [
                "Sediu social",
                "Strada Revoluției nr. 26, oraș Hârșova, județ Constanța",
              ],
              ["Reprezentanți legali", "Baciu Nicolae, Iordan Elena"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-0.5 py-2 border-b border-line/60 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
              >
                <dt className="text-subtle">{label}</dt>
                <dd className="font-medium text-content">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
