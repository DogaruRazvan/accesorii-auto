const ITEMS = [
  {
    title: "Livrare rapidă",
    sub: "În toată țara, 1-3 zile",
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
    title: "Retur în 14 zile",
    sub: "Simplu, fără bătăi de cap",
    icon: (
      <>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </>
    ),
  },
  {
    title: "Plată securizată",
    sub: "Card sau ramburs la livrare",
    icon: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),
  },
]

export default function TrustBar() {
  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="content-container py-6 small:py-7">
        <ul className="grid grid-cols-1 xsmall:grid-cols-3 gap-5 xsmall:gap-4">
          {ITEMS.map((item) => (
            <li
              key={item.title}
              className="flex items-center gap-3.5 justify-center xsmall:justify-start"
            >
              <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 text-gray-700">
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
                <p className="text-sm font-semibold text-gray-950 leading-tight">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 leading-tight mt-0.5">
                  {item.sub}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
