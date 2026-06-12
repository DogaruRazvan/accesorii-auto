import { getT } from "@lib/i18n/server"

const ITEMS = [
  {
    titleKey: "trust.shippingTitle",
    subKey: "trust.shippingSub",
    icon: (
      <>
        <path d="M1 3h15v13H1z" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
  },
  {
    titleKey: "trust.returnTitle",
    subKey: "trust.returnSub",
    icon: (
      <>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </>
    ),
  },
  {
    titleKey: "trust.payTitle",
    subKey: "trust.paySub",
    icon: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),
  },
]

export default async function TrustBar() {
  const t = await getT()
  return (
    <section className="border-y border-line bg-card">
      <div className="content-container py-6 small:py-7">
        <ul className="grid grid-cols-1 xsmall:grid-cols-3 gap-5 xsmall:gap-4">
          {ITEMS.map((item) => (
            <li
              key={item.titleKey}
              className="flex items-center gap-3.5 justify-center xsmall:justify-start"
            >
              <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-muted text-content/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {item.icon}
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-content leading-tight">
                  {t(item.titleKey)}
                </p>
                <p className="text-xs text-subtle leading-tight mt-0.5">
                  {t(item.subKey)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
