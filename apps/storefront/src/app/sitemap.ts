import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

const COUNTRY = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ro"

// Sitemap static cu paginile principale (fara fetch la backend, ca sa nu rupa
// build-ul). Categoriile/produsele pot fi adaugate ulterior daca e nevoie.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseURL().replace(/\/$/, "")
  const now = new Date()

  const routes = [
    "",
    "/store",
    "/content/termeni-si-conditii",
    "/content/politica-de-confidentialitate",
    "/content/politica-de-retur",
    "/content/politica-cookies",
    "/content/anpc",
  ]

  return routes.map((r) => ({
    url: `${base}/${COUNTRY}${r}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.6,
  }))
}
