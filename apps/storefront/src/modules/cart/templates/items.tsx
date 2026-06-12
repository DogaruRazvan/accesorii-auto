import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@modules/common/components/ui"
import { getT } from "@lib/i18n/server"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = async ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const t = await getT()
  return (
    <div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">{t("cartpage.headItem")}</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>{t("cartpage.headQty")}</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              {t("cartpage.headPrice")}
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              {t("cartpage.headTotal")}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
