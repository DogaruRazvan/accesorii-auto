import { ReactNode } from "react"

type LegalPageProps = {
  title: string
  /** Data ultimei actualizari, ex. "16 iunie 2026". Optional. */
  lastUpdated?: string
  children: ReactNode
}

/**
 * Layout comun pentru paginile legale (termeni, confidentialitate, retur,
 * cookies, ANPC). Continut static — fara query la backend, se randeaza SSG.
 *
 * Stilurile pentru continut sunt aplicate prin clasele utilitare de mai jos,
 * ca textul brut (h2, p, ul, a) sa arate bine fara sa adaugi clase de fiecare
 * data. Folosesc tokenii semantici de tema (text-content / text-subtle / etc.)
 * ca sa mearga si pe dark, si pe light.
 */
const LegalPage = ({ title, lastUpdated, children }: LegalPageProps) => {
  return (
    <div className="content-container py-12 small:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl small:text-4xl font-semibold text-content mb-2">
          {title}
        </h1>
        {lastUpdated && (
          <p className="text-sm text-subtle mb-10">
            Ultima actualizare: {lastUpdated}
          </p>
        )}
        <div
          className="
            text-content/90 leading-relaxed
            [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-content [&_h2]:mt-10 [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-content [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
            [&_a]:text-cta [&_a]:underline hover:[&_a]:opacity-80
            [&_strong]:text-content [&_strong]:font-semibold
          "
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default LegalPage
