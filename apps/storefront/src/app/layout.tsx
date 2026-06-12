import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
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
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="ro" data-mode="light" className={`${inter.variable} ${jakartaSans.variable}`}>
      <body className="font-sans antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
