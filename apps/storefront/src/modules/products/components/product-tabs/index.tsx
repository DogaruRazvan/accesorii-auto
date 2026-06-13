"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Detalii produs",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Livrare & Retur",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const rows = [
    { label: "Material", value: product.material || "-" },
    { label: "Țara de origine", value: product.origin_country || "-" },
    { label: "Tip", value: product.type ? product.type.value : "-" },
    { label: "Greutate", value: product.weight ? `${product.weight} g` : "-" },
    {
      label: "Dimensiuni",
      value:
        product.length && product.width && product.height
          ? `${product.length}L × ${product.width}W × ${product.height}H`
          : "-",
    },
  ]

  return (
    <div className="py-6">
      <dl className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 py-3 border-b border-line last:border-b-0"
          >
            <dt className="text-sm text-subtle">{row.label}</dt>
            <dd className="text-sm font-medium text-content text-right">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const ShippingInfoTab = () => {
  const items = [
    {
      icon: <FastDelivery />,
      title: "Livrare rapidă",
      text: "Coletul ajunge în 3-5 zile lucrătoare la adresa ta sau la punctul de ridicare ales.",
    },
    {
      icon: <Refresh />,
      title: "Schimb simplu",
      text: "Produsul nu e ce te așteptai? Îl schimbăm cu altul fără bătăi de cap.",
    },
    {
      icon: <Back />,
      title: "Retur în 14 zile",
      text: "Returnezi produsul și îți restituim banii. Conform legii, ai dreptul de retragere în 14 zile, fără explicații.",
    },
  ]

  return (
    <div className="py-6 flex flex-col gap-y-5">
      {items.map((item) => (
        <div key={item.title} className="flex items-start gap-x-3.5">
          <span className="shrink-0 mt-0.5 flex items-center justify-center w-10 h-10 rounded-full bg-cta/10 text-cta">
            {item.icon}
          </span>
          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-semibold text-content">
              {item.title}
            </span>
            <p className="text-sm leading-relaxed text-subtle max-w-sm">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductTabs
