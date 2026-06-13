import { Metadata } from "next"

import Hero from "@modules/home/components/hero"

export const metadata: Metadata = {
  title: "MENV Divers — Tot ce ai nevoie, într-un singur loc",
  description:
    "Mii de produse din toate categoriile. Comandă online cu livrare rapidă în toată țara.",
}

// Home = doar scena cinematica. Produsele se vad in /store.
export default function Home() {
  return <Hero />
}
