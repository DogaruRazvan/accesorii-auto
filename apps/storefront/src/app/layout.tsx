import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import { LocaleProvider } from "@lib/i18n/context"
import { getLocale } from "@lib/i18n/server"
import "styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  // Iconitele vin din conventia de fisiere Next: src/app/icon.png,
  // apple-icon.png, favicon.ico (generate din logo). Nu mai e nevoie de
  // configurare manuala aici.
}

// Viewport corect pe telefon: lățime = ecranul, fără zoom forțat.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

// Ruleaza inainte de paint ca sa nu apara flash de tema gresita.
// Fara alegere salvata -> urmeaza setarea device-ului (prefers-color-scheme).
const themeInit = `(function(){try{var s=localStorage.getItem('theme');var d=(s==='dark'||s==='light')?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;if(d){e.classList.add('dark');e.setAttribute('data-mode','dark');}else{e.classList.remove('dark');e.setAttribute('data-mode','light');}}catch(x){}})();`

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jakartaSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans antialiased bg-page text-content">
        <LocaleProvider locale={locale}>
          <main className="relative">{props.children}</main>
        </LocaleProvider>
      </body>
    </html>
  )
}
