import React from "react"

/**
 * Pictograme ANPC obligatorii (Ordin ANPC 449/2022): SAL + SOL, 250x50px, cu
 * link către platformele oficiale, afișate în footer pe toate paginile.
 *
 * Sunt construite ca badge-uri (nu <img>) ca să se randeze mereu, fără imagini
 * lipsă. Dacă vrei pictogramele oficiale exacte, descarcă PNG-urile de pe
 * https://anpc.ro/ce-este-sal/, pune-le în /public ca anpc-sal.png /
 * anpc-sol.png și înlocuiește badge-urile de mai jos cu <img src="/anpc-sal.png" .../>.
 */

const ANPC_BLUE = "#16407a"

type BadgeProps = {
  href: string
  label: string
  sub: string
}

const Badge = ({ href, label, sub }: BadgeProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${label} - ${sub}`}
    className="inline-flex items-stretch overflow-hidden rounded border border-line bg-white"
    style={{ width: 250, height: 50 }}
  >
    <span
      className="flex items-center justify-center font-bold text-white text-sm tracking-wide"
      style={{ backgroundColor: ANPC_BLUE, width: 64 }}
    >
      ANPC
    </span>
    <span className="flex flex-col justify-center px-3 leading-tight">
      <span
        className="font-bold text-[13px]"
        style={{ color: ANPC_BLUE }}
      >
        {label}
      </span>
      <span className="text-[9px] text-gray-600">{sub}</span>
    </span>
  </a>
)

export default function AnpcBadges() {
  return (
    <div className="flex flex-wrap gap-3">
      <Badge
        href="https://anpc.ro/ce-este-sal/"
        label="SAL"
        sub="Soluționarea Alternativă a Litigiilor"
      />
      <Badge
        href="https://ec.europa.eu/consumers/odr"
        label="SOL"
        sub="Soluționarea Online a Litigiilor"
      />
    </div>
  )
}
