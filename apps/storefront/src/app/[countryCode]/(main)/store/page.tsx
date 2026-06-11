import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import StoreLanding from "@modules/store/templates/store-landing"

export const metadata: Metadata = {
  title: "Magazin | MENV Divers",
  description: "Explorează categoriile și produsele MENV Divers.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    view?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, view, q } = searchParams

  // Implicit afisam landing-ul tip revista (categorii + recomandari + butoane).
  // Lista de produse apare doar cand utilizatorul alege "Toate produsele"
  // (view=all) sau cauta ceva (q=...).
  if (view !== "all" && !q) {
    return <StoreLanding countryCode={params.countryCode} />
  }

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      searchQuery={q}
    />
  )
}
