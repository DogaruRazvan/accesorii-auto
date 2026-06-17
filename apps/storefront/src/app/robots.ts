import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

// Permite indexarea completa + indica sitemap-ul catre Google.
export default function robots(): MetadataRoute.Robots {
  const base = getBaseURL().replace(/\/$/, "")
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  }
}
