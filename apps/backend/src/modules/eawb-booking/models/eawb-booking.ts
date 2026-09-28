import { model } from "@medusajs/framework/utils"

export default model.define("eawb_booking", {
  id: model.id().primaryKey(),
  order_id: model.text().unique(),
  request_hash: model.text(),
  status: model.enum(["pending", "booked", "uncertain", "rejected", "cancelled"]),
  result: model.json().nullable(),
})
